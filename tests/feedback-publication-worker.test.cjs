// Actual Worker entry point with synthetic in-memory SQLite. No network or Wrangler.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { DatabaseSync } = require('node:sqlite');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/workers/worker.js'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations/0001_feedback_publication_consent.sql'), 'utf8');
const schema = `CREATE TABLE tool_feedback (
 id INTEGER PRIMARY KEY AUTOINCREMENT, tool_id TEXT NOT NULL, tool_name TEXT NOT NULL,
 rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5), feedback_type TEXT NOT NULL,
 name TEXT DEFAULT 'Anonymous', email TEXT, message TEXT NOT NULL, country_code TEXT,
 helpful_count INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','pending','rejected')),
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;
const publicKeys = ['id', 'tool_id', 'tool_name', 'rating', 'feedback_type', 'name', 'message', 'country_code', 'helpful_count', 'created_at'].sort();
const payload = { toolId: 'synthetic-a', toolName: 'Synthetic Tool', rating: 4, feedbackType: 'Synthetic Bug', name: 'Synthetic Name', email: 'test@example.invalid', message: 'Entirely synthetic feedback text' };
function harness(t, migrated = true) {
    const db = new DatabaseSync(':memory:'); t.after(() => db.close()); db.exec(schema); if (migrated) db.exec(migration);
    const queries = [];
    const env = { ADMIN_KEY: 'synthetic-test-only', DB: { prepare(sql) {
        function statement(params = []) { return {
            bind(...values) { return statement(values); },
            async all() { queries.push(sql); return { results: db.prepare(sql).all(...params).map(row => ({ ...row })) }; },
            async run() { queries.push(sql); const r = db.prepare(sql).run(...params); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; }
        }; } return statement();
    } } };
    const context = { Request, Response, URL, console: { error() {} } };
    vm.createContext(context);
    // Only adapt the module export in memory; execute the production fetch entry point.
    vm.runInContext(source.replace('export default {', 'globalThis.worker = {'), context);
    async function request(route, method = 'GET', body, options = {}) {
        const req = new Request('https://synthetic.invalid' + route, { method, headers: options.headers, ...(body === undefined ? {} : { body: options.raw ? body : JSON.stringify(body) }) });
        Object.defineProperty(req, 'cf', { value: { country: 'ZZ' } });
        const response = await context.worker.fetch(req, env, {});
        const pathname = new URL(req.url).pathname;
        if (pathname === '/feedback' || pathname.startsWith('/feedback/')) assert.equal(response.headers.get('Cache-Control'), 'no-store');
        const text = await response.text(); return { status: response.status, body: text ? JSON.parse(text) : null, headers: response.headers };
    }
    function seed(overrides = {}) {
        const record = { tool_id: 'synthetic-a', tool_name: 'Synthetic Tool', rating: 5, feedback_type: 'Public Review', name: 'Synthetic', email: 'private@example.invalid', message: 'Synthetic fixture message', country_code: 'ZZ', helpful_count: 0, status: 'published', submission_type: 'public_review', publication_consent_version: 'public-review-v1', publication_consented_at: '2000-01-01T00:00:00.000Z', ...overrides };
        const keys = Object.keys(record); const r = db.prepare('INSERT INTO tool_feedback (' + keys.join(',') + ') VALUES (' + keys.map(() => '?').join(',') + ')').run(...Object.values(record)); return Number(r.lastInsertRowid);
    }
    return { db, env, queries, request, seed, rows: () => db.prepare('SELECT * FROM tool_feedback').all() };
}
for (const type of [undefined, 'private_feedback']) test('private classification: ' + type, async t => {
    const h = harness(t); const body = { ...payload, status: 'published', publicationConsentVersion: 'public-review-v1', publication_consented_at: 'forged', publicationConsentedAt: 'forged', countryCode: 'US', ...(type === undefined ? {} : { submissionType: type }) };
    const r = await h.request('/feedback', 'POST', body); assert.equal(r.status, 201);
    const row = h.rows()[0]; assert.equal(row.submission_type, 'private_feedback'); assert.equal(row.status, 'pending'); assert.equal(row.publication_consent_version, null); assert.equal(row.publication_consented_at, null); assert.equal(row.country_code, 'ZZ');
    assert.deepEqual(Object.keys(r.body).sort(), ['feedbackId', 'message', 'success']);
    assert.equal((await h.request('/feedback')).body.summary.total_reviews, 0);
});
for (const value of [null, '', false, true, 0, 1, [], {}, 'public', 'PUBLIC_REVIEW']) test('invalid supplied type: ' + JSON.stringify(value), async t => {
    const h = harness(t); assert.equal((await h.request('/feedback', 'POST', { ...payload, submissionType: value })).status, 400); assert.equal(h.rows().length, 0);
});
for (const version of [undefined, null, '', true, [], {}, 'public-review-v2']) test('invalid public consent: ' + JSON.stringify(version), async t => {
    const h = harness(t); assert.equal((await h.request('/feedback', 'POST', { ...payload, submissionType: 'public_review', publicationConsentVersion: version })).status, 400); assert.equal(h.rows().length, 0);
});
test('public submission uses server values, preserved defaults, and explicit projections', async t => {
    const h = harness(t), start = Date.now();
    const r = await h.request('/feedback', 'POST', { ...payload, feedbackType: undefined, name: '', email: '', submissionType: 'public_review', publicationConsentVersion: 'public-review-v1', status: 'rejected', publicationConsentedAt: 'forged', publication_consented_at: 'forged', countryCode: 'US' });
    assert.equal(r.status, 201); const row = h.rows()[0];
    assert.equal(row.status, 'published'); assert.equal(row.submission_type, 'public_review'); assert.equal(row.publication_consent_version, 'public-review-v1');
    assert.equal(row.feedback_type, 'Public Review'); assert.equal(row.name, 'Anonymous'); assert.equal(row.email, null); assert.equal(row.country_code, 'ZZ');
    const stamp = Date.parse(row.publication_consented_at); assert.ok(stamp >= start && stamp <= Date.now()); assert.equal(new Date(stamp).toISOString(), row.publication_consented_at);
    const list = await h.request('/feedback'); assert.equal(list.body.summary.total_reviews, 1); assert.equal(list.body.summary.average_rating, 4);
    assert.deepEqual(Object.keys(list.body).sort(), ['reviews', 'success', 'summary']);
    assert.deepEqual(Object.keys(list.body.summary).sort(), ['average_rating', 'rating_1', 'rating_2', 'rating_3', 'rating_4', 'rating_5', 'total_reviews']);
    assert.deepEqual(Object.keys(list.body.reviews[0]).sort(), publicKeys);
    const detail = await h.request('/feedback/' + row.id); assert.equal(detail.status, 200); assert.deepEqual(Object.keys(detail.body).sort(), ['feedback', 'success']); assert.deepEqual(Object.keys(detail.body.feedback).sort(), publicKeys);
});
const excluded = [
    ['legacy', { submission_type: null, publication_consent_version: null, publication_consented_at: null }],
    ['private marked published', { submission_type: 'private_feedback', publication_consent_version: null, publication_consented_at: null }],
    ['private with forged consent', { submission_type: 'private_feedback' }],
    ['missing type', { submission_type: null }],
    ['wrong type', { submission_type: 'other' }],
    ['missing version', { publication_consent_version: null }],
    ['wrong version', { publication_consent_version: 'other' }],
    ['missing timestamp', { publication_consented_at: null }],
    ['pending', { status: 'pending' }], ['rejected', { status: 'rejected' }]
];
for (const [name, record] of excluded) test('all public paths exclude ' + name, async t => {
    const h = harness(t), id = h.seed(record);
    for (const route of ['/feedback', '/feedback?toolId=synthetic-a']) { const r = await h.request(route); assert.equal(r.body.summary.total_reviews, 0); assert.deepEqual(r.body.reviews, []); }
    for (const suffix of ['', '/helpful']) { const method = suffix ? 'POST' : 'GET'; const result = await h.request('/feedback/' + id + suffix, method); const missing = await h.request('/feedback/99999' + suffix, method); assert.equal(result.status, 404); assert.deepEqual(result.body, missing.body); }
    assert.equal(h.rows()[0].helpful_count, 0);
});
test('global and tool-specific aggregates include eligible records only', async t => {
    const h = harness(t); h.seed({ rating: 5 }); h.seed({ rating: 3 }); h.seed({ tool_id: 'synthetic-b', rating: 1 }); for (const [, record] of excluded) h.seed(record);
    const global = (await h.request('/feedback')).body; assert.equal(global.summary.total_reviews, 3); assert.equal(global.summary.average_rating, 3); assert.equal(global.reviews.length, 3);
    const a = (await h.request('/feedback?toolId=synthetic-a')).body; assert.equal(a.summary.total_reviews, 2); assert.equal(a.summary.average_rating, 4); assert.equal(a.summary.rating_5, 1); assert.equal(a.summary.rating_3, 1); assert.equal(a.reviews.length, 2);
    for (const row of global.reviews) assert.deepEqual(Object.keys(row).sort(), publicKeys);
});
test('helpful increment uses one eligible UPDATE RETURNING statement', async t => {
    const h = harness(t), id = h.seed();
    for (const expected of [1, 2]) { h.queries.length = 0; const r = await h.request('/feedback/' + id + '/helpful', 'POST'); assert.equal(r.status, 200); assert.equal(r.body.helpfulCount, expected); assert.deepEqual(Object.keys(r.body).sort(), ['feedbackId', 'helpfulCount', 'message', 'success']); assert.equal(h.queries.length, 1); assert.match(h.queries[0], /UPDATE tool_feedback/); assert.match(h.queries[0], /RETURNING id, helpful_count/); }
});
for (const [name, body, raw] of [['malformed JSON', '{', true], ['null payload', null], ['array payload', []], ['string payload', 'text'], ['missing category', { ...payload, feedbackType: undefined }], ['bad rating', { ...payload, rating: 6 }], ['short message', { ...payload, message: 'short' }]]) test('controlled validation and no-store: ' + name, async t => {
    const h = harness(t); assert.equal((await h.request('/feedback', 'POST', body, { raw })).status, 400); assert.equal(h.rows().length, 0);
});
test('admin deletion preserves authentication and can remove private synthetic rows', async t => {
    const h = harness(t), id = h.seed({ submission_type: 'private_feedback', status: 'pending' });
    assert.equal((await h.request('/feedback/' + id, 'DELETE')).status, 401); assert.equal(h.rows().length, 1);
    assert.equal((await h.request('/feedback/' + id, 'DELETE', undefined, { headers: { 'X-Admin-Key': 'wrong' } })).status, 401);
    assert.equal((await h.request('/feedback/' + id, 'DELETE', undefined, { headers: { 'X-Admin-Key': h.env.ADMIN_KEY } })).status, 200); assert.equal(h.rows().length, 0);
    assert.equal((await h.request('/feedback/' + id, 'DELETE', undefined, { headers: { 'X-Admin-Key': h.env.ADMIN_KEY } })).status, 404);
});
test('feedback preflight, unsupported routes and invalid helpful IDs are no-store', async t => {
    const h = harness(t);
    for (const route of ['/feedback', '/feedback/1/helpful', '/feedback/unknown']) { const r = await h.request(route, 'OPTIONS'); assert.equal(r.status, 204); assert.equal(r.headers.get('Access-Control-Allow-Origin'), '*'); }
    assert.equal((await h.request('/feedback', 'PUT')).status, 404); assert.equal((await h.request('/feedback/unknown')).status, 404);
    assert.equal((await h.request('/feedback/abc/helpful', 'POST')).status, 400);
});
test('all feedback database failures are generic and no-store', async t => {
    const h = harness(t); h.env.DB.prepare = () => { throw Error('synthetic secret database detail'); };
    for (const [route, method, body, options] of [['/feedback', 'GET'], ['/feedback/1', 'GET'], ['/feedback/1/helpful', 'POST'], ['/feedback', 'POST', payload], ['/feedback/1', 'DELETE', undefined, { headers: { 'X-Admin-Key': h.env.ADMIN_KEY } }]]) {
        const r = await h.request(route, method, body, options); assert.equal(r.status, 500); assert.deepEqual(r.body, { success: false, message: 'Internal server error.' });
    }
});
test('missing consent schema fails closed without fallback', async t => {
    const h = harness(t, false); h.db.exec("INSERT INTO tool_feedback (tool_id, tool_name, rating, feedback_type, message) VALUES ('synthetic-a','Synthetic',5,'Synthetic','Synthetic legacy row')");
    for (const [route, method, body] of [['/feedback', 'GET'], ['/feedback/1', 'GET'], ['/feedback/1/helpful', 'POST'], ['/feedback', 'POST', payload]]) { const r = await h.request(route, method, body); assert.equal(r.status, 500); assert.deepEqual(r.body, { success: false, message: 'Internal server error.' }); }
    assert.equal(h.rows().length, 1); assert.equal(h.rows()[0].helpful_count, 0);
});
test('unrelated routes and headers retain their existing behavior', async t => {
    const h = harness(t);
    h.db.exec('CREATE TABLE statistics (id INTEGER, stat_key TEXT, stat_value INTEGER); CREATE TABLE tool_usage (tool_id TEXT, tool_name TEXT, usage_count INTEGER, last_used TEXT);');
    const r = await h.request('/statistics'); assert.equal(r.status, 200); assert.deepEqual(r.body, { success: true, summary: [], tools: [] }); assert.equal(r.headers.get('Cache-Control'), null);
    for (const [route, method, expected] of [['/other', 'GET', 404], ['/feedback-other', 'GET', 404], ['/statistics', 'OPTIONS', 204]]) { const response = await h.request(route, method); assert.equal(response.status, expected); assert.equal(response.headers.get('Cache-Control'), null); }
    assert.deepEqual(h.db.prepare('PRAGMA database_list').all().map(row => row.file), ['']);
});

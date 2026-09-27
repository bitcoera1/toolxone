// Schema-only tests: node --test tests/feedback-publication.test.cjs
// Uses Node's installed SQLite and an in-memory database; no D1, network or disk database.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const migration = fs.readFileSync(path.join(__dirname, '../migrations/0001_feedback_publication_consent.sql'), 'utf8');
const columns = ['submission_type', 'publication_consent_version', 'publication_consented_at'];
// Reproduction of the verified table definition, not a copy of production data.
const schema = `CREATE TABLE tool_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tool_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback_type TEXT NOT NULL,
    name TEXT DEFAULT 'Anonymous',
    email TEXT,
    message TEXT NOT NULL,
    country_code TEXT,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','pending','rejected')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;
function database(t) {
    const db = new DatabaseSync(':memory:');
    t.after(() => db.close());
    db.exec(schema);
    return db;
}
const rows = db => db.prepare('SELECT * FROM tool_feedback ORDER BY id').all().map(row => ({ ...row }));
function insertOld(db, rating = 4, status = 'published') {
    return db.prepare('INSERT INTO tool_feedback (tool_id, tool_name, rating, feedback_type, message, status) VALUES (?, ?, ?, ?, ?, ?)')
        .run('synthetic-tool', 'Synthetic Tool', rating, 'Synthetic Feedback', 'Synthetic schema test message', status);
}

test('migration contains exactly three nullable additive statements', () => {
    const statements = migration.split(';').map(s => s.trim()).filter(Boolean);
    assert.deepEqual(statements, columns.map(column => 'ALTER TABLE tool_feedback ADD COLUMN ' + column + ' TEXT DEFAULT NULL'));
});

test('exactly three columns added; original schema metadata and other definitions preserved', t => {
    const db = database(t);
    const before = db.prepare("PRAGMA table_info('tool_feedback')").all();
    const objects = db.prepare("SELECT type, name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger') ORDER BY name").all();
    db.exec(migration);
    const after = db.prepare("PRAGMA table_info('tool_feedback')").all();
    assert.equal(after.length, before.length + 3);
    assert.deepEqual(after.slice(0, before.length), before);
    assert.deepEqual(after.slice(before.length).map(c => ({ name: c.name, type: c.type, notnull: c.notnull, default: c.dflt_value, pk: c.pk })),
        columns.map(name => ({ name, type: 'TEXT', notnull: 0, default: 'NULL', pk: 0 })));
    assert.deepEqual(db.prepare("SELECT type, name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger') ORDER BY name").all(), objects);
    assert.deepEqual(db.prepare('PRAGMA database_list').all().map(d => d.file), ['']);
});

test('existing synthetic values preserved and new consent fields remain null', t => {
    const db = database(t);
    for (const status of ['published', 'pending', 'rejected']) insertOld(db, 4, status);
    db.prepare('INSERT INTO tool_feedback (id, tool_id, tool_name, rating, feedback_type, name, email, message, country_code, helpful_count, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(20, 'synthetic-tool', 'Synthetic Tool', 5, 'Synthetic Review', 'Synthetic Person', 'synthetic@example.invalid', 'Entirely fabricated test text', 'ZZ', 7, 'published', '2000-01-01 00:00:00');
    const before = rows(db);
    db.exec(migration);
    assert.deepEqual(rows(db), before.map(row => ({ ...row, submission_type: null, publication_consent_version: null, publication_consented_at: null })));
    const next = insertOld(db);
    assert.equal(Number(next.lastInsertRowid), 21);
});

test('old inserts still succeed with existing defaults and null consent', t => {
    const db = database(t); db.exec(migration);
    db.prepare('INSERT INTO tool_feedback (tool_id, tool_name, rating, feedback_type, message) VALUES (?, ?, ?, ?, ?)')
        .run('synthetic-tool', 'Synthetic Tool', 3, 'Synthetic Feedback', 'Synthetic old-client payload');
    const row = rows(db)[0];
    assert.equal(row.name, 'Anonymous'); assert.equal(row.email, null);
    assert.equal(row.helpful_count, 0); assert.equal(row.status, 'published');
    assert.match(row.created_at, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    for (const column of columns) assert.equal(row[column], null);
});

for (const type of ['private_feedback', 'public_review']) test('new nullable TEXT columns store ' + type, t => {
    const db = database(t); db.exec(migration);
    const isPublic = type === 'public_review';
    const version = isPublic ? 'public-review-v1' : null;
    const timestamp = isPublic ? '2000-01-01T00:00:00.000Z' : null;
    db.prepare('INSERT INTO tool_feedback (tool_id, tool_name, rating, feedback_type, message, status, submission_type, publication_consent_version, publication_consented_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run('synthetic-tool', 'Synthetic Tool', 4, 'Synthetic Feedback', 'Synthetic consent field test', isPublic ? 'published' : 'pending', type, version, timestamp);
    const row = rows(db)[0];
    assert.equal(row.submission_type, type); assert.equal(row.publication_consent_version, version); assert.equal(row.publication_consented_at, timestamp);
});

test('existing rating constraint remains enforced', t => {
    const db = database(t); db.exec(migration);
    for (const rating of [0, 6, -1]) assert.throws(() => insertOld(db, rating), /CHECK constraint failed/);
    assert.throws(() => insertOld(db, null), /NOT NULL constraint failed/);
    for (const rating of [1, 2, 3, 4, 5]) insertOld(db, rating);
    assert.equal(rows(db).length, 5);
});

test('existing status constraint remains enforced', t => {
    const db = database(t); db.exec(migration);
    for (const status of ['private', '', 'unknown']) assert.throws(() => insertOld(db, 4, status), /CHECK constraint failed/);
    assert.throws(() => insertOld(db, 4, null), /NOT NULL constraint failed/);
    for (const status of ['published', 'pending', 'rejected']) insertOld(db, 4, status);
    assert.deepEqual(rows(db).map(row => row.status), ['published', 'pending', 'rejected']);
});

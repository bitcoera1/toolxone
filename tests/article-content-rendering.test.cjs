// Real registry, article renderer and integration delegation; in-memory DOM only.
// No network, production API, dependencies, or generated artifacts.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

// Frozen pre-restoration authored content: expectations do not derive from edited data.
const expectedCurrency = {
  "title": "How Currency Exchange Profit and Loss Are Calculated",
  "introduction": "Currency exchange profit or loss can occur when a currency is bought at one exchange rate and later sold or valued at another. The result depends on the amount of currency involved, the buy rate, the sell rate, and any fees or commissions charged during the transaction. ToolXone's Currency Exchange Profit Calculator uses the values you enter to estimate buying cost, selling value, gross profit or loss, net profit or loss, and the percentage gain or loss relative to the original buying cost.",
  "sections": [
    {
      "heading": "What Information Does the Currency Profit Calculator Use?",
      "content": "The calculation is based on four inputs. Together, these values describe the currency exchange scenario you want to evaluate.",
      "items": [
        {
          "title": "Currency Amount",
          "description": "The quantity of foreign currency being bought, sold, or evaluated."
        },
        {
          "title": "Buy Rate",
          "description": "The exchange rate used to calculate how much it costs to acquire the selected currency amount."
        },
        {
          "title": "Sell Rate",
          "description": "The exchange rate used to calculate the value of the currency amount when it is sold or evaluated."
        },
        {
          "title": "Exchange Fee / Commission",
          "description": "An optional transaction cost deducted from the gross result when calculating net profit or loss."
        }
      ]
    },
    {
      "heading": "How Is Buying Cost Calculated?",
      "content": "Buying cost represents the amount required to purchase the entered currency amount at the selected buy rate.",
      "formula": "Buying Cost = Currency Amount × Buy Rate",
      "example": "For example, if you evaluate 1,000 units of a currency at a buy rate of 278, the buying cost is 1,000 × 278 = 278,000."
    },
    {
      "heading": "How Is Selling Value Calculated?",
      "content": "Selling value represents the value of the same currency amount at the entered sell rate.",
      "formula": "Selling Value = Currency Amount × Sell Rate",
      "example": "If the same 1,000 units are evaluated at a sell rate of 286, the selling value becomes 1,000 × 286 = 286,000."
    },
    {
      "heading": "Gross Profit or Loss",
      "content": "Gross profit or loss measures the difference between the selling value and the original buying cost before any exchange fee or commission is deducted.",
      "formula": "Gross Profit or Loss = Selling Value − Buying Cost",
      "example": "Using the previous example, 286,000 − 278,000 = 8,000. Because the result is positive, the example produces a gross profit of 8,000. If the result were negative, it would represent a gross loss."
    },
    {
      "heading": "How Exchange Fees Affect Profit",
      "content": "Exchange services, payment providers, brokers, banks, or other intermediaries may charge transaction fees or commissions. A fee reduces the result of the exchange and therefore needs to be considered when estimating net profit or loss.",
      "formula": "Net Profit or Loss = Gross Profit or Loss − Exchange Fee",
      "example": "If the gross profit is 8,000 and the transaction includes a fee of 500, the net result is 8,000 − 500 = 7,500. The estimated net profit is therefore 7,500 after accounting for the entered fee."
    },
    {
      "heading": "How Is Profit or Loss Percentage Calculated?",
      "content": "The percentage result shows the net gain or loss relative to the original buying cost. This makes it easier to understand the size of the result compared with the amount originally spent.",
      "formula": "Profit / Loss % = (Net Profit or Loss ÷ Buying Cost) × 100",
      "example": "Using the example above, (7,500 ÷ 278,000) × 100 ≈ 2.70%. The transaction therefore produces an estimated net profit equal to approximately 2.70% of the original buying cost."
    },
    {
      "heading": "Buy Rate vs. Sell Rate: Why the Difference Matters",
      "content": "The relationship between the buy rate and sell rate is central to the calculation. When the sell rate is higher than the buy rate, the exchange produces a positive gross difference before fees. When the sell rate is lower, the exchange produces a gross loss.",
      "comparisons": [
        {
          "title": "Sell Rate > Buy Rate",
          "description": "The rate difference produces a positive gross result. Fees can reduce that profit and may even turn the final result into a net loss."
        },
        {
          "title": "Sell Rate < Buy Rate",
          "description": "The selling value is lower than the buying cost, producing a gross loss before any additional fees are deducted."
        }
      ]
    },
    {
      "heading": "What Is the Exchange Rate Spread?",
      "content": "The difference between two exchange rates is often described as a rate spread. In the context of this calculator, the difference between the entered sell rate and buy rate helps determine the gross result of the transaction.",
      "formula": "Rate Difference = Sell Rate − Buy Rate",
      "example": "For a buy rate of 278 and a sell rate of 286, the rate difference is 286 − 278 = 8. For 1,000 currency units, that rate difference corresponds to a gross difference of 8,000 before fees."
    },
    {
      "heading": "Can a Profitable Rate Difference Still Produce a Net Loss?",
      "content": "Yes. A higher sell rate does not automatically guarantee a positive net result. Transaction fees can exceed the gross profit created by the rate difference.",
      "example": "Suppose 1,000 currency units are bought at 278 and sold at 280. The gross profit is (1,000 × 280) − (1,000 × 278) = 2,000. If the exchange fee is 3,000, the net result is 2,000 − 3,000 = −1,000. Although the sell rate is higher than the buy rate, the fee turns the transaction into a net loss of 1,000."
    },
    {
      "heading": "What Is the Break-Even Exchange Rate?",
      "content": "A break-even sell rate is the rate at which the selling value covers both the original buying cost and the entered fee, leaving a net result of zero.",
      "formula": "Break-Even Sell Rate = Buy Rate + (Exchange Fee ÷ Currency Amount)",
      "example": "With 1,000 currency units bought at a rate of 278 and a fee of 500, the break-even sell rate is 278 + (500 ÷ 1,000) = 278.50. Under this simplified scenario, a sell rate of 278.50 would produce a selling value of 278,500, exactly covering the 278,000 buying cost and 500 fee."
    },
    {
      "heading": "What Happens When the Buy Rate and Sell Rate Are Equal?",
      "content": "If the buy rate and sell rate are identical, the buying cost and selling value are equal. This produces a gross result of zero.",
      "formula": "Sell Rate = Buy Rate → Gross Profit / Loss = 0",
      "example": "With no exchange fee, the transaction is break-even. If a fee is entered, the transaction produces a net loss equal to that fee."
    },
    {
      "heading": "Example of a Currency Exchange Loss",
      "content": "A loss occurs when the calculated selling value is lower than the buying cost, or when fees push the final result below zero.",
      "example": "Suppose 1,000 currency units are bought at 286 and later evaluated at a sell rate of 278. Buying Cost = 1,000 × 286 = 286,000. Selling Value = 1,000 × 278 = 278,000. Gross Loss = 278,000 − 286,000 = −8,000. If an additional fee of 500 is included, the net loss becomes −8,000 − 500 = −8,500."
    },
    {
      "heading": "Where Can Currency Profit Calculations Be Useful?",
      "content": "Comparing buy and sell rates can be useful in many situations involving foreign currency. The same basic calculation can help evaluate different exchange scenarios before comparing the financial result.",
      "items": [
        {
          "title": "✈️ Travel Money",
          "description": "Compare the cost and value of exchanging currency at different quoted rates."
        },
        {
          "title": "🌍 International Payments",
          "description": "Explore how exchange-rate differences and fees may affect cross-border transactions."
        },
        {
          "title": "💼 Business Transactions",
          "description": "Estimate exchange results when receiving, holding, or converting foreign currency."
        },
        {
          "title": "📊 Currency Scenarios",
          "description": "Compare hypothetical buy rates, sell rates, and fees to understand possible profit or loss outcomes."
        }
      ]
    },
    {
      "heading": "Exchange Profit Is Not the Same as Currency Conversion",
      "content": "A standard currency converter answers a different question: how much one currency is worth in another currency at a given exchange rate. A currency profit calculator instead compares the financial result between an entered buy rate and sell rate.",
      "comparisons": [
        {
          "title": "Currency Converter",
          "description": "Converts an amount from one currency into another using an exchange rate."
        },
        {
          "title": "Currency Profit Calculator",
          "description": "Compares buying cost and selling value to estimate profit or loss after optional fees."
        }
      ]
    },
    {
      "heading": "Important Factors to Consider",
      "content": "This calculator provides an estimate based only on the values entered. Actual currency transactions can involve additional costs or conditions that are not automatically included in the calculation.",
      "items": [
        {
          "title": "Bank or payment-provider fees"
        },
        {
          "title": "Broker commissions"
        },
        {
          "title": "Different quoted buy and sell rates"
        },
        {
          "title": "Transfer or withdrawal charges"
        },
        {
          "title": "Rate changes between transactions"
        },
        {
          "title": "Taxes or other costs where applicable"
        }
      ],
      "closing": "Include relevant transaction costs in the fee field when you want the calculator's net result to reflect those costs."
    },
    {
      "heading": "Does the Calculator Use Live Exchange Rates?",
      "content": "No. The Currency Exchange Profit Calculator does not automatically retrieve live market rates. It calculates the scenario using the buy rate and sell rate entered by you.",
      "closing": "This makes it possible to evaluate quoted rates, historical examples, personal transaction records, or hypothetical exchange scenarios without depending on a specific live exchange-rate source."
    },
    {
      "heading": "Important Note",
      "content": "Currency exchange rates and transaction costs can change, and actual results may differ from calculator estimates. ToolXone's Currency Exchange Profit Calculator is intended for informational and educational calculations and should not be treated as financial, investment, trading, tax, or legal advice."
    }
  ]
};
const expectedQR = {
  "title": "QR Code Generator Guide",
  "intro": "Create scannable QR codes online with ToolXone's free QR Code Generator. Generate QR codes for websites, text, email addresses, phone numbers, SMS messages and WiFi information quickly from your browser.",
  "sections": [
    {
      "heading": "What Is a QR Code Generator?",
      "content": "A QR Code Generator converts information such as a website URL, text, contact information or other supported data into a QR code that can be scanned by a smartphone or compatible QR scanner. QR codes provide a convenient way to share digital information without requiring users to type it manually."
    },
    {
      "heading": "What Can You Create QR Codes For?",
      "content": "ToolXone's QR Code Generator supports several common QR code uses, including website URLs and text, email addresses, phone numbers, SMS messages and WiFi information. Choose the appropriate QR type, enter the required information and generate your QR code."
    },
    {
      "heading": "How to Generate a QR Code",
      "content": "Select the type of QR code you want to create, enter the requested information and select Generate QR. ToolXone creates the QR code in the preview area. When the QR code is ready, you can download it as a PNG image."
    },
    {
      "heading": "QR Codes for Websites and URLs",
      "content": "QR codes can provide a quick way to open a website or online resource. Enter the complete URL, including the appropriate web address, and generate the QR code. Users can then scan the code with a compatible device to access the encoded information."
    },
    {
      "heading": "QR Codes for Email, Phone and SMS",
      "content": "QR codes can also make communication easier. Depending on the selected QR type, you can encode an email address, phone number or SMS message. This can reduce the need for users to manually type contact information on a mobile device."
    },
    {
      "heading": "QR Codes for WiFi",
      "content": "A WiFi QR code can make it easier to share wireless network connection details with compatible devices. Enter the required WiFi information using the WiFi QR type and generate the code. Always make sure the network information is correct before sharing the generated QR code."
    },
    {
      "heading": "Can QR Codes Be Downloaded?",
      "content": "Yes. After generating a QR code, ToolXone provides a Download PNG option so you can save the generated QR code as an image and use it where appropriate."
    },
    {
      "heading": "Tips for Using QR Codes",
      "content": "Test a QR code before distributing or publishing it. Make sure the encoded information is correct and that the code can be scanned successfully from the intended distance and display size. For important links or information, testing on more than one compatible device can also help confirm that the QR code works as expected."
    }
  ]
};

function harness() {
    class Element {
        constructor() { this.innerHTML = ''; this.classList = { add() {} }; }
    }
    const target = new Element();
    const context = {
        HTMLElement: Element,
        console: { info() {}, log() {}, warn() {}, error() {}, debug() {} },
        document: { querySelector: selector => selector === '#financeInfo' ? target : null },
        addEventListener() {},
        fetch() { throw new Error('Network access forbidden in article tests'); }
    };
    context.window = context;
    vm.createContext(context);
    for (const file of [
        'js/content/content-registry.js',
        'js/content/content-data-finance.js',
        'js/content/content-data-qr.js',
        'js/content/article-renderer.js',
        'js/content/content-integration-engine.js'
    ]) vm.runInContext(read(file), context, { filename: file });
    const integration = context.ToolXoneContentIntegrationEngine;
    integration.modules.registry = context.ToolXoneContentRegistry;
    integration.modules.articleRenderer = context.ToolXoneArticleRenderer;
    return {
        render(id) {
            const article = integration.getContent(id).article;
            assert.ok(article);
            assert.equal(integration.renderArticle(article, '#financeInfo'), true);
            return target.innerHTML;
        }
    };
}
function visible(html) {
    return html.replace(/<[^>]*>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}
function count(text, needle) { return text.split(needle).length - 1; }
function sections(html) {
    return [...html.matchAll(/<h2>(.*?)<\/h2>([\s\S]*?)(?=<h2>|<\/section>)/g)];
}

test('Currency Profit renders all authored formulas, examples, lists, comparisons and closing text', () => {
    const html = harness().render('currency-profit-calculator');
    const blocks = sections(html);
    assert.equal(blocks.length, 17);
    assert.ok(visible(html).includes(expectedCurrency.introduction));
    let formulas = 0, examples = 0, lists = 0, closings = 0;
    for (const [i, section] of expectedCurrency.sections.entries()) {
        const block = blocks[i][2], text = visible(block);
        assert.ok(text.includes(section.content), section.heading + ': original paragraph');
        for (const key of ['formula', 'example', 'closing']) {
            if (!section[key]) continue;
            assert.ok([...block.matchAll(/<p>([\s\S]*?)<\/p>/g)].some(m => visible(m[1]) === section[key]), section.heading + ': ' + key);
            if (key === 'formula') formulas++;
            if (key === 'example') examples++;
            if (key === 'closing') closings++;
        }
        for (const key of ['items', 'comparisons']) {
            if (!section[key]) continue;
            lists++;
            const items = [...block.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => visible(m[1]));
            assert.deepEqual(items, section[key].map(item => item.title + (item.description ? ' ' + item.description : '')), section.heading);
        }
    }
    assert.deepEqual({ formulas, examples, lists, closings }, { formulas: 8, examples: 10, lists: 5, closings: 2 });
});

test('Currency Profit preserves headings, order, valid simple structure and single disclaimer', () => {
    const html = harness().render('currency-profit-calculator');
    const blocks = sections(html);
    assert.deepEqual(blocks.map(m => visible(m[1])), expectedCurrency.sections.map(s => s.heading));
    assert.equal(count(html, '<h1>'), 1);
    assert.ok(html.includes('<h1>' + expectedCurrency.title + '</h1>'));
    assert.equal(count(html, '<ul>'), 5);
    assert.equal(count(html, '<li>'), 18);
    assert.ok(html.includes('Sell Rate &gt; Buy Rate'));
    assert.ok(html.includes('Sell Rate &lt; Buy Rate'));
    assert.doesNotMatch(html, /undefined|\[object Object\]/);
    const stack = [];
    for (const match of html.matchAll(/<(\/?)(section|h1|h2|p|ul|li|strong)\b[^>]*>/g)) {
        const [, close, tag] = match;
        if (close) assert.equal(stack.pop(), tag, 'balanced nested tags');
        else {
            if (tag === 'li') assert.equal(stack.at(-1), 'ul');
            if (tag === 'ul' || tag === 'p') assert.notEqual(stack.at(-1), 'p');
            stack.push(tag);
        }
    }
    assert.deepEqual(stack, []);
    for (const [i, section] of expectedCurrency.sections.entries()) {
        const text = visible(blocks[i][2]);
        const ordered = [section.content];
        for (const [key, value] of Object.entries(section)) {
            if (['heading', 'content'].includes(key)) continue;
            if (Array.isArray(value)) for (const item of value) {
                ordered.push(item.title);
                if (item.description) ordered.push(item.description);
            } else ordered.push(value);
        }
        let position = 0;
        for (const value of ordered) {
            const next = text.indexOf(value, position);
            assert.ok(next >= position, section.heading + ': content order');
            position = next + value.length;
        }
    }
    const disclaimer = expectedCurrency.sections.at(-1);
    assert.equal(count(html, '<h2>Important Note</h2>'), 1);
    assert.equal(count(visible(html), disclaimer.content), 1);
});

test('QR introduction renders once before all eight unchanged sections', () => {
    const html = harness().render('qr-code-generator');
    assert.equal(count(visible(html), expectedQR.intro), 1);
    const blocks = sections(html);
    assert.deepEqual(blocks.map(m => visible(m[1])), expectedQR.sections.map(s => s.heading));
    assert.equal(blocks.length, 8);
    assert.ok(html.indexOf(expectedQR.intro) < html.indexOf('<h2>'));
    for (const [i, section] of expectedQR.sections.entries()) assert.equal(visible(blocks[i][2]), section.content);
});

test('repeated rendering replaces each article without duplicate wrappers or content', () => {
    const app = harness();
    for (const id of ['currency-profit-calculator', 'qr-code-generator']) {
        const first = app.render(id), second = app.render(id);
        assert.equal(second, first);
        assert.equal(count(second, '<section class="tool-article">'), 1);
        assert.equal(count(second, '<h1>'), 1);
    }
});

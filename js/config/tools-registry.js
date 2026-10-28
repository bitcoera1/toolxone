/**
 * ==========================================================
 * ToolXone Tools Registry
 * Version: 2.0.0
 * ==========================================================
 *
 * CENTRAL TOOL SOURCE OF TRUTH
 *
 * This registry is the authoritative source for:
 *
 * - Tool IDs
 * - Tool names
 * - Slugs
 * - URLs
 * - Icons
 * - Tool types
 * - Categories
 * - Statistics categories
 * - Aliases
 * - Related tools
 * - Featured status
 * - Newest status
 * - Active status
 *
 * Consumed by:
 *
 * - Tool Identity Resolver
 * - Statistics Engine
 * - Homepage
 * - Search
 * - Categories
 * - Featured Tools
 * - Related Tools
 * - Tool Cards
 * - Content Platform
 * - Future Admin Dashboard
 *
 * IMPORTANT:
 *
 * This file is now the SINGLE CANONICAL TOOL REGISTRY.
 *
 * Other systems must NOT maintain their own independent
 * database of tool IDs, names, URLs, or core tool details.
 * ==========================================================
 */

const ToolXoneToolsRegistry = [

    /* ======================================================
       CALCULATORS
       ====================================================== */

    {
        id: "gpa-cgpa-calculator",
        name: "GPA / CGPA Calculator",
        slug: "gpa-cgpa-calculator",
        type: "calculator",
        category: "calculator",
        categoryId: "calculators",
        statisticsCategory: "calculator",
        icon: "🎓",
        url: "gpa-cgpa-calculator.html",
        aliases: ["gpa calculator", "cgpa calculator", "grade point average", "gpa-cgpa-calculator"],
        related: ["basic-calculator", "percentage-calculator", "scientific-calculator"],
        featured: false,
        newest: true,
        active: true
    },

    {
        id: "basic-calculator",
        name: "Basic Calculator",
        slug: "basic-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "calculators",
        statisticsCategory: "calculator",

        icon: "🧮",

        url: "calculator.html",

        aliases: [
            "basic",
            "calculator",
            "basic calculator",
            "basic-calculator"
        ],

        related: [
            "scientific-calculator",
            "percentage-calculator",
            "bmi-calculator",
            "discount-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "scientific-calculator",
        name: "Scientific Calculator",
        slug: "scientific-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "calculators",
        statisticsCategory: "calculator",

        icon: "🔬",

        url: "scientific-calculator.html",

        aliases: [
            "scientific",
            "scientific calculator",
            "scientific-calculator"
        ],

        related: [
            "basic-calculator",
            "percentage-calculator",
            "compound-interest-calculator",
            "roi-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "percentage-calculator",
        name: "Percentage Calculator",
        slug: "percentage-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "calculators",
        statisticsCategory: "calculator",

        icon: "📊",

        url: "percentage-calculator.html",

        aliases: [
            "percentage",
            "percent",
            "percentage calculator",
            "percentage-calculator"
        ],

        related: [
            "discount-calculator",
            "profit-margin-calculator",
            "basic-calculator",
            "gst-vat-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    /* ======================================================
       HEALTH
       ====================================================== */

    {
        id: "bmi-calculator",
        name: "BMI Calculator",
        slug: "bmi-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "health",
        statisticsCategory: "health",

        icon: "❤️",

        url: "bmi-calculator.html",

        aliases: [
            "bmi",
            "body mass index",
            "bmi calculator",
            "bmi-calculator"
        ],

        related: [
            "bmr-calculator",
            "body-fat-calculator",
            "weight-converter",
            "age-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

{
    id: "bmr-calculator",
    name: "BMR Calculator",
    slug: "bmr-calculator",

    type: "calculator",
    category: "calculator",
    categoryId: "health",
    statisticsCategory: "health",

    icon: "🔥",

    url: "bmr-calculator.html",

    aliases: [
        "bmr",
        "basal metabolic rate",
        "bmr calculator",
        "bmr-calculator"
    ],

    related: [
        "bmi-calculator",
        "age-calculator",
        "weight-converter",
        "body-fat-calculator"
    ],

    featured: false,
    newest: true,
    active: true
},

    {
        id: "body-fat-calculator",
        name: "Body Fat Calculator",
        slug: "body-fat-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "health",
        statisticsCategory: "health",

        icon: "💪",

        url: "body-fat-calculator.html",

        aliases: [
            "body fat",
            "body fat percentage",
            "body fat calculator",
            "body fat percentage calculator",
            "body-fat-calculator"
        ],

        related: [
            "bmi-calculator",
            "bmr-calculator",
            "age-calculator",
            "weight-converter"
        ],

        featured: false,
        newest: true,
        active: true
    },

    {
    id: "calorie-calculator",

    name: "Calorie Calculator",

    categoryId: "health",

    statisticsCategory: "health",

    icon: "🍎",

    url: "calorie-calculator.html",

    aliases: [
        "calorie",
        "calorie calculator",
        "daily calorie calculator",
        "calorie needs",
        "calorie needs calculator",
        "maintenance calories"
    ],

    related: [
        "bmr-calculator",
        "bmi-calculator",
        "body-fat-calculator",
        "age-calculator"
    ],

    featured: false,

    newest: true,

    active: true
},

    /* ======================================================
       FINANCE CALCULATORS
       ====================================================== */

    {
        id: "loan-calculator",
        name: "Loan Calculator",
        slug: "loan-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "💰",

        url: "loan-calculator.html",

        aliases: [
            "loan",
            "loan calculator",
            "loan-calculator"
        ],

        related: [
            "emi-calculator",
            "mortgage-calculator",
            "compound-interest-calculator",
            "roi-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "emi-calculator",
        name: "EMI Calculator",
        slug: "emi-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "💳",

        url: "emi-calculator.html",

        aliases: [
            "emi",
            "emi calculator",
            "emi-calculator"
        ],

        related: [
            "loan-calculator",
            "mortgage-calculator",
            "compound-interest-calculator",
            "roi-calculator"
        ],

        featured: true,
        newest: false,
        active: true
    },

    {
        id: "mortgage-calculator",
        name: "Mortgage Calculator",
        slug: "mortgage-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "🏡",

        url: "mortgage-calculator.html",

        aliases: [
            "mortgage",
            "mortgage calculator",
            "mortgage-calculator"
        ],

        related: [
            "loan-calculator",
            "emi-calculator",
            "retirement-calculator",
            "compound-interest-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "compound-interest-calculator",
        name: "Compound Interest Calculator",
        slug: "compound-interest-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "📈",

        url: "compound-interest-calculator.html",

        aliases: [
            "compound",
            "compound interest",
            "compound interest calculator",
            "compound-interest-calculator"
        ],

        related: [
            "savings-goal-calculator",
            "retirement-calculator",
            "roi-calculator",
            "inflation-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "roi-calculator",
        name: "ROI Calculator",
        slug: "roi-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "📈",

        url: "roi-calculator.html",

        aliases: [
            "roi",
            "return on investment",
            "roi calculator",
            "roi-calculator"
        ],

        related: [
            "compound-interest-calculator",
            "profit-margin-calculator",
            "loan-calculator",
            "retirement-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "profit-margin-calculator",
        name: "Profit Margin Calculator",
        slug: "profit-margin-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "💹",

        url: "profit-margin-calculator.html",

        aliases: [
            "profit margin",
            "margin",
            "profit margin calculator",
            "profit-margin-calculator"
        ],

        related: [
            "discount-calculator",
            "gst-vat-calculator",
            "roi-calculator",
            "currency-profit-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "discount-calculator",
        name: "Discount Calculator",
        slug: "discount-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "🏷️",

        url: "discount-calculator.html",

        aliases: [
            "discount",
            "discount calculator",
            "discount-calculator"
        ],

        related: [
            "profit-margin-calculator",
            "gst-vat-calculator",
            "roi-calculator",
            "currency-profit-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "gst-vat-calculator",
        name: "GST / VAT Calculator",
        slug: "gst-vat-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "🧾",

        url: "gst-vat-calculator.html",

        aliases: [
            "gst",
            "vat",
            "gst vat",
            "gst/vat",
            "gst calculator",
            "vat calculator",
            "gst-vat-calculator"
        ],

        related: [
            "discount-calculator",
            "profit-margin-calculator",
            "currency-profit-calculator",
            "roi-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "inflation-calculator",
        name: "Inflation Calculator",
        slug: "inflation-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "📉",

        url: "inflation-calculator.html",

        aliases: [
            "inflation",
            "inflation calculator",
            "inflation-calculator"
        ],

        related: [
            "compound-interest-calculator",
            "savings-goal-calculator",
            "retirement-calculator",
            "currency-profit-calculator"
        ],

        featured: true,
        newest: true,
        active: true
    },

    {
        id: "currency-profit-calculator",
        name: "Currency Profit Calculator",
        slug: "currency-profit-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "💱",

        url: "currency-profit-calculator.html",

        aliases: [
            "currency profit",
            "currency profit calculator",
            "currency-profit-calculator"
        ],

        related: [
            "profit-margin-calculator",
            "roi-calculator",
            "inflation-calculator",
            "currency-converter"
        ],

        featured: true,
        newest: true,
        active: true
    },

    {
        id: "savings-goal-calculator",
        name: "Savings Goal Calculator",
        slug: "savings-goal-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "🎯",

        url: "savings-goal-calculator.html",

        aliases: [
            "savings goal",
            "savings",
            "savings goal calculator",
            "savings-goal-calculator"
        ],

        related: [
            "compound-interest-calculator",
            "retirement-calculator",
            "inflation-calculator",
            "currency-profit-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "retirement-calculator",
        name: "Retirement Calculator",
        slug: "retirement-calculator",

        type: "calculator",
        category: "calculator",
        categoryId: "finance",
        statisticsCategory: "finance",

        icon: "🏆",

        url: "retirement-calculator.html",

        aliases: [
            "retirement",
            "retirement calculator",
            "retirement-calculator"
        ],

        related: [
            "compound-interest-calculator",
            "savings-goal-calculator",
            "roi-calculator",
            "inflation-calculator"
        ],

        featured: true,
        newest: true,
        active: true
    },

    /* ======================================================
       CONVERTERS
       ====================================================== */

    {
        id: "currency-converter",
        name: "Currency Converter",
        slug: "currency-converter",

        type: "converter",
        category: "converter",
        categoryId: "converters",
        statisticsCategory: "converter",

        icon: "💱",

        url: "currency-converter.html",

        aliases: [
            "currency",
            "currency converter",
            "currency-converter"
        ],

        related: [
            "currency-profit-calculator",
            "inflation-calculator",
            "profit-margin-calculator",
            "roi-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    {
        id: "weight-converter",
        name: "Weight Converter",
        slug: "weight-converter",

        type: "converter",
        category: "converter",
        categoryId: "converters",
        statisticsCategory: "converter",

        icon: "⚖️",

        url: "weight-converter.html",

        aliases: [
            "weight",
            "weight converter",
            "weight-converter"
        ],

        related: [
            "bmi-calculator",
            "age-calculator",
            "percentage-calculator",
            "basic-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

    /* ======================================================
       UTILITIES
       ====================================================== */

    {
        id: "age-calculator",
        name: "Age Calculator",
        slug: "age-calculator",

        type: "calculator",
        category: "utility",
        categoryId: "utilities",
        statisticsCategory: "utility",

        icon: "🎂",

        url: "age-calculator.html",

        aliases: [
            "age",
            "age calculator",
            "age-calculator"
        ],

        related: [
            "bmi-calculator",
            "weight-converter",
            "retirement-calculator",
            "basic-calculator"
        ],

        featured: false,
        newest: false,
        active: true
    },

        {
        id: "qr-code-generator",
        name: "QR Code Generator",
        slug: "qr-code-generator",

        type: "utility",
        category: "utility",
        categoryId: "utilities",
        statisticsCategory: "qr",

        icon: "📱",

        url: "qr-code-generator.html",

        aliases: [
            "qr",
            "qr code",
            "qr code generator",
            "qr-code-generator"
        ],

        related: [
            "basic-calculator",
            "percentage-calculator",
            "age-calculator",
            "weight-converter"
        ],

        featured: false,
        newest: false,
        active: true
    },


    /* ======================================================
       PDF TOOLS
       ====================================================== */


    {
        id: "pdf-to-image",
        name: "PDF to Image",
        slug: "pdf-to-image",

        type: "pdf",
        category: "pdf",
        categoryId: "pdf",
        statisticsCategory: "pdf",

        icon: "🖼️",

        url: "pdf-to-image.html",

        aliases: [
            "pdf to image",
            "pdf to jpg",
            "pdf to png",
            "pdf to webp",
            "convert pdf to image",
            "convert pdf to jpg",
            "convert pdf to png",
            "convert pdf to webp",
            "pdf-to-image",
            "pdf-to-jpg",
            "pdf-to-png",
            "pdf-to-webp"
        ],

        related: [
            "image-to-pdf"
        ],

        featured: true,
        newest: true,
        active: true
    },


    {
        id: "image-to-pdf",
        name: "Image to PDF",
        slug: "image-to-pdf",

        type: "pdf",
        category: "pdf",
        categoryId: "pdf",
        statisticsCategory: "pdf",

        icon: "📄",

        url: "image-to-pdf.html",

        aliases: [
            "image to pdf",
            "jpg to pdf",
            "png to pdf",
            "webp to pdf",
            "convert image to pdf",
            "convert jpg to pdf",
            "convert png to pdf",
            "convert webp to pdf",
            "image-to-pdf",
            "jpg-to-pdf",
            "png-to-pdf",
            "webp-to-pdf"
        ],

        related: [
            "pdf-to-image"
        ],

        featured: true,
        newest: true,
        active: true
    }

];


/* ==========================================================
   REGISTRY HELPERS
   ========================================================== */

/**
 * Get a tool by canonical ID.
 */
ToolXoneToolsRegistry.get = function (id) {

    if (!id) return null;

    return this.find(tool => tool.id === id) || null;

};


/**
 * Get a tool by slug.
 */
ToolXoneToolsRegistry.getBySlug = function (slug) {

    if (!slug) return null;

    const normalized = String(slug)
        .trim()
        .toLowerCase();

    return this.find(tool =>
        tool.slug &&
        tool.slug.toLowerCase() === normalized
    ) || null;

};


/**
 * Find a tool using an alias.
 */
ToolXoneToolsRegistry.getByAlias = function (value) {

    if (!value) return null;

    const normalized = String(value)
        .trim()
        .toLowerCase();

    return this.find(tool => {

        if (tool.id.toLowerCase() === normalized) {
            return true;
        }

        if (
            tool.slug &&
            tool.slug.toLowerCase() === normalized
        ) {
            return true;
        }

        return Array.isArray(tool.aliases) &&
            tool.aliases.some(alias =>
                String(alias).toLowerCase() === normalized
            );

    }) || null;

};


/**
 * Get only active tools.
 */
ToolXoneToolsRegistry.getActive = function () {

    return this.filter(tool => tool.active === true);

};


/**
 * Get tools by type.
 */
ToolXoneToolsRegistry.getByType = function (type) {

    if (!type) return [];

    const normalized = String(type)
        .trim()
        .toLowerCase();

    return this.filter(tool =>
        tool.type === normalized
    );

};


/**
 * Get tools by category.
 */
ToolXoneToolsRegistry.getByCategory = function (category) {

    if (!category) return [];

    const normalized = String(category)
        .trim()
        .toLowerCase();

    return this.filter(tool =>
        tool.category === normalized ||
        tool.categoryId === normalized
    );

};


/**
 * Get featured tools.
 */
ToolXoneToolsRegistry.getFeatured = function () {

    return this.filter(tool =>
        tool.featured === true
    );

};


/**
 * Get newest tools.
 */
ToolXoneToolsRegistry.getNewest = function () {

    return this.filter(tool =>
        tool.newest === true
    );

};


/**
 * Get related tools for a canonical tool ID.
 */
ToolXoneToolsRegistry.getRelated = function (id) {

    const tool = this.get(id);

    if (!tool || !Array.isArray(tool.related)) {
        return [];
    }

    return tool.related
        .map(relatedId => this.get(relatedId))
        .filter(Boolean);

};


/**
 * Check whether a tool exists.
 */
ToolXoneToolsRegistry.exists = function (id) {

    return !!this.get(id);

};


/**
 * Return the number of registered tools.
 */
ToolXoneToolsRegistry.count = function () {

    return this.length;

};


/**
 * Validate the registry.
 */
ToolXoneToolsRegistry.validate = function () {

    const issues = [];
    const ids = new Set();

    this.forEach(tool => {

        if (!tool.id) {
            issues.push("Tool is missing an ID.");
            return;
        }

        if (ids.has(tool.id)) {
            issues.push(
                `Duplicate tool ID: ${tool.id}`
            );
        }

        ids.add(tool.id);

        if (!tool.name) {
            issues.push(
                `${tool.id}: missing name.`
            );
        }

        if (!tool.url) {
            issues.push(
                `${tool.id}: missing URL.`
            );
        }

        if (!tool.slug) {
            issues.push(
                `${tool.id}: missing slug.`
            );
        }

        if (!Array.isArray(tool.aliases)) {
            issues.push(
                `${tool.id}: aliases must be an array.`
            );
        }

        if (!Array.isArray(tool.related)) {
            issues.push(
                `${tool.id}: related must be an array.`
            );
        }

        if (!tool.category) {
            issues.push(
                `${tool.id}: missing category.`
            );
        }

        if (!tool.statisticsCategory) {
            issues.push(
                `${tool.id}: missing statisticsCategory.`
            );
        }

    });

    return {
        valid: issues.length === 0,
        totalTools: this.length,
        issues
    };

};


/* ==========================================================
   GLOBAL EXPOSURE
   ========================================================== */

if (typeof window !== "undefined") {

    window.ToolXoneToolsRegistry =
        ToolXoneToolsRegistry;

}


/* ==========================================================
   INITIALIZATION REPORT
   ========================================================== */

console.info(
    "ToolXone Tools Registry v2.0.0 initialized."
);

console.info(
    `Registered tools: ${ToolXoneToolsRegistry.length}`
);

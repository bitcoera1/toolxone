/*
=========================================
TOOLXONE CORE CONFIG
Version 2.1
=========================================
*/

const TOOLXONE = {
    name: "ToolXone",
    version: "2.1",
    founder: "Tahir Aslam",
    year: 2026,
    totalTools: 20,
    defaultTheme: "light",

    categories: [
        {
            id: "finance",
            icon: "💰",
            name: "Finance Tools",
            tools: [
                { 
    id: "loan", 
    icon: "💰", 
    name: "Loan Calculator", 
    link: "loan-calculator.html",
    related: ["emi", "mortgage", "compound", "roi"]
},
{ 
    id: "mortgage", 
    icon: "🏡", 
    name: "Mortgage Calculator", 
    link: "mortgage-calculator.html",
    related: ["loan", "emi", "retirement", "compound"]
},
{ 
    id: "emi", 
    icon: "💳", 
    name: "EMI Calculator", 
    link: "emi-calculator.html",
    related: ["loan", "mortgage", "compound", "roi"]
},
{ 
    id: "compound", 
    icon: "📈", 
    name: "Compound Interest Calculator", 
    link: "compound-interest-calculator.html",
    related: ["savings-goal", "retirement", "roi", "inflation"]
},
                {
    id: "discount",
    icon: "🏷️",
    name: "Discount Calculator",
    link: "discount-calculator.html",
    related: ["profit-margin", "gst-vat", "roi", "currency-profit"]
},
{
    id: "gst-vat",
    icon: "🧾",
    name: "GST / VAT Calculator",
    link: "gst-vat-calculator.html",
    related: ["discount", "profit-margin", "currency-profit", "roi"]
},
{
    id: "profit-margin",
    icon: "💹",
    name: "Profit Margin Calculator",
    link: "profit-margin-calculator.html",
    related: ["discount", "gst-vat", "roi", "currency-profit"]
},
{
    id: "roi",
    icon: "📈",
    name: "ROI Calculator",
    link: "roi-calculator.html",
    related: ["compound", "profit-margin", "loan", "retirement"]
},
{
    id: "savings-goal",
    icon: "🎯",
    name: "Savings Goal Calculator",
    link: "savings-goal-calculator.html",
    related: ["compound", "retirement", "inflation", "currency-profit"]
},
{
    id: "inflation",
    icon: "📉",
    name: "Inflation Calculator",
    link: "inflation-calculator.html",
    related: ["compound", "savings-goal", "retirement", "currency-profit"]
},
{
    id: "currency-profit",
    icon: "💱",
    name: "Currency Profit Calculator",
    link: "currency-profit-calculator.html",
    related: ["profit-margin", "roi", "inflation", "currency"]
},
{
    id: "retirement",
    icon: "🏆",
    name: "Retirement Calculator",
    link: "retirement-calculator.html",
    related: ["compound", "savings-goal", "roi", "inflation"]
},
            ]
        },

        {
            id: "calculators",
            icon: "🧮",
            name: "Calculators",
            tools: [
                { 
    id: "basic", 
    icon: "🧮", 
    name: "Basic Calculator", 
    link: "calculator.html",
    related: ["scientific", "percentage", "bmi", "discount"]
},
{ 
    id: "scientific", 
    icon: "🔬", 
    name: "Scientific Calculator", 
    link: "scientific-calculator.html",
    related: ["basic", "percentage", "compound", "roi"]
},
{ 
    id: "percentage", 
    icon: "📊", 
    name: "Percentage Calculator", 
    link: "percentage-calculator.html",
    related: ["discount", "profit-margin", "basic", "gst-vat"]
}
            ]
        },

        {
            id: "converters",
            icon: "🔄",
            name: "Converters",
            tools: [
                { 
    id: "currency", 
    icon: "💱", 
    name: "Currency Converter", 
    link: "currency-converter.html",
    related: ["currency-profit", "inflation", "profit-margin", "roi"]
},
{ 
    id: "weight", 
    icon: "⚖️", 
    name: "Weight Converter", 
    link: "weight-converter.html",
    related: ["bmi", "age", "percentage", "basic"]
}
            ]
        },

        {
            id: "health",
            icon: "❤️",
            name: "Health Tools",
            tools: [
{ 
    id: "bmi", 
    icon: "❤️", 
    name: "BMI Calculator", 
    link: "bmi-calculator.html",
    related: ["weight", "age", "percentage", "basic"]
}            ]
        },

        {
            id: "utilities",
            icon: "🛠️",
            name: "Utilities",
            tools: [
                { 
    id: "age", 
    icon: "🎂", 
    name: "Age Calculator", 
    link: "age-calculator.html",
    related: ["bmi", "weight", "retirement", "basic"]
},
{ 
    id: "qr", 
    icon: "📱", 
    name: "QR Code Generator", 
    link: "qr-code-generator.html",
    related: ["image-tools", "developer-tools", "ai-tools", "pdf-tools"]
}
            ]
        },

        {
            id: "future",
            icon: "🚀",
            name: "Coming Soon",
            tools: [
                { id: "ai-tools", icon: "🤖", name: "AI Tools", link: "#" },
                { id: "pdf-tools", icon: "📄", name: "PDF Tools", link: "#" },
                { id: "image-tools", icon: "🖼️", name: "Image Tools", link: "#" },
                { id: "developer-tools", icon: "💻", name: "Developer Tools", link: "#" }
            ]
        }
    ],

    featuredTools: [
        "retirement",
        "currency-profit",
        "inflation",
        "emi"
    ],

    newestTools: [
        "retirement",
        "currency-profit",
        "inflation"
    ]
};
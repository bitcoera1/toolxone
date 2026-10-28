/* ToolXone GPA / CGPA Calculator SEO configuration */
(function () {
    "use strict";
    const pageUrl = "https://www.toolxone.com/gpa-cgpa-calculator.html";
    const description = "Calculate semester GPA and cumulative CGPA with credit-weighted courses and a grading scale that matches your institution.";
    ToolXoneSchemaRegistry.register("GpaCgpaCalculator", {
        version: "1.0.0",
        meta: {
            basic: { title: "GPA and CGPA Calculator – Free Weighted Grade Calculator | ToolXone", description, keywords: ["GPA calculator", "CGPA calculator", "semester GPA", "credit weighted GPA", "grade point average"] },
            canonical: { href: pageUrl },
            robots: { content: "index,follow" },
            application: { name: "ToolXone GPA / CGPA Calculator" },
            mobile: { appleTitle: "GPA / CGPA Calculator", themeColor: "#0f172a" },
            openGraph: { title: "GPA and CGPA Calculator | ToolXone", description, image: "https://www.toolxone.com/images/gpa-cgpa-calculator.svg", imageAlt: "GPA and CGPA Calculator" }
        },
        schema: {
            organization: { name: "ToolXone", url: "https://www.toolxone.com" },
            website: { name: "ToolXone", url: "https://www.toolxone.com" },
            webpage: { name: "GPA and CGPA Calculator", url: pageUrl, description },
            application: { name: "GPA / CGPA Calculator", applicationCategory: "EducationalApplication", operatingSystem: "Any", url: pageUrl, description, offers: { price: "0", priceCurrency: "USD" }, publisher: { name: "ToolXone", url: "https://www.toolxone.com" } },
            faq: [
                { question: "How is semester GPA calculated?", answer: "Multiply each course's grade points by its credit hours, add the products, and divide by the total credit hours included." },
                { question: "Can I use my institution's own grading scale?", answer: "Yes. Select Custom Grading System, enter your institution's letter grades and grade-point values, then choose a letter grade for each course." },
                { question: "Does the calculator assume a standard 4.0 scale?", answer: "No. Quick mode accepts the points you enter, and custom mode uses the grade scale you define. The scale and credit rules should match your institution." },
                { question: "How do I calculate CGPA from a previous CGPA?", answer: "Enter your previous CGPA and completed credits, calculate the current semester GPA above, then combine the previous and current quality points weighted by their credits." },
                { question: "Can I calculate CGPA from multiple semesters?", answer: "Yes. Choose Enter multiple semesters and provide each semester's GPA and earned credits. The result is weighted across all entered credits." },
                { question: "Does this convert GPA to a percentage?", answer: "No. Percentage conversions vary by institution. Use only a conversion formula explicitly supplied by your institution." },
                { question: "Which courses should I include?", answer: "Use the credits and grades your institution counts toward GPA. Policies for repeated, withdrawn, pass/fail, or transferred courses differ." },
                { question: "Why can my result differ from my transcript?", answer: "Your institution may apply different inclusion, repeat-course, precision, or rounding rules. This calculator uses the values and credits you provide." }
            ]
        }
    });
})();

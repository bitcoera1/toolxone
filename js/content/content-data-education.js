/* ToolXone Education Tools Content */
(function (window) {
    "use strict";

    const toolId = "gpa-cgpa-calculator";
    const content = {
        hero: {
            title: "GPA / CGPA Calculator",
            subtitle: "Calculate credit-weighted academic averages",
            description: "Calculate a semester GPA or cumulative GPA with course credits, your own grade-point values, or a custom letter-grade scale.",
            badge: "Education Tool",
            category: "Calculators",
            icon: "🎓",
            highlights: ["Credit-weighted results", "Quick points or custom grades", "Semester and cumulative calculations", "No assumed percentage conversion"],
            statistics: { functions: "2", accuracy: "Weighted", availability: "24/7", price: "Free" },
            preview: { image: { src: "images/gpa-cgpa-calculator.svg", alt: "GPA and CGPA calculator showing a course grade table and weighted result" } },
            cta: { primary: "Calculate GPA", secondary: "Learn about GPA" }
        },
        article: {
            title: "How GPA and CGPA Are Calculated",
            introduction: "A grade point average summarizes course results while accounting for the credit hours assigned to each course. This GPA and CGPA Calculator lets you enter grade points directly or define the letter-grade values used by your institution.",
            sections: [
                { heading: "What Is a Semester GPA?", content: "<p>A semester GPA is the weighted average of the grade points earned in courses during a term. A course with more credits contributes more to the result than a course with fewer credits.</p>" },
                { heading: "The Credit-Weighted GPA Formula", content: "<p>For each course, multiply its grade points by its credit hours. Add those products, then divide by the sum of the included credit hours.</p><p><strong>Semester GPA = Σ (course grade points × course credits) ÷ Σ course credits</strong></p><p>For example, a 4-credit course with 3.7 points and a 2-credit course with 3.0 points produce (4 × 3.7 + 2 × 3.0) ÷ (4 + 2) = 3.467 before display rounding.</p>" },
                { heading: "Use Your Institution's Grading Scale", content: "<p>Institutions can use different letter grades, grade-point values, credit rules, and rounding policies. In Custom Grading System mode, enter the letter grades and point values from your institution, then select a grade for each course. The listed points are inputs to the calculation and are not a universal standard.</p><p>Quick GPA mode accepts grade points directly when you already know the point value for each course.</p>" },
                { heading: "How CGPA Combines Coursework", content: "<p>CGPA is calculated by weighting grade averages by credits. When you enter a previous CGPA and completed credits, the calculator combines those quality points with the current semester's weighted GPA and credits.</p><p><strong>Combined CGPA = (previous CGPA × previous credits + current semester GPA × current semester credits) ÷ total credits</strong></p><p>You can also enter GPA and credits for multiple semesters. The calculator combines their weighted points rather than taking a simple average of semester GPAs.</p>" },
                { heading: "Check Credit and Institutional Rules", content: "<p>Enter the credits your institution counts toward the GPA. Some institutions exclude particular courses, use repeated-course replacement rules, or apply special treatment to pass/fail courses. Follow your transcript or academic handbook when deciding which grades and credits to include.</p>" },
                { heading: "GPA Is Not Automatically a Percentage", content: "<p>There is no single percentage conversion that applies to every institution or grading scale. This calculator reports weighted GPA values only. Use a percentage conversion only when your institution publishes the specific formula that applies to your records.</p>" },
                { heading: "Rounding and Results", content: "<p>Results display to three decimal places. The displayed value is rounded for presentation; institutions may retain more precision or apply their own rounding rules, so an official transcript can differ slightly.</p>" }
            ]
        },
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
    };

    window.ToolXoneContentRegistry.register("hero", toolId, content.hero);
    window.ToolXoneContentRegistry.register("articles", toolId, content.article);
    window.ToolXoneContentRegistry.register("faq", toolId, content.faq);
    window.ToolXoneContentRegistry.register("related", toolId, [
        "basic-calculator", "percentage-calculator", "scientific-calculator"
    ]);
})(window);

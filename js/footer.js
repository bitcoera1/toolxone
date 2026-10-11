/* ==========================================================
   TOOLXONE SHARED FOOTER
   ----------------------------------------------------------
   Responsibility:
   - Generate the shared ToolXone footer
   - Keep footer structure consistent across all pages
   - Use the shared footer styles from css/tools.css
   - Initialize safely regardless of script timing
   ========================================================== */

(function () {

    "use strict";

    function initializeFooter() {

        const footerContainer =
            document.getElementById("siteFooter");

        if (!footerContainer) {

            console.warn(
                "⚠️ ToolXone Footer: #siteFooter not found."
            );

            return;
        }

        const currentYear =
            new Date().getFullYear();


        footerContainer.innerHTML = `

            <div class="footer-content">

                <!-- ToolXone -->
                <div class="footer-grid">

                    <div class="footer-column">

                        <h3>🟢 ToolXone</h3>

                        <p>
                            Free Online Calculators & Smart Utility Tools.
                            Helping everyone calculate, convert and make
                            smarter decisions —
                            Practical Online Tools — Free to Use.
                        </p>

                    </div>


                    <!-- Quick Links -->
                    <div class="footer-column">

                        <h3>🚀 Quick Links</h3>

                        <a href="index.html">
                            🏠 Home
                        </a>

                        <a href="index.html#dashboard">
                            ⭐ Popular Tools
                        </a>

                        <a href="index.html#categories-section">
                            📂 Categories
                        </a>

                        <a href="index.html#dashboard">
                            🧮 Explore Tools
                        </a>

                    </div>


                    <!-- Company -->
                    <div class="footer-column">

                        <h3>🏢 Company</h3>

                        <a href="about.html">
                            ℹ️ About Us
                        </a>

                        <a href="contact.html">
                            📧 Contact
                        </a>

                        <a href="feedback.html">
                            💬 Feedback
                        </a>

                    </div>


                    <!-- Legal -->
                    <div class="footer-column">

                        <h3>📜 Legal</h3>

                        <a href="privacy-policy.html">
                            🔒 Privacy Policy
                        </a>

                        <a href="terms-conditions.html">
                            📄 Terms & Conditions
                        </a>

                        <a href="disclaimer.html">
                            ⚠️ Disclaimer
                        </a>

                        <a href="affiliate-disclosure.html">
                            🤝 Affiliate Disclosure
                        </a>

                    </div>


                    <!-- Follow ToolXone -->
                    <div class="footer-column">

                        <h3>🌐 Follow ToolXone</h3>

                        <a
                            href="https://www.facebook.com/ToolXone"
                            target="_blank"
                            rel="noopener noreferrer">
                            📘 Facebook
                        </a>

                        <a
                            href="https://www.instagram.com/toolxone/"
                            target="_blank"
                            rel="noopener noreferrer">
                            📸 Instagram
                        </a>

                        <a
                            href="https://www.pinterest.com/toolxone/"
                            target="_blank"
                            rel="noopener noreferrer">
                            📌 Pinterest
                        </a>

                        <a
                            href="https://www.linkedin.com/company/toolxone/"
                            target="_blank"
                            rel="noopener noreferrer">
                            💼 LinkedIn
                        </a>

                        <a
                            href="https://www.youtube.com/@toolxone"
                            target="_blank"
                            rel="noopener noreferrer">
                            ▶️ YouTube
                        </a>

                        <a
                            href="https://x.com/toolxone"
                            target="_blank"
                            rel="noopener noreferrer">
                            ✖️ X
                        </a>

                        <a
                            href="https://www.reddit.com/user/ToolXone/"
                            target="_blank"
                            rel="noopener noreferrer">
                            👽 Reddit
                        </a>

                        <a
                            href="https://medium.com/@toolxone"
                            target="_blank"
                            rel="noopener noreferrer">
                            ✍️ Medium
                        </a>

                    </div>

                </div>


                <!-- Footer Bottom -->
                <div class="footer-bottom">

                    <p>
                        © ${currentYear}
                        ToolXone. All rights reserved.
                    </p>

                </div>

            </div>

        `;

        console.log(
            "✅ ToolXone Footer initialized."
        );
    }


    /*
     * Safe initialization
     *
     * If this script loads after the DOM is ready,
     * initialize immediately.
     *
     * Otherwise wait for DOMContentLoaded.
     */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeFooter
        );

    } else {

        initializeFooter();

    }

})();
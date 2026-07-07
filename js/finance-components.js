// ======================================
// TOOLXONE Finance Components
// Shared UI Components
// ======================================

function renderFinanceInfo(containerId, title, description) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <section class="info-section">
            <h2>${title}</h2>
            <p>${description}</p>
        </section>
    `;
}

function renderFinanceFAQ(containerId, faqs) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <section class="faq-section">

            <h2>Frequently Asked Questions</h2>

            ${faqs.map(item => `
                <details>
                    <summary>${item.question}</summary>
                    <p>${item.answer}</p>
                </details>
            `).join("")}

        </section>
    `;
}

function renderFinanceFeedback(containerId, toolName = "ToolXone Tool") {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <section class="feedback-section" data-tool="${toolName}">

            <div class="feedback-header">
                <div class="feedback-icon">💬</div>

                <div>
                    <h2>Help Improve ToolXone</h2>
                    <p>Your feedback helps us build better tools for everyone.</p>
                </div>
            </div>

            <div class="feedback-tool">
                <strong>Current Tool:</strong>
                <span>${toolName}</span>
            </div>

            <form class="feedback-form">

                <div class="feedback-group">
                    <label>⭐ Rate this Tool</label>

                    <div class="rating-options">
                        <label><input type="radio" name="toolRating" value="5"> ⭐⭐⭐⭐⭐ Excellent</label>
                        <label><input type="radio" name="toolRating" value="4"> ⭐⭐⭐⭐ Very Good</label>
                        <label><input type="radio" name="toolRating" value="3"> ⭐⭐⭐ Good</label>
                        <label><input type="radio" name="toolRating" value="2"> ⭐⭐ Needs Improvement</label>
                        <label><input type="radio" name="toolRating" value="1"> ⭐ Poor</label>
                    </div>
                </div>

                <div class="feedback-group">
                    <label>Feedback Type</label>

                    <select class="feedback-type">
                        <option>💡 Suggest a Feature</option>
                        <option>🐞 Report a Bug</option>
                        <option>❤️ General Feedback</option>
                        <option>⚡ Performance Issue</option>
                        <option>🎨 UI / Design Suggestion</option>
                    </select>
                </div>

                <div class="feedback-group">
                    <label>Your Name (Optional)</label>
                    <input type="text" class="feedback-name" placeholder="Enter your name">
                </div>

                <div class="feedback-group">
                    <label>Email (Optional)</label>
                    <input type="email" class="feedback-email" placeholder="your@email.com">
                </div>

                <div class="feedback-group">
                    <label>Your Message</label>

                    <textarea
                        class="feedback-message"
                        rows="6"
                        placeholder="Tell us your experience, report a bug, or suggest a new feature..."
                    ></textarea>
                </div>

                <button class="feedback-submit" type="submit">
                    🚀 Submit Feedback
                </button>

                <div class="feedback-status"></div>

            </form>

            <div class="feedback-note">
                🔒 Your information stays private. Thank you for helping improve ToolXone.
            </div>

        </section>
    `;
}
// ===============================
// TOOLXONE FEEDBACK SYSTEM
// ===============================

document.addEventListener("submit", function (e) {

    if (!e.target.classList.contains("feedback-form")) return;

    e.preventDefault();

    const form = e.target;
    const section = form.closest(".feedback-section");
    const submitBtn = form.querySelector(".feedback-submit");
    const status = form.querySelector(".feedback-status");

    const rating = form.querySelector('input[name="toolRating"]:checked');
    const type = form.querySelector(".feedback-type").value;
    const name = form.querySelector(".feedback-name").value.trim() || "Anonymous";
    const email = form.querySelector(".feedback-email").value.trim() || "Not Provided";
    const message = form.querySelector(".feedback-message").value.trim();

    if (!rating) {
        status.innerHTML = "⭐ Please select a rating.";
        status.className = "feedback-status error";
        return;
    }

    if (message.length < 10) {
        status.innerHTML = "✍️ Please write at least 10 characters.";
        status.className = "feedback-status error";
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ Sending...";

    const ratingMap = {
        "5": "★★★★★ Excellent",
        "4": "★★★★ Very Good",
        "3": "★★★ Good",
        "2": "★★ Needs Improvement",
        "1": "★ Poor"
    };

    const googleForm = document.createElement("form");
    googleForm.method = "POST";
    googleForm.action = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdOXkUo9mkEQp8p-Jv-P8-1rhTj50icBwMtq5HkVrlbbUt0pg/formResponse?pli=1";
    googleForm.target = "hiddenGoogleFormFrame";
    googleForm.style.display = "none";

    const iframe = document.createElement("iframe");
    iframe.name = "hiddenGoogleFormFrame";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const fields = {
        "entry.114908239": section.dataset.tool,
        "entry.1084107115": ratingMap[rating.value],
        "entry.1298677595": type,
        "entry.1551489435": name,
        "entry.1422424945": email,
        "entry.115849848": message,
        "fvv": "1",
        "partialResponse": '[null,null,"4696885395784088671"]',
        "pageHistory": "0",
        "fbzx": "4696885395784088671",
        "submissionTimestamp": "-1"
    };

    for (const key in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        googleForm.appendChild(input);
    }

    document.body.appendChild(googleForm);
    googleForm.submit();

    status.innerHTML = `🎉 Thank you, ${name}! Your feedback has been submitted successfully.`;
    status.className = "feedback-status success";

    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = "🚀 Submit Feedback";

    setTimeout(() => {
        googleForm.remove();
        iframe.remove();
    }, 3000);
});
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

function renderFinanceFeedback(containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <section class="feedback-section">

            <h2>Help Improve ToolXone</h2>

            <p>Your feedback helps us improve this calculator.</p>

            <div class="feedback-options">
                <button>👍 Helpful</button>
                <button>⭐ Excellent</button>
                <button>💡 Suggest Improvement</button>
            </div>

            <textarea
                placeholder="Share your suggestion..."
            ></textarea>

            <button class="feedback-submit">
                Submit Feedback
            </button>

        </section>
    `;
}
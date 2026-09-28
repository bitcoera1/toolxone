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

    if (!container || !Array.isArray(faqs)) return;

    container.innerHTML = `
<section class="tx-faq-section">

    <h2>Frequently Asked Questions</h2>

    ${faqs.map(item => `
<details class="toolxone-faq-item">

    <summary
        aria-expanded="false"
    >
        ${item.question}
    </summary>

    <div class="toolxone-faq-answer">

        <p>
            ${item.answer}
        </p>

        </div>

         </details>
    `).join("")}

   </section>
`;

}

function renderFinanceFeedback(
    containerId,
    toolName = "ToolXone Tool"
) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    const tool =
        ToolXoneToolsRegistry.find(
            item => item.name === toolName
        );

    const toolId =
        tool?.id || null;

    if (!toolId) {

        console.warn(
            "[ToolXone Feedback] Tool not found in registry:",
            toolName
        );

    }

    container.innerHTML = `
    <section
        class="tx-feedback-section"
        data-tool-id="${toolId || ""}"
        data-tool-name="${toolName}"
    >

    <div class="tx-feedback-header">

        <div class="tx-feedback-icon">
            💬
        </div>

        <h2>Help Improve ToolXone</h2>

        <p>
            Your feedback helps us build faster, smarter and more accurate tools
            for everyone.
        </p>

    </div>

    <div class="tx-feedback-tool">

        <span class="tx-feedback-label">
            Current Tool
        </span>

        <strong>${toolName}</strong>

    </div>

    <form class="feedback-form">

        <div class="tx-feedback-group">

            <label>
                Submission choice
                <select class="feedback-submission-type" name="submissionType">
                    <option value="private_feedback" selected>Private feedback</option>
                    <option value="public_review">Public review</option>
                </select>
            </label>

            <p>Private feedback is not published as a public review.</p>
            <p>By selecting Public review and submitting, you agree that your submitted name (or Anonymous), rating, message, tool, server-derived country when available, and date may be displayed publicly.</p>
            <p>Email remains private and is never publicly displayed.</p>

        </div>

        <!-- Rating -->

        <div class="tx-feedback-group">

            <label class="tx-feedback-title">
                ⭐ Rate this Tool
            </label>

            <div class="rating-options">

                <label class="rating-card">

                    <input
                        type="radio"
                        name="toolRating"
                        value="5"
                    >

                    <span>★★★★★</span>

                    <small>Excellent</small>

                </label>

                <label class="rating-card">

                    <input
                        type="radio"
                        name="toolRating"
                        value="4"
                    >

                    <span>★★★★☆</span>

                    <small>Very Good</small>

                </label>

                <label class="rating-card">

                    <input
                        type="radio"
                        name="toolRating"
                        value="3"
                    >

                    <span>★★★☆☆</span>

                    <small>Good</small>

                </label>

                <label class="rating-card">

                    <input
                        type="radio"
                        name="toolRating"
                        value="2"
                    >

                    <span>★★☆☆☆</span>

                    <small>Needs Improvement</small>

                </label>

                <label class="rating-card">

                    <input
                        type="radio"
                        name="toolRating"
                        value="1"
                    >

                    <span>★☆☆☆☆</span>

                    <small>Poor</small>

                </label>

            </div>

        </div>

        <!-- Feedback Type -->

        <div class="tx-feedback-group">

            <label>
                Feedback Type
            </label>

            <select class="feedback-type">

                <option>💡 Suggest a Feature</option>

                <option>🐞 Report a Bug</option>

                <option>❤️ General Feedback</option>

                <option>⚡ Performance Issue</option>

                <option>🎨 UI / Design Suggestion</option>

            </select>

        </div>

        <!-- Name -->

        <div class="tx-feedback-group">

            <label>
                Your Name (Optional)
            </label>

            <input
                type="text"
                class="feedback-name"
                placeholder="Enter your name"
            >

        </div>

        <!-- Email -->

        <div class="tx-feedback-group">

            <label>
                Email (Optional)
            </label>

            <input
                type="email"
                class="feedback-email"
                placeholder="your@email.com"
            >

        </div>

        <!-- Message -->

        <div class="tx-feedback-group">

            <label>
                Your Message
            </label>

            <textarea
                class="feedback-message"
                rows="7"
                placeholder="Tell us your experience, report a bug or suggest a new feature..."
            ></textarea>

        </div>

        <button
            class="feedback-submit"
            type="submit"
        >
            🚀 Submit Feedback
        </button>

        <div class="feedback-status"></div>

    </form>

    <div class="tx-feedback-note">

        🔒 Private feedback stays private. Only explicitly chosen public reviews may be published.
        We never publish your email address.

    </div>

</section>
`;

}


/*=========================================================
  Country Flag Helper
=========================================================*/

function countryCodeToFlag(countryCode){

    if(!countryCode){

        return "";

    }

    const code =
        String(countryCode)
            .trim()
            .toUpperCase();

    /*
    Cloudflare special country codes:
    XX = unknown
    T1 = Tor network

    Do not display these as country flags.
    */

    if(
        code === "XX" ||
        code === "T1" ||
        !/^[A-Z]{2}$/.test(code)
    ){

        return "";

    }

    return Array.from(code)
        .map(function(letter){

            return String.fromCodePoint(
                127397 + letter.charCodeAt(0)
            );

        })
        .join("");

}


/*=========================================================
  ToolXone Live Review Component
  Version: 2.0.0
=========================================================*/

function renderToolReviews(
    containerId,
    toolName = "ToolXone Tool",
    toolId = null
) {

    const container =
        document.getElementById(containerId);

    if (!container) return;


    /*
    ----------------------------------------
    Resolve Tool ID
    ----------------------------------------
    */

    let resolvedToolId = toolId;

/*
----------------------------------------
Resolve Tool ID
----------------------------------------
*/

// 1. Explicit tool ID
if (!resolvedToolId) {

    const pageToolId =
        document.body?.dataset?.tool;

    if (pageToolId) {

        resolvedToolId =
            pageToolId;

    }

}


// 2. Fallback to ToolXone registry
if (
    !resolvedToolId &&
    typeof ToolXoneToolsRegistry !== "undefined"
) {

    const tool =
        ToolXoneToolsRegistry.find(
            item =>
                item.name === toolName
        );

    if (tool) {

        resolvedToolId =
            tool.id;

    }

}


    /*
    ----------------------------------------
    Safe HTML Escape
    ----------------------------------------
    */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }
    
    /*
    ----------------------------------------
    Render Loading State
    ----------------------------------------
    */

    container.innerHTML = `

        <section class="tx-review-section">

            <div class="tx-review-header">

                <div class="tx-review-icon">
                    ⭐
                </div>

                <h2>Tool Reviews</h2>

                <p>
                    See what our users think about the
                    <strong>${escapeHTML(toolName)}</strong>.
                    Every review helps us improve ToolXone.
                </p>

            </div>

            <div class="tx-review-summary">

                <div class="tx-review-score">

                    <div class="tx-rating-number">
                        —
                    </div>

                    <div class="tx-rating-stars">
                        ☆☆☆☆☆
                    </div>

                    <div class="tx-rating-text">
                        Loading reviews...
                    </div>

                </div>

                <div class="tx-rating-breakdown">

                    <div class="tx-rating-row">
                        <span>★★★★★</span>
                        <div class="tx-rating-bar">
                            <div class="tx-rating-fill"
                                 style="width:0%">
                            </div>
                        </div>
                        <strong>0%</strong>
                    </div>

                    <div class="tx-rating-row">
                        <span>★★★★☆</span>
                        <div class="tx-rating-bar">
                            <div class="tx-rating-fill"
                                 style="width:0%">
                            </div>
                        </div>
                        <strong>0%</strong>
                    </div>

                    <div class="tx-rating-row">
                        <span>★★★☆☆</span>
                        <div class="tx-rating-bar">
                            <div class="tx-rating-fill"
                                 style="width:0%">
                            </div>
                        </div>
                        <strong>0%</strong>
                    </div>

                    <div class="tx-rating-row">
                        <span>★★☆☆☆</span>
                        <div class="tx-rating-bar"
                             style="width:0%">
                            <div class="tx-rating-fill"></div>
                        </div>
                        <strong>0%</strong>
                    </div>

                    <div class="tx-rating-row">
                        <span>★☆☆☆☆</span>
                        <div class="tx-rating-bar">
                            <div class="tx-rating-fill"
                                 style="width:0%">
                            </div>
                        </div>
                        <strong>0%</strong>
                    </div>

                </div>

            </div>

            <div class="tx-review-list">

                <div class="tx-review-loading">
                    ⭐ Loading real ToolXone reviews...
                </div>

            </div>

        </section>

    `;


    /*
    ----------------------------------------
    Missing Tool ID
    ----------------------------------------
    */

    if (!resolvedToolId) {

        console.error(
            "[ToolXone Reviews] Unable to resolve tool ID:",
            toolName
        );

        const list =
            container.querySelector(
                ".tx-review-list"
            );

        if (list) {

            list.innerHTML = `

                <div class="tx-review-empty">

                    ⚠️ Reviews are currently unavailable
                    for this tool.

                </div>

            `;

        }

        return;

    }


    /*
    ----------------------------------------
    Fetch Live Reviews
    ----------------------------------------
    */

    (async () => {

        try {

            const response =
                await FeedbackAPI.getAll(
                    resolvedToolId
                );


            /*
            ----------------------------------------
            Validate Response
            ----------------------------------------
            */

            if (
                !response ||
                !response.success
            ) {

                throw new Error(
                    response?.message ||
                    "Unable to load reviews."
                );

            }


            const summary =
                response.summary || {};

            const reviews =
                Array.isArray(
                    response.reviews
                )
                    ? response.reviews
                    : [];


            /*
            ----------------------------------------
            Summary Values
            ----------------------------------------
            */

            const totalReviews =
                Number(
                    summary.total_reviews
                ) || 0;

            const averageRating =
                Number(
                    summary.average_rating
                ) || 0;


            const rating5 =
                Number(
                    summary.rating_5
                ) || 0;

            const rating4 =
                Number(
                    summary.rating_4
                ) || 0;

            const rating3 =
                Number(
                    summary.rating_3
                ) || 0;

            const rating2 =
                Number(
                    summary.rating_2
                ) || 0;

            const rating1 =
                Number(
                    summary.rating_1
                ) || 0;


            /*
            ----------------------------------------
            Calculate Rating Percentages
            ----------------------------------------
            */

            function percentage(count) {

                if (!totalReviews) {

                    return 0;

                }

                return Math.round(
                    (count / totalReviews) * 100
                );

            }


            const percentages = {

                5: percentage(rating5),

                4: percentage(rating4),

                3: percentage(rating3),

                2: percentage(rating2),

                1: percentage(rating1)

            };


            /*
            ----------------------------------------
            Update Average Rating
            ----------------------------------------
            */

            const ratingNumber =
                container.querySelector(
                    ".tx-rating-number"
                );

            const ratingStars =
                container.querySelector(
                    ".tx-rating-stars"
                );

            const ratingText =
                container.querySelector(
                    ".tx-rating-text"
                );


            if (ratingNumber) {

                ratingNumber.textContent =
                    totalReviews
                        ? averageRating.toFixed(1)
                        : "0.0";

            }


            if (ratingStars) {

                const roundedRating =
                    Math.round(
                        averageRating
                    );

                ratingStars.textContent =
                    "★".repeat(
                        Math.min(
                            roundedRating,
                            5
                        )
                    ) +
                    "☆".repeat(
                        Math.max(
                            5 - roundedRating,
                            0
                        )
                    );

            }


            if (ratingText) {

                ratingText.innerHTML =
                    totalReviews
                        ? `Based on <strong>${totalReviews.toLocaleString()}</strong> ${
                            totalReviews === 1
                                ? "review"
                                : "reviews"
                        }`
                        : "No reviews yet";

            }


            /*
            ----------------------------------------
            Update Rating Breakdown
            ----------------------------------------
            */

            const rows =
                container.querySelectorAll(
                    ".tx-rating-row"
                );


            const breakdown = [

                percentages[5],

                percentages[4],

                percentages[3],

                percentages[2],

                percentages[1]

            ];


            rows.forEach(
                (row, index) => {

                    const fill =
                        row.querySelector(
                            ".tx-rating-fill"
                        );

                    const percentageElement =
                        row.querySelector(
                            "strong"
                        );

                    const value =
                        breakdown[index] || 0;


                    if (fill) {

                        fill.style.width =
                            `${value}%`;

                    }


                    if (percentageElement) {

                        percentageElement.textContent =
                            `${value}%`;

                    }

                }
            );


            /*
            ----------------------------------------
            Review List
            ----------------------------------------
            */

            const reviewList =
                container.querySelector(
                    ".tx-review-list"
                );


            if (!reviewList) return;


            /*
            ----------------------------------------
            Empty State
            ----------------------------------------
            */

            if (!reviews.length) {

                reviewList.innerHTML = `

                    <div class="tx-review-empty">

                        ⭐ No reviews yet.

                        <br>

                        Be the first to review
                        <strong>
                            ${escapeHTML(toolName)}
                        </strong>!

                    </div>

                `;

                return;

            }


            /*
            ----------------------------------------
            Render Real Reviews
            ----------------------------------------
            */

            reviewList.innerHTML =
                reviews.map(
                    review => {

                        const name =
                            review.name &&
                            String(
                                review.name
                            ).trim()
                                ? String(
                                    review.name
                                ).trim()
                                : "Anonymous";


                           
                                const countryCode =
                            review.country_code &&
                            String(
                                review.country_code
                            ).trim()
                                ? String(
                                    review.country_code
                                ).trim()
                                : "";

                        const countryFlag =
                            countryCodeToFlag(
                                countryCode
                            );

                        const initial =
                            name
                                .charAt(0)
                                .toUpperCase();


                        const rating =
                            Math.max(
                                1,
                                Math.min(
                                    5,
                                    Number(
                                        review.rating
                                    ) || 0
                                )
                            );


                        const stars =
                            "★".repeat(
                                rating
                            ) +
                            "☆".repeat(
                                5 - rating
                            );


                        const message =
                            escapeHTML(
                                review.message
                            );


                        const feedbackType =
                            escapeHTML(
                                review.feedback_type
                            );


                        const helpfulCount =
                            Number(
                                review.helpful_count
                            ) || 0;


                        return `

                            <article
                                class="tx-review-card"
                                data-review-id="${escapeHTML(
                                    review.id
                                )}"
                            >

                                <div class="tx-review-top">

                                    <div class="tx-review-avatar">

                                        ${escapeHTML(
                                            initial
                                        )}

                                    </div>

                                    <div class="tx-review-user">

                                        <h4>

    ${escapeHTML(
        name
    )}

    ${
        countryFlag
            ? `
                <span
                    class="tx-review-country-flag"
                    role="img"
                    aria-label="Reviewer country: ${escapeHTML(countryCode)}"
                    title="${escapeHTML(countryCode)}"
                >
                    ${countryFlag}
                </span>
              `
            : ""
    }

</h4>

                                        <span>
                                            ${feedbackType}
                                        </span>

                                    </div>

                                    <div class="tx-review-date">

                                        ${formatReviewDate(
                                            review.created_at
                                        )}

                                    </div>

                                </div>

                                <div class="tx-review-stars">

                                    ${stars}

                                </div>

                                <p class="tx-review-message">

                                    ${message}

                                </p>

                                <div class="tx-review-footer">

                                    <button
                                        class="tx-review-helpful"
                                        type="button"
                                        data-review-id="${escapeHTML(review.id)}"
                                        title="Mark this review as helpful"
                                    >

                                        👍 Helpful (${helpfulCount})

                                    </button>

                                </div>

                            </article>

                        `;

                    }
                ).join("");

        }

        catch (error) {

            console.error(
                "[ToolXone Reviews] Loading error:",
                error
            );


            const reviewList =
                container.querySelector(
                    ".tx-review-list"
                );


            if (reviewList) {

                reviewList.innerHTML = `

                    <div class="tx-review-empty">

                        ❌ We couldn't load the reviews
                        right now.

                        <br>

                        Please try again later.

                    </div>

                `;

            }

        }

    })();


    /*
    ----------------------------------------
    Helpful Review Voting
    ----------------------------------------
    */

    if (!container.dataset.helpfulBound) {

        container.addEventListener(
            "click",
            async function (e) {

                const button =
                    e.target.closest(
                        ".tx-review-helpful"
                    );

                if (!button) return;


                const reviewId =
                    button.dataset.reviewId;

                if (!reviewId) {

                    console.error(
                        "[ToolXone Reviews] Missing review ID."
                    );

                    return;

                }


                /*
                ----------------------------------------
                Prevent duplicate clicks
                ----------------------------------------
                */

                if (
                    button.disabled
                ) {

                    return;

                }


                button.disabled = true;

                const originalText =
                    button.innerHTML;

                button.innerHTML =
                    "⏳ Updating...";


                try {

                    /*
                    ----------------------------------------
                    Mark review as helpful
                    ----------------------------------------
                    */

                    const response =
                        await FeedbackAPI.helpful(
                            reviewId
                        );

                    if (
                        !response ||
                        !response.success
                    ) {

                        throw new Error(
                            response?.message ||
                            "Unable to mark review as helpful."
                        );

                    }


                    /*
                    ----------------------------------------
                    Update Helpful Count
                    ----------------------------------------
                    */

                    const helpfulCount =
                        Number(
                            response.helpfulCount
                        ) || 0;


                    button.innerHTML =
                        `👍 Helpful (${helpfulCount})`;


                    /*
                    ----------------------------------------
                    Lock this vote
                    ----------------------------------------
                    */

                    button.classList.add(
                        "is-helpful"
                    );

                }

                catch (error) {

                    console.error(
                        "[ToolXone Reviews] Helpful vote error:",
                        error
                    );


                    button.innerHTML =
                        originalText;


                    button.disabled = false;

                }

            }
        );


        /*
        ----------------------------------------
        Prevent duplicate event binding
        ----------------------------------------
        */

        container.dataset.helpfulBound =
            "true";

    }

}
    
    /*
    ----------------------------------------
    Format Review Date
    ----------------------------------------
    */

    function formatReviewDate(
        createdAt
    ) {

        if (!createdAt) {

            return "";

        }


        const normalized =
            String(
                createdAt
            ).replace(
                " ",
                "T"
            );


        const date =
            new Date(
                normalized
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return escapeHTML(
                createdAt
            );

        }


        const now =
            new Date();


        const diffMs =
            now.getTime() -
            date.getTime();


        const diffMinutes =
            Math.floor(
                diffMs /
                60000
            );


        if (
            diffMinutes < 1
        ) {

            return "Just now";

        }


        if (
            diffMinutes < 60
        ) {

            return `${diffMinutes} ${
                diffMinutes === 1
                    ? "minute"
                    : "minutes"
            } ago`;

        }


        const diffHours =
            Math.floor(
                diffMinutes /
                60
            );


        if (
            diffHours < 24
        ) {

            return `${diffHours} ${
                diffHours === 1
                    ? "hour"
                    : "hours"
            } ago`;

        }


        const diffDays =
            Math.floor(
                diffHours /
                24
            );


        if (
            diffDays === 1
        ) {

            return "Yesterday";

        }


        if (
            diffDays < 30
        ) {

            return `${diffDays} days ago`;

        }


        return date.toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }




window.renderToolReviews =
    renderToolReviews;


// ===============================
// TOOLXONE FEEDBACK SYSTEM
// ===============================

document.addEventListener(
    "submit",
    async function (e) {

        if (
            !e.target.classList.contains(
                "feedback-form"
            )
        ) {
            return;
        }

        e.preventDefault();

        const form = e.target;

        const section =
            form.closest(
                ".tx-feedback-section"
            );

        const submitBtn =
            form.querySelector(
                ".feedback-submit"
            );

        const status =
            form.querySelector(
                ".feedback-status"
            );

        /*
        ----------------------------------------
        Resolve Tool
        ----------------------------------------
        */

        const toolId =
            section?.dataset.toolId || null;

        const toolName =
            section?.dataset.toolName ||
            "ToolXone Tool";

        if (!toolId) {

            status.innerHTML =
                "⚠️ Unable to identify this tool. Please refresh the page and try again.";

            status.className =
                "feedback-status error";

            console.error(
                "[ToolXone Feedback] Missing tool ID:",
                toolName
            );

            return;

        }

        /*
        ----------------------------------------
        Read Form Data
        ----------------------------------------
        */

        const rating =
            form.querySelector(
                'input[name="toolRating"]:checked'
            );

        const submissionType =
            form.querySelector('.feedback-submission-type')?.value === 'public_review'
                ? 'public_review'
                : 'private_feedback';

        const type =
            form.querySelector(
                ".feedback-type"
            )?.value || "";

        const name =
            form.querySelector(
                ".feedback-name"
            )?.value.trim() ||
            "Anonymous";

        const email =
            form.querySelector(
                ".feedback-email"
            )?.value.trim() ||
            null;

        const message =
            form.querySelector(
                ".feedback-message"
            )?.value.trim() ||
            "";

        /*
        ----------------------------------------
        Client Validation
        ----------------------------------------
        */

        if (!rating) {

            status.innerHTML =
                "⭐ Please select a rating.";

            status.className =
                "feedback-status error";

            return;

        }

        if (message.length < 10) {

            status.innerHTML =
                "✍️ Please write at least 10 characters.";

            status.className =
                "feedback-status error";

            return;

        }

        /*
        ----------------------------------------
        Submit State
        ----------------------------------------
        */

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            "⏳ Sending...";

        status.innerHTML = "";

        status.className =
            "feedback-status";

        try {

            /*
            ----------------------------------------
            Submit to ToolXone Backend
            ----------------------------------------
            */

            const response =
                await FeedbackAPI.submit({

                    toolId,

                    toolName,

                    rating:
                        Number(
                            rating.value
                        ),

                    submissionType,

                    ...(submissionType === 'public_review'
                        ? { publicationConsentVersion: 'public-review-v1' }
                        : { feedbackType: type }),

                    name,

                    email,

                    message,

                    countryCode:
                        null

                });

            /*
            ----------------------------------------
            Backend Response
            ----------------------------------------
            */

            if (
                !response ||
                !response.success
            ) {

                throw new Error(
                    response?.message ||
                    "Feedback submission failed."
                );

            }

            /*
            ----------------------------------------
            Success
            ----------------------------------------
            */

            status.textContent =
                `🎉 Thank you, ${name}! Your ${submissionType === 'public_review' ? 'public review' : 'private feedback'} has been submitted successfully.`;

            status.className =
                "feedback-status success";

            form.reset();

        }

        catch (error) {

            console.error(
                "[ToolXone Feedback] Submission error:",
                error
            );

            status.innerHTML =
                "❌ We couldn't submit your feedback right now. Please try again.";

            status.className =
                "feedback-status error";

        }

        finally {

            submitBtn.disabled = false;

            submitBtn.innerHTML =
                "🚀 Submit Feedback";

        }

    }
);
/*
==========================================================
ToolXone Backend
Cloudflare Worker
Version: 1.1.0
==========================================================
Responsibility

Main backend entry point.

Handles:

- Statistics
- Tool Usage
- Feedback
- Reviews

==========================================================
*/

export default {

    async fetch(request, env, ctx) {

        return WorkerRouter.handle(
            request,
            env,
            ctx
        );

    }

};


const PUBLIC_FEEDBACK_PREDICATE = `
    submission_type = 'public_review'
    AND publication_consent_version = 'public-review-v1'
    AND publication_consented_at IS NOT NULL
    AND status = 'published'
`;

const WorkerRouter = {

    // ==================================================
    // MAIN REQUEST HANDLER
    // ==================================================

    async handle(
        request,
        env,
        ctx
    ) {

        const path = new URL(request.url).pathname;
        const isFeedbackPath =
            path === "/feedback" || path.startsWith("/feedback/");
        let response;

        try {
            response = request.method === "OPTIONS"
                ? this.cors()
                : await this.dispatch(path, request.method, request, env, ctx);
        } catch (error) {
            response = this.serverError(error);
        }

        if (isFeedbackPath) {
            response.headers.set("Cache-Control", "no-store");
        }

        return response;

    },


    // ==================================================
    // ROUTER
    // ==================================================

    async dispatch(
        path,
        method,
        request,
        env,
        ctx
    ) {

        // =============================================
        // STATISTICS
        // =============================================

        if (
            path === "/statistics" &&
            method === "GET"
        ) {

            return this.getStatistics(
                env
            );

        }


        if (
            path === "/statistics/increment" &&
            method === "POST"
        ) {

            return this.incrementStatistic(
                request,
                env
            );

        }


        if (
            path === "/statistics/tool" &&
            method === "POST"
        ) {

            return this.recordToolUsage(
                request,
                env
            );

        }


        // =============================================
        // FEEDBACK / REVIEWS
        // =============================================

        if (
            path === "/feedback" &&
            method === "POST"
        ) {

            return this.createFeedback(
                request,
                env
            );

        }


        if (
            path === "/feedback" &&
            method === "GET"
        ) {

            return this.getFeedback(
                request,
                env
            );

        }

        // =============================================
        //      MARK FEEDBACK AS HELPFUL
        // =============================================

if (
    path.startsWith("/feedback/") &&
    path.endsWith("/helpful") &&
    method === "POST"
) {

    const id =
        path.split("/")[2];

    return this.markFeedbackHelpful(
        id,
        env
    );

}

        // ---------------------------------------------
        // Single review
        // ---------------------------------------------

        const feedbackMatch =
            path.match(
                /^\/feedback\/(\d+)$/
            );

        if (
            feedbackMatch &&
            method === "GET"
        ) {

            return this.getFeedbackById(
                feedbackMatch[1],
                env
            );

        }


        // ---------------------------------------------
        // Delete review
        // ---------------------------------------------

        if (
            feedbackMatch &&
            method === "DELETE"
        ) {

            return this.deleteFeedback(
                feedbackMatch[1],
                request,
                env
            );

        }


        // =============================================
        // NOT FOUND
        // =============================================

        return this.notFound();

    },


    // ==================================================
    // STATISTICS
    // ==================================================

    async getStatistics(env) {

        try {

            const {
                results: summary
            } = await env.DB
                .prepare(`
                    SELECT
                        stat_key,
                        stat_value
                    FROM
                        statistics
                    ORDER BY
                        id
                `)
                .all();


            const {
                results: tools
            } = await env.DB
                .prepare(`
                    SELECT
                        tool_id,
                        tool_name,
                        usage_count,
                        last_used
                    FROM
                        tool_usage
                    ORDER BY
                        usage_count DESC
                `)
                .all();


            return this.json({

                success: true,

                summary,

                tools

            });

        }

        catch (error) {

            return this.serverError(
                error
            );

        }

    },


    // ==================================================
    // INCREMENT STATISTIC
    // ==================================================

    async incrementStatistic(
        request,
        env
    ) {

        try {

            const {
                statKey
            } = await request.json();


            if (!statKey) {

                return this.json({

                    success: false,

                    message:
                        "Statistic key is required."

                }, 400);

            }


            await env.DB
                .prepare(`
                    UPDATE statistics
                    SET
                        stat_value =
                            stat_value + 1,
                        updated_at =
                            CURRENT_TIMESTAMP
                    WHERE
                        stat_key = ?
                `)
                .bind(
                    statKey
                )
                .run();


            return this.json({

                success: true,

                statKey

            });

        }

        catch (error) {

            return this.serverError(
                error
            );

        }

    },


    // ==================================================
    // TOOL USAGE
    // ==================================================

    async recordToolUsage(
        request,
        env
    ) {

        try {

            const {
                toolId,
                toolName
            } = await request.json();


            if (
                !toolId ||
                !toolName
            ) {

                return this.json({

                    success: false,

                    message:
                        "Tool ID and Tool Name are required."

                }, 400);

            }


            await env.DB
                .prepare(`
                    INSERT INTO tool_usage (
                        tool_id,
                        tool_name,
                        usage_count
                    )

                    VALUES (
                        ?, ?, 1
                    )

                    ON CONFLICT(tool_id)

                    DO UPDATE SET

                        usage_count =
                            usage_count + 1,

                        last_used =
                            CURRENT_TIMESTAMP
                `)
                .bind(
                    toolId,
                    toolName
                )
                .run();


            return this.json({

                success: true,

                toolId

            });

        }

        catch (error) {

            return this.serverError(
                error
            );

        }

    },


    // ==================================================
    // CREATE FEEDBACK
    // ==================================================

    async createFeedback(
        request,
        env
    ) {

        try {

            let data;
            try {
                data = await request.json();
            } catch {
                return this.json({ success: false, message: "Invalid JSON body." }, 400);
            }

            if (!data || typeof data !== "object" || Array.isArray(data)) {
                return this.json({ success: false, message: "A JSON object is required." }, 400);
            }

            const submissionType = Object.prototype.hasOwnProperty.call(data, "submissionType")
                ? data.submissionType
                : "private_feedback";

            if (submissionType !== "private_feedback" && submissionType !== "public_review") {
                return this.json({ success: false, message: "Invalid submission type." }, 400);
            }

            const isPublicReview = submissionType === "public_review";
            if (isPublicReview && data.publicationConsentVersion !== "public-review-v1") {
                return this.json({ success: false, message: "Public review publication consent is required." }, 400);
            }

            const storedFeedbackType = isPublicReview ? "Public Review" : data.feedbackType;
            const publicationStatus = isPublicReview ? "published" : "pending";
            const consentVersion = isPublicReview ? "public-review-v1" : null;
            const consentedAt = isPublicReview ? new Date().toISOString() : null;


            const {
    toolId,
    toolName,
    rating,
    name,
    email,
    message
} = data;


            // ------------------------------------------
            // Required fields
            // ------------------------------------------

            if (
                !toolId ||
                !toolName ||
                !rating ||
                !storedFeedbackType ||
                !message
            ) {

                return this.json({

                    success: false,

                    message:
                        "Tool ID, Tool Name, Rating, Feedback Type and Message are required."

                }, 400);

            }


            // ------------------------------------------
            // Rating validation
            // ------------------------------------------

            const numericRating =
                Number(rating);


            if (
                !Number.isInteger(
                    numericRating
                ) ||
                numericRating < 1 ||
                numericRating > 5
            ) {

                return this.json({

                    success: false,

                    message:
                        "Rating must be an integer between 1 and 5."

                }, 400);

            }


            // ------------------------------------------
            // Message validation
            // ------------------------------------------

            const cleanMessage =
                String(message)
                    .trim();


            if (
                cleanMessage.length < 10
            ) {

                return this.json({

                    success: false,

                    message:
                        "Feedback message must contain at least 10 characters."

                }, 400);

            }


            // ------------------------------------------
            // Safe defaults
            // ------------------------------------------

            const cleanName =
                name &&
                String(name).trim()
                    ? String(name).trim()
                    : "Anonymous";


            const cleanEmail =
                email &&
                String(email).trim()
                    ? String(email).trim()
                    : null;


            /*

/* ------------------------------------------
   Automatic Country Detection
   ------------------------------------------

   Cloudflare provides the visitor's
   two-letter country code through
   request.cf.country.

   The server value is authoritative.
   Never trust a client-supplied country.
------------------------------------------ */

const detectedCountryCode =
    request.cf?.country || null;

const cleanCountryCode =
    detectedCountryCode &&
    String(
        detectedCountryCode
    )
        .trim()
        .toUpperCase()
        .slice(0, 2)
    || null;


            // ------------------------------------------
            // Insert review
            // ------------------------------------------

            const result =
                await env.DB
                    .prepare(`
                        INSERT INTO tool_feedback (

                            tool_id,
                            tool_name,
                            rating,
                            feedback_type,
                            name,
                            email,
                            message,
                            country_code,
                            helpful_count,
                            status,
                            submission_type,
                            publication_consent_version,
                            publication_consented_at

                        )

                        VALUES (

                            ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?

                        )

                    `)
                    .bind(

                        toolId,
                        toolName,
                        numericRating,
                        storedFeedbackType,
                        cleanName,
                        cleanEmail,
                        cleanMessage,
                        cleanCountryCode,
                        publicationStatus,
                        submissionType,
                        consentVersion,
                        consentedAt

                    )
                    .run();


            return this.json({

                success: true,

                message:
                    isPublicReview
                        ? "Public review submitted successfully."
                        : "Private feedback submitted successfully.",

                feedbackId:
                    result.meta
                        ?.last_row_id || null

            }, 201);

        }

        catch (error) {

            return this.serverError(
                error
            );

        }

    },


    // ==================================================
    // GET FEEDBACK / REVIEWS
    // ==================================================

    async getFeedback(
        request,
        env
    ) {

        try {

            const url =
                new URL(
                    request.url
                );


            const toolId =
                url.searchParams.get(
                    "toolId"
                );


            // ------------------------------------------
            // Rating summary
            // ------------------------------------------

            let summaryQuery = `
                SELECT

                    COUNT(*) AS total_reviews,

                    ROUND(
                        AVG(rating),
                        1
                    ) AS average_rating,

                    SUM(
                        CASE
                            WHEN rating = 5
                            THEN 1
                            ELSE 0
                        END
                    ) AS rating_5,

                    SUM(
                        CASE
                            WHEN rating = 4
                            THEN 1
                            ELSE 0
                        END
                    ) AS rating_4,

                    SUM(
                        CASE
                            WHEN rating = 3
                            THEN 1
                            ELSE 0
                        END
                    ) AS rating_3,

                    SUM(
                        CASE
                            WHEN rating = 2
                            THEN 1
                            ELSE 0
                        END
                    ) AS rating_2,

                    SUM(
                        CASE
                            WHEN rating = 1
                            THEN 1
                            ELSE 0
                        END
                    ) AS rating_1

                FROM
                    tool_feedback

                WHERE
                    ${PUBLIC_FEEDBACK_PREDICATE}
            `;


            let summaryStatement;


            if (toolId) {

                summaryQuery += `
                    AND tool_id = ?
                `;

                summaryStatement =
                    env.DB
                        .prepare(
                            summaryQuery
                        )
                        .bind(toolId);

            }

            else {

                summaryStatement =
                    env.DB
                        .prepare(
                            summaryQuery
                        );

            }


            const {
                results: summary
            } = await summaryStatement.all();


            // ------------------------------------------
            // Reviews
            // ------------------------------------------

            let reviewsQuery = `
                SELECT

                    id,
                    tool_id,
                    tool_name,
                    rating,
                    feedback_type,
                    name,
                    message,
                    country_code,
                    helpful_count,
                    created_at

                FROM
                    tool_feedback

                WHERE
                    ${PUBLIC_FEEDBACK_PREDICATE}
            `;


            if (toolId) {

                reviewsQuery += `
                    AND tool_id = ?
                `;

            }


            reviewsQuery += `
                ORDER BY
                    created_at DESC
            `;


            reviewsQuery += `
                LIMIT 50
            `;


            let reviewsStatement =
                env.DB.prepare(
                    reviewsQuery
                );


            if (toolId) {

                reviewsStatement =
                    reviewsStatement.bind(
                        toolId
                    );

            }


            const {
                results: reviews
            } = await reviewsStatement.all();


            return this.json({

                success: true,

                summary:
                    summary[0] || {

                        total_reviews: 0,

                        average_rating: 0,

                        rating_5: 0,

                        rating_4: 0,

                        rating_3: 0,

                        rating_2: 0,

                        rating_1: 0

                    },

                reviews

            });

        }

        catch (error) {

            return this.serverError(
                error
            );

        }

    },


    // ==================================================
    // GET SINGLE FEEDBACK
    // ==================================================

    async getFeedbackById(
        id,
        env
    ) {

        try {

            const {
                results
            } = await env.DB
                .prepare(`
                    SELECT

                        id,
                        tool_id,
                        tool_name,
                        rating,
                        feedback_type,
                        name,
                        message,
                        country_code,
                        helpful_count,
                        created_at

                    FROM
                        tool_feedback

                    WHERE
                        id = ?
                        AND ${PUBLIC_FEEDBACK_PREDICATE}

                    LIMIT 1
                `)
                .bind(id)
                .all();


            if (
                !results.length
            ) {

                return this.json({

                    success: false,

                    message:
                        "Feedback not found."

                }, 404);

            }


            return this.json({

                success: true,

                feedback:
                    results[0]

            });

        }

        catch (error) {

            return this.serverError(
                error
            );

        }

    },

// ==================================================
// MARK FEEDBACK AS HELPFUL
// ==================================================

async markFeedbackHelpful(
    id,
    env
) {

    try {

        // ------------------------------------------
        // Validate ID
        // ------------------------------------------

        const numericId =
            Number(id);


        if (
            !Number.isInteger(
                numericId
            ) ||
            numericId <= 0
        ) {

            return this.json({

                success: false,

                message:
                    "Invalid feedback ID."

            }, 400);

        }


        const { results: updated } = await env.DB
            .prepare(`
                UPDATE tool_feedback
                SET helpful_count = helpful_count + 1
                WHERE id = ?
                  AND ${PUBLIC_FEEDBACK_PREDICATE}
                RETURNING id, helpful_count
            `)
            .bind(numericId)
            .all();

        if (!updated.length) {
            return this.json({ success: false, message: "Feedback not found." }, 404);
        }

        return this.json({

            success: true,

            message:
                "Feedback marked as helpful.",

            feedbackId:
                numericId,

            helpfulCount:
                updated[0]?.helpful_count || 0

        });

    }

    catch (error) {

        return this.serverError(
            error
        );

    }

},


    // ==================================================
    // DELETE FEEDBACK
    // ==================================================

    async deleteFeedback(
        id,
        request,
        env
    ) {

        try {

            // ------------------------------------------
            // Admin authentication
            // ------------------------------------------

            const adminKey =
                request.headers.get(
                    "X-Admin-Key"
                );


            if (
                !env.ADMIN_KEY ||
                adminKey !== env.ADMIN_KEY
            ) {

                return this.json({

                    success: false,

                    message:
                        "Unauthorized."

                }, 401);

            }


            const result =
                await env.DB
                    .prepare(`
                        DELETE FROM
                            tool_feedback

                        WHERE
                            id = ?
                    `)
                    .bind(id)
                    .run();


            if (
                !result.meta
                    ?.changes
            ) {

                return this.json({

                    success: false,

                    message:
                        "Feedback not found."

                }, 404);

            }


            return this.json({

                success: true,

                message:
                    "Feedback deleted successfully.",

                id

            });

        }

        catch (error) {

            return this.serverError(
                error
            );

        }

    },


    // ==================================================
    // JSON RESPONSE
    // ==================================================

    json(
        data,
        status = 200
    ) {

        return new Response(

            JSON.stringify(
                data
            ),

            {

                status,

                headers: {

                    "Content-Type":
                        "application/json",

                    "Access-Control-Allow-Origin":
                        "*",

                    "Access-Control-Allow-Headers":
                        "Content-Type, X-Admin-Key",

                    "Access-Control-Allow-Methods":
                        "GET,POST,PUT,DELETE,OPTIONS"

                }

            }

        );

    },


    // ==================================================
    // CORS
    // ==================================================

    cors() {

        return new Response(

            null,

            {

                status: 204,

                headers: {

                    "Access-Control-Allow-Origin":
                        "*",

                    "Access-Control-Allow-Headers":
                        "Content-Type, X-Admin-Key",

                    "Access-Control-Allow-Methods":
                        "GET,POST,PUT,DELETE,OPTIONS"

                }

            }

        );

    },


    // ==================================================
    // NOT FOUND
    // ==================================================

    notFound() {

        return this.json({

            success: false,

            message:
                "Endpoint not found."

        }, 404);

    },


    // ==================================================
    // SERVER ERROR
    // ==================================================

    serverError(error) {

        console.error(
            "[ToolXone Worker Error]",
            error
        );


        return this.json({

            success: false,

            message:
                "Internal server error."

        }, 500);

    }

};
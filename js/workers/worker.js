/*
====================================================

ToolXone Backend

Cloudflare Worker

Version:
1.0.0

Responsibility

Main backend entry point.

====================================================
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

const WorkerRouter = {

    async handle(

        request,
        env,
        ctx

    ) {

        try {

            const url = new URL(request.url);

const path = url.pathname;

const method = request.method;

if (method === "OPTIONS") {

    return this.cors();

}

return this.dispatch(

    path,
    method,
    request,
    env,
    ctx

);


  }

        catch (error) {

            return this.serverError(

                error

            );

        }

    },

    async dispatch(
    path,
    method,
    request,
    env,
    ctx
) {

    // Get all statistics
    if (
        path === "/statistics" &&
        method === "GET"
    ) {

        return this.getStatistics(env);

    }

    // Increment a statistic
    if (
        path === "/statistics/increment" &&
        method === "POST"
    ) {

        return this.incrementStatistic(
            request,
            env
        );

    }

    return this.notFound();

},

    async getStatistics(env) {

    try {

        const { results } =

            await env.DB

                .prepare(

                    `
                    SELECT
                        stat_key,
                        stat_value
                    FROM
                        statistics
                    ORDER BY
                        id
                    `
                )

                .all();

        return this.json(

            {

                success: true,

                data: results

            }

        );

    }

    catch (error) {

        return this.serverError(

            error

        );

    }

},

async incrementStatistic(
    request,
    env
) {

    try {

        const {

            statKey

        } = await request.json();

        if (

            !statKey

        ) {

            return this.json(

                {

                    success: false,

                    message:
                        "Statistic key is required."

                },

                400

            );

        }

        await env.DB

            .prepare(

                `
                UPDATE statistics
                SET stat_value = stat_value + 1
                WHERE stat_key = ?
                `

            )

            .bind(

                statKey

            )

            .run();

        return this.json(

            {

                success: true,

                statKey

            }

        );

    }

    catch (error) {

        return this.serverError(

            error

        );

    }

},

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
                        "*",

                    "Access-Control-Allow-Methods":
                        "GET,POST,PUT,DELETE,OPTIONS"

                }

            }

        );

    },

    cors() {

        return new Response(

            null,

            {

                status: 204,

                headers: {

                    "Access-Control-Allow-Origin":
                        "*",

                    "Access-Control-Allow-Headers":
                        "*",

                    "Access-Control-Allow-Methods":
                        "GET,POST,PUT,DELETE,OPTIONS"

                }

            }

        );

    },

    notFound() {

        return this.json(

            {

                success: false,

                message:

                    "Endpoint not found."

            },

            404

        );

    },

    serverError(error) {

        return this.json(

            {

                success: false,

                message:

                    error.message

            },

            500

        );

        
    }

    
};


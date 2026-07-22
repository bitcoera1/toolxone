/*
====================================================

ToolXone Backend

API Client

Version:
1.0.0

Responsibility

Communicate with
Cloudflare Workers.

====================================================
*/

const APIClient = {

    async request(

        endpoint,

        options = {}

    ) {

        const url =

            BackendConfig.API_BASE_URL +

            endpoint;

        const config = {

            headers: {

                "Content-Type":
                    "application/json"

            },

            ...options

        };

        try {

            const response =

                await fetch(

                    url,

                    config

                );

            if (!response.ok) {

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            return await response.json();

        }

        catch (error) {

            if (

                BackendConfig.ENABLE_LOGGING

            ) {

                console.error(

                    "API Error:",

                    error

                );

            }

            throw error;

        }

    },

    async get(

        endpoint

    ) {

        return this.request(

            endpoint,

            {

                method: "GET"

            }

        );

    },

    async post(

        endpoint,

        data

    ) {

        return this.request(

            endpoint,

            {

                method: "POST",

                body: JSON.stringify(

                    data

                )

            }

        );

    },

    async put(

        endpoint,

        data

    ) {

        return this.request(

            endpoint,

            {

                method: "PUT",

                body: JSON.stringify(

                    data

                )

            }

        );

    },

    async delete(

        endpoint

    ) {

        return this.request(

            endpoint,

            {

                method: "DELETE"

            }

        );

    }

};

Object.freeze(

    APIClient

);
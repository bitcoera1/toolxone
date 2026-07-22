/*
====================================================

ToolXone Backend

Feedback API

Version:
1.0.0

Responsibility

Communicate with
Feedback endpoints.

====================================================
*/

const FeedbackAPI = {

    async submit(data) {

        return APIClient.post(

            BackendConfig.ENDPOINTS.FEEDBACK,

            data

        );

    },

    async getAll() {

        return APIClient.get(

            BackendConfig.ENDPOINTS.FEEDBACK

        );

    },

    async getById(id) {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.FEEDBACK}/${id}`

        );

    },

    async delete(id) {

        return APIClient.delete(

            `${BackendConfig.ENDPOINTS.FEEDBACK}/${id}`

        );

    }

};

Object.freeze(

    FeedbackAPI

);
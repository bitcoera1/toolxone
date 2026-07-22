/*
====================================================

ToolXone Backend

Phoenix API

Version:
1.0.0

Responsibility

Communicate with
Phoenix AI endpoints.

====================================================
*/

const PhoenixAPI = {

    async generateBanner(data) {

        return APIClient.post(

            `${BackendConfig.ENDPOINTS.PHOENIX}/generate`,

            data

        );

    },

    async getTemplates() {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.PHOENIX}/templates`

        );

    },

    async saveProject(data) {

        return APIClient.post(

            `${BackendConfig.ENDPOINTS.PHOENIX}/projects`,

            data

        );

    },

    async getProjects() {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.PHOENIX}/projects`

        );

    },

    async deleteProject(id) {

        return APIClient.delete(

            `${BackendConfig.ENDPOINTS.PHOENIX}/projects/${id}`

        );

    }

};

Object.freeze(

    PhoenixAPI

);
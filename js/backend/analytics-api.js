/*
====================================================

ToolXone Backend

Analytics API

Version:
1.0.0

Responsibility

Communicate with
Analytics endpoints.

====================================================
*/

const AnalyticsAPI = {

    async getOverview() {

        return APIClient.get(

            BackendConfig.ENDPOINTS.ANALYTICS

        );

    },

    async getDaily() {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.ANALYTICS}/daily`

        );

    },

    async getMonthly() {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.ANALYTICS}/monthly`

        );

    },

    async getCountries() {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.ANALYTICS}/countries`

        );

    },

    async getTopTools() {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.ANALYTICS}/top-tools`

        );

    }

};

Object.freeze(

    AnalyticsAPI

);
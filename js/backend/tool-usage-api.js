/*
====================================================

ToolXone Backend

Tool Usage API

Version:
1.0.0

Responsibility

Communicate with
Tool Usage endpoints.

====================================================
*/

const ToolUsageAPI = {

    async record(toolName) {

        return APIClient.post(

            BackendConfig.ENDPOINTS.TOOL_USAGE,

            {

                toolName

            }

        );

    },

    async getTopTools() {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.TOOL_USAGE}/top`

        );

    },

    async getUsage(toolName) {

        return APIClient.get(

            `${BackendConfig.ENDPOINTS.TOOL_USAGE}/${toolName}`

        );

    },

    async getAll() {

        return APIClient.get(

            BackendConfig.ENDPOINTS.TOOL_USAGE

        );

    }

};

Object.freeze(

    ToolUsageAPI

);
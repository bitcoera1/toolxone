/*
====================================================

ToolXone Backend

Backend Configuration

Version:
1.1.0

====================================================
*/

const TOOLXONE_BACKEND_VERSION = "1.1.0";

const BackendConfig = {

    APP_NAME: "ToolXone",

    API_VERSION: "v1",

    ENVIRONMENT: "production",

    WORKER_NAME: "toolxone-api",

    WORKER_URL:
        "https://toolxone-api.toolxone.workers.dev",

    API_BASE_URL:
        "https://toolxone-api.toolxone.workers.dev",

    REQUEST_TIMEOUT: 15000,

    RETRY_ATTEMPTS: 2,

    ENABLE_LOGGING: true,

    ENDPOINTS: {

        STATISTICS:
            "/statistics",

        TOOL_USAGE:
            "/tool-usage",

        ANALYTICS:
            "/analytics",

        FEEDBACK:
            "/feedback",

        PHOENIX:
            "/phoenix"

    }

};

Object.freeze(BackendConfig);
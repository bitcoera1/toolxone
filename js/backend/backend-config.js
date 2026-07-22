/*
====================================================

ToolXone Backend

Backend Configuration

Version:
1.0.0

Responsibility

Store backend configuration
used by all backend modules.

====================================================
*/

const TOOLXONE_BACKEND_VERSION = "1.0.0";

const BackendConfig = {

    APP_NAME:
        "ToolXone",

    API_VERSION:
        "v1",

    ENVIRONMENT:
        "development",

    API_BASE_URL:
        "",

    WORKER_NAME:
        "",

    WORKER_URL:
        "",

    REQUEST_TIMEOUT:
        10000,

    RETRY_ATTEMPTS:
        3,

    ENABLE_LOGGING:
        true,

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

Object.freeze(
    BackendConfig
);
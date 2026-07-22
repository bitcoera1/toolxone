/**
 * ==========================================================
 * ToolXone Statistics Storage
 * Version: 1.0
 * ==========================================================
 * Handles loading and saving statistics.
 * Currently uses Local Storage.
 * Can later be upgraded to Supabase, Firebase,
 * Cloudflare D1, MySQL, PostgreSQL, etc.
 * ==========================================================
 */

const ToolXoneStatisticsStorage = (() => {

    const STORAGE_KEY = "toolxone_statistics";

    function getDefaultStatistics() {
        return {
            meta: {
                version: "1.0",
                startedAt: new Date().toISOString()
            },

            totals: {
                toolActions: 0,
                calculations: 0,
                conversions: 0,
                utilities: 0,
                aiGenerations: 0
            },

            tools: {}
        };
    }

    function load() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return getDefaultStatistics();
            }

            return JSON.parse(raw);

        } catch (error) {

            console.error(
                "[ToolXone Statistics] Failed to load statistics.",
                error
            );

            return getDefaultStatistics();
        }
    }

    function save(data) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

        } catch (error) {

            console.error(
                "[ToolXone Statistics] Failed to save statistics.",
                error
            );

        }

    }

    function reset() {

        localStorage.removeItem(STORAGE_KEY);

    }

    return {

        load,
        save,
        reset

    };

})();
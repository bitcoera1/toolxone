/**
 * ============================================================
 * PHOENIX AI
 * Typography DNA Engine
 * ------------------------------------------------------------
 * Version : 1.0.0
 *
 * Responsibility:
 * Analyze an Intent Profile and generate intelligent
 * typography recommendations based on:
 *
 * - Business
 * - Campaign
 * - Audience
 * - Emotion
 * - Visual Style
 *
 * Public API:
 *
 * PhoenixTypographyDNA.generate(intentProfile)
 *
 * ============================================================
 */

const PHOENIX_TYPOGRAPHY_VERSION = "1.0.0";

const PhoenixTypographyDNA = {

    generate(intentProfile) {

        const typography = this.selectTypography(intentProfile);

        return this.buildTypography(typography);

    },
   
        selectTypography(intentProfile) {

        if (!intentProfile || typeof intentProfile !== "object") {
            return "default";
        }

        const { business, emotion, campaign } = intentProfile;

        // Business-first typography
        if (business === "law-firm") {
            return "professional";
        }

        if (business === "hospital" || business === "clinic") {
            return "clean";
        }

        if (business === "coffee-shop") {
            return "friendly";
        }

        if (business === "restaurant") {
            return "modern";
        }

        if (business === "hotel") {
            return "luxury";
        }

        if (business === "gym") {
            return "bold";
        }

        // Emotion overrides
        if (emotion === "trust") {
            return "clean";
        }

        if (emotion === "celebration") {
            return "playful";
        }

        if (emotion === "warmth") {
            return "friendly";
        }

        // Campaign overrides
        if (campaign === "sale") {
            return "bold";
        }

        if (campaign === "grand-opening") {
            return "display";
        }

        return "default";

    },

        buildTypography(typography) {

        const typographySystems = {

            default: {

                headline: {
                    family: "Inter",
                    weight: 700,
                    transform: "none"
                },

                body: {
                    family: "Inter",
                    weight: 400,
                    lineHeight: 1.5
                },

                spacing: {
                    letterSpacing: 0,
                    paragraphSpacing: 16
                }

            },

            professional: {

                headline: {
                    family: "Merriweather",
                    weight: 700,
                    transform: "none"
                },

                body: {
                    family: "Inter",
                    weight: 400,
                    lineHeight: 1.6
                },

                spacing: {
                    letterSpacing: 0.2,
                    paragraphSpacing: 18
                }

            },

            clean: {

                headline: {
                    family: "Inter",
                    weight: 700,
                    transform: "none"
                },

                body: {
                    family: "Inter",
                    weight: 400,
                    lineHeight: 1.6
                },

                spacing: {
                    letterSpacing: 0,
                    paragraphSpacing: 18
                }

            },

            friendly: {

                headline: {
                    family: "Poppins",
                    weight: 700,
                    transform: "none"
                },

                body: {
                    family: "Nunito",
                    weight: 400,
                    lineHeight: 1.6
                },

                spacing: {
                    letterSpacing: 0.2,
                    paragraphSpacing: 18
                }

            },

            modern: {

                headline: {
                    family: "Montserrat",
                    weight: 700,
                    transform: "uppercase"
                },

                body: {
                    family: "Inter",
                    weight: 400,
                    lineHeight: 1.5
                },

                spacing: {
                    letterSpacing: 0.5,
                    paragraphSpacing: 16
                }

            },

            luxury: {

                headline: {
                    family: "Playfair Display",
                    weight: 700,
                    transform: "none"
                },

                body: {
                    family: "Lora",
                    weight: 400,
                    lineHeight: 1.7
                },

                spacing: {
                    letterSpacing: 0.3,
                    paragraphSpacing: 20
                }

            },

            bold: {

                headline: {
                    family: "Bebas Neue",
                    weight: 700,
                    transform: "uppercase"
                },

                body: {
                    family: "Inter",
                    weight: 500,
                    lineHeight: 1.5
                },

                spacing: {
                    letterSpacing: 1,
                    paragraphSpacing: 16
                }

            },

            playful: {

                headline: {
                    family: "Baloo 2",
                    weight: 700,
                    transform: "none"
                },

                body: {
                    family: "Nunito",
                    weight: 400,
                    lineHeight: 1.6
                },

                spacing: {
                    letterSpacing: 0.3,
                    paragraphSpacing: 18
                }

            },

            display: {

                headline: {
                    family: "Oswald",
                    weight: 700,
                    transform: "uppercase"
                },

                body: {
                    family: "Inter",
                    weight: 400,
                    lineHeight: 1.5
                },

                spacing: {
                    letterSpacing: 1,
                    paragraphSpacing: 16
                }

            }

        };

        return typographySystems[typography] ?? typographySystems.default;

    },

  }
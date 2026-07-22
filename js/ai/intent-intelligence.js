/**
 * ============================================================
 * PHOENIX AI
 * Intent Intelligence Engine
 * ------------------------------------------------------------
 * Mission:
 * Understand the user's prompt before any design is created.
 *
 * Responsibilities:
 * - Normalize user prompts
 * - Extract keywords
 * - Detect business type
 * - Detect campaign type
 * - Detect audience
 * - Detect emotion
 * - Calculate confidence
 * - Return structured intent data
 *
 * Public API:
 * PhoenixIntent.analyze(prompt)
 *
 * Version:
 * 1.0.0
 * ============================================================
 */
/**
 * ============================================================
 * Configuration
 * ============================================================
 */

const PHOENIX_INTENT_VERSION = "1.0.0";

/**
 * ============================================================
 * Intent Intelligence Engine
 * ============================================================
 */

const PhoenixIntent = {

    analyze(prompt) {

        const normalizedPrompt = this.normalizePrompt(prompt);

        const keywords = this.extractKeywords(normalizedPrompt);

        const business = this.detectBusiness(keywords);

        const campaign = this.detectCampaign(keywords);

        const audience = this.detectAudience(keywords);

        const emotion = this.detectEmotion(keywords);

        const confidence = this.calculateConfidence({

            business,

            campaign,

            audience,

            emotion

        });

        return this.buildResult({

            normalizedPrompt,

            keywords,

            business,

            campaign,

            audience,

            emotion,

            confidence

        });

    },
   
        buildResult(data = {}) {

        return {

            business: data.business ?? null,

            campaign: data.campaign ?? null,

            audience: data.audience ?? null,

            emotion: data.emotion ?? null,

            urgency: data.urgency ?? null,

            tone: data.tone ?? null,

            platform: data.platform ?? null,

            offer: data.offer ?? null,

            confidence: data.confidence ?? 0,

            keywords: data.keywords ?? [],

            normalizedPrompt: data.normalizedPrompt ?? ""

        };

    },

        normalizePrompt(prompt) {

        if (typeof prompt !== "string") {
            return "";
        }

        return prompt
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();

    },

        extractKeywords(prompt) {

        if (!prompt) {
            return [];
        }

        return [...new Set(

            prompt
                .split(" ")
                .map(word => word.trim())
                .filter(Boolean)

        )];

    },

    detectBusiness(keywords) {

        if (!Array.isArray(keywords)) {
            return null;
        }

        const businesses = {

            "coffee": "coffee-shop",

            "cafe": "coffee-shop",

            "restaurant": "restaurant",

            "pizza": "restaurant",

            "bakery": "bakery",

            "gym": "gym",

            "fitness": "gym",

            "hospital": "hospital",

            "clinic": "clinic",

            "dental": "dental-clinic",

            "school": "school",

            "college": "college",

            "university": "university",

            "travel": "travel",

            "hotel": "hotel",

            "real": "real-estate",

            "property": "real-estate",

            "fashion": "fashion",

            "clothing": "fashion",

            "beauty": "beauty",

            "salon": "beauty",

            "crypto": "cryptocurrency",

            "finance": "finance",

            "insurance": "insurance",

            "software": "software",

            "technology": "technology"

        };

        for (const keyword of keywords) {

            if (businesses[keyword]) {

                return businesses[keyword];

            }

        }

        return null;

    },

        detectCampaign(keywords) {

        if (!Array.isArray(keywords)) {
            return null;
        }

        const campaigns = {

            "sale": "sale",

            "discount": "sale",

            "offer": "promotion",

            "off": "sale",

            "deal": "promotion",

            "promo": "promotion",

            "opening": "grand-opening",

            "launch": "product-launch",

            "new": "announcement",

            "event": "event",

            "festival": "festival",

            "webinar": "webinar",

            "seminar": "seminar",

            "conference": "conference",

            "workshop": "workshop",

            "hiring": "recruitment",

            "job": "recruitment",

            "career": "recruitment",

            "vacancy": "recruitment",

            "birthday": "birthday",

            "anniversary": "anniversary",

            "holiday": "holiday",

            "black": "black-friday",

            "friday": "black-friday",

            "christmas": "christmas",

            "eid": "eid",

            "ramadan": "ramadan"

        };

        for (const keyword of keywords) {

            if (campaigns[keyword]) {

                return campaigns[keyword];

            }

        }

        return null;

    },

        detectAudience(keywords) {

        if (!Array.isArray(keywords)) {
            return null;
        }

        const audiences = {

            "kids": "children",

            "children": "children",

            "parents": "parents",

            "students": "students",

            "teachers": "education",

            "developers": "developers",

            "designers": "designers",

            "business": "business-owners",

            "companies": "business-owners",

            "entrepreneurs": "entrepreneurs",

            "gamers": "gamers",

            "travelers": "travelers",

            "tourists": "travelers",

            "fitness": "fitness-enthusiasts",

            "athletes": "athletes",

            "women": "women",

            "ladies": "women",

            "men": "men",

            "families": "families",

            "pets": "pet-owners",

            "doctors": "medical-professionals",

            "lawyers": "legal-professionals"

        };

        for (const keyword of keywords) {

            if (audiences[keyword]) {

                return audiences[keyword];

            }

        }

        return null;

    },

        detectEmotion(keywords) {

        if (!Array.isArray(keywords)) {
            return null;
        }

        const emotions = {

            "sale": "excitement",

            "discount": "excitement",

            "offer": "excitement",

            "off": "urgency",

            "today": "urgency",

            "now": "urgency",

            "limited": "urgency",

            "grand": "celebration",

            "opening": "celebration",

            "festival": "celebration",

            "birthday": "happiness",

            "holiday": "joy",

            "christmas": "joy",

            "eid": "joy",

            "ramadan": "peace",

            "clinic": "trust",

            "hospital": "trust",

            "doctor": "trust",

            "insurance": "security",

            "finance": "confidence",

            "investment": "confidence",

            "education": "inspiration",

            "school": "inspiration",

            "university": "achievement",

            "fitness": "motivation",

            "gym": "motivation",

            "travel": "adventure",

            "hotel": "comfort",

            "coffee": "warmth",

            "restaurant": "appetite"

        };

        for (const keyword of keywords) {

            if (emotions[keyword]) {

                return emotions[keyword];

            }

        }

        return null;

    },

        calculateConfidence(intent) {

        if (!intent || typeof intent !== "object") {
            return 0;
        }

        let score = 0;

        if (intent.business) score += 25;

        if (intent.campaign) score += 25;

        if (intent.audience) score += 20;

        if (intent.emotion) score += 20;

        if (intent.keywords?.length > 5) score += 10;

        return Math.min(score, 100);

    },



  }

  // ============================================
// Phoenix AI - Intent Engine Test
// ============================================

const testPrompt = `
Grand Opening!
50% OFF all Coffee this Friday.
Bring your family and enjoy free desserts.
`;

const intentResult = PhoenixIntent.analyze(testPrompt);

console.log("Phoenix Intent Result:");
console.log(intentResult);
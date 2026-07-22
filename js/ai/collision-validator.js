class CollisionValidator {

    static VALIDATOR_NAME = "CollisionValidator";

    static validate(layout) {

        return {
            passed: true,
            collisions: []
        };

    }
/**
 * ========================================================
 * Get Layout Elements
 * ========================================================
 */

static getElements(layout) {

    if (!layout?.elements) {
        return [];
    }

    return layout.elements.filter(element =>

        element &&
        typeof element.x === "number" &&
        typeof element.y === "number" &&
        typeof element.width === "number" &&
        typeof element.height === "number"

    );

}

/**
 * ========================================================
 * Detect Collisions
 * ========================================================
 */

static detectCollisions(elements) {

    const collisions = [];

    for (let i = 0; i < elements.length; i++) {

        for (let j = i + 1; j < elements.length; j++) {

            const first = elements[i];
            const second = elements[j];

            if (this.intersects(first, second)) {

                collisions.push(

                    this.buildCollision(first, second)

                );

            }

        }

    }

    return collisions;

}
/**
 * ========================================================
 * Rectangle Intersection
 * ========================================================
 */

static intersects(a, b) {

    return !(

        a.x + a.width <= b.x ||

        b.x + b.width <= a.x ||

        a.y + a.height <= b.y ||

        b.y + b.height <= a.y

    );

}

/**
 * ========================================================
 * Build Collision
 * ========================================================
 */

static buildCollision(firstElement, secondElement) {

    return {

        validator: this.VALIDATOR_NAME,

        code: this.getCollisionCode(firstElement, secondElement),

        type: "element-collision",

        severity: this.getCollisionSeverity(firstElement, secondElement),

        first: {

            id: firstElement.id || null,

            type: firstElement.type,

            name: firstElement.name || null

        },

        second: {

            id: secondElement.id || null,

            type: secondElement.type,

            name: secondElement.name || null

        },

        timestamp: Date.now()

    };

}
/**
 * ========================================================
 * Collision Codes
 * ========================================================
 */

static getCollisionCode(firstElement, secondElement) {

    return "CV001";

}

/**
 * ========================================================
 * Collision Severity
 * ========================================================
 */

static getCollisionSeverity(firstElement, secondElement) {

    const highPriority = [

        "logo",

        "qr",

        "cta",

        "product"

    ];

    if (

        highPriority.includes(firstElement.type) ||

        highPriority.includes(secondElement.type)

    ) {

        return "high";

    }

    return "medium";

}

}

window.CollisionValidator = CollisionValidator;
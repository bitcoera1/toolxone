/**
 * ============================================================
 * Phoenix AI - Safe Layout Engine
 * Mission 13.6 - Safe Layout Planner
 * Phase 1 - Protected Region Detection
 * ============================================================
 */

(function () {
  "use strict";

  if (!window.Phoenix) {
    window.Phoenix = {};
  }

  /**
   * Creates an empty protected-region registry.
   *
   * The registry will become the single source of truth for
   * regions that must be respected by the layout planner.
   *
   * @returns {{
   *   version: string,
   *   canvas: object|null,
   *   regions: Array<object>,
   *   count: number,
   *   createdAt: string
   * }}
   */
  function createProtectedRegionRegistry() {
    return {
      version: "13.6.1",
      canvas: null,
      regions: [],
      count: 0,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Adds a protected region to a registry.
   *
   * @param {object} registry
   * @param {object} region
   * @returns {object}
   */
  function registerRegion(registry, region) {
    if (!registry || !Array.isArray(registry.regions)) {
      throw new TypeError(
        "Phoenix SafeLayoutEngine: Invalid protected-region registry."
      );
    }

    if (!region || typeof region !== "object") {
      throw new TypeError(
        "Phoenix SafeLayoutEngine: Region must be an object."
      );
    }

    registry.regions.push(region);
    registry.count = registry.regions.length;

    return registry;
  }

  /**
   * Returns a copy of all registered protected regions.
   *
   * @param {object} registry
   * @returns {Array<object>}
   */
  function getRegions(registry) {
    if (!registry || !Array.isArray(registry.regions)) {
      return [];
    }

    return [...registry.regions];
  }

  /**
   * Removes every region while preserving the registry object.
   *
   * @param {object} registry
   * @returns {object}
   */
  function clearRegistry(registry) {
    if (!registry || !Array.isArray(registry.regions)) {
      throw new TypeError(
        "Phoenix SafeLayoutEngine: Invalid protected-region registry."
      );
    }

    registry.regions.length = 0;
    registry.count = 0;

    return registry;
  }
/**
 * Converts measured layout boxes into standardized
 * protected-region objects.
 *
 * This function does not query the DOM, render elements,
 * or make layout decisions.
 *
 * @param {object} boxes
 * @returns {Array<object>}
 */
function buildProtectedRegions(boxes) {
  if (!boxes || typeof boxes !== "object") {
    console.warn(
      "Phoenix SafeLayoutEngine: No measured boxes were provided."
    );

    return [];
  }

  const protectedRegionDefinitions = [
    {
      id: "branding",
      type: "branding",
      priority: "critical",
      anchor: "top",
      padding: 20,
      movable: false,
      resizable: false,
      overlapAllowed: false
    },
    {
      id: "hero",
      type: "hero",
      priority: "high",
      anchor: "visual",
      padding: 16,
      movable: false,
      resizable: false,
      overlapAllowed: false
    },
    {
      id: "cta",
      type: "cta",
      priority: "critical",
      anchor: "bottom",
      padding: 18,
      movable: false,
      resizable: false,
      overlapAllowed: false
    }
  ];

  return protectedRegionDefinitions
    .map(definition => {
      const box = boxes[definition.id];

      if (!box) {
        return null;
      }

      return {
        id: definition.id,
        type: definition.type,
        protected: true,
        priority: definition.priority,
        anchor: definition.anchor,

        geometry: {
          top: Number(box.top || 0),
          bottom: Number(box.bottom || 0),
          left: Number(box.left || 0),
          right: Number(box.right || 0),
          width: Number(box.width || 0),
          height: Number(box.height || 0),
          centerX: Number(
            box.centerX ??
            ((box.left || 0) + (box.width || 0) / 2)
          ),
          centerY: Number(
            box.centerY ??
            ((box.top || 0) + (box.height || 0) / 2)
          )
        },

        constraints: {
          padding: definition.padding,
          movable: definition.movable,
          resizable: definition.resizable,
          overlapAllowed: definition.overlapAllowed
        }
      };
    })
    .filter(Boolean);
}

/**
 * Calculates the safe vertical movement allowed around
 * one protected region.
 *
 * Phase 7.2 currently supports top-anchored regions,
 * beginning with branding protection.
 *
 * @param {object} options
 * @returns {object}
 */
function calculateMovementLimit({
  requestedShift = 0,
  region = null,
  metrics = null
} = {}) {
  const normalizedShift =
    Number.isFinite(Number(requestedShift))
      ? Number(requestedShift)
      : 0;

  if (
    !region ||
    !metrics ||
    !region.geometry
  ) {
    return {
      approvedShift: normalizedShift,
      limited: false,
      reason: null
    };
  }

  /*
   * This first rule protects only top-anchored regions.
   * Branding is currently our top-anchored critical region.
   */
  if (
    region.anchor !== "top" ||
    normalizedShift >= 0
  ) {
    return {
      approvedShift: normalizedShift,
      limited: false,
      reason: null
    };
  }

  const contentTop =
    Number(metrics.contentTop);

  const protectedBottom =
    Number(region.geometry.bottom);

  const protectionPadding =
    Number(
      region.constraints?.padding || 0
    );

  if (
    !Number.isFinite(contentTop) ||
    !Number.isFinite(protectedBottom)
  ) {
    return {
      approvedShift: normalizedShift,
      limited: false,
      reason: null
    };
  }

  const safeContentTop =
    protectedBottom +
    protectionPadding;

  /*
   * Example:
   *
   * contentTop       = 120
   * safeContentTop   = 90
   *
   * Maximum upward shift:
   * 90 - 120 = -30
   */
  const maximumSafeUpwardShift =
    safeContentTop -
    contentTop;

  const approvedShift =
    Math.max(
      normalizedShift,
      maximumSafeUpwardShift
    );

  const limited =
    approvedShift !==
    normalizedShift;

  return {
    approvedShift:
      Number(
        approvedShift.toFixed(2)
      ),

    limited,

    reason:
      limited
        ? region.id
        : null,

    details: {
      contentTop:
        Number(contentTop.toFixed(2)),

      protectedBottom:
        Number(
          protectedBottom.toFixed(2)
        ),

      protectionPadding:
        Number(
          protectionPadding.toFixed(2)
        ),

      safeContentTop:
        Number(
          safeContentTop.toFixed(2)
        ),

      maximumSafeUpwardShift:
        Number(
          maximumSafeUpwardShift.toFixed(2)
        )
    }
  };
}

/**
 * Evaluates a requested layout decision against
 * all registered protected-region constraints.
 *
 * Phase 7.2:
 * Enforces top-region protection, beginning with branding.
 */
function evaluateConstraints({
  requestedShift = 0,
  registry = null,
  metrics = null
} = {}) {
  const normalizedRequestedShift =
    Number.isFinite(Number(requestedShift))
      ? Number(requestedShift)
      : 0;

  let approvedShift =
    normalizedRequestedShift;

  let limitedBy =
    null;

  const warnings = [];

  const regions =
    Array.isArray(registry?.regions)
      ? registry.regions
      : [];

  regions.forEach(region => {
    const result =
      calculateMovementLimit({
        requestedShift:
          approvedShift,

        region,

        metrics
      });

    approvedShift =
      result.approvedShift;

    if (result.limited) {
      limitedBy =
        region.id;

      warnings.push({
        type:
          "protected-region-limit",

        regionId:
          region.id,

        requestedShift:
          normalizedRequestedShift,

        approvedShift:
          result.approvedShift,

        details:
          result.details
      });
    }
  });

  const evaluation = {
    requestedShift:
      normalizedRequestedShift,

    approvedShift:
      Number(
        approvedShift.toFixed(2)
      ),

    limited:
      approvedShift !==
      normalizedRequestedShift,

    limitedBy,

    warnings,

    registry,

    metrics
  };

  console.log(
    "🛡️ Constraint Evaluation",
    evaluation
  );

  return evaluation;
}

  const SafeLayoutEngine = {

    createProtectedRegionRegistry,

    registerRegion,

    getRegions,

    clearRegistry,

    buildProtectedRegions,

    evaluateConstraints

};

  window.Phoenix.SafeLayoutEngine = Object.freeze(SafeLayoutEngine);

  console.log("🛡️ Phoenix Safe Layout Engine Loaded");
})();
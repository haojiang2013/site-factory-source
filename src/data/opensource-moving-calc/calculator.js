// === TEST CASES ===
// TC1: input { movingType: "Local", homeSize: "Studio", distance: 12, hasPiano: false, packingService: "Self", storageNeeded: false } → output { total: 186, breakdown: { base: 150, distanceCost: 36, pianoCost: 0, packingCost: 0, storageCost: 0 } }
// TC2: input { movingType: "Local", homeSize: "1BR", distance: 8, hasPiano: true, packingService: "Self", storageNeeded: false } → output { total: 724, breakdown: { base: 300, distanceCost: 24, pianoCost: 400, packingCost: 0, storageCost: 0 } }
// TC3: input { movingType: "Long-distance", homeSize: "3BR", distance: 250, hasPiano: false, packingService: "Full", storageNeeded: true } → output { total: 4175, breakdown: { base: 2200, distanceCost: 375, pianoCost: 0, packingCost: 1100, storageCost: 500 } }
// TC4: input { movingType: "International", homeSize: "4BR+", distance: 1000, hasPiano: true, packingService: "Partial", storageNeeded: true } → output { total: 10100, breakdown: { base: 6000, distanceCost: 2500, pianoCost: 400, packingCost: 700, storageCost: 500 } }
// TC5: input with distance = -5 → output { error: "Distance must be a positive number" }
// TC6: input with distance = 0 → output { error: "Distance must be a positive number" }
// TC7: input missing homeSize → output { error: "homeSize is required" }
// TC8: input with distance = "abc" → output { error: "Distance must be a positive number" }
// TC9: input { movingType: "Regional", ... } → output { error: "Invalid moving type" }
// TC10: input { packingService: "None", ... } → output { error: "Invalid packing service" }
// TC11: input { hasPiano: "yes", ... } → output { error: "hasPiano must be a boolean" }
// TC12: minimal: { movingType: "Local", homeSize: "Studio", distance: 1, hasPiano: false, packingService: "Self", storageNeeded: false } → output { total: 153, breakdown: { base: 150, distanceCost: 3, pianoCost: 0, packingCost: 0, storageCost: 0 } }
// TC13: maximal: { movingType: "International", homeSize: "4BR+", distance: 5000, hasPiano: true, packingService: "Full", storageNeeded: true } → output { total: 20900, breakdown: { base: 6000, distanceCost: 12500, pianoCost: 400, packingCost: 1500, storageCost: 500 } }
// TC14: input with distance = "150" (string) → output { error: "Distance must be a number" }
// TC15: input { movingType: "Long-distance", homeSize: "2BR", distance: 1500, hasPiano: false, packingService: "Partial", storageNeeded: false } → output { total: 4100, breakdown: { base: 1500, distanceCost: 2250, pianoCost: 0, packingCost: 350, storageCost: 0 } }
// TC16: input { movingType: "International", homeSize: "1BR", distance: 300, hasPiano: true, packingService: "Self", storageNeeded: false } → output { total: 3650, breakdown: { base: 2500, distanceCost: 750, pianoCost: 400, packingCost: 0, storageCost: 0 } }
// TC17: input { movingType: "Local", homeSize: "3BR", distance: 20, hasPiano: true, packingService: "Full", storageNeeded: true } → output { total: 2860, breakdown: { base: 800, distanceCost: 60, pianoCost: 400, packingCost: 1100, storageCost: 500 } }
// TC18: input with distance = undefined → output { error: "Distance is required" }
// TC19: input with homeSize = null → output { error: "homeSize is required" }
// TC20: input missing movingType → output { error: "movingType is required" }
// TC21: float distance: { movingType: "Local", homeSize: "Studio", distance: 10.5, hasPiano: false, packingService: "Self", storageNeeded: false } → output { total: 181.5, breakdown: { base: 150, distanceCost: 31.5, pianoCost: 0, packingCost: 0, storageCost: 0 } }
// TC22: very large distance: { movingType: "International", homeSize: "1BR", distance: 10000, hasPiano: false, packingService: "Self", storageNeeded: false } → output { total: 27500, breakdown: { base: 2500, distanceCost: 25000, pianoCost: 0, packingCost: 0, storageCost: 0 } }

// === CALCULATOR ===
// Formula reference: AMSA 2025 + U-Haul public pricing

const calculator = {
  // Base moving cost by service type and home size
  baseMovingCosts: {
    Local: { Studio: 150, '1BR': 300, '2BR': 500, '3BR': 800, '4BR+': 1100 },
    'Long-distance': { Studio: 500, '1BR': 900, '2BR': 1500, '3BR': 2200, '4BR+': 3000 },
    International: { Studio: 1500, '1BR': 2500, '2BR': 3500, '3BR': 4500, '4BR+': 6000 }
  },

  // Per-mile rate by service type
  perMileRate: {
    Local: 3,
    'Long-distance': 1.5,
    International: 2.5
  },

  // Packing service costs (flat fee by home size)
  packingCosts: {
    Self: { Studio: 0, '1BR': 0, '2BR': 0, '3BR': 0, '4BR+': 0 },
    Partial: { Studio: 100, '1BR': 200, '2BR': 350, '3BR': 500, '4BR+': 700 },
    Full: { Studio: 250, '1BR': 500, '2BR': 800, '3BR': 1100, '4BR+': 1500 }
  },

  // Storage flat fee (one month assumed)
  storageCostFlat: 500,

  // Piano / large appliance surcharge
  pianoCost: 400,

  // Allowed values
  allowedMovingTypes: ['Local', 'Long-distance', 'International'],
  allowedHomeSizes: ['Studio', '1BR', '2BR', '3BR', '4BR+'],
  allowedPackingServices: ['Self', 'Partial', 'Full'],

  /**
   * Main calculation entry point.
   * @param {Object} inputs - { movingType, homeSize, distance, hasPiano, packingService, storageNeeded }
   * @returns {{ total: number, breakdown: Object } | { error: string }}
   */
  calculate(inputs) {
    // Validate first; return error if invalid
    const validation = this.validate(inputs);
    if (!validation.valid) {
      return { error: validation.errors[0] }; // Return first error
    }

    const { movingType, homeSize, distance, hasPiano, packingService, storageNeeded } = inputs;

    const base = this.baseMovingCosts[movingType][homeSize];
    const distanceCost = distance * this.perMileRate[movingType];
    const pianoCost = hasPiano ? this.pianoCost : 0;
    const packingCost = this.packingCosts[packingService][homeSize];
    const storageCost = storageNeeded ? this.storageCostFlat : 0;

    const total = base + distanceCost + pianoCost + packingCost + storageCost;

    return {
      total: Math.round(total * 100) / 100, // ensure at most 2 decimal places
      breakdown: {
        base: Math.round(base * 100) / 100,
        distanceCost: Math.round(distanceCost * 100) / 100,
        pianoCost: Math.round(pianoCost * 100) / 100,
        packingCost: Math.round(packingCost * 100) / 100,
        storageCost: Math.round(storageCost * 100) / 100
      }
    };
  },

  /**
   * Validates the inputs object.
   * @param {Object} inputs
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate(inputs) {
    const errors = [];

    // movingType
    if (!inputs.movingType) {
      errors.push('movingType is required');
    } else if (!this.allowedMovingTypes.includes(inputs.movingType)) {
      errors.push('Invalid moving type');
    }

    // homeSize
    if (!inputs.homeSize) {
      errors.push('homeSize is required');
    } else if (!this.allowedHomeSizes.includes(inputs.homeSize)) {
      errors.push('Invalid home size');
    }

    // distance
    if (inputs.distance === undefined || inputs.distance === null) {
      errors.push('Distance is required');
    } else if (typeof inputs.distance !== 'number' || isNaN(inputs.distance)) {
      errors.push('Distance must be a number');
    } else if (inputs.distance <= 0) {
      errors.push('Distance must be a positive number');
    }

    // hasPiano
    if (typeof inputs.hasPiano !== 'boolean') {
      errors.push('hasPiano must be a boolean');
    }

    // packingService
    if (!inputs.packingService) {
      errors.push('packingService is required');
    } else if (!this.allowedPackingServices.includes(inputs.packingService)) {
      errors.push('Invalid packing service');
    }

    // storageNeeded
    if (typeof inputs.storageNeeded !== 'boolean') {
      errors.push('storageNeeded must be a boolean');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Formats a number as USD currency string.
   * @param {number} amount
   * @returns {string}
   */
  formatCurrency(amount) {
    return '$' + Number(amount).toFixed(2);
  },

  /**
   * Resets any internal state (no state here, placeholder).
   */
  reset() {},

  /**
   * Saves data to localStorage.
   * @param {string} key
   * @param {*} data
   */
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // storage full or unavailable
    }
  },

  /**
   * Loads data from localStorage.
   * @param {string} key
   * @returns {*} Parsed data or null.
   */
  loadFromLocalStorage(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  }
};
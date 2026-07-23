import type { BurnerUnit } from "../models/Equipment";

export class BurnerCalculationService {
  // Approximate LPG lower heating value
  private static readonly KWH_PER_KG = 13.7;

  static calculateKgPerHour(
    value: number,
    unit: BurnerUnit
  ): number {

    if (value <= 0) {
      return 0;
    }

    switch (unit) {

      case "kg/h":
        return value;

      case "g/h":
        return value / 1000;

      case "W":
        return (value / 1000) / this.KWH_PER_KG;

      case "kW":
        return value / this.KWH_PER_KG;

      case "BTU/h":
        return (value * 0.00029307107) / this.KWH_PER_KG;

      default:
        return 0;
    }
  }
}
import type { Equipment } from "../models/Equipment";
import type { Installation } from "../models/Installation";
import type { Measurement } from "../models/Measurement";

export interface AnalysisResult {
  currentGasKg: number;

  gasUsedKg: number;

  remainingPercent: number;

  status: "GOOD" | "LOW" | "CRITICAL";

  theoreticalKgPerHour: number;

  actualKgPerHour: number | null;

  remainingHours: number | null;

  estimatedRemainingSessions: number | null;

  cylinderAgeDays: number;

  totalCookingHours: number;

  averageSessionHours: number;
}

export class AnalysisService {
  static analyze(
    installation: Installation,
    equipment: Equipment,
    measurements: Measurement[]
  ): AnalysisResult {
    const currentGasKg =
      installation.currentGrossWeightKg -
      installation.emptyCylinderWeightKg;

    const gasUsedKg =
      installation.initialGrossWeightKg -
      installation.currentGrossWeightKg;

    const remainingPercent =
      (currentGasKg /
        installation.cylinderCapacityKg) *
      100;

    const theoreticalKgPerHour =
      equipment.burners.reduce(
        (sum, burner) =>
          sum + burner.calculatedKgPerHour,
        0
      );

    const cookingMeasurements =
      measurements.filter(
        (m) =>
          m.bbqHoursSincePrevious !== undefined &&
          m.bbqHoursSincePrevious > 0
      );

    const totalCookingHours =
      cookingMeasurements.reduce(
        (sum, m) =>
          sum +
          (m.bbqHoursSincePrevious ?? 0),
        0
      );

    const averageSessionHours =
      cookingMeasurements.length === 0
        ? 0
        : totalCookingHours /
          cookingMeasurements.length;

    const actualKgPerHour =
      totalCookingHours > 0
        ? gasUsedKg / totalCookingHours
        : null;

    const remainingHours =
      actualKgPerHour && actualKgPerHour > 0
        ? currentGasKg / actualKgPerHour
        : null;

    const estimatedRemainingSessions =
      remainingHours &&
      averageSessionHours > 0
        ? remainingHours /
          averageSessionHours
        : null;

    const cylinderAgeDays = Math.floor(
      (Date.now() -
        installation.installDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
let status: "GOOD" | "LOW" | "CRITICAL";

if (remainingPercent > 40) {
  status = "GOOD";
} else if (remainingPercent > 20) {
  status = "LOW";
} else {
  status = "CRITICAL";
}
    return {
      currentGasKg,

      gasUsedKg,

      remainingPercent,

      theoreticalKgPerHour,

      actualKgPerHour,

      remainingHours,

      estimatedRemainingSessions,

      cylinderAgeDays,

      totalCookingHours,

      averageSessionHours,

      status,
    };
  }
}
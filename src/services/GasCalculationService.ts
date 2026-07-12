export interface GasCalculationInput {
  cylinderCapacityKg: number;
  emptyCylinderWeightKg: number;
  currentGrossWeightKg: number;
  averageConsumptionKgPerHour: number;
}

export interface GasCalculationResult {
  remainingLpgKg: number;
  remainingPercent: number;
  remainingHours: number;
  remainingSessions: number;
  status: "GOOD" | "LOW" | "CRITICAL";
}

export function calculateGas(
  input: GasCalculationInput
): GasCalculationResult {

  const remainingLpgKg =
    Math.max(
      0,
      input.currentGrossWeightKg - input.emptyCylinderWeightKg
    );

  const remainingPercent =
    Math.min(
      100,
      (remainingLpgKg / input.cylinderCapacityKg) * 100
    );

  const remainingHours =
    remainingLpgKg / input.averageConsumptionKgPerHour;

  const DEFAULT_SESSION_DURATION_HOURS = 2;
  const remainingSessions =
    remainingHours / DEFAULT_SESSION_DURATION_HOURS;
  let status: "GOOD" | "LOW" | "CRITICAL";

  if (remainingPercent > 40)
    status = "GOOD";
  else if (remainingPercent > 20)
    status = "LOW";
  else
    status = "CRITICAL";

  return {
    remainingLpgKg,
    remainingPercent,
    remainingHours,
    remainingSessions,
    status,
  };
}
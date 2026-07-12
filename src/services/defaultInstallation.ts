import type { Installation } from "../models/Installation";

export const defaultInstallation: Installation = {
  cylinderCapacityKg: 12,

  emptyCylinderWeightKg: 13.4,

  initialGrossWeightKg: 25.4,

  installDate: new Date(),
};
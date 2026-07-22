import type { Installation } from "../models/Installation";

export const defaultInstallation: Installation = {
  
  id: crypto.randomUUID(),
  
  installDate: new Date(),

  cylinderCapacityKg: 12,

  emptyCylinderWeightKg: 13.4,

  initialGrossWeightKg: 25.4,

  currentGrossWeightKg: 25.4,
};
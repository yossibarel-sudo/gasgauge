export interface Installation {
  id: string;
  
  installDate: Date;

  cylinderCapacityKg: number;

  emptyCylinderWeightKg: number;

  initialGrossWeightKg: number;

  currentGrossWeightKg: number;
}
export interface CylinderLearning {
  id: string;

  installationId: string;

  completedDate: Date;

  theoreticalKgPerHour: number;

  actualKgPerHour: number;

  correctionFactor: number;

  cookingHours: number;

  gasConsumedKg: number;

  ignored: boolean;
}

export interface LearningStatistics {
  calibrationFactor: number;

  confidence: number;

  completedCylinders: number;

  averageCorrection: number;

  standardDeviation: number;
}
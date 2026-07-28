export interface LearningRecord {
  id: string;

  startMeasurementId: string;

  endMeasurementId: string;

  gasConsumedKg: number;

  cookingHours: number;

  theoreticalKgPerHour: number;

  actualKgPerHour: number;

  correctionFactor: number;

  createdAt: Date;

  ignored: boolean;
}

export interface LearningStatistics {
  calibrationFactor: number;

  confidence: number;

  completedCylinders: number;

  averageCorrection: number;

  standardDeviation: number;
}
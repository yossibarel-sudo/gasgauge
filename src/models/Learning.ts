export interface LearningRecord {

  id: string;

  startMeasurementId: string;

  endMeasurementId: string;

  createdAt: Date;

  gasConsumedKg: number;

  cookingHours: number;

  theoreticalKgPerHour: number;

  actualKgPerHour: number;

  correctionFactor: number;

  ignored: boolean;

  ignoredReason?: string;

}

export interface LearningStatistics {
  calibrationFactor: number;

  confidence: number;

  completedCylinders: number;

  averageCorrection: number;

  standardDeviation: number;
}
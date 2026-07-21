export interface Measurement {
  id: string;

  date: Date;

  grossWeightKg: number;

  remainingLpgKg: number;

  remainingPercent: number;

  bbqHoursSincePrevious?: number;

  notes?: string;
}
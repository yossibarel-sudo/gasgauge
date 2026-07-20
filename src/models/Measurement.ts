export interface Measurement {
  date: Date;

  grossWeightKg: number;

  remainingLpgKg: number;

  remainingPercent: number;

  notes?: string;
}
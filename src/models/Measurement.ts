export interface Measurement {
  id: string;

  date: Date;

  grossWeightKg: number;

  remainingLpgKg: number;

  remainingPercent: number;

  notes?: string;
}
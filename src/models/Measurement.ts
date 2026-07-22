export interface Measurement {
  id: string;

  installationId: string;
  
  date: Date;

  grossWeightKg: number;

  remainingLpgKg: number;

  remainingPercent: number;

  notes?: string;
}
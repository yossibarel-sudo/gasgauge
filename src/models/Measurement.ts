export interface Measurement {
  id: string;

  installationId: string;
  
  date: Date;

  grossWeightKg: number;

  remainingLpgKg: number;

  remainingPercent: number;

    /**
   * Measurement taken immediately after a BBQ session.
   * Used by the adaptive learning engine.
   */
  bbqRelated?: boolean;

  measurementType:
  | "INSTALLATION"
  | "BBQ_AUTOMATIC"
  | "BBQ_MANUAL"
  | "MANUAL";

  notes?: string;
}
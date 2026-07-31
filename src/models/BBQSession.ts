export interface BBQSession {

  id: string;

  /**
   * The cylinder installation this session belongs to.
   */
  installationId: string;

  /**
   * Session date (kept for history compatibility).
   */
  date: Date;

  /**
   * BBQ start timestamp.
   */
  startTime?: Date;

  /**
   * BBQ end timestamp.
   */
  endTime?: Date;

  /**
   * Actual cooking duration in hours.
   */
  durationHours: number;

  /**
   * Number of burners used.
   */
  burnerIds: number[];
  /**
   * Estimated LPG consumed during this session.
   */
  estimatedGasUsedKg: number;

    /**
   * Actual LPG consumed from the cylinder weight
   * after the BBQ session.
   */
  actualGasUsedKg?: number;

  /**
   * Optional notes.
   */
  notes?: string;

}
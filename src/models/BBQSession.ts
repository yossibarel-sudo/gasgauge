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
  burnersUsed?: number;


  /**
   * Optional notes.
   */
  notes?: string;

}
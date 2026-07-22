export interface BBQSession {
  id: string;

  /**
   * The cylinder installation this session belongs to.
   */
  installationId: string;

  /**
   * Date when the BBQ session occurred.
   */
  date: Date;

  /**
   * Actual cooking duration in hours.
   */
  durationHours: number;

  /**
   * Optional user notes.
   */
  notes?: string;
}
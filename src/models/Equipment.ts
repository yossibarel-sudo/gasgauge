export type BurnerUnit = "W" | "kW" | "BTU/h" | "kg/h" | "g/h";

export interface Burner {
  id: number;
  name: string;
  value: number;
  unit: BurnerUnit;

  /**
   * Calculated gas consumption in kg/h.
   * If the burner is entered directly in kg/h or g/h,
   * this value matches the converted input.
   * If entered as power (W, kW, BTU/h),
   * it is calculated using the LPG conversion factor.
   */
  calculatedKgPerHour: number;
}

export interface Equipment {
  manufacturer: string;
  model: string;
  burners: Burner[];
  defaultSessionDurationMinutes: number;
}
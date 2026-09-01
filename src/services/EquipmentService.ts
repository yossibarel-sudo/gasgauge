import type { Equipment } from "../models/Equipment";
import { defaultEquipment } from "./defaultEquipment";

const STORAGE_KEY = "gasgauge-equipment";
const CALIBRATION_KEY = "gasgauge-calibration-factor";
const CALIBRATION_DATE_KEY = "gasgauge-calibration-date";
const CALIBRATION_RECOMMENDATION_KEY = "gasgauge-calibration-recommendation";
const CALIBRATION_RECOMMENDATION_HANDLED_COUNT_KEY = "gasgauge-calibration-recommendation-handled-count";

export class EquipmentService {
  static load(): Equipment {
    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) {
      return defaultEquipment;
    }

    return JSON.parse(json) as Equipment;
  }

  static save(equipment: Equipment): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(equipment)
    );
  }

  static applyCalibration(
    calibrationFactor: number
  ): Equipment {
    const equipment = this.load();

    const calibratedEquipment: Equipment = {
      ...equipment,

      burners: equipment.burners.map(
        (burner) => ({
          ...burner,

          calculatedKgPerHour:
            burner.calculatedKgPerHour *
            calibrationFactor,
        })
      ),
    };

    this.save(calibratedEquipment);

    localStorage.setItem(
      CALIBRATION_KEY,
      String(calibrationFactor)
    );

    localStorage.setItem(
      CALIBRATION_DATE_KEY,
      new Date().toISOString()
    );

    this.clearCalibrationRecommendation();

    return calibratedEquipment;
  }

  static setCalibrationRecommendation(
    calibrationFactor: number
  ): void {
    localStorage.setItem(
      CALIBRATION_RECOMMENDATION_KEY,
      String(calibrationFactor)
    );
  }

  static getCalibrationRecommendation(): number | null {
    const value = localStorage.getItem(
      CALIBRATION_RECOMMENDATION_KEY
    );

    if (value === null) {
      return null;
    }

    const factor = Number(value);
    return Number.isFinite(factor) ? factor : null;
  }

  static clearCalibrationRecommendation(): void {
    localStorage.removeItem(
      CALIBRATION_RECOMMENDATION_KEY
    );
    localStorage.removeItem(
      CALIBRATION_RECOMMENDATION_HANDLED_COUNT_KEY
    );
  }

  static handleCalibrationRecommendation(
    completedCount: number
  ): void {
    localStorage.setItem(
      CALIBRATION_RECOMMENDATION_HANDLED_COUNT_KEY,
      String(completedCount)
    );
    localStorage.removeItem(
      CALIBRATION_RECOMMENDATION_KEY
    );
  }

  static getHandledCalibrationRecommendationCount(): number {
    const value = localStorage.getItem(
      CALIBRATION_RECOMMENDATION_HANDLED_COUNT_KEY
    );

    if (value === null) {
      return 0;
    }

    const count = Number(value);
    return Number.isFinite(count) ? count : 0;
  }

  static getAppliedCalibrationFactor():
    number | null {
    const value =
      localStorage.getItem(
        CALIBRATION_KEY
      );

    if (value === null) {
      return null;
    }

    const factor = Number(value);

    return Number.isFinite(factor)
      ? factor
      : null;
  }

  static getCalibrationDate():
    Date | null {
    const value =
      localStorage.getItem(
        CALIBRATION_DATE_KEY
      );

    if (value === null) {
      return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }
}
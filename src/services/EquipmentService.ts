import type { Equipment } from "../models/Equipment";
import { defaultEquipment } from "./defaultEquipment";

const STORAGE_KEY = "gasgauge-equipment";
const CALIBRATION_KEY = "gasgauge-calibration-factor";

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

    return calibratedEquipment;
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
}
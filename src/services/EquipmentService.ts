import type { Equipment } from "../models/Equipment";
import { defaultEquipment } from "./defaultEquipment";

import { STORAGE_KEYS } from "../constants/storageKeys";

export class EquipmentService {
  static load(): Equipment {
    const json = localStorage.getItem(STORAGE_KEYS.equipment);

    if (!json) {
      return defaultEquipment;
    }

    return JSON.parse(json) as Equipment;
  }

  static save(equipment: Equipment): void {
    localStorage.setItem(
      STORAGE_KEYS.equipment,
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
      STORAGE_KEYS.calibrationFactor,
      String(calibrationFactor)
    );

    localStorage.setItem(
      STORAGE_KEYS.calibrationDate,
      new Date().toISOString()
    );

    return calibratedEquipment;
  }

  static getAppliedCalibrationFactor():
    number | null {
    const value =
      localStorage.getItem(
        STORAGE_KEYS.calibrationFactor
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
        STORAGE_KEYS.calibrationDate
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
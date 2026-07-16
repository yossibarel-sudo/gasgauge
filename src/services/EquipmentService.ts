import type { Equipment } from "../models/Equipment";
import { defaultEquipment } from "./defaultEquipment";

const STORAGE_KEY = "gasgauge-equipment";

export class EquipmentService {
  static load(): Equipment {
    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) {
      return defaultEquipment;
    }

    return JSON.parse(json) as Equipment;
  }

  static save(equipment: Equipment): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
  }
}
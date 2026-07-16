import type { Equipment } from "../models/Equipment";
import { defaultEquipment } from "./defaultEquipment";

const STORAGE_KEY = "gasgauge-equipment";

export class EquipmentService {
  static load(): Equipment {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      this.save(defaultEquipment);
      return defaultEquipment;
    }

    return JSON.parse(data) as Equipment;
  }

  static save(equipment: Equipment): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
  }
}
import type { Equipment } from "../models/Equipment";

export const defaultEquipment: Equipment = {
  manufacturer: "Grandhall",
  model: "Maxim GT3RS",

  defaultSessionDurationMinutes: 60,

  burners: [
    {
      id: 1,
      name: "Main Burner 1",
      value: 3.5,
      unit: "kW",
      calculatedKgPerHour: 0.255,
    },
    {
      id: 2,
      name: "Main Burner 2",
      value: 3.5,
      unit: "kW",
      calculatedKgPerHour: 0.255,
    },
    {
      id: 3,
      name: "Main Burner 3",
      value: 3.5,
      unit: "kW",
      calculatedKgPerHour: 0.255,
    },
  ],
};
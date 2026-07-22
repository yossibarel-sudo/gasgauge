import type { Equipment } from "../models/Equipment";
import type { Installation } from "../models/Installation";
import type { Measurement } from "../models/Measurement";

import { BBQSessionService } from "./BBQSessionService";


export interface AnalysisResult {

  remainingLpgKg: number;

  remainingPercent: number;

  gasUsedKg: number;

  theoreticalKgPerHour: number;

  actualKgPerHour: number | null;

  effectiveKgPerHour: number;

  usingActualConsumption: boolean;

  efficiencyPercent: number | null;

  remainingHours: number | null;

  remainingSessions: number | null;

  cylinderAgeDays: number;

  totalCookingHours: number;

  averageSessionHours: number;

  status: "GOOD" | "LOW" | "CRITICAL";
}



export class AnalysisService {


  static analyze(

    installation: Installation,

    equipment: Equipment,

    _measurements: Measurement[]

  ): AnalysisResult {


    const remainingLpgKg =
      Math.max(
        0,
        installation.currentGrossWeightKg -
        installation.emptyCylinderWeightKg
      );


    const gasUsedKg =
      Math.max(
        0,
        installation.initialGrossWeightKg -
        installation.currentGrossWeightKg
      );


    const remainingPercent =
      installation.cylinderCapacityKg > 0
        ? (remainingLpgKg /
            installation.cylinderCapacityKg) * 100
        : 0;



    const theoreticalKgPerHour =
      equipment.burners.reduce(
        (sum, burner) =>
          sum + burner.calculatedKgPerHour,
        0
      );



    const sessions =
      BBQSessionService.loadForInstallation(
        installation.id
      );



    const totalCookingHours =
      sessions.reduce(
        (sum, session) =>
          sum + session.durationHours,
        0
      );



    const averageSessionHours =
      sessions.length > 0
        ? totalCookingHours / sessions.length
        : 0;



    const actualKgPerHour =
      totalCookingHours > 0
        ? gasUsedKg / totalCookingHours
        : null;



    const usingActualConsumption =
      actualKgPerHour !== null &&
      sessions.length >= 3;



    const effectiveKgPerHour =
      usingActualConsumption
        ? actualKgPerHour!
        : theoreticalKgPerHour;



    const remainingHours =
      effectiveKgPerHour > 0
        ? remainingLpgKg / effectiveKgPerHour
        : null;



    const remainingSessions =
      remainingHours !== null &&
      averageSessionHours > 0
        ? remainingHours / averageSessionHours
        : null;



    const efficiencyPercent =
      actualKgPerHour !== null &&
      theoreticalKgPerHour > 0
        ? (actualKgPerHour /
            theoreticalKgPerHour) * 100
        : null;



    const cylinderAgeDays =
      Math.floor(
        (Date.now() -
          installation.installDate.getTime()) /
        (1000 * 60 * 60 * 24)
      );



    let status:
      | "GOOD"
      | "LOW"
      | "CRITICAL";


    if (remainingPercent > 40) {

      status = "GOOD";

    } else if (remainingPercent > 20) {

      status = "LOW";

    } else {

      status = "CRITICAL";

    }



    return {

      remainingLpgKg,

      remainingPercent,

      gasUsedKg,

      theoreticalKgPerHour,

      actualKgPerHour,

      effectiveKgPerHour,

      usingActualConsumption,

      efficiencyPercent,

      remainingHours,

      remainingSessions,

      cylinderAgeDays,

      totalCookingHours,

      averageSessionHours,

      status,

    };

  }

}
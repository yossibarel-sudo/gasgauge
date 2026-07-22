import type { Equipment } from "../models/Equipment";
import type { Installation } from "../models/Installation";
import type { Measurement } from "../models/Measurement";
import type { BBQSession } from "../models/BBQSession";


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

  status:
    | "GOOD"
    | "LOW"
    | "CRITICAL";
}




export class AnalysisService {


  static analyze(

    installation: Installation,

    equipment: Equipment,

    _measurements: Measurement[],

    bbqSessions: BBQSession[]

  ): AnalysisResult {



    //----------------------------------
    // LPG remaining
    //----------------------------------

    const remainingLpgKg =
      Math.max(
        0,
        installation.currentGrossWeightKg -
        installation.emptyCylinderWeightKg
      );



    //----------------------------------
    // Gas consumed
    //----------------------------------

    const gasUsedKg =
      Math.max(
        0,
        installation.initialGrossWeightKg -
        installation.currentGrossWeightKg
      );



    //----------------------------------
    // Remaining percentage
    //----------------------------------

    const remainingPercent =
      installation.cylinderCapacityKg > 0

        ? (
            remainingLpgKg /
            installation.cylinderCapacityKg
          ) * 100

        : 0;




    //----------------------------------
    // Equipment consumption
    //----------------------------------

    const theoreticalKgPerHour =

      equipment.burners.reduce(

        (sum, burner) =>

          sum +
          burner.calculatedKgPerHour,

        0

      );




    //----------------------------------
    // BBQ statistics
    //----------------------------------

    const installationSessions =

  (bbqSessions ?? []).filter(

    (session) =>

      session.installationId ===
      installation.id

  );



    const totalCookingHours =

      installationSessions.reduce(

        (sum, session) =>

          sum +
          session.durationHours,

        0

      );



    const averageSessionHours =

      installationSessions.length > 0

        ? totalCookingHours /
          installationSessions.length

        : 0;




    //----------------------------------
    // Actual consumption
    //----------------------------------

    const actualKgPerHour =

      totalCookingHours > 0

        ? gasUsedKg /
          totalCookingHours

        : null;




    //----------------------------------
    // Select consumption source
    //----------------------------------

    const usingActualConsumption =

      actualKgPerHour !== null;



    const effectiveKgPerHour =

      usingActualConsumption

        ? actualKgPerHour

        : theoreticalKgPerHour;




    //----------------------------------
    // Remaining prediction
    //----------------------------------

    const remainingHours =

      effectiveKgPerHour > 0

        ? remainingLpgKg /
          effectiveKgPerHour

        : null;




    const remainingSessions =

      remainingHours !== null &&
      averageSessionHours > 0

        ? remainingHours /
          averageSessionHours

        : null;




    //----------------------------------
    // Efficiency
    //----------------------------------

    const efficiencyPercent =

      actualKgPerHour !== null &&
      theoreticalKgPerHour > 0

        ? (
            actualKgPerHour /
            theoreticalKgPerHour
          ) * 100

        : null;




    //----------------------------------
    // Cylinder age
    //----------------------------------

    const cylinderAgeDays =

      Math.floor(

        (
          Date.now() -
          installation.installDate.getTime()

        ) /

        (
          1000 *
          60 *
          60 *
          24
        )

      );




    //----------------------------------
    // Status
    //----------------------------------

    let status:
      | "GOOD"
      | "LOW"
      | "CRITICAL";



    if (remainingPercent > 40) {

      status = "GOOD";

    }

    else if (remainingPercent > 20) {

      status = "LOW";

    }

    else {

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
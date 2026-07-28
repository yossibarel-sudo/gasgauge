import type { Equipment } from "../models/Equipment";
import type { Installation } from "../models/Installation";
import type { Measurement } from "../models/Measurement";
import { BBQSessionService } from "./BBQSessionService";
import { LearningService } from "./LearningService";

export interface AnalysisResult {

  remainingLpgKg: number;

  remainingPercent: number;

  gasUsedKg: number;

  theoreticalKgPerHour: number;

  actualKgPerHour: number | null;

  effectiveKgPerHour: number | null;

  learningFactor: number | null;

  predictionConfidence: number;

  usingActualConsumption: boolean;

  efficiencyPercent: number | null;

  remainingHours: number | null;

  remainingSessions: number | null;

  cylinderAgeDays: number;

  totalCookingHours: number;

  averageSessionHours: number;

  calibrationFactor: number;

  status:
    | "GOOD"
    | "LOW"
    | "CRITICAL";

}




export class AnalysisService {


  static analyze(

    installation: Installation,

    equipment: Equipment,
    
    _measurements: Measurement[]
   
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
// BBQ sessions
//----------------------------------

const sessions =
  BBQSessionService.loadForInstallation(
    installation.id
  );

const completedSessions =
  sessions.filter(
    session =>
      session.estimatedGasUsedKg > 0
  );

const totalCookingHours =
  completedSessions.reduce(
    (sum, session) =>
      sum + session.durationHours,
    0
  );

const totalEstimatedGasUsedKg =
  completedSessions.reduce(
    (sum, session) =>
      sum + session.estimatedGasUsedKg,
    0
  );

const averageSessionHours =
  completedSessions.length > 0
    ? totalCookingHours /
      completedSessions.length
    : 0;

let actualKgPerHour:
  number | null = null;

if (
  totalCookingHours > 0 &&
  totalEstimatedGasUsedKg > 0
) {
  actualKgPerHour =
    totalEstimatedGasUsedKg /
    totalCookingHours;
}


    //----------------------------------
    // Select consumption source
    //----------------------------------

   const learningFactor =
  actualKgPerHour !== null &&
  theoreticalKgPerHour > 0
    ? actualKgPerHour /
      theoreticalKgPerHour
    : null;

const usingActualConsumption =
  learningFactor !== null;

const learning = LearningService.statistics();

const baseKgPerHour =
  actualKgPerHour ?? theoreticalKgPerHour;

const effectiveKgPerHour =
  baseKgPerHour * learning.calibrationFactor;


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

      learningFactor,

      predictionConfidence: learning.confidence,

      calibrationFactor: learning.calibrationFactor,

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
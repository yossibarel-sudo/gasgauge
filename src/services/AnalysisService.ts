import type { Equipment } from "../models/Equipment";
import type { Installation } from "../models/Installation";
import type { Measurement } from "../models/Measurement";
import { BBQSessionService } from "./BBQSessionService";
import { LearningService } from "./LearningService";
import { EquipmentService } from "./EquipmentService";

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

  
  // ----------------------------------------------------
  // Analytics
  // ----------------------------------------------------

   totalSessions: number;

   totalGasConsumedKg: number;

   averageGasPerSessionKg: number;

   averageGasPerHourKg: number;

   averageGasPerDayKg: number;

   estimatedCylinderLifetimeDays: number;

   consumptionTrend: "UP" | "DOWN" | "STABLE";

   consumptionTrendPercent: number;
   calibrationRecommended: boolean;
   calibrationDeviationPercent: number;
   recommendedKgPerHour: number | null;

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

  let consumptionTrend: "UP" | "DOWN" | "STABLE" =
  "STABLE";

let consumptionTrendPercent = 0;

if (completedSessions.length >= 6) {
  const recent =
    completedSessions
      .slice(-3)
      .reduce(
        (sum, s) => sum + s.estimatedGasUsedKg,
        0
      ) / 3;

  const previous =
    completedSessions
      .slice(-6, -3)
      .reduce(
        (sum, s) => sum + s.estimatedGasUsedKg,
        0
      ) / 3;

  if (previous > 0) {
    consumptionTrendPercent =
      ((recent - previous) / previous) * 100;
  }

  if (recent > previous * 1.10)
    consumptionTrend = "UP";
  else if (recent < previous * 0.90)
    consumptionTrend = "DOWN";
}

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

  // ----------------------------------------------------
  // Analytics
  // ----------------------------------------------------

const totalSessions = completedSessions.length;

const averageGasPerSessionKg =
  totalSessions > 0
    ? totalEstimatedGasUsedKg / totalSessions
    : 0;

const averageGasPerHourKg =
  totalCookingHours > 0
    ? totalEstimatedGasUsedKg / totalCookingHours
    : 0;


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

    const effectiveKgPerHour =
  theoreticalKgPerHour *
  learning.calibrationFactor;

     //--------------------------------------------------
     // Adaptive Calibration Recommendation
     //--------------------------------------------------

const learningRecords =
  LearningService.load().filter(
    (record) => !record.ignored
  );

const calibrationDeviationPercent =
  (learning.calibrationFactor - 1) * 100;

const appliedCalibrationFactor =
  EquipmentService.getAppliedCalibrationFactor();

const calibrationAlreadyApplied =
  appliedCalibrationFactor !== null &&
  Math.abs(
    appliedCalibrationFactor -
      learning.calibrationFactor
  ) < 0.0001;

const calibrationRecommended =
  learningRecords.length >= 3 &&
  Math.abs(calibrationDeviationPercent) > 10 &&
  !calibrationAlreadyApplied;

const recommendedKgPerHour =
  calibrationRecommended &&
  theoreticalKgPerHour > 0
    ? theoreticalKgPerHour *
      learning.calibrationFactor
    : null;


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

    const install = new Date(installation.installDate);
     install.setHours(0, 0, 0, 0);

    const today = new Date();
     today.setHours(0, 0, 0, 0);

    const cylinderAgeDays = Math.max(
     0,
     Math.floor(
    (today.getTime() - install.getTime()) /
    (1000 * 60 * 60 * 24)
  )
);

    const averageGasPerDayKg =
     cylinderAgeDays > 0
    ? gasUsedKg / cylinderAgeDays
    : 0;

    const estimatedCylinderLifetimeDays =
     averageGasPerDayKg > 0
    ? installation.cylinderCapacityKg / averageGasPerDayKg
    : 0;

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

     // Analytics

      totalSessions,

      totalGasConsumedKg: gasUsedKg,

      averageGasPerSessionKg,

      averageGasPerHourKg,

      averageGasPerDayKg,

      estimatedCylinderLifetimeDays,

      consumptionTrend,
      consumptionTrendPercent,

      calibrationRecommended,
      calibrationDeviationPercent,
      recommendedKgPerHour,

    };

  }

}
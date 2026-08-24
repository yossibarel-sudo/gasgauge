import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Measurement } from "../models/Measurement";
import { BBQSessionService } from "./BBQSessionService";
import { EquipmentService } from "./EquipmentService";
import type {
  LearningRecord,
  LearningStatistics,
} from "../models/Learning";


export class LearningService {
  static load(): LearningRecord[] {
    const json = localStorage.getItem(STORAGE_KEYS.learning);

    if (!json) {
      return [];
    }

    const data = JSON.parse(json) as LearningRecord[];

    return data.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  }

  static save(data: LearningRecord[]): void {
    localStorage.setItem(
      STORAGE_KEYS.learning,
      JSON.stringify(data)
    );
  }

  static add(record: LearningRecord): void {
    const records = this.load();

    records.push(record);

    this.save(records);
  }

  static learnFromMeasurements(
  previous: Measurement,
  current: Measurement
): void {
  const calibrationFactorAtTime =
    EquipmentService.getAppliedCalibrationFactor() ?? 1;

  //----------------------------------
  // Ignore invalid measurements
  //----------------------------------

  if (
  !current.bbqRelated
) { return;}
  if (
  current.grossWeightKg >=
  previous.grossWeightKg
) {

  this.add({

    id: crypto.randomUUID(),

    startMeasurementId: previous.id,

    endMeasurementId: current.id,

    createdAt: new Date(),

    calibrationFactorAtTime,

    gasConsumedKg: 0,

    cookingHours: 0,

    theoreticalKgPerHour: 0,

    actualKgPerHour: 0,

    correctionFactor: 1,

    ignored: true,

    ignoredReason:
      "Weight increased",

  });

  return;

}

  const sessions =
    BBQSessionService.betweenDates(
      previous.installationId,
      previous.date,
      current.date
    );

  if (sessions.length === 0) {

  this.add({

    id: crypto.randomUUID(),

    startMeasurementId: previous.id,

    endMeasurementId: current.id,

    createdAt: new Date(),

    calibrationFactorAtTime,
    
    gasConsumedKg: 0,

    cookingHours: 0,

    theoreticalKgPerHour: 0,

    actualKgPerHour: 0,

    correctionFactor: 1,

    ignored: true,

    ignoredReason:
      "No BBQ sessions",

  });

  return;

}

  const equipment =
    EquipmentService.load();

  let cookingHours = 0;
  let theoreticalGas = 0;

  for (const session of sessions) {

    cookingHours +=
      session.durationHours;

    const sessionKgPerHour =
      equipment.burners
        .filter(burner =>
          session.burnerIds.includes(
            burner.id
          )
        )
        .reduce(
          (sum, burner) =>
            sum +
            burner.calculatedKgPerHour,
          0
        );

    theoreticalGas +=
      sessionKgPerHour *
      session.durationHours;

  }

  if (
    cookingHours <= 0 ||
    theoreticalGas <= 0
  ) {
    return;
  }

  const gasConsumedKg =
    previous.grossWeightKg -
    current.grossWeightKg;

    if (
  gasConsumedKg <= 0 ||
  gasConsumedKg > 3
) {

  this.add({

    id: crypto.randomUUID(),

    startMeasurementId: previous.id,

    endMeasurementId: current.id,

    createdAt: new Date(),

    calibrationFactorAtTime,
    
    gasConsumedKg,

    cookingHours,

    theoreticalKgPerHour: 0,

    actualKgPerHour: 0,

    correctionFactor: 1,

    ignored: true,

    ignoredReason:
      "Invalid gas consumption",

  });

  return;

}

  const actualKgPerHour =
    gasConsumedKg /
    cookingHours;

  if (
  actualKgPerHour < 0.05 ||
  actualKgPerHour > 2
) {

  this.add({

    id: crypto.randomUUID(),

    startMeasurementId: previous.id,

    endMeasurementId: current.id,

    createdAt: new Date(),

    calibrationFactorAtTime,

    gasConsumedKg,

    cookingHours,

    theoreticalKgPerHour: 0,

    actualKgPerHour,

    correctionFactor: 1,

    ignored: true,

    ignoredReason:
      "Invalid flow rate",

  });

  return;

}

  const theoreticalKgPerHour =
    theoreticalGas /
    cookingHours;

  const correctionFactor =
    actualKgPerHour /
    theoreticalKgPerHour;

  if (
  correctionFactor < 0.7 ||
  correctionFactor > 1.3
) {

  this.add({

    id: crypto.randomUUID(),

    startMeasurementId: previous.id,

    endMeasurementId: current.id,

    createdAt: new Date(),

    calibrationFactorAtTime,
    
    gasConsumedKg,

    cookingHours,

    theoreticalKgPerHour,

    actualKgPerHour,

    correctionFactor,

    ignored: true,

    ignoredReason:
      "Correction factor out of range",

  });

  return;

}

  this.add({

    id: crypto.randomUUID(),

    startMeasurementId:
      previous.id,

    endMeasurementId:
      current.id,

    createdAt:
      new Date(),

    calibrationFactorAtTime,

    gasConsumedKg,

    cookingHours,

    theoreticalKgPerHour,

    actualKgPerHour,

    correctionFactor,

    ignored: false,

  });

}
  static statistics(): LearningStatistics {
  const calibrationDate =
    EquipmentService.getCalibrationDate();

  const records = this.load().filter(
    (record) => {
      if (record.ignored) {
        return false;
      }

      if (calibrationDate === null) {
        return true;
      }

      return record.createdAt > calibrationDate;
    }
  );

  if (records.length === 0) {
    return {
      calibrationFactor: 1,
      confidence: 0,
      completedCylinders: 0,
      averageCorrection: 1,
      standardDeviation: 0,
    };
  }

  const averageCorrection =
    records.reduce(
      (sum, record) =>
        sum + record.correctionFactor,
      0
    ) / records.length;

  const variance =
    records.reduce(
      (sum, record) =>
        sum +
        Math.pow(
          record.correctionFactor -
            averageCorrection,
          2
        ),
      0
    ) / records.length;

  const standardDeviation =
    Math.sqrt(variance);

  const confidence = Math.min(
    100,
    Math.round(records.length * 5)
  );

  return {
    calibrationFactor:
      averageCorrection,

    confidence,

    completedCylinders:
      records.length,

    averageCorrection,

    standardDeviation,
  };
}
}
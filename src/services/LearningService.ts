import type { Measurement } from "../models/Measurement";
import { BBQSessionService } from "./BBQSessionService";
import { EquipmentService } from "./EquipmentService";
import type {
  LearningRecord,
  LearningStatistics,
} from "../models/Learning";

const STORAGE_KEY = "gasgauge_learning";

export class LearningService {
  static load(): LearningRecord[] {
    const json = localStorage.getItem(STORAGE_KEY);

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
      STORAGE_KEY,
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

  if (
    current.grossWeightKg >=
    previous.grossWeightKg
  ) {
    return;
  }

  const sessions =
    BBQSessionService.betweenDates(
      previous.installationId,
      previous.date,
      current.date
    );

  if (sessions.length === 0) {
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

  const actualKgPerHour =
    gasConsumedKg /
    cookingHours;

  const theoreticalKgPerHour =
    theoreticalGas /
    cookingHours;

  const correctionFactor =
    actualKgPerHour /
    theoreticalKgPerHour;

  if (
    correctionFactor < 0.5 ||
    correctionFactor > 1.5
  ) {
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

    gasConsumedKg,

    cookingHours,

    theoreticalKgPerHour,

    actualKgPerHour,

    correctionFactor,

    ignored: false,

  });

}
  static statistics(): LearningStatistics {
    const records = this.load().filter(
      (record) => !record.ignored
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
        (sum, record) => sum + record.correctionFactor,
        0
      ) / records.length;

    const variance =
      records.reduce(
        (sum, record) =>
          sum +
          Math.pow(
            record.correctionFactor - averageCorrection,
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
      calibrationFactor: averageCorrection,
      confidence,
      completedCylinders: records.length,
      averageCorrection,
      standardDeviation,
    };
  }
}
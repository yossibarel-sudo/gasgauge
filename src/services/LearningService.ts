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
      records.length * 10
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
import type {
  CylinderLearning,
  LearningStatistics,
} from "../models/Learning";

const STORAGE_KEY = "gasgauge_learning";

export class LearningService {
  static load(): CylinderLearning[] {
    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) return [];

    const data = JSON.parse(json) as CylinderLearning[];

    return data.map((item) => ({
      ...item,
      completedDate: new Date(item.completedDate),
    }));
  }

  static save(data: CylinderLearning[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static add(record: CylinderLearning): void {
    const records = this.load();

    records.push(record);

    this.save(records);
  }

  static statistics(): LearningStatistics {
    const records = this.load().filter((r) => !r.ignored);

    if (records.length === 0) {
      return {
        calibrationFactor: 1,
        confidence: 0,
        completedCylinders: 0,
        averageCorrection: 1,
        standardDeviation: 0,
      };
    }

    const average =
      records.reduce((sum, r) => sum + r.correctionFactor, 0) /
      records.length;

    const variance =
      records.reduce(
        (sum, r) => sum + Math.pow(r.correctionFactor - average, 2),
        0
      ) / records.length;

    const deviation = Math.sqrt(variance);

    const confidence = Math.min(
      100,
      Math.round(records.length * 15 - deviation * 40)
    );

    return {
      calibrationFactor: average,
      confidence: Math.max(0, confidence),
      completedCylinders: records.length,
      averageCorrection: average,
      standardDeviation: deviation,
    };
  }
}
import type { Measurement } from "../models/Measurement";

const STORAGE_KEY = "gasgauge-measurements";

export class MeasurementService {
  static load(): Measurement[] {
    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) {
      return [];
    }

    const measurements = JSON.parse(json) as Measurement[];

    return measurements
      .map((measurement) => ({
        ...measurement,
        date: new Date(measurement.date),
      }))
      .sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
  }

  static save(measurement: Measurement): void {
    const measurements = this.load();

    measurements.push(measurement);

    measurements.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(measurements)
    );
  }

  static delete(index: number): void {
    const measurements = this.load();

    if (index < 0 || index >= measurements.length) {
      return;
    }

    measurements.splice(index, 1);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(measurements)
    );
  }

  static latest(): Measurement | null {
    const measurements = this.load();

    if (measurements.length === 0) {
      return null;
    }

    return measurements[0];
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
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

  static delete(id: string): void {
  const measurements = this.load();

  const updatedMeasurements = measurements.filter(
    (measurement) => measurement.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedMeasurements)
  );
}
  
  static latest(): Measurement | null {
    const measurements = this.load();

    if (measurements.length === 0) {
      return null;
    }

    return measurements[0];
  }

  static latestBefore(
  installationId: string,
  date: Date
): Measurement | null {

  const measurements =
    this.load()
      .filter(
        measurement =>
          measurement.installationId === installationId &&
          measurement.date < date
      )
      .sort(
        (a, b) =>
          b.date.getTime() -
          a.date.getTime()
      );

  return measurements.length > 0
    ? measurements[0]
    : null;

}
}
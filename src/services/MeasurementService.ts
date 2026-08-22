import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Measurement } from "../models/Measurement";

export class MeasurementService {
  static load(): Measurement[] {
    const json = localStorage.getItem(STORAGE_KEYS.measurements);

    if (!json) {
      return [];
    }

    const measurements = JSON.parse(json) as Measurement[];

    return measurements
  .map((measurement) => ({

    ...measurement,

    bbqRelated:
      measurement.bbqRelated ?? false,

    measurementType:
      measurement.measurementType ??
      "MANUAL",

    date:
      new Date(measurement.date),

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
      STORAGE_KEYS.measurements,
      JSON.stringify(measurements)
    );
  }

  static delete(id: string): void {
  const measurements = this.load();

  const updatedMeasurements = measurements.filter(
    (measurement) => measurement.id !== id
  );

  localStorage.setItem(
    STORAGE_KEYS.measurements,
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

  static latestForInstallation(
  installationId: string
): Measurement | null {

  const measurements =
    this.load()
      .filter(
        m =>
          m.installationId ===
          installationId
      );

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
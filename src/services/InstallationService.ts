import type { Installation } from "../models/Installation";
import { defaultInstallation } from "./defaultInstallation";

const STORAGE_KEY = "gasgauge-installation";

export class InstallationService {
  static load(): Installation {
    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) {
      this.save(defaultInstallation);
      return defaultInstallation;
    }

    const installation = JSON.parse(json) as Installation;

    return {
      ...installation,
      installDate: new Date(installation.installDate),
    };
  }

  static save(installation: Installation): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(installation)
    );
  }
}
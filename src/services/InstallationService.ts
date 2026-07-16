import type { Installation } from "../models/Installation";
import { defaultInstallation } from "./defaultInstallation";

const STORAGE_KEY = "gasgauge-installation";

export class InstallationService {
  static load(): Installation {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      this.save(defaultInstallation);
      return defaultInstallation;
    }

    return JSON.parse(data) as Installation;
  }

  static save(installation: Installation): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(installation));
  }
}
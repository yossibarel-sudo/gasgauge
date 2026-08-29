import type { Installation } from "../models/Installation";
import { defaultInstallation } from "./defaultInstallation";
import { STORAGE_KEYS } from "../constants/storageKeys";

export class InstallationService {
  static load(): Installation {
    const json = localStorage.getItem(STORAGE_KEYS.installation);

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
      STORAGE_KEYS.installation,
      JSON.stringify(installation)
    );
  }
}
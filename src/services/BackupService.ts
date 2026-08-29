import { STORAGE_KEYS } from "../constants/storageKeys";

export interface GasGaugeBackup {
  version: 2;
  createdAt: string;
  data: {
    equipment: string | null;
    installation: string | null;
    measurements: string | null;
    bbqSessions: string | null;
    learning: string | null;
    calibrationFactor: string | null;
    calibrationDate: string | null;
    activeBBQSession: string | null;
  };
}

interface LegacyGasGaugeBackup {
  version: 1;
  createdAt: string;
  data: {
    equipment: string | null;
    installation: string | null;
    measurements: string | null;
    bbqSessions: string | null;
    learning: string | null;
  };
}

export class BackupService {
  static createBackup(): GasGaugeBackup {
    return {
      version: 2,
      createdAt: new Date().toISOString(),
      data: {
        equipment: localStorage.getItem(
          STORAGE_KEYS.equipment
        ),
        installation: localStorage.getItem(
          STORAGE_KEYS.installation
        ),
        measurements: localStorage.getItem(
          STORAGE_KEYS.measurements
        ),
        bbqSessions: localStorage.getItem(
          STORAGE_KEYS.bbqSessions
        ),
        learning: localStorage.getItem(
          STORAGE_KEYS.learning
        ),
        calibrationFactor: localStorage.getItem(
          STORAGE_KEYS.calibrationFactor
        ),
        calibrationDate: localStorage.getItem(
          STORAGE_KEYS.calibrationDate
        ),
        activeBBQSession: localStorage.getItem(
          STORAGE_KEYS.activeBBQSession
        ),
      },
    };
  }

  static downloadBackup(): void {
    const backup = this.createBackup();

    const json = JSON.stringify(
      backup,
      null,
      2
    );

    const blob = new Blob(
      [json],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      `gasgauge-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  static restoreBackup(
    backup: GasGaugeBackup | LegacyGasGaugeBackup
  ): void {
    if (
      !backup ||
      !backup.data ||
      (backup.version !== 1 && backup.version !== 2)
    ) {
      throw new Error(
        "Invalid GasGauge backup file."
      );
    }

    this.setOrRemove(
      STORAGE_KEYS.equipment,
      backup.data.equipment
    );

    this.setOrRemove(
      STORAGE_KEYS.installation,
      backup.data.installation
    );

    this.setOrRemove(
      STORAGE_KEYS.measurements,
      backup.data.measurements
    );

    this.setOrRemove(
      STORAGE_KEYS.bbqSessions,
      backup.data.bbqSessions
    );

    this.setOrRemove(
      STORAGE_KEYS.learning,
      backup.data.learning
    );

    if (backup.version === 2) {
      this.setOrRemove(
        STORAGE_KEYS.calibrationFactor,
        backup.data.calibrationFactor
      );

      this.setOrRemove(
        STORAGE_KEYS.calibrationDate,
        backup.data.calibrationDate
      );

      this.setOrRemove(
        STORAGE_KEYS.activeBBQSession,
        backup.data.activeBBQSession
      );
    } else {
      // Version 1 backups did not contain calibration/session state.
      // Clear these keys so the restored application does not mix
      // current state with the older backup snapshot.
      localStorage.removeItem(
        STORAGE_KEYS.calibrationFactor
      );

      localStorage.removeItem(
        STORAGE_KEYS.calibrationDate
      );

      localStorage.removeItem(
        STORAGE_KEYS.activeBBQSession
      );
    }
  }

  private static setOrRemove(
    key: string,
    value: string | null | undefined
  ): void {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(
        key,
        value
      );
    }
  }
}

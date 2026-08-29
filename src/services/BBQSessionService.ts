import { STORAGE_KEYS } from "../constants/storageKeys";
import type { BBQSession } from "../models/BBQSession";
import { EquipmentService } from "./EquipmentService";

export class BBQSessionService {

  static load(): BBQSession[] {

    const json = localStorage.getItem(STORAGE_KEYS.bbqSessions);

    if (!json) {
      return [];
    }

    return (JSON.parse(json) as BBQSession[])
      .map((session) => ({

        ...session,

        date: new Date(session.date),

        startTime: session.startTime
          ? new Date(session.startTime)
          : undefined,

        endTime: session.endTime
          ? new Date(session.endTime)
          : undefined,

      }))
      .sort(
        (a, b) =>
          b.date.getTime() -
          a.date.getTime()
      );

  }

  static loadForInstallation(
    installationId: string
  ): BBQSession[] {

    return this.load().filter(
      session =>
        session.installationId ===
        installationId
    );

  }

  static save(
    session: BBQSession
  ): void {

    const sessions =
      this.load();

    sessions.push(session);

    localStorage.setItem(
      STORAGE_KEYS.bbqSessions,
      JSON.stringify(sessions)
    );

  }

  static delete(
    id: string
  ): void {

    const updated =
      this.load().filter(
        session =>
          session.id !== id
      );

    localStorage.setItem(
      STORAGE_KEYS.bbqSessions,
      JSON.stringify(updated)
    );

  }

  static getActiveSession():
    BBQSession | null {

    const json =
      localStorage.getItem(
        STORAGE_KEYS.activeBBQSession
      );

    if (!json) {
      return null;
    }

    const session =
      JSON.parse(json);

    return {

      ...session,

      date:
        new Date(session.date),

      startTime:
        new Date(session.startTime),

    };

  }

  static startSession(
    installationId: string
  ): BBQSession {

    const now =
      new Date();

    const session: BBQSession = {

      id: crypto.randomUUID(),

      installationId,

      date: now,

      startTime: now,

      durationHours: 0,

      burnerIds: [],

      estimatedGasUsedKg: 0,

    };

    localStorage.setItem(
      STORAGE_KEYS.activeBBQSession,
      JSON.stringify(session)
    );

    return session;

  }

  static updateActiveBurners(
    burnerIds: number[]
  ): BBQSession | null {

    const active = this.getActiveSession();

    if (!active) {
      return null;
    }

    const updated: BBQSession = {
      ...active,
      burnerIds,
    };

    localStorage.setItem(
      STORAGE_KEYS.activeBBQSession,
      JSON.stringify(updated)
    );

    return updated;
  }

  static finishSession(
    burnerIds: number[]
  ): BBQSession | null {

    const active =
      this.getActiveSession();

    if (!active) {
      return null;
    }

    const end =
      new Date();

    const duration =
      (
        end.getTime() -
        active.startTime!.getTime()
      ) /
      (1000 * 60 * 60);

    const equipment =
      EquipmentService.load();

    const estimatedKgPerHour =
      equipment.burners
        .filter(
          burner =>
            burnerIds.includes(
              burner.id
            )
        )
        .reduce(
          (sum, burner) =>
            sum +
            burner.calculatedKgPerHour,
          0
        );

    const finished: BBQSession = {

      ...active,

      endTime: end,

      durationHours: duration,

      burnerIds,

      estimatedGasUsedKg:
        estimatedKgPerHour *
        duration,

    };

    this.save(finished);

    localStorage.removeItem(
      STORAGE_KEYS.activeBBQSession
    );

    return finished;

  }

  static betweenDates(
  installationId: string,
  from: Date,
  to: Date
): BBQSession[] {

  return this.load()
    .filter(session =>
      session.installationId === installationId &&
      session.date >= from &&
      session.date <= to
    );

}

  static clear(): void {

    localStorage.removeItem(
      STORAGE_KEYS.bbqSessions
    );

    localStorage.removeItem(
      STORAGE_KEYS.activeBBQSession
    );

  }

  static latestCompleted(
  installationId: string
): BBQSession | null {

  const sessions =
    this.loadForInstallation(
      installationId
    );

  if (sessions.length === 0) {
    return null;
  }

  return sessions.sort(
    (a, b) =>
      (b.endTime?.getTime() ?? 0) -
      (a.endTime?.getTime() ?? 0)
  )[0];

}

}
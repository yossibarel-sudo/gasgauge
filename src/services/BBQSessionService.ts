import type { BBQSession } from "../models/BBQSession";
import { EquipmentService } from "./EquipmentService";

const STORAGE_KEY = "gasgauge-bbq-sessions";
const ACTIVE_KEY = "gasgauge-active-bbq-session";

export class BBQSessionService {

  static load(): BBQSession[] {

    const json = localStorage.getItem(STORAGE_KEY);

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
      STORAGE_KEY,
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
      STORAGE_KEY,
      JSON.stringify(updated)
    );

  }

  static getActiveSession():
    BBQSession | null {

    const json =
      localStorage.getItem(
        ACTIVE_KEY
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
      ACTIVE_KEY,
      JSON.stringify(session)
    );

    return session;

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
      ACTIVE_KEY
    );

    return finished;

  }

  static clear(): void {

    localStorage.removeItem(
      STORAGE_KEY
    );

    localStorage.removeItem(
      ACTIVE_KEY
    );

  }

}
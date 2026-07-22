import type { BBQSession } from "../models/BBQSession";

const STORAGE_KEY = "gasgauge-bbq-sessions";


export class BBQSessionService {


  static load(): BBQSession[] {

    const json =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!json) {
      return [];
    }


    const sessions =
      JSON.parse(json) as BBQSession[];


    return sessions
      .map((session) => ({
        ...session,

        date:
          new Date(session.date),
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

    return this.load()
      .filter(
        (session) =>
          session.installationId ===
          installationId
      );
  }



  static save(
    session: BBQSession
  ): void {

    const sessions =
      this.load();


    sessions.push(
      session
    );


    sessions.sort(
      (a, b) =>
        b.date.getTime() -
        a.date.getTime()
    );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(sessions)
    );
  }



  static delete(
    id: string
  ): void {

    const sessions =
      this.load();


    const updated =
      sessions.filter(
        (session) =>
          session.id !== id
      );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  }



  static latest():
    BBQSession | null {

    const sessions =
      this.load();


    if (
      sessions.length === 0
    ) {
      return null;
    }


    return sessions[0];
  }



  static clear(): void {

    localStorage.removeItem(
      STORAGE_KEY
    );
  }

}
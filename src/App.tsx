import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import EquipmentPage from "./pages/EquipmentPage";
import MeasurementsPage from "./pages/MeasurementsPage";
import BBQSessionsPage from "./pages/BBQSessionsPage";
import LearningPage from "./pages/LearningPage";

type Page =
  | "dashboard"
  | "equipment"
  | "measurements"
  | "bbqSessions"
  | "learning"
;



export default function App() {


  const [
    page,
    setPage,
  ] =
    useState<Page>(
      "dashboard"
    );




  if (page === "equipment") {

    return (

      <EquipmentPage

        onBack={() =>
          setPage("dashboard")
        }

      />

    );

  }




  if (page === "measurements") {

    return (

      <MeasurementsPage

        onBack={() =>
          setPage("dashboard")
        }

      />

    );

  }




  if (page === "bbqSessions") {

    return (

      <BBQSessionsPage

        onBack={() =>
          setPage("dashboard")
        }

      />

    );

  }

  if (page === "learning") {
  return (
    <LearningPage
      onBack={() => setPage("dashboard")}
    />
  );
}


  return (

    <Dashboard

      onEquipment={() =>
        setPage("equipment")
      }


      onMeasurements={() =>
        setPage("measurements")
      }


      onBBQSessions={() =>
        setPage("bbqSessions")
      }

      onLearning={() =>
        setPage("learning")
      }

    />

  );

}
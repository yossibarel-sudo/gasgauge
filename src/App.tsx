import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import EquipmentPage from "./pages/EquipmentPage";
import MeasurementsPage from "./pages/MeasurementsPage";

type Page =
  | "dashboard"
  | "equipment"
  | "measurements";

export default function App() {
  const [page, setPage] =
    useState<Page>("dashboard");

  if (page === "equipment") {
    return (
      <div>
        <EquipmentPage />

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() =>
              setPage("dashboard")
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>
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

  return (
    <Dashboard
      onEquipment={() =>
        setPage("equipment")
      }
      onMeasurements={() =>
        setPage("measurements")
      }
    />
  );
}
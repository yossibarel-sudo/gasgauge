import { useState } from "react";

import {
  Alert,
  Button,
  Snackbar,
} from "@mui/material";

import InstallationDialog from "../components/InstallationDialog";
import WeightDialog from "../components/WeightDialog";

import { calculateGas } from "../services/GasCalculationService";
import { InstallationService } from "../services/InstallationService";
import { MeasurementService } from "../services/MeasurementService";

import type { Installation } from "../models/Installation";

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function Dashboard() {
  const [installation, setInstallation] = useState<Installation>(
    () => InstallationService.load()
  );

  const [installationDialogOpen, setInstallationDialogOpen] =
    useState(false);

  const [weightDialogOpen, setWeightDialogOpen] =
    useState(false);

  const [showInstallSaved, setShowInstallSaved] =
    useState(false);

  const [showWeightSaved, setShowWeightSaved] =
    useState(false);

  const gas = calculateGas({
    cylinderCapacityKg: installation.cylinderCapacityKg,

    emptyCylinderWeightKg:
      installation.emptyCylinderWeightKg,

    currentGrossWeightKg:
      installation.currentGrossWeightKg,

    averageConsumptionKgPerHour: 0.55,
  });

  function saveInstallation(newInstallation: Installation) {
    InstallationService.save(newInstallation);

    setInstallation(newInstallation);

    setInstallationDialogOpen(false);

    setShowInstallSaved(true);
  }

  function saveWeight(weight: number) {
  const updatedInstallation: Installation = {
    ...installation,
    currentGrossWeightKg: weight,
  };
 
  setLatestMeasurement(MeasurementService.latest());

  const gas = calculateGas({
    cylinderCapacityKg: updatedInstallation.cylinderCapacityKg,

    emptyCylinderWeightKg:
      updatedInstallation.emptyCylinderWeightKg,

    currentGrossWeightKg:
      updatedInstallation.currentGrossWeightKg,

    averageConsumptionKgPerHour: 0.55,
  });

  InstallationService.save(updatedInstallation);

  MeasurementService.save({
    date: new Date(),

    grossWeightKg: weight,

    remainingLpgKg: gas.remainingLpgKg,

    remainingPercent: gas.remainingPercent,
  });

  setInstallation(updatedInstallation);

  setWeightDialogOpen(false);

  setShowWeightSaved(true);
}

 const [latestMeasurement, setLatestMeasurement] = useState(
  () => MeasurementService.latest()
);

  return (
    <div
      style={{
        width: "420px",
        background: "#1E1E1E",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 0 25px rgba(0,0,0,0.5)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#4CAF50",
        }}
      >
        GasGauge
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#AAAAAA",
        }}
      >
        Cylinder Installed:
        <br />
        {formatDate(installation.installDate)}
        {latestMeasurement && (
  <p
    style={{
      textAlign: "center",
      color: "#AAAAAA",
      marginTop: "-10px",
      fontSize: "14px",
    }}
  >
    Last Weight:{" "}
    {latestMeasurement.grossWeightKg.toFixed(2)} kg
  </p>
)}
      </p>

      <Button
        fullWidth
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() =>
          setInstallationDialogOpen(true)
        }
      >
        Install New Cylinder
      </Button>

      <hr />

      <h2
        style={{
          textAlign: "center",
          color: "white",
        }}
      >
        Remaining LPG
      </h2>

      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "64px",
            color: "#4CAF50",
            marginBottom: 0,
          }}
        >
          {gas.remainingPercent.toFixed(0)}%
        </h1>

        <div
          style={{
            color: "white",
            fontSize: "28px",
          }}
        >
          {gas.remainingLpgKg.toFixed(2)} kg
        </div>

        <div
          style={{
            color: "#AAAAAA",
          }}
        >
          of {installation.cylinderCapacityKg} kg
        </div>
      </div>

      <hr />

      <table
        style={{
          width: "100%",
          color: "white",
        }}
      >
        <tbody>
          <tr>
            <td>Current Weight</td>
            <td align="right">
              {installation.currentGrossWeightKg.toFixed(
                2
              )}{" "}
              kg
            </td>
          </tr>

          <tr>
            <td>Remaining BBQ Sessions</td>
            <td align="right">
              {gas.remainingSessions.toFixed(1)}
            </td>
          </tr>

          <tr>
            <td>Cooking Hours</td>
            <td align="right">
              {gas.remainingHours.toFixed(1)}
            </td>
          </tr>

          <tr>
            <td>Status</td>

            <td
              align="right"
              style={{
                color: "#4CAF50",
                fontWeight: "bold",
              }}
            >
              {gas.status}
            </td>
          </tr>
        </tbody>
      </table>

      <Button
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() =>
          setWeightDialogOpen(true)
        }
      >
        Add Cylinder Weight
      </Button>

      <InstallationDialog
        open={installationDialogOpen}
        installation={installation}
        onCancel={() =>
          setInstallationDialogOpen(false)
        }
        onSave={saveInstallation}
      />

      <WeightDialog
        open={weightDialogOpen}
        currentWeight={
          installation.currentGrossWeightKg
        }
        onCancel={() =>
          setWeightDialogOpen(false)
        }
        onSave={saveWeight}
      />

      <Snackbar
        open={showInstallSaved}
        autoHideDuration={3000}
        onClose={() =>
          setShowInstallSaved(false)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
        >
          New cylinder installed.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showWeightSaved}
        autoHideDuration={3000}
        onClose={() =>
          setShowWeightSaved(false)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
        >
          Weight updated.
        </Alert>
      </Snackbar>
    </div>
  );
}
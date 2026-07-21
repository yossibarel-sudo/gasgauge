import { useState } from "react";

import {
  Alert,
  Button,
  Snackbar,
} from "@mui/material";

import InstallationDialog from "../components/InstallationDialog";
import WeightDialog from "../components/WeightDialog";

import { calculateGas } from "../services/GasCalculationService";
import { AnalysisService } from "../services/AnalysisService";
import { EquipmentService } from "../services/EquipmentService";
import { InstallationService } from "../services/InstallationService";
import { MeasurementService } from "../services/MeasurementService";

import type { Installation } from "../models/Installation";

interface DashboardProps {
  onEquipment: () => void;
  onMeasurements: () => void;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function Dashboard({
  onEquipment,
  onMeasurements,
}: DashboardProps) {

  const [installation, setInstallation] =
    useState<Installation>(() =>
      InstallationService.load()
    );

  const [latestMeasurement, setLatestMeasurement] =
    useState(() =>
      MeasurementService.latest()
    );

  const [
    installationDialogOpen,
    setInstallationDialogOpen,
  ] = useState(false);

  const [
    weightDialogOpen,
    setWeightDialogOpen,
  ] = useState(false);

  const [
    showInstallSaved,
    setShowInstallSaved,
  ] = useState(false);

  const [
    showWeightSaved,
    setShowWeightSaved,
  ] = useState(false);


  const measurements =
    MeasurementService.load();

  const equipment =
    EquipmentService.load();


  const analysis =
    AnalysisService.analyze(
      installation,
      equipment,
      measurements
    );


  const cylinderAgeDays =
    Math.floor(
      (
        new Date().getTime() -
        installation.installDate.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    );


  function saveInstallation(
    newInstallation: Installation
  ) {

    InstallationService.save(
      newInstallation
    );

    setInstallation(
      newInstallation
    );

    setInstallationDialogOpen(false);

    setShowInstallSaved(true);
  }


 function saveWeight(
  weight: number,
  bbqHours: number
) {

    const updatedInstallation: Installation = {
      ...installation,
      currentGrossWeightKg: weight,
    };


    const gas =
      calculateGas({
        cylinderCapacityKg:
          updatedInstallation.cylinderCapacityKg,

        emptyCylinderWeightKg:
          updatedInstallation.emptyCylinderWeightKg,

        currentGrossWeightKg:
          updatedInstallation.currentGrossWeightKg,

        averageConsumptionKgPerHour: 0.55,
      });


    InstallationService.save(
      updatedInstallation
    );

MeasurementService.save({
  id: crypto.randomUUID(),

  date: new Date(),

  grossWeightKg: weight,

  remainingLpgKg:
    gas.remainingLpgKg,

  remainingPercent:
    gas.remainingPercent,

  bbqHoursSincePrevious:
    bbqHours > 0
      ? bbqHours
      : undefined,
});


    setLatestMeasurement(
      MeasurementService.latest()
    );


    setInstallation(
      updatedInstallation
    );


    setWeightDialogOpen(false);

    setShowWeightSaved(true);
  }


  return (
    <div
      style={{
        width: "420px",
        background: "#1E1E1E",
        borderRadius: "18px",
        padding: "30px",
        boxShadow:
          "0 0 25px rgba(0,0,0,0.5)",
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


      <div
        style={{
          textAlign: "center",
          color: "#AAAAAA",
          marginBottom: "20px",
        }}
      >

        <div>
          Cylinder Installed:
        </div>

        <div>
          {formatDate(
            installation.installDate
          )}
        </div>


        {latestMeasurement && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "14px",
            }}
          >
            Last Weight{" "}
            {latestMeasurement.grossWeightKg.toFixed(2)}
            {" "}kg
          </div>
        )}

      </div>


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


      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >

        <Button
          fullWidth
          variant="outlined"
          onClick={onEquipment}
        >
          Equipment
        </Button>


        <Button
          fullWidth
          variant="outlined"
          onClick={onMeasurements}
        >
          Measurement History
        </Button>

      </div>
           <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "20px",
        }}
      >

        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>
            Current Weight
          </div>

          <div style={metricValueStyle}>
            {installation.currentGrossWeightKg.toFixed(2)} kg
          </div>
        </div>


        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>
            Last Measurement
          </div>

          <div style={metricValueStyle}>
            {latestMeasurement
              ? formatDate(latestMeasurement.date)
              : "--"}
          </div>
        </div>


        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>
            Measurements
          </div>

          <div style={metricValueStyle}>
            {measurements.length}
          </div>
        </div>


        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>
            Cylinder Age
          </div>

          <div style={metricValueStyle}>
            {cylinderAgeDays} days
          </div>
        </div>

      </div>


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
          {analysis.remainingPercent.toFixed(0)}%
        </h1>


        <div
          style={{
            color: "white",
            fontSize: "28px",
          }}
        >
          {analysis.currentGasKg.toFixed(2)} kg
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
              {installation.currentGrossWeightKg.toFixed(2)} kg
            </td>
          </tr>


          <tr>
            <td>Remaining BBQ Sessions</td>

            <td align="right">
              {analysis.estimatedRemainingSessions !== null
                ? analysis.estimatedRemainingSessions.toFixed(1)
                : "--"}
            </td>
          </tr>


          <tr>
            <td>Cooking Hours</td>

            <td align="right">
              {analysis.remainingHours !== null
                ? analysis.remainingHours.toFixed(1)
                : "--"}
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
              {analysis.status}
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


const metricCardStyle = {
  background: "#2A2A2A",
  borderRadius: "10px",
  padding: "12px",
};


const metricTitleStyle = {
  color: "#AAAAAA",
  fontSize: "13px",
};


const metricValueStyle = {
  color: "white",
  fontSize: "22px",
};
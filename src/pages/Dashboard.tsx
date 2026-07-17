import { useState } from "react";

import {
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import InstallationDialog from "../components/InstallationDialog";
import { InstallationService } from "../services/InstallationService";
import { calculateGas } from "../services/GasCalculationService";

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function Dashboard() {
  const [installation, setInstallation] = useState(
  () => InstallationService.load()
);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  installation.currentGrossWeightKg
  const gas = calculateGas({
    cylinderCapacityKg: installation.cylinderCapacityKg,

    emptyCylinderWeightKg:
        installation.emptyCylinderWeightKg,

    currentGrossWeightKg: installation.currentGrossWeightKg,
    averageConsumptionKgPerHour: 0.55,
});
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
          marginBottom: "5px",
        }}
      >
        GasGauge
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#B0B0B0",
          marginBottom: "30px",
        }}
      >
        Cylinder Installed:
{
    formatDate(installation.installDate)
}
      </p>

<div
  style={{
    textAlign: "center",
    marginTop: "15px",
    marginBottom: "20px",
  }}
>
  <Button
    variant="contained"
    onClick={() => setDialogOpen(true)}
  >
    Install New Cylinder
  </Button>
</div>

      <hr />

      <h2
        style={{
          textAlign: "center",
          color: "#E0E0E0",
          marginTop: "20px",
        }}
      >
        Remaining LPG
      </h2>

     <div style={{ textAlign: "center" }}>
      <h1
        style={{
         fontSize: "64px",
         color: "#4CAF50",
         marginBottom: "0px",
       }}
      >
       {gas.remainingPercent.toFixed(0)}%
      </h1>

    <div
        style={{
         color: "white",
         fontSize: "26px",
         marginTop: "15px",
       }}
     >
       {gas.remainingLpgKg.toFixed(2)} kg
     </div>

  <div
    style={{
      color: "#AAAAAA",
      fontSize: "16px",
      marginTop: "8px",
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
          marginTop: "20px",
        }}
      >
        <tbody>
          <tr>
            <td>Remaining BBQ Sessions</td>
            <td align="right">{gas.remainingSessions.toFixed(1)}</td>
          </tr>

          <tr>
            <td>Cooking Hours</td>
            <td align="right">{gas.remainingHours.toFixed(1)}</td>
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
  variant="contained"
  fullWidth
  size="large"
  sx={{ mt: 3 }}
>
  Add Cylinder Weight
</Button>
   
    <InstallationDialog
  open={dialogOpen}
  installation={installation}
  onCancel={() => setDialogOpen(false)}
  onSave={(newInstallation) => {
    InstallationService.save(newInstallation);
    setInstallation(newInstallation);
    setDialogOpen(false);
    setSaved(true);
  }}
/>
    <Snackbar
  open={saved}
  autoHideDuration={3000}
  onClose={() => setSaved(false)}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "center",
  }}
>
  <Alert
    severity="success"
    variant="filled"
    onClose={() => setSaved(false)}
  >
    New cylinder installed successfully.
  </Alert>
</Snackbar>

    </div>
  );
}
import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Table,
  TableBody,
  Typography,
} from "@mui/material";

import BBQSessionControl from "../components/BBQSessionControl";
import InstallationDialog from "../components/InstallationDialog";
import WeightDialog from "../components/WeightDialog";
import MetricCard from "../components/MetricCard";
import InfoRow from "../components/InfoRow";

import { AnalysisService } from "../services/AnalysisService";
import { InstallationService } from "../services/InstallationService";
import { MeasurementService } from "../services/MeasurementService";
import { EquipmentService } from "../services/EquipmentService";

import type { Installation } from "../models/Installation";


interface DashboardProps {

  onEquipment: () => void;

  onMeasurements: () => void;

  onBBQSessions: () => void;

}



function formatDate(
  date: Date
): string {

  const day =
    String(date.getDate())
      .padStart(2, "0");

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const year =
    date.getFullYear();

  return `${day}/${month}/${year}`;
}



export default function Dashboard({

  onEquipment,

  onMeasurements,

  onBBQSessions,

}: DashboardProps) {


  const [installation, setInstallation] =
    useState<Installation>(
      () => InstallationService.load()
    );


  const [measurements, setMeasurements] =
    useState(
      () => MeasurementService.load()
    );



  const equipment =
    EquipmentService.load();



  const analysis =
  AnalysisService.analyze(
    installation,
    equipment,
    measurements,
  );



  const [
    installationDialogOpen,
    setInstallationDialogOpen,
  ] =
    useState(false);



  const [
    weightDialogOpen,
    setWeightDialogOpen,
  ] =
    useState(false);



  const [
    showSaved,
    setShowSaved,
  ] =
    useState(false);




  function saveInstallation(
    newInstallation: Installation
  ) {

    InstallationService.save(
      newInstallation
    );


    setInstallation(
      newInstallation
    );


    setShowSaved(true);


    setInstallationDialogOpen(false);

  }




  function saveWeight(
    weight: number
  ) {


    const updatedInstallation =
    {
      ...installation,

      currentGrossWeightKg:
        weight,
    };



    InstallationService.save(
      updatedInstallation
    );



    const updatedAnalysis =
  AnalysisService.analyze(
    updatedInstallation,
    equipment,
    measurements,
    );



    MeasurementService.save({

      id: crypto.randomUUID(),

      installationId:
        installation.id,

      date:
        new Date(),

      grossWeightKg:
        weight,

      remainingLpgKg:
        updatedAnalysis.remainingLpgKg,

      remainingPercent:
        updatedAnalysis.remainingPercent,

    });



    setInstallation(
      updatedInstallation
    );


    setMeasurements(
      MeasurementService.load()
    );


    setWeightDialogOpen(false);


    setShowSaved(true);

  }
    return (

    <Box
      sx={{
        width: "100%",
        maxWidth: 700,
        mx: "auto",
        mt: 3,
        px: 2,
      }}
    >


      <Typography
        variant="h3"
        align="center"
        sx={{
          color:"#4CAF50",
          mb:1,
          fontWeight:"bold",
        }}
      >
        GasGauge
      </Typography>



      <Typography
        align="center"
        sx={{
          color:"#777",
          mb:3,
        }}
      >
        Cylinder Installed:{" "}
        {formatDate(
          installation.installDate
        )}
      </Typography>



      <Paper
        sx={{
          p:3,
          mb:3,
          textAlign:"center",
          background:"#1E1E1E",
        }}
      >

        <Typography
          variant="h6"
          color="text.secondary"
        >
          Remaining LPG
        </Typography>


        <Typography
          sx={{
            fontSize:"64px",
            color:"#4CAF50",
            fontWeight:"bold",
          }}
        >
          {analysis.remainingPercent.toFixed(0)}%
        </Typography>


        <Typography
          sx={{
            fontSize:"28px",
            color:"white",
          }}
        >
          {analysis.remainingLpgKg.toFixed(2)} kg
        </Typography>


        <Typography color="text.secondary">
  {
    analysis.usingActualConsumption
      ? `Using learned consumption (${analysis.actualKgPerHour!.toFixed(3)} kg/h)`
      : "Using configured burner consumption"
  }
</Typography>

      </Paper>

      <BBQSessionControl
        installation={installation}
      />

      <Box
        sx={{
          display:"grid",
          gridTemplateColumns:"repeat(2,1fr)",
          gap:2,
          mb:3,
        }}
      >

        <MetricCard
          title="Current Weight"
          value={
            `${installation.currentGrossWeightKg.toFixed(2)} kg`
          }
        />


        <MetricCard
          title="Cylinder Age"
          value={
            `${analysis.cylinderAgeDays} days`
          }
        />


        <MetricCard
          title="Measurements"
          value={
            measurements.length
          }
        />


        <MetricCard
          title="Status"
          value={analysis.status}
          valueColor={
            analysis.status === "GOOD"
              ? "#4CAF50"
              : analysis.status === "LOW"
              ? "#FFA726"
              : "#F44336"
          }
        />

      </Box>



      {
        analysis.status === "LOW" && (

          <Alert
            severity="warning"
            sx={{mb:3}}
          >
            LPG level is getting low.
          </Alert>

        )
      }



      {
        analysis.status === "CRITICAL" && (

          <Alert
            severity="error"
            sx={{mb:3}}
          >
            LPG level is critical.
          </Alert>

        )
      }


      <Paper
        sx={{
          p:2,
          mb:3,
          background:"#1E1E1E",
        }}
      >

        <Typography
          variant="h6"
          sx={{
            color:"white",
            mb:1,
          }}
        >
          Cooking Prediction
        </Typography>



        <Table>

          <TableBody>


            <InfoRow
              label="Remaining Cooking Hours"
              value={
                analysis.remainingHours !== null
                  ? `${analysis.remainingHours.toFixed(1)} h`
                  : "--"
              }
            />



            <InfoRow
              label="Remaining BBQ Sessions"
              value={
                analysis.remainingSessions !== null
                  ? analysis.remainingSessions.toFixed(1)
                  : "--"
              }
            />



            <InfoRow
              label="Configured Consumption"
              value={
                `${analysis.theoreticalKgPerHour.toFixed(3)} kg/h`
              }
            />



            <InfoRow
              label="Measured Consumption"
              value={
                analysis.actualKgPerHour !== null
                  ? `${analysis.actualKgPerHour.toFixed(3)} kg/h`
                  : "--"
              }
            />



            <InfoRow
              label="Total BBQ Hours"
              value={
                `${analysis.totalCookingHours.toFixed(1)} h`
              }
            />


          </TableBody>

        </Table>

      </Paper>




      <Box
        sx={{
          display:"flex",
          gap:2,
          mb:3,
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
          History
        </Button>


        <Button
          fullWidth
          variant="outlined"
          onClick={onBBQSessions}
        >
          BBQ Sessions
        </Button>


      </Box>




      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{mb:2}}
        onClick={() =>
          setWeightDialogOpen(true)
        }
      >
        Add Cylinder Weight
      </Button>



      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() =>
          setInstallationDialogOpen(true)
        }
      >
        Install New Cylinder
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
        open={showSaved}
        autoHideDuration={3000}
        onClose={() =>
          setShowSaved(false)
        }
        message="Data saved successfully"
      />


    </Box>

  );

}
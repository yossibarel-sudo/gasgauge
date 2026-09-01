import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import BBQSessionControl from "../components/BBQSessionControl";
import InstallationDialog from "../components/InstallationDialog";
import WeightDialog from "../components/WeightDialog";
import MetricCard from "../components/MetricCard";
import InfoRow from "../components/InfoRow";

import { BackupService } from "../services/BackupService";
import { AnalysisService } from "../services/AnalysisService";
import { InstallationService } from "../services/InstallationService";
import { MeasurementService } from "../services/MeasurementService";
import { EquipmentService } from "../services/EquipmentService";
import { LearningService } from "../services/LearningService";
import type { Measurement } from "../models/Measurement";
import type { Installation } from "../models/Installation";
import type { BBQSession } from "../models/BBQSession";

interface DashboardProps {

  onEquipment: () => void;

  onMeasurements: () => void;

  onBBQSessions: () => void;

  onLearning: () => void;

  onStatistics: () => void;

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

  onLearning,
  
  onStatistics,

}: DashboardProps) {


  const [installation, setInstallation] =
    useState<Installation>(
      () => InstallationService.load()
    );


  const [measurements, setMeasurements] =
    useState(
      () => MeasurementService.load()
    );

const [lastSession, setLastSession] =
  useState<BBQSession | null>(null);

  const equipment =
    EquipmentService.load();

const burnerNames =
  lastSession?.burnerIds
    ?.map(id =>
      equipment.burners.find(
        burner => burner.id === id
      )?.name ?? `#${id}`
    )
    .join(", ");

  const analysis =
  AnalysisService.analyze(
    installation,
    equipment,
    measurements,
  );

const learning =
  LearningService.statistics();

const pendingCalibrationFactor =
  EquipmentService.getCalibrationRecommendation();

const handledCalibrationCount =
  EquipmentService.getHandledCalibrationRecommendationCount();

const hasNewCalibrationRecommendation =
  analysis.calibrationRecommended &&
  learning.completedCylinders > handledCalibrationCount;

useEffect(() => {
  if (hasNewCalibrationRecommendation) {
    EquipmentService.setCalibrationRecommendation(
      analysis.calibrationFactor
    );
  }
}, [
  hasNewCalibrationRecommendation,
  analysis.calibrationFactor,
]);

const calibrationFactorForRecommendation =
  pendingCalibrationFactor ??
  (hasNewCalibrationRecommendation
    ? analysis.calibrationFactor
    : null);

const calibrationRecommendationVisible =
  calibrationFactorForRecommendation !== null;

const calibrationDeviationForDisplay =
  (calibrationFactorForRecommendation ?? 1) * 100 - 100;

const recommendedKgPerHourForDisplay =
  calibrationRecommendationVisible
    ? analysis.theoreticalKgPerHour *
      (calibrationFactorForRecommendation ?? 1)
    : null;

  const [
    installationDialogOpen,
    setInstallationDialogOpen,
  ] =
    useState(false);

  const [calibrationDialogOpen, setCalibrationDialogOpen] =
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

  EquipmentService.clearCalibrationRecommendation();

  const installationAnalysis =
    AnalysisService.analyze(
      newInstallation,
      equipment,
      []
    );

  MeasurementService.save({

    id: crypto.randomUUID(),

    installationId:
      newInstallation.id,

    date:
      newInstallation.installDate,

    grossWeightKg:
      newInstallation.initialGrossWeightKg,

    remainingLpgKg:
      installationAnalysis.remainingLpgKg,

    remainingPercent:
      installationAnalysis.remainingPercent,

    bbqRelated: false,

    measurementType: "INSTALLATION",

  });

  setInstallation(
    newInstallation
  );

  setMeasurements(
    MeasurementService.load()
  );

  setShowSaved(true);

  setInstallationDialogOpen(false);

}


function restoreBackup(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const backup = JSON.parse(
        reader.result as string
      );

      BackupService.restoreBackup(backup);

      window.location.reload();
    } catch (error) {
      console.error(
        "Failed to restore backup:",
        error
      );

      alert(
        "Unable to restore backup. The file may be invalid."
      );
    }
  };

  reader.readAsText(file);

  event.target.value = "";
}


  function saveWeight(
    weight: number
  ) 
  {


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



    const newMeasurement: Measurement = {

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

  bbqRelated:
    lastSession !== null,

  measurementType: "BBQ_AUTOMATIC",

};

const previousMeasurement =
    MeasurementService.latestBefore(
        installation.id,
        newMeasurement.date
    );

MeasurementService.save(
  newMeasurement
);

if (
  previousMeasurement &&
  newMeasurement.bbqRelated
) {

  LearningService.learnFromMeasurements(
    previousMeasurement,
    newMeasurement
  );

}

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
            color:
              analysis.status === "GOOD"
                ? "#4CAF50"
                : analysis.status === "LOW"
                ? "#FFA726"
                : "#F44336",
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
    analysis.effectiveKgPerHour !== null
  ? `Using calibrated consumption (${analysis.effectiveKgPerHour.toFixed(3)} kg/h)`
  : "Using configured burner consumption"
  }
</Typography>

      </Paper>

      <BBQSessionControl
  installationId={installation.id}
  onSessionFinished={(session) => {

  setLastSession(session);

  setWeightDialogOpen(true);

}}
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
          value={measurements.length}
        />

        <MetricCard
          title="Avg Consumption"
          value={`${analysis.averageGasPerHourKg.toFixed(3)} kg/h`}
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
    value={`${analysis.theoreticalKgPerHour.toFixed(3)} kg/h`}
  />

  <InfoRow
    label="Learned Consumption"
    value={
      analysis.effectiveKgPerHour !== null
        ? `${analysis.effectiveKgPerHour.toFixed(3)} kg/h`
        : "--"
    }
  />

  <InfoRow
    label="Learning Factor"
    value={
      analysis.learningFactor !== null
        ? `${(analysis.learningFactor * 100).toFixed(0)} %`
        : "--"
    }
  />

  <InfoRow
  label="Calibration Factor"
  value={learning.calibrationFactor.toFixed(3)}
/>

<InfoRow
  label="Prediction Confidence"
  value={`${learning.confidence}%`}
/>

<InfoRow
  label="Average Gas / Session"
  value={`${analysis.averageGasPerSessionKg.toFixed(3)} kg`}
/>

<InfoRow
  label="Estimated Cylinder Lifetime"
  value={
    analysis.estimatedCylinderLifetimeDays > 0
      ? `${analysis.estimatedCylinderLifetimeDays.toFixed(0)} days`
      : "--"
  }
/>

<InfoRow
  label="Consumption Trend"
  value={
    analysis.consumptionTrend === "UP"
      ? "Increasing ↑"
      : analysis.consumptionTrend === "DOWN"
      ? "Decreasing ↓"
      : "Stable →"
  }
/>

  <TableRow>
    <TableCell colSpan={2}>
      <LinearProgress
        variant="determinate"
        value={analysis.predictionConfidence}
        sx={{
          height: 8,
          borderRadius: 4,
        }}
      />
    </TableCell>
  </TableRow>

  <InfoRow
    label="Total BBQ Hours"
    value={`${analysis.totalCookingHours.toFixed(1)} h`}
  />

</TableBody>

        </Table>

      </Paper>


    {calibrationRecommendationVisible && (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography
        variant="h6"
        gutterBottom
      >
        Calibration Recommendation
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Measured consumption differs from the
        configured consumption by{" "}
        {Math.abs(
          calibrationDeviationForDisplay
        ).toFixed(1)}
        %.
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Recommended consumption:{" "}
        <strong>
          {recommendedKgPerHourForDisplay !== null
            ? `${recommendedKgPerHourForDisplay.toFixed(
                3
              )} kg/h`
            : "--"}
        </strong>
      </Typography>

      <Button
        variant="contained"
        onClick={() =>
          setCalibrationDialogOpen(true)
        }
      >
        Review Recommendation
      </Button>
    </CardContent>
  </Card>
)}

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
          <Box
            component="span"
            sx={{ display: { xs: "none", sm: "inline" } }}
          >
            Equipment
          </Box>
          <Box
            component="span"
            sx={{ display: { xs: "inline", sm: "none" } }}
          >
            Equip.
          </Box>
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

        <Button
          fullWidth
          variant="outlined"
          //sx={{ mt: 2 }}
          onClick={onLearning}
        >
         Learning History
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={onStatistics}
       >
        Statistics
        </Button>


      </Box>



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



            <Box
          sx={{
          display: "flex",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={() =>
            BackupService.downloadBackup()
          }
        >
          Export Backup
        </Button>

        <Button
          fullWidth
          variant="outlined"
          component="label"
        >
          Restore Backup
          <input
            type="file"
            accept=".json,application/json"
            hidden
            onChange={restoreBackup}
          />
        </Button>
      </Box>


      <InstallationDialog
        key={installationDialogOpen ? "installation-open" : "installation-closed"}
        open={installationDialogOpen}
        installation={installation}
        onCancel={() =>
          setInstallationDialogOpen(false)
        }
        onSave={saveInstallation}
      />


      <WeightDialog
  key={weightDialogOpen ? "weight-open" : "weight-closed"}
  open={weightDialogOpen}
  previousWeight={
  MeasurementService
    .latestForInstallation(
      installation.id
    )?.grossWeightKg ??
  installation.currentGrossWeightKg
}
  currentWeight={
    installation.currentGrossWeightKg
  }
  sessionDate={
    lastSession?.endTime
  }
  sessionDurationHours={
    lastSession?.durationHours
  }
  burners={
    burnerNames
  }
  estimatedGasKg={
    lastSession?.estimatedGasUsedKg
  }
  onCancel={() =>
    setWeightDialogOpen(false)
  }
  onSave={saveWeight}
/>

<Dialog
  open={calibrationDialogOpen}
  onClose={() =>
    setCalibrationDialogOpen(false)
  }
>
  <DialogTitle>
    Update Equipment Calibration?
  </DialogTitle>

  <DialogContent>
    <Typography>
      The measured gas consumption differs from
      the configured consumption by{" "}
      {Math.abs(
        calibrationDeviationForDisplay
      ).toFixed(1)}
      %.
    </Typography>

    <Typography sx={{ mt: 2 }}>
      Recommended value:
    </Typography>

    <Typography variant="h6">
      {recommendedKgPerHourForDisplay !== null
        ? `${recommendedKgPerHourForDisplay.toFixed(
            3
          )} kg/h`
        : "--"}
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => {
        EquipmentService.handleCalibrationRecommendation(
          learning.completedCylinders
        );
        setCalibrationDialogOpen(false);
      }}
    >
      Keep Current
    </Button>

    <Button
  variant="contained"
  onClick={() => {
    if (
      analysis.calibrationFactor > 0
    ) {
      EquipmentService.applyCalibration(
        analysis.calibrationFactor
      );
    }

    setCalibrationDialogOpen(false);
  }}
>
  Update
</Button>

  </DialogActions>
</Dialog>

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
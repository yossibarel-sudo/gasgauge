import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import WeightDialog from "../components/WeightDialog";
import { InstallationService } from "../services/InstallationService";
import { AnalysisService } from "../services/AnalysisService";
import { EquipmentService } from "../services/EquipmentService";
import { MeasurementService } from "../services/MeasurementService";
import { useState } from "react";

import type { Measurement } from "../models/Measurement";

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

interface MeasurementsPageProps {
  onBack: () => void;
}

export default function MeasurementsPage({
  onBack,
}: MeasurementsPageProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>(
    () => MeasurementService.load()
  );

  const [weightDialogOpen, setWeightDialogOpen] =
  useState(false);

  function deleteMeasurement(id: string) {
    if (
      !window.confirm(
        "Delete this measurement?"
      )
    ) {
      return;
    }

    MeasurementService.delete(id);

    setMeasurements(MeasurementService.load());
  }

function saveManualWeight(weight: number) {

  const installation =
    InstallationService.load();

  const updatedInstallation = {
    ...installation,
    currentGrossWeightKg: weight,
  };

  InstallationService.save(
    updatedInstallation
  );

  const analysis =
    AnalysisService.analyze(
      updatedInstallation,
      EquipmentService.load(),
      MeasurementService.load()
    );

  const measurement: Measurement = {

    id: crypto.randomUUID(),

    installationId:
      installation.id,

    date:
      new Date(),

    grossWeightKg:
      weight,

    remainingLpgKg:
      analysis.remainingLpgKg,

    remainingPercent:
      analysis.remainingPercent,

  };

  MeasurementService.save(
    measurement
  );

  setMeasurements(
    MeasurementService.load()
  );

  setWeightDialogOpen(false);

}

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
      >
        Measurement History
      </Typography>

      <Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    mb: 2,
  }}
>
  <Button
    variant="contained"
    onClick={() =>
      setWeightDialogOpen(true)
    }
  >
    Add Manual Measurement
  </Button>
</Box>

      <Card>
        <CardContent>
          {measurements.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 4 }}
            >
              No measurements have been recorded yet.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">
                    Weight (kg)
                  </TableCell>
                  <TableCell align="right">
                    LPG Remaining (kg)
                  </TableCell>
                  <TableCell align="right">
                    Remaining %
                  </TableCell>
                  <TableCell align="center">
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {measurements.map(
                  (measurement) => (
                    <TableRow key={measurement.id}>
                      <TableCell>
                        {formatDate(
                          measurement.date
                        )}
                      </TableCell>

                      <TableCell align="right">
                        {measurement.grossWeightKg.toFixed(
                          2
                        )}
                      </TableCell>

                      <TableCell align="right">
                        {measurement.remainingLpgKg.toFixed(
                          2
                        )}
                      </TableCell>

                      <TableCell align="right">
                        {measurement.remainingPercent.toFixed(
                          0
                        )}
                        %
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() =>
                            deleteMeasurement(measurement.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={onBack}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>

      <WeightDialog
  open={weightDialogOpen}
  previousWeight={
    InstallationService.load().currentGrossWeightKg
  }
  currentWeight={
    InstallationService.load().currentGrossWeightKg
  }
  onCancel={() =>
    setWeightDialogOpen(false)
  }
  onSave={saveManualWeight}
/>
    </Box>
  );
}
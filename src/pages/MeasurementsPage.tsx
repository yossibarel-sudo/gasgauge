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
    </Box>
  );
}
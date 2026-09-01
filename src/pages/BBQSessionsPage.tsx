import { useState } from "react";

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

import BBQSessionDialog from "../components/BBQSessionDialog";
import WeightDialog from "../components/WeightDialog";

import { BBQSessionService } from "../services/BBQSessionService";
import { InstallationService } from "../services/InstallationService";
import { MeasurementService } from "../services/MeasurementService";
import { AnalysisService } from "../services/AnalysisService";
import { EquipmentService } from "../services/EquipmentService";
import { LearningService } from "../services/LearningService";

import type { BBQSession } from "../models/BBQSession";
import type { Measurement } from "../models/Measurement";



interface BBQSessionsPageProps {

  onBack: () => void;

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



export default function BBQSessionsPage({

  onBack,

}: BBQSessionsPageProps) {



  const installation =
    InstallationService.load();



  const [
    sessions,
    setSessions,
  ] =
    useState<BBQSession[]>(
      () =>
        BBQSessionService
          .loadForInstallation(
            installation.id
          )
    );



  const [
    dialogOpen,
    setDialogOpen,
  ] =
    useState(false);

  const [pendingSession, setPendingSession] =
    useState<BBQSession | null>(null);

  const [weightDialogOpen, setWeightDialogOpen] =
    useState(false);




  function saveSession(
    session: BBQSession
  ) {
    setDialogOpen(false);
    setPendingSession(session);
    setWeightDialogOpen(true);
  }

  function saveSessionWeight(weight: number) {
    if (!pendingSession) {
      return;
    }

    const currentInstallation = InstallationService.load();
    
    const updatedInstallation = {
      ...currentInstallation,
      currentGrossWeightKg: weight,
    };

    const completedSession: BBQSession = {
      ...pendingSession,
       };

    BBQSessionService.save(completedSession);

    setSessions(
      BBQSessionService.loadForInstallation(
        currentInstallation.id
      )
    );

    InstallationService.save(updatedInstallation);

    const analysis = AnalysisService.analyze(
      updatedInstallation,
      EquipmentService.load(),
      MeasurementService.load()
    );

    const measurement: Measurement = {
      id: crypto.randomUUID(),
      installationId: currentInstallation.id,
      date: new Date(),
      grossWeightKg: weight,
      remainingLpgKg: analysis.remainingLpgKg,
      remainingPercent: analysis.remainingPercent,
      bbqRelated: true,
      measurementType: "BBQ_MANUAL",
      notes: "Manual BBQ session measurement",
    };

    const previousMeasurement = MeasurementService.latestBefore(
      currentInstallation.id,
      measurement.date
    );

    MeasurementService.save(measurement);

    if (previousMeasurement) {
      LearningService.learnFromMeasurements(
        previousMeasurement,
        measurement
      );
    }

    setPendingSession(null);
    setWeightDialogOpen(false);
  }




  function deleteSession(
    id: string
  ) {

    if (
      !window.confirm(
        "Delete this BBQ session?"
      )
    ) {

      return;

    }


    BBQSessionService.delete(
      id
    );


    setSessions(
      BBQSessionService
        .loadForInstallation(
          installation.id
        )
    );

  }




  return (

    <Box
      sx={{
        maxWidth:900,
        mx:"auto",
        mt:4,
      }}
    >


      <Typography
        variant="h4"
        gutterBottom
      >
        BBQ Sessions
      </Typography>



      <Card>

        <CardContent>


          <Box
            sx={{
              display:"flex",
              justifyContent:"flex-end",
              mb:2,
            }}
          >

            <Button
              variant="contained"
              onClick={() =>
                setDialogOpen(true)
              }
            >
              Add BBQ Session
            </Button>

          </Box>




          {
            sessions.length === 0 ? (

              <Typography
                color="text.secondary"
                sx={{py:4}}
              >
                No BBQ sessions recorded yet.
              </Typography>


            ) : (


              <Table>


                <TableHead>

                  <TableRow>

                    <TableCell>
                      Date
                    </TableCell>


                    <TableCell align="right">
                      Duration (h)
                    </TableCell>


                    <TableCell>
                      Notes
                    </TableCell>


                    <TableCell align="center">
                      Delete
                    </TableCell>


                  </TableRow>


                </TableHead>



                <TableBody>


                  {
                    sessions.map(
                      (session) => (

                        <TableRow
                          key={
                            session.id
                          }
                        >


                          <TableCell>

                            {
                              formatDate(
                                session.date
                              )
                            }

                          </TableCell>



                          <TableCell align="right">

                            {
                              session.durationHours
                                .toFixed(2)
                            }

                          </TableCell>



                          <TableCell>

                            {
                              session.notes || "-"
                            }

                          </TableCell>



                          <TableCell align="center">

                            <IconButton

                              color="error"

                              onClick={() =>
                                deleteSession(
                                  session.id
                                )
                              }

                            >

                              <DeleteIcon />

                            </IconButton>


                          </TableCell>


                        </TableRow>

                      )
                    )
                  }


                </TableBody>


              </Table>


            )
          }




          <Box
            sx={{
              display:"flex",
              justifyContent:"flex-end",
              mt:3,
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





      <BBQSessionDialog
        key={dialogOpen ? "bbq-open" : "bbq-closed"}
        open={dialogOpen}

        installationId={
          installation.id
        }

        onCancel={() =>
          setDialogOpen(false)
        }

        onSave={
          saveSession
        }

      />

      <WeightDialog
        key={pendingSession?.id ?? "weight-closed"}
        open={weightDialogOpen}
        previousWeight={installation.currentGrossWeightKg}
        currentWeight={installation.currentGrossWeightKg}
        sessionDate={pendingSession?.date}
        sessionDurationHours={pendingSession?.durationHours}
        burners={
          pendingSession?.burnerIds
            .map((id) =>
              EquipmentService.load().burners.find(
                (burner) => burner.id === id
              )?.name ?? `#${id}`
            )
            .join(", ")
        }
        estimatedGasKg={pendingSession?.estimatedGasUsedKg}
        onCancel={() => {
          setWeightDialogOpen(false);
          setPendingSession(null);
        }}
        onSave={saveSessionWeight}
      />


    </Box>

  );

}
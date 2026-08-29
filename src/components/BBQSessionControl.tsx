import { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";

import { BBQSessionService } from "../services/BBQSessionService";
import { EquipmentService } from "../services/EquipmentService";

import type { BBQSession } from "../models/BBQSession";

interface Props {
  installationId: string;
 onSessionFinished: (
  session: BBQSession
) => void;
 
}

export default function BBQSessionControl({
  installationId,
  onSessionFinished,
}: Props) {

  const [activeSession, setActiveSession] =
    useState<BBQSession | null>(
      BBQSessionService.getActiveSession()
    );

  const [burnerIds, setBurnerIds] =
    useState<number[]>(
      BBQSessionService.getActiveSession()?.burnerIds ?? []
    );

  const [currentTime, setCurrentTime] =
    useState(() => Date.now());

  const equipment =
    EquipmentService.load();

  useEffect(() => {

    if (!activeSession) {
      return;
    }

    const timer =
      setInterval(() => {

        setCurrentTime(Date.now());

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [activeSession]);

  function elapsedHours(): number {

    if (!activeSession?.startTime) {
      return 0;
    }

    return (
      currentTime -
      activeSession.startTime.getTime()
    ) / (1000 * 60 * 60);

  }

  function startSession() {

    const session =
      BBQSessionService.startSession(
        installationId
      );

    setBurnerIds(session.burnerIds);

    setActiveSession(session);

  }

  function finishSession() {

  const session =
    BBQSessionService.finishSession(
      burnerIds
    );

  setActiveSession(null);

  if (session) {
    onSessionFinished(session);
  }

}

  const selectedKgPerHour =
    equipment.burners
      .filter(burner => burnerIds.includes(burner.id))
      .reduce(
        (sum, burner) =>
          sum + burner.calculatedKgPerHour,
        0
      );

  const estimatedGas =
    selectedKgPerHour *
    elapsedHours();

  return (

    <Paper
      sx={{
        p: 2,
        mb: 3,
      }}
    >

      <Typography
        variant="h6"
        gutterBottom
      >
        BBQ Session
      </Typography>

      {
        !activeSession ? (

          <Button
            fullWidth
            variant="contained"
            onClick={startSession}
          >
            Start Cooking
          </Button>

        ) : (

          <>

            <Typography sx={{ mb: 2 }}>
              Running: {elapsedHours().toFixed(2)} h
            </Typography>

            <Typography sx={{ mb: 2 }}>
              Estimated LPG: {estimatedGas.toFixed(2)} kg
            </Typography>

            <FormGroup sx={{ mb: 2 }}>

              {equipment.burners.map((burner) => (

                <FormControlLabel
                  key={burner.id}
                  label={burner.name}
                  control={

                    <Checkbox
                      checked={burnerIds.includes(
                        burner.id
                      )}
                      onChange={(e) => {

                        const nextBurnerIds = e.target.checked
                          ? [...burnerIds, burner.id]
                          : burnerIds.filter(
                              id => id !== burner.id
                            );

                        setBurnerIds(nextBurnerIds);
                        BBQSessionService.updateActiveBurners(
                          nextBurnerIds
                        );

                      }}
                    />

                  }
                />

              ))}

            </FormGroup>

            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={finishSession}
            >
              Finish Cooking
            </Button>

          </>

        )
      }

    </Paper>

  );

}
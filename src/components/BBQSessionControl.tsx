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
import type { AnalysisResult } from "../services/AnalysisService";

interface Props {
  installationId: string;
  analysis: AnalysisResult;
  onSessionFinished: () => void;
}

export default function BBQSessionControl({
  installationId,
  analysis,
  onSessionFinished,
}: Props) {

  const [activeSession, setActiveSession] =
    useState<BBQSession | null>(
      BBQSessionService.getActiveSession()
    );

  const [burnerIds, setBurnerIds] =
    useState<number[]>([]);

  const [, forceRefresh] =
    useState(0);

  const equipment =
    EquipmentService.load();

  useEffect(() => {

    if (!activeSession) {
      return;
    }

    const timer =
      setInterval(() => {

        forceRefresh(
          value => value + 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [activeSession]);

  function elapsedHours(): number {

    if (!activeSession?.startTime) {
      return 0;
    }

    return (
      Date.now() -
      activeSession.startTime.getTime()
    ) / (1000 * 60 * 60);

  }

  function startSession() {

    const session =
      BBQSessionService.startSession(
        installationId
      );

    setBurnerIds([]);

    setActiveSession(session);

  }

  function finishSession() {

    if (burnerIds.length === 0) {
      alert("Select at least one burner.");
      return;
    }

    BBQSessionService.finishSession(
      burnerIds
    );

    setActiveSession(null);

    setBurnerIds([]);

    onSessionFinished();

  }

  const estimatedGas =
    analysis.effectiveKgPerHour != null
      ? analysis.effectiveKgPerHour *
        elapsedHours()
      : 0;

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

                        if (e.target.checked) {

                          setBurnerIds([
                            ...burnerIds,
                            burner.id,
                          ]);

                        } else {

                          setBurnerIds(
                            burnerIds.filter(
                              id => id !== burner.id
                            )
                          );

                        }

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
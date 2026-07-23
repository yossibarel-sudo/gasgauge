import { useEffect, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AnalysisService } from "../services/AnalysisService";
import { EquipmentService } from "../services/EquipmentService";
import type { Installation } from "../models/Installation";

import { BBQSessionService } from "../services/BBQSessionService";


interface BBQSessionControlProps {
  installation: Installation;
  onSessionFinished?: () => void;
}



function formatElapsed(
  startTime: Date
): string {

  const seconds =
    Math.floor(
      (
        Date.now()
        -
        startTime.getTime()
      )
      /
      1000
    );


  const hours =
    Math.floor(
      seconds / 3600
    );


  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );


  const secs =
    seconds % 60;


  return (
    `${String(hours).padStart(2,"0")}:` +
    `${String(minutes).padStart(2,"0")}:` +
    `${String(secs).padStart(2,"0")}`
  );

}




export default function BBQSessionControl({
  installation,
  onSessionFinished,
}: BBQSessionControlProps) {


  const [activeSession, setActiveSession] =
    useState(
      () =>
        BBQSessionService.getActiveSession()
    );


  const [elapsed, setElapsed] =
    useState("00:00:00");


  const [burnersUsed, setBurnersUsed] =
    useState(1);

const equipment = EquipmentService.load();

const analysis = AnalysisService.analyze(
  installation,
  equipment,
  []
);

const estimatedGasUsed =
  activeSession &&
  analysis.effectiveKgPerHour !== null
    ? analysis.effectiveKgPerHour *
      (
        (Date.now() -
          activeSession.startTime!.getTime()) /
        (1000 * 60 * 60)
      )
    : 0;

const estimatedRemaining =
  Math.max(
    0,
    analysis.remainingLpgKg -
      estimatedGasUsed
  );

const estimatedRemainingHours =
  analysis.effectiveKgPerHour !== null &&
  analysis.effectiveKgPerHour > 0
    ? estimatedRemaining /
      analysis.effectiveKgPerHour
    : null;

  useEffect(() => {


    if (!activeSession) {

      setElapsed(
        "00:00:00"
      );

      return;

    }



    const timer =
      setInterval(() => {


        if (
          activeSession.startTime
        ) {

          setElapsed(
            formatElapsed(
              activeSession.startTime
            )
          );

        }


      },1000);



    return () =>
      clearInterval(timer);



  },[activeSession]);






  function startBBQ() {


    const session =
      BBQSessionService.startSession(
        installation.id
      );


    setActiveSession(
      session
    );

  }






  function stopBBQ() {


    BBQSessionService.finishSession(
      burnersUsed
    );


    setActiveSession(
      null
    );


    setElapsed(
      "00:00:00"
    );
    onSessionFinished?.();

  }






  return (

    <Paper
      sx={{
        p:2,
        mb:3,
      }}
    >

      {
        !activeSession

        ?

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={
            startBBQ
          }
        >
          🔥 Start BBQ
        </Button>


        :


        <Box>


          <Typography
            variant="h6"
          >
            🔥 BBQ Running
          </Typography>



          <Typography
            sx={{
              my:2,
              fontSize:24,
            }}
          >
            {elapsed}
          </Typography>

<Typography>
  Estimated gas used:
  {" "}
  {estimatedGasUsed.toFixed(2)} kg
</Typography>

<Typography
  sx={{
    mb:2,
  }}
>
  Estimated remaining:
  {" "}
  {estimatedRemaining.toFixed(2)} kg
</Typography>

<Typography sx={{ mb: 2 }}>
  Estimated cooking time left:
  {" "}
  {
    estimatedRemainingHours !== null
      ? `${estimatedRemainingHours.toFixed(1)} h`
      : "--"
  }
</Typography>

          <Box
            sx={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              gap:2,
              mb:2,
            }}
          >

            <IconButton
              onClick={() =>
                setBurnersUsed(
                  Math.max(
                    1,
                    burnersUsed - 1
                  )
                )
              }
            >
              <RemoveIcon/>
            </IconButton>



            <Typography
              variant="h6"
            >
              {burnersUsed}
              {" burners"}
            </Typography>



            <IconButton
              onClick={() =>
                setBurnersUsed(
                  Math.min(
                    6,
                    burnersUsed + 1
                  )
                )
              }
            >
              <AddIcon/>
            </IconButton>


          </Box>




          <Button
            fullWidth
            color="error"
            variant="contained"
            onClick={
              stopBBQ
            }
          >
            Stop BBQ
          </Button>


        </Box>

      }


    </Paper>

  );

}
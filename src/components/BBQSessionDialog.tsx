import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import type { BBQSession } from "../models/BBQSession";


interface BBQSessionDialogProps {

  open: boolean;

  installationId: string;

  session?: BBQSession | null;

  onCancel: () => void;

  onSave: (session: BBQSession) => void;

}



function createDefaultSession(
  installationId: string
): BBQSession {

  return {

    id: crypto.randomUUID(),

    installationId,

    date: new Date(),

    durationHours: 1,

    notes: "",

  };

}



export default function BBQSessionDialog({

  open,

  installationId,

  session,

  onCancel,

  onSave,

}: BBQSessionDialogProps) {


  const [
    editedSession,
    setEditedSession,
  ] =
    useState<BBQSession>(
      createDefaultSession(
        installationId
      )
    );



  useEffect(() => {

    if (session) {

      setEditedSession(session);

    } else {

      setEditedSession(
        createDefaultSession(
          installationId
        )
      );

    }

  }, [
    session,
    installationId,
    open,
  ]);




  function updateSession(
    changes: Partial<BBQSession>
  ) {

    setEditedSession({

      ...editedSession,

      ...changes,

    });

  }



  return (

    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>
        Add BBQ Session
      </DialogTitle>



      <DialogContent>


        <TextField

          fullWidth

          margin="normal"

          label="Date"

          type="date"

          value={
            editedSession.date
              .toISOString()
              .split("T")[0]
          }

          onChange={(e) =>
            updateSession({

              date:
                new Date(
                  e.target.value
                ),

            })
          }

          slotProps={{
            inputLabel:{
              shrink:true,
            },
          }}

        />



        <TextField

          fullWidth

          margin="normal"

          label="Duration (hours)"

          type="number"

          slotProps={{
  htmlInput: {
    step: 0.25,
    min: 0,
  },
}}

          value={
            editedSession.durationHours
          }

          onChange={(e) =>
            updateSession({

              durationHours:
                Number(
                  e.target.value
                ),

            })
          }

        />



        <TextField

          fullWidth

          margin="normal"

          label="Notes"

          multiline

          rows={3}

          value={
            editedSession.notes ?? ""
          }

          onChange={(e) =>
            updateSession({

              notes:
                e.target.value,

            })
          }

        />


      </DialogContent>



      <DialogActions>


        <Button
          onClick={onCancel}
        >
          Cancel
        </Button>



        <Button

          variant="contained"

          onClick={() =>
            onSave(
              editedSession
            )
          }

        >
          Save

        </Button>


      </DialogActions>


    </Dialog>

  );

}
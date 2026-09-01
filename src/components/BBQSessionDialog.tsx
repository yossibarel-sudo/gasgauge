import { useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";

import type { BBQSession } from "../models/BBQSession";
import { EquipmentService } from "../services/EquipmentService";

interface BBQSessionDialogProps {
  open: boolean;
  installationId: string;
  session?: BBQSession | null;
  onCancel: () => void;
  onSave: (session: BBQSession) => void;
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calculateEstimatedGasUsed(
  session: BBQSession
): number {
  const equipment = EquipmentService.load();

  const kgPerHour = equipment.burners
    .filter((burner) =>
      session.burnerIds.includes(burner.id)
    )
    .reduce(
      (sum, burner) =>
        sum + burner.calculatedKgPerHour,
      0
    );

  const durationHours = Number.isFinite(
    session.durationHours
  )
    ? Math.max(0, session.durationHours)
    : 0;

  return kgPerHour * durationHours;
}

function createDefaultSession(
  installationId: string
): BBQSession {
  return {
    id: crypto.randomUUID(),
    installationId,
    date: new Date(),
    durationHours: 1,
    burnerIds: [],
    estimatedGasUsedKg: 0,
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
  const [editedSession, setEditedSession] =
    useState<BBQSession>(() =>
      session ?? createDefaultSession(installationId)
    );

  const equipment = EquipmentService.load();

  function updateSession(
    changes: Partial<BBQSession>
  ) {
    setEditedSession((current) => {
      const updated = {
        ...current,
        ...changes,
      };

      return {
        ...updated,
        estimatedGasUsedKg:
          calculateEstimatedGasUsed(updated),
      };
    });
  }

  const canSave =
    editedSession.burnerIds.length > 0 &&
    Number.isFinite(editedSession.durationHours) &&
    editedSession.durationHours > 0;

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
          value={toDateInputValue(editedSession.date)}
          onChange={(e) =>
            updateSession({
              date: parseDateInput(e.target.value),
            })
          }
          slotProps={{
            inputLabel: {
              shrink: true,
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
              min: 0.01,
            },
          }}
          value={editedSession.durationHours || ""}
          onChange={(e) =>
            updateSession({
              durationHours:
                e.target.value === ""
                  ? 0
                  : Number(e.target.value),
            })
          }
        />

        <Typography
          variant="subtitle1"
          sx={{ mt: 2, fontWeight: "bold" }}
        >
          Burners Used
        </Typography>

        <FormGroup>
          {equipment.burners.map((burner) => (
            <FormControlLabel
              key={burner.id}
              label={burner.name}
              control={
                <Checkbox
                  checked={editedSession.burnerIds.includes(
                    burner.id
                  )}
                  onChange={(e) => {
                    const nextBurnerIds = e.target.checked
                      ? [
                          ...editedSession.burnerIds,
                          burner.id,
                        ]
                      : editedSession.burnerIds.filter(
                          (id) => id !== burner.id
                        );

                    updateSession({
                      burnerIds: nextBurnerIds,
                    });
                  }}
                />
              }
            />
          ))}
        </FormGroup>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Estimated LPG: {editedSession.estimatedGasUsedKg.toFixed(2)} kg
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Notes"
          multiline
          rows={3}
          value={editedSession.notes ?? ""}
          onChange={(e) =>
            updateSession({
              notes: e.target.value,
            })
          }
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!canSave}
          onClick={() => onSave(editedSession)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

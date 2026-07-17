import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import type { Installation } from "../models/Installation";

interface InstallationDialogProps {
  open: boolean;
  installation: Installation;
  onCancel: () => void;
  onSave: (installation: Installation) => void;
}

export default function InstallationDialog({
  open,
  installation,
  onCancel,
  onSave,
}: InstallationDialogProps) {
  const [editedInstallation, setEditedInstallation] =
    useState<Installation>(installation);

  useEffect(() => {
    setEditedInstallation(installation);
  }, [installation]);

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Install New Cylinder</DialogTitle>

      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Installation Date"
          type="date"
          value={editedInstallation.installDate
            .toISOString()
            .split("T")[0]}
          onChange={(e) =>
            setEditedInstallation({
              ...editedInstallation,
              installDate: new Date(e.target.value),
            })
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Cylinder Capacity (kg)"
          type="number"
          value={editedInstallation.cylinderCapacityKg}
          onChange={(e) =>
            setEditedInstallation({
              ...editedInstallation,
              cylinderCapacityKg: Number(e.target.value),
            })
          }
        />

        <TextField
          margin="normal"
          fullWidth
          label="Empty Cylinder Weight (kg)"
          type="number"
          value={editedInstallation.emptyCylinderWeightKg}
          onChange={(e) =>
            setEditedInstallation({
              ...editedInstallation,
              emptyCylinderWeightKg: Number(e.target.value),
            })
          }
        />

        <TextField
          margin="normal"
          fullWidth
          label="Initial Gross Weight (kg)"
          type="number"
          value={editedInstallation.initialGrossWeightKg}
          onChange={(e) =>
            setEditedInstallation({
              ...editedInstallation,
              initialGrossWeightKg: Number(e.target.value),
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
          onClick={() => onSave(editedInstallation)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { EquipmentService } from "../services/EquipmentService";
import type { Burner, BurnerUnit, Equipment } from "../models/Equipment";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment>(
  () => EquipmentService.load()
);

  const updateEquipment = (
    field: keyof Equipment,
    value: string | number
  ) => {
    setEquipment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBurner = (
    index: number,
    field: keyof Burner,
    value: string | number
  ) => {
    const burners = [...equipment.burners];

    burners[index] = {
      ...burners[index],
      [field]: value,
    };

    setEquipment({
      ...equipment,
      burners,
    });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Equipment Setup
      </Typography>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            margin="normal"
            label="Manufacturer"
            value={equipment.manufacturer}
            onChange={(e) =>
              updateEquipment("manufacturer", e.target.value)
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Model"
            value={equipment.model}
            onChange={(e) =>
              updateEquipment("model", e.target.value)
            }
          />

          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Default Session Duration (minutes)"
            value={equipment.defaultSessionDurationMinutes}
            onChange={(e) =>
              updateEquipment(
                "defaultSessionDurationMinutes",
                Number(e.target.value)
              )
            }
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Burners
          </Typography>

          {equipment.burners.map((burner, index) => (
            <Card
              key={burner.id}
              variant="outlined"
              sx={{ mb: 2, p: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Burner {burner.id}
              </Typography>

              <TextField
                fullWidth
                margin="normal"
                label="Name"
                value={burner.name}
                onChange={(e) =>
                  updateBurner(index, "name", e.target.value)
                }
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  type="number"
                  label="Value"
                  value={burner.value}
                  onChange={(e) =>
                    updateBurner(index, "value", Number(e.target.value))
                  }
                />

                <TextField
                  select
                  label="Unit"
                  value={burner.unit}
                  onChange={(e) =>
                    updateBurner(
                      index,
                      "unit",
                      e.target.value as BurnerUnit
                    )
                  }
                >
                  {["W", "kW", "BTU/h", "kg/h", "g/h"].map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Card>
          ))}

          <Button
  variant="contained"
  size="large"
  sx={{ mt: 2 }}
  onClick={() => {
    EquipmentService.save(equipment);
    alert("Equipment saved successfully.");
  }}
>
  Save
</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { EquipmentService } from "../services/EquipmentService";

import type {
  Burner,
  BurnerUnit,
  Equipment,
} from "../models/Equipment";

interface EquipmentPageProps {
  onBack: () => void;
}

export default function EquipmentPage({
  onBack,
}: EquipmentPageProps) {
  const [equipment, setEquipment] =
    useState<Equipment>(
      () => EquipmentService.load()
    );

  const [saved, setSaved] =
    useState(false);

  function updateEquipment(
    field: keyof Equipment,
    value: string | number
  ) {
    setEquipment((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateBurner(
    index: number,
    field: keyof Burner,
    value: string | number
  ) {
    const burners = [...equipment.burners];

    burners[index] = {
      ...burners[index],
      [field]: value,
    };

    setEquipment({
      ...equipment,
      burners,
    });
  }

  function addBurner() {
    if (equipment.burners.length >= 6) {
      return;
    }

    const burnerNumber =
      equipment.burners.length + 1;

    const newBurner: Burner = {
      id: burnerNumber,
      name: `Main Burner ${burnerNumber}`,
      value: 3.5,
      unit: "kW",
      calculatedKgPerHour: 0.255,
    };

    setEquipment({
      ...equipment,
      burners: [
        ...equipment.burners,
        newBurner,
      ],
    });
  }

  function removeBurner(id: number) {
    if (equipment.burners.length <= 1) {
      return;
    }

    setEquipment({
      ...equipment,
      burners:
        equipment.burners.filter(
          (burner) =>
            burner.id !== id
        ),
    });
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
              updateEquipment(
                "manufacturer",
                e.target.value
              )
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Model"
            value={equipment.model}
            onChange={(e) =>
              updateEquipment(
                "model",
                e.target.value
              )
            }
          />

          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Default Session Duration (minutes)"
            value={
              equipment.defaultSessionDurationMinutes
            }
            onChange={(e) =>
              updateEquipment(
                "defaultSessionDurationMinutes",
                Number(e.target.value)
              )
            }
          />

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Burners
          </Typography>

          {equipment.burners.map(
            (burner, index) => (
              <Card
                key={burner.id}
                variant="outlined"
                sx={{
                  mb: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                  >
                    Burner {burner.id}
                  </Typography>

                  {equipment.burners.length >
                    1 && (
                    <Button
                      color="error"
                      onClick={() =>
                        removeBurner(
                          burner.id
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </Box>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  value={burner.name}
                  onChange={(e) =>
                    updateBurner(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <TextField
                    type="number"
                    label="Value"
                    value={burner.value}
                    onChange={(e) =>
                      updateBurner(
                        index,
                        "value",
                        Number(
                          e.target.value
                        )
                      )
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
                        e.target
                          .value as BurnerUnit
                      )
                    }
                  >
                    {[
                      "W",
                      "kW",
                      "BTU/h",
                      "kg/h",
                      "g/h",
                    ].map((unit) => (
                      <MenuItem
                        key={unit}
                        value={unit}
                      >
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>

                </Box>

              </Card>
            )
          )}
                    <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              mb: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={addBurner}
              disabled={
                equipment.burners.length >= 6
              }
            >
              Add Burner
            </Button>

            <Typography
              color="text.secondary"
              sx={{ alignSelf: "center" }}
            >
              {equipment.burners.length} / 6 burners
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={onBack}
            >
              Back to Dashboard
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                EquipmentService.save(
                  equipment
                );
                setSaved(true);
              }}
            >
              Save
            </Button>
          </Box>

        </CardContent>
      </Card>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() =>
          setSaved(false)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setSaved(false)
          }
        >
          Equipment saved successfully.
        </Alert>
      </Snackbar>

    </Box>
  );
}
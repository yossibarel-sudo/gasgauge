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

import type {
  Burner,
  BurnerUnit,
  Equipment,
} from "../models/Equipment";

import { EquipmentService } from "../services/EquipmentService";
import { BurnerCalculationService } from "../services/BurnerCalculationService";


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

    setEquipment({
      ...equipment,
      [field]: value,
    });

  }



  function updateBurner(
    index: number,
    field: keyof Burner,
    value: string | number
  ) {

    const burners =
      [...equipment.burners];


    const updatedBurner: Burner =
    {
      ...burners[index],
      [field]: value,
    };


    updatedBurner.calculatedKgPerHour =
      BurnerCalculationService.calculateKgPerHour(
        Number(updatedBurner.value),
        updatedBurner.unit
      );


    burners[index] =
      updatedBurner;


    setEquipment({

      ...equipment,

      burners,

    });

  }




  function addBurner() {

    if (
      equipment.burners.length >= 6
    ) {
      return;
    }


    const id =
      equipment.burners.length + 1;


    const newBurner: Burner =
    {
      id,

      name:
        `Main Burner ${id}`,

      value:
        3.5,

      unit:
        "kW",

      calculatedKgPerHour:
        BurnerCalculationService.calculateKgPerHour(
          3.5,
          "kW"
        ),
    };


    setEquipment({

      ...equipment,

      burners:
      [
        ...equipment.burners,
        newBurner,
      ],

    });

  }





  function removeBurner(
    id: number
  ) {

    if (
      equipment.burners.length <= 1
    ) {
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



  function saveEquipment() {

    EquipmentService.save(
      equipment
    );

    setSaved(true);

  }



  return (

    <Box

      sx={{
        maxWidth:700,
        mx:"auto",
        mt:3,
        px:2,
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
            value={
              equipment.manufacturer
            }
            onChange={(e)=>
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
            value={
              equipment.model
            }
            onChange={(e)=>
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
            onChange={(e)=>
              updateEquipment(
                "defaultSessionDurationMinutes",
                Number(e.target.value)
              )
            }
          />



          <Divider
            sx={{
              my:3,
            }}
          />



          <Typography
            variant="h6"
          >
            Burners
          </Typography>
                    {
            equipment.burners.map(
              (burner, index) => (

                <Card
                  key={burner.id}
                  variant="outlined"
                  sx={{
                    mt:2,
                    p:2,
                  }}
                >

                  <Box
                    sx={{
                      display:"flex",
                      justifyContent:"space-between",
                      alignItems:"center",
                    }}
                  >

                    <Typography
                      variant="subtitle1"
                    >
                      Burner {burner.id}
                    </Typography>


                    {
                      equipment.burners.length > 1 && (

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

                      )
                    }

                  </Box>



                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={
                      burner.name
                    }
                    onChange={(e)=>
                      updateBurner(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                  />



                  <Box
                    sx={{
                      display:"flex",
                      gap:2,
                    }}
                  >

                    <TextField
                      fullWidth
                      type="number"
                      label="Value"
                      value={
                        burner.value
                      }
                      onChange={(e)=>
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
                      fullWidth
                      select
                      label="Unit"
                      value={
                        burner.unit
                      }
                      onChange={(e)=>
                        updateBurner(
                          index,
                          "unit",
                          e.target.value as BurnerUnit
                        )
                      }
                    >

                      {
                        [
                          "W",
                          "kW",
                          "BTU/h",
                          "kg/h",
                          "g/h",
                        ].map(
                          (unit) => (

                            <MenuItem
                              key={unit}
                              value={unit}
                            >
                              {unit}
                            </MenuItem>

                          )
                        )
                      }

                    </TextField>


                  </Box>




                  <Typography
                    sx={{
                      mt:1,
                      fontWeight:"bold",
                    }}
                  >

                    Consumption:
                    {" "}
                    {
                      burner.calculatedKgPerHour.toFixed(3)
                    }
                    {" kg/h"}

                  </Typography>


                </Card>

              )
            )
          }





          <Box
            sx={{
              mt:3,
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
            }}
          >

            <Button
              variant="outlined"
              disabled={
                equipment.burners.length >= 6
              }
              onClick={
                addBurner
              }
            >
              Add Burner
            </Button>


            <Typography
              color="text.secondary"
            >
              {
                equipment.burners.length
              }
              /6 burners
            </Typography>


          </Box>




          <Divider
            sx={{
              my:3,
            }}
          />




          <Box
            sx={{
              display:"flex",
              justifyContent:"space-between",
            }}
          >

            <Button
              variant="outlined"
              onClick={
                onBack
              }
            >
              Back to Dashboard
            </Button>



            <Button
              variant="contained"
              onClick={
                saveEquipment
              }
            >
              Save
            </Button>


          </Box>



        </CardContent>

      </Card>




      <Snackbar
        open={
          saved
        }
        autoHideDuration={
          3000
        }
        onClose={() =>
          setSaved(false)
        }
      >

        <Alert
          severity="success"
          variant="filled"
        >
          Equipment saved successfully
        </Alert>


      </Snackbar>



    </Box>

  );

}
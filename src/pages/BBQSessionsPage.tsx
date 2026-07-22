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

import { BBQSessionService } from "../services/BBQSessionService";
import { InstallationService } from "../services/InstallationService";

import type { BBQSession } from "../models/BBQSession";



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




  function saveSession(
    session: BBQSession
  ) {

    BBQSessionService.save(
      session
    );


    setSessions(
      BBQSessionService
        .loadForInstallation(
          installation.id
        )
    );


    setDialogOpen(false);

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


    </Box>

  );

}
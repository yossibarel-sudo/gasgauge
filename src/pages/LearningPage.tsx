import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { LearningService } from "../services/LearningService";

function formatDate(date: Date): string {

  return date.toLocaleDateString();

}

interface Props {

  onBack: () => void;

}

export default function LearningPage({

  onBack,

}: Props) {

  const records =
    LearningService.load()
      .sort(
        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime()
      );

  return (

    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 4,
      }}
    >

      <Typography
        variant="h4"
        gutterBottom
      >
        Learning History
      </Typography>

      <Card>

        <CardContent>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>Date</TableCell>

                <TableCell align="right">
                  Gas (kg)
                </TableCell>

                <TableCell align="right">
                  Hours
                </TableCell>

                <TableCell align="right">
                  Actual kg/h
                </TableCell>

                <TableCell align="right">
                  Factor
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Reason
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {records.map(record => (

                <TableRow key={record.id}>

                  <TableCell>

                    {formatDate(
                      record.createdAt
                    )}

                  </TableCell>

                  <TableCell align="right">

                    {record.gasConsumedKg.toFixed(2)}

                  </TableCell>

                  <TableCell align="right">

                    {record.cookingHours.toFixed(2)}

                  </TableCell>

                  <TableCell align="right">

                    {record.actualKgPerHour.toFixed(2)}

                  </TableCell>

                  <TableCell align="right">

                    {record.correctionFactor.toFixed(2)}

                  </TableCell>

                  <TableCell>

                    <Chip

                      label={
                        record.ignored
                          ? "Ignored"
                          : "Accepted"
                      }

                      color={
                        record.ignored
                          ? "warning"
                          : "success"
                      }

                      size="small"

                    />

                  </TableCell>

                  <TableCell>

                    {record.ignoredReason ?? "-"}

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
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

    </Box>

  );

}
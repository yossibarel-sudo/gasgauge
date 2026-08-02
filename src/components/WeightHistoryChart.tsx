import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Measurement } from "../models/Measurement";

interface Props {
  measurements: Measurement[];
}

export default function WeightHistoryChart({
  measurements,
}: Props) {

  const data =
    [...measurements]
      .sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime()
      )
      .map(m => ({

        date:
  `${String(m.date.getDate()).padStart(2,"0")}/` +
  `${String(m.date.getMonth()+1).padStart(2,"0")}/` +
  `${m.date.getFullYear()}`,

        weight:
          Number(
            m.grossWeightKg.toFixed(2)
          ),

        remaining:
          Number(
            m.remainingLpgKg.toFixed(2)
          ),

      }));

  return (

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <LineChart data={data}>

        <CartesianGrid strokeDasharray="3 3"/>

        <XAxis dataKey="date"/>

        <YAxis/>

        <Tooltip/>

        <Line
          dataKey="weight"
          name="Cylinder Weight"
          stroke="#1976d2"
        />

      </LineChart>

    </ResponsiveContainer>

  );

}
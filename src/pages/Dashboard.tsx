import { defaultInstallation } from "../services/defaultInstallation";
import { calculateGas } from "../services/GasCalculationService";
export default function Dashboard() {
  const currentWeight = 22.0;

const gas = calculateGas({
    cylinderCapacityKg: defaultInstallation.cylinderCapacityKg,

    emptyCylinderWeightKg:
        defaultInstallation.emptyCylinderWeightKg,

    currentGrossWeightKg: currentWeight,

    averageConsumptionKgPerHour: 0.55,
});
  return (
    <div
      style={{
        width: "420px",
        background: "#1E1E1E",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 0 25px rgba(0,0,0,0.5)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#4CAF50",
          marginBottom: "5px",
        }}
      >
        GasGauge
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#B0B0B0",
          marginBottom: "30px",
        }}
      >
        Installed:
{
    defaultInstallation.installDate.toLocaleDateString()
}
      </p>

      <hr />

      <h2
        style={{
          textAlign: "center",
          color: "#E0E0E0",
          marginTop: "20px",
        }}
      >
        Remaining LPG
      </h2>

     <div style={{ textAlign: "center" }}>
      <h1
        style={{
         fontSize: "64px",
         color: "#4CAF50",
         marginBottom: "0px",
       }}
      >
       {gas.remainingPercent.toFixed(0)}%
      </h1>

    <div
        style={{
         color: "white",
         fontSize: "26px",
         marginTop: "15px",
       }}
     >
       {gas.remainingLpgKg.toFixed(2)} kg
     </div>

  <div
    style={{
      color: "#AAAAAA",
      fontSize: "16px",
      marginTop: "8px",
    }}
  >
    of {defaultInstallation.cylinderCapacityKg} kg
  </div>
</div>

      <hr />

      <table
        style={{
          width: "100%",
          color: "white",
          marginTop: "20px",
        }}
      >
        <tbody>
          <tr>
            <td>Remaining BBQ Sessions</td>
            <td align="right">{gas.remainingSessions.toFixed(1)}</td>
          </tr>

          <tr>
            <td>Cooking Hours</td>
            <td align="right">{gas.remainingHours.toFixed(1)}</td>
          </tr>

          <tr>
            <td>Status</td>
            <td
              align="right"
              style={{
                color: "#4CAF50",
                fontWeight: "bold",
              }}
            >
              {gas.status}
            </td>
          </tr>
        </tbody>
      </table>

      <button
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Add Cylinder Weight
      </button>
    </div>
  );
}
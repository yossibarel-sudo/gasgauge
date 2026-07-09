export default function Dashboard() {
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
        Smart LPG Monitor
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

      <h1
        style={{
          fontSize: "64px",
          textAlign: "center",
          margin: "10px",
          color: "#4CAF50",
        }}
      >
        72%
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "24px",
          color: "white",
        }}
      >
        8.64 kg
      </p>

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
            <td align="right">6</td>
          </tr>

          <tr>
            <td>Cooking Hours</td>
            <td align="right">13.2</td>
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
              GOOD
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
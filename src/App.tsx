import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Dashboard />
    </div>
  );
}

export default App;
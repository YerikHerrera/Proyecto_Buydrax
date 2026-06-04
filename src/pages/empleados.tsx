import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function empleados() {
  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "40px" }}>
          <h1>Empleados</h1>
        </main>
      </div>
    </div>
  );
}
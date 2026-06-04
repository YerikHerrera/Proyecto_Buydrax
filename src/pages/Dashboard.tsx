import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> 7f376fa (Resolver conflicto de merge en el Dashboard (estructura y layout principal))
import Card from "../components/ui/Card";

function Dashboard() {
  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ padding: "80px", flex: 1 }}>
          <h6>--BIENVENIDO/A--</h6>
          <h1>¡Bienvenido a Buydrax!</h1>

          <Card title="Ventas Totales">
            <p>$15,000</p>
          </Card>

          <Card title="Usuarios Activos">
            <p>250</p>
          </Card>

          <Card title="Pedidos">
            <p>1,200</p>
          </Card>
        </main>
<<<<<<< HEAD
>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> 7f376fa (Resolver conflicto de merge en el Dashboard (estructura y layout principal))
      </div>
    </div>
  );
}

export default Dashboard;
export default Dashboard;
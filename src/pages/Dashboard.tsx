import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
<<<<<<< HEAD
=======

>>>>>>> 009dea9 (Primer Commit del Proyecto)
import Card from "../components/ui/Card";

function Dashboard() {
  return (
    <div>
      <Navbar />

<<<<<<< HEAD
      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ padding: '80px', flex: 1, overflow: 'hidden' }}>
          <div style={{ color: "#1E3A8A" }}></div>
          <h6>--BIENVENIDO/A-- </h6>
          <h1>¡Bienvenido a Buydrax!</h1> 
           <Card title="Ventas Totales"><p>$15,000</p></Card>
            <Card title="Usuarios Activos"><p>250</p></Card>
            <Card title="Pedidos"><p>1,200</p></Card>
          <div style={{ display: 'flex', gap: '100px', marginTop: '250px' }}>
          </div>
        </main>

=======
      <div className="container">
        <Sidebar />

        <main>
          <h1>Dashboard</h1>

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
>>>>>>> 009dea9 (Primer Commit del Proyecto)
      </div>
    </div>
  );
}

export default Dashboard;
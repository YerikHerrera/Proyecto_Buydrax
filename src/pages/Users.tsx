import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

<<<<<<< HEAD
=======

import Sidebar from "../components/layout/Sidebar";



>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> 39b5048 (- Login: se reemplazó imagen de fondo, se ajustó layout visual del)
function Users() {
  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ padding: "100px", flex: 1 }}>
          <h1>Usuarios</h1>

          <table className="table table-striped table-hover mt-3">
            <thead className="table-dark">
<<<<<<< HEAD
=======
      <div className="container">
        <Sidebar />

        <main>
          <h1>Usuarios</h1>

          <table>
            <thead>
>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> 39b5048 (- Login: se reemplazó imagen de fondo, se ajustó layout visual del)
              <tr>
                <th>Nombre</th>
                <th>Rol</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Juan Pérez</td>
                <td>Admin</td>
              </tr>
              <tr>
                <td>María López</td>
                <td>Editor</td>
              </tr>
              <tr>
                <td>Carlos Ruiz</td>
                <td>Viewer</td>
              </tr>
<<<<<<< HEAD
=======

            <tbody>
             
>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> 39b5048 (- Login: se reemplazó imagen de fondo, se ajustó layout visual del)
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default Users;
import Navbar from "../components/layout/Navbar";
<<<<<<< HEAD
import Sidebar from "../components/layout/Sidebar";

=======

import Sidebar from "../components/layout/Sidebar";



>>>>>>> 009dea9 (Primer Commit del Proyecto)
function Users() {
  return (
    <div>
      <Navbar />

<<<<<<< HEAD
      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ padding: '100px', flex: 1 }}>
          <h1>Usuarios</h1>

          <table className="table table-striped table-hover mt-3">
            <thead className="table-dark">
=======
      <div className="container">
        <Sidebar />

        <main>
          <h1>Usuarios</h1>

          <table>
            <thead>
>>>>>>> 009dea9 (Primer Commit del Proyecto)
              <tr>
                <th>Nombre</th>
                <th>Rol</th>
              </tr>
            </thead>
<<<<<<< HEAD
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
=======

            <tbody>
             
>>>>>>> 009dea9 (Primer Commit del Proyecto)
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default Users;
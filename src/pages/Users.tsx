import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Users() {
  return (
    <div>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ padding: '100px', flex: 1 }}>
          <h1>Usuarios</h1>

          <table className="table table-striped table-hover mt-3">
            <thead className="table-dark">
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
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default Users;
<<<<<<< HEAD
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1E3A8A', padding: '0 20px' }}>
      <div className="container-fluid">

        {/* LOGO */}
        <a className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" href="#">
          <i className="bi bi-box"></i> Buydrax
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={false}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0" style={{ gap: '5px', fontSize: '13px' }}>
            <li className="nav-item">
              <a className="nav-link text-white d-flex align-items-center gap-1" href="#"
                style={{ borderBottom: '2px solid orange', paddingBottom: '4px' }}>
                <i className="bi bi-house-fill"></i> Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white d-flex align-items-center gap-1" href="#">
                <i className="bi bi-people-fill"></i> Empleados
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white d-flex align-items-center gap-1" href="#">
                <i className="bi bi-people-fill"></i> Proyectos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white d-flex align-items-center gap-1" href="#">
                <i className="bi bi-headset"></i> Asistencia
              </a>
            </li>
          </ul>
          
          <button className="btn text-white" type="button">
            <i className="bi bi-search fs-5"></i>
          </button>

        </div>
      </div>
    </nav>
  )
}
=======
function Navbar() {
  return (
    <nav className="navbar">
      <h2>Mi Aplicación</h2>
    </nav>
  );
}

export default Navbar;
>>>>>>> 009dea9 (Primer Commit del Proyecto)

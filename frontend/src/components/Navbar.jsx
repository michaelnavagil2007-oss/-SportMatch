import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">
        Sport<span>Match</span>
      </div>

      <nav>
        <a href="#inicio">Inicio</a>
        <a href="#servicios">Servicios</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <Link to="/login" className="login-btn">
        Iniciar sesión
      </Link>

    </header>
  )
}

export default Navbar
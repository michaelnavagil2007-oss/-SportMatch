
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const irASeccion = (seccion) => {
    if (location.pathname !== '/') {
      navigate('/')

      setTimeout(() => {
        document.getElementById(seccion)?.scrollIntoView({
          behavior: 'smooth'
        })
      }, 150)

      return
    }

    document.getElementById(seccion)?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <header className="navbar">

      <div className="logo">
        Sport<span>Match</span>
      </div>

      <nav>
        <button type="button" onClick={() => irASeccion('inicio')}>
          Inicio
        </button>

        <button type="button" onClick={() => irASeccion('servicios')}>
          Servicios
        </button>

        <button type="button" onClick={() => irASeccion('nosotros')}>
          Nosotros
        </button>

        <button type="button" onClick={() => irASeccion('contacto')}>
          Contacto
        </button>
      </nav>

      <Link to="/login" className="login-btn">
        Iniciar sesión
      </Link>

    </header>
  )
}

export default Navbar

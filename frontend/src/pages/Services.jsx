
import { Link } from 'react-router-dom'

const services = [
  {
    title: 'Búsqueda de talentos',
    description:
      'Encuentra deportistas según su deporte, posición y nivel competitivo.',
    icon: '🔎',
    available: true
  },
  {
    title: 'Conexión con entrenadores',
    description:
      'Descubre entrenadores deportivos y conoce sus especialidades.',
    icon: '🏋️',
    available: true
  },
  {
    title: 'Exploración de clubes',
    description:
      'Encuentra clubes y academias que forman parte de nuestra comunidad.',
    icon: '🏆',
    available: true
  },
  {
    title: 'Oportunidades deportivas',
    description:
      'Próximamente podrás consultar convocatorias, pruebas y oportunidades.',
    icon: '📢',
    available: false
  }
]

export default function Services() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <Link to="/" className="dashboard-logo">
          Sport<span>Match</span>
        </Link>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <div>
            <p className="section-label">
              NUESTROS SERVICIOS
            </p>
            <h1>Servicios deportivos</h1>
            <p>
              SportMatch conecta deportistas,
              entrenadores y clubes en una
              misma plataforma digital.
            </p>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="opportunity-grid">
            {services.map((service) => (
              <article
                className="opportunity-card"
                key={service.title}
              >
                <div className="opportunity-info">
                  <span style={{ fontSize: '32px' }}>
                    {service.icon}
                  </span>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <span className="opportunity-tag">
                    {service.available
                      ? 'Disponible'
                      : 'Próximamente'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div style={{ marginTop: '24px' }}>
          <Link
            to="/explore"
            className="logout-btn"
            style={{
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            Explorar perfiles deportivos
          </Link>
        </div>
      </main>
    </div>
  )
}

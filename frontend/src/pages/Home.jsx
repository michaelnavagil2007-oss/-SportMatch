import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="app">

      <Navbar />

      <main>

        <section id="inicio" className="hero">

          <div className="hero-content">

            <p className="hero-tag">
              TU FUTURO DEPORTIVO COMIENZA AQUÍ
            </p>

            <h1>
              Conecta con tu
              <span> oportunidad deportiva.</span>
            </h1>

            <p className="hero-description">
              SportMatch es una plataforma que conecta
              deportistas, entrenadores y oportunidades
              para ayudarte a desarrollar tu potencial.
            </p>

            <div className="hero-buttons">

  <button
    className="primary-btn"
    onClick={() => {
      document.getElementById('servicios').scrollIntoView({
        behavior: 'smooth'
      })
    }}
  >
    Explorar servicios
  </button>

  <button
    className="secondary-btn"
    onClick={() => {
      document.getElementById('nosotros').scrollIntoView({
        behavior: 'smooth'
      })
    }}
  >
    Conocer SportMatch
  </button>

</div>
          </div>

          <div className="hero-card">

            <div className="ball-icon">
              ⚽
            </div>

            <h2>
              Encuentra tu próximo desafío
            </h2>

            <p>
              Entrenamiento, preparación y oportunidades
              deportivas en un solo lugar.
            </p>

          </div>

        </section>

        <section id="servicios" className="services">

          <div className="section-title">

            <p>
              LO QUE OFRECEMOS
            </p>

            <h2>
              Servicios para potenciar
              <span> tu talento</span>
            </h2>

          </div>

          <div className="service-grid">

            <article className="service-card">

              <div className="service-icon">
                ⚽
              </div>

              <h3>
                Entrenamiento deportivo
              </h3>

              <p>
                Mejora tus habilidades mediante
                entrenamientos adaptados a tus objetivos.
              </p>

            </article>

            <article className="service-card">

              <div className="service-icon">
                💪
              </div>

              <h3>
                Preparación física
              </h3>

              <p>
                Desarrolla fuerza, velocidad y resistencia
                para mejorar tu rendimiento.
              </p>

            </article>

            <article className="service-card">

              <div className="service-icon">
                🤝
              </div>

              <h3>
                Conexión deportiva
              </h3>

              <p>
                Conecta con deportistas, entrenadores
                y nuevas oportunidades.
              </p>

            </article>

          </div>

        </section>

        <section id="nosotros" className="about">

          <div>

            <p className="section-label">
              SOBRE SPORTMATCH
            </p>

            <h2>
              Una plataforma creada
              <span> para deportistas.</span>
            </h2>

          </div>

          <p>
            Nuestro objetivo es facilitar el acceso a
            servicios, entrenamiento y oportunidades
            deportivas mediante una experiencia digital
            sencilla, moderna y accesible.
          </p>

        </section>

        <section id="contacto" className="contact">

          <div className="contact-content">

            <p className="section-label">
              CONTACTO
            </p>

            <h2>
              ¿Quieres formar parte de SportMatch?
            </h2>

            <p>
              Déjanos tus datos y nos pondremos en
              contacto contigo.
            </p>

          </div>

          <form className="contact-form">

            <input
              type="text"
              placeholder="Nombre completo"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
            />

            <textarea
              placeholder="Escribe tu mensaje"
              rows="5"
            />

            <button
              type="submit"
              className="primary-btn"
            >
              Enviar mensaje
            </button>

          </form>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Home
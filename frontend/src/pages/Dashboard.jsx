import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProfileVisibility from '../components/ProfileVisibility'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser) {
          if (active) setAuthenticated(false)
          return
        }

        if (active) setAuthenticated(true)

        // Los permisos se consultan en Supabase; no dependen del tipo de perfil.
        const { data: adminAccess, error: adminError } =
          await supabase.rpc('is_sportmatch_admin')
        if (active) setIsAdmin(!adminError && adminAccess === true)

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileError) throw profileError
        if (!active) return

        setUser({
          ...profile,
          userType: profile.user_type,
          dominantFoot: profile.dominant_foot,
        })
      } catch (error) {
        if (active) setErrorMessage(error.message || 'No se pudo cargar tu perfil.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()
    return () => { active = false }
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setErrorMessage('No se pudo cerrar la sesión: ' + error.message)
      setLoggingOut(false)
      return
    }
    localStorage.removeItem('sportmatchLoggedIn')
    localStorage.removeItem('sportmatchUser')
    navigate('/login', { replace: true })
  }

  if (loading) {
    return <main className="dashboard-page" style={{ padding: '3rem', textAlign: 'center' }}>Cargando tu perfil de SportMatch...</main>
  }

  if (!authenticated) return <Navigate to="/login" replace />

  if (errorMessage || !user) {
    return (
      <main className="dashboard-page" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>No pudimos cargar tu perfil</h2>
        <p role="alert">{errorMessage || 'Tu perfil no está disponible.'}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
        <button onClick={handleLogout} disabled={loggingOut}>Cerrar sesión</button>
      </main>
    )
  }

  const userType = user.userType
  const userName = user.name || 'Usuario'
  const userSport = user.sport || 'No especificado'

  const getUserTypeName = () => {
    if (userType === 'deportista') return 'Deportista'
    if (userType === 'entrenador') return 'Entrenador'
    return 'Club / Academia'
  }

  const getWelcomeText = () => {
    if (userType === 'deportista') {
      return 'Encuentra oportunidades, conecta con entrenadores y desarrolla tu talento deportivo.'
    }

    if (userType === 'entrenador') {
      return 'Encuentra deportistas, ofrece tus servicios y desarrolla nuevas oportunidades profesionales.'
    }

    return 'Encuentra talento deportivo, publica oportunidades y conecta con entrenadores y deportistas.'
  }

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <header className="dashboard-navbar">

        <Link to="/" className="dashboard-logo">
          Sport<span>Match</span>
        </Link>
        <Link
  to="/explore"
  className="logout-btn"
  style={{ textDecoration: 'none' }}
>
  Explorar talentos
</Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="logout-btn"
            style={{ textDecoration: 'none' }}
          >
            Panel de administración
          </Link>
        )}

        <div className="dashboard-user">

          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{userName}</strong>

            <small>
              {getUserTypeName()}
            </small>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>

        </div>

      </header>


      <main className="dashboard-content">

        {/* BIENVENIDA */}

        <section className="dashboard-welcome">

          <div>

            <p className="section-label">
              PANEL PRINCIPAL
            </p>

            <h1>
              Bienvenido, <span>{userName}</span>
            </h1>

            <p>
              {getWelcomeText()}
            </p>

          </div>


          <div className="dashboard-profile-card">

            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{userName}</h3>

              <p>
                {getUserTypeName()} · {userSport}
              </p>
            </div>

            <button
              type="button"
              onClick={() => document.getElementById('mi-perfil')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })}
            >
              Ver mi perfil
            </button>

          </div>

        </section>


        {/* DEPORTISTA */}

        {userType === 'deportista' && (

          <>

            <section className="dashboard-stats">

              <article className="dashboard-stat">
                <span>⚽</span>

                <div>
                  <strong>0</strong>
                  <small>Oportunidades</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>🤝</span>

                <div>
                  <strong>0</strong>
                  <small>Conexiones</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>📩</span>

                <div>
                  <strong>0</strong>
                  <small>Solicitudes</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>⭐</span>

                <div>
                  <strong>0%</strong>
                  <small>Perfil completado</small>
                </div>
              </article>

            </section>


            <section id="mi-perfil" className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <p className="section-label">
                    PERFIL DEPORTIVO
                  </p>

                  <h2>
                    Tu información
                  </h2>
                </div>

              </div>


              <div className="profile-details-grid">

                <div className="profile-detail">
                  <span>Deporte</span>
                  <strong>{user.sport || 'No especificado'}</strong>
                </div>

                <div className="profile-detail">
                  <span>Posición</span>
                  <strong>{user.position || 'No especificada'}</strong>
                </div>

                <div className="profile-detail">
                  <span>Pie dominante</span>
                  <strong>
                    {user.dominantFoot || 'No especificado'}
                  </strong>
                </div>

                <div className="profile-detail">
                  <span>Nivel</span>
                  <strong>
                    {user.level || 'No especificado'}
                  </strong>
                </div>

                <div className="profile-detail">
                  <span>Ciudad</span>
                  <strong>
                    {user.city || 'No especificada'}
                  </strong>
                </div>

              </div>

            </section>


            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <p className="section-label">
                    DESCUBRE
                  </p>

                  <h2>
                    Oportunidades para ti
                  </h2>
                </div>

              </div>


              <div className="opportunity-grid">

                <article className="opportunity-card">

                  <div className="opportunity-icon">
                    ⚽
                  </div>

                  <div className="opportunity-info">

                    <span className="opportunity-tag">
                      PRÓXIMAMENTE
                    </span>

                    <h3>
                      Pruebas para jugadores
                    </h3>

                    <p>
                      Encuentra clubes y academias que buscan
                      nuevos talentos deportivos.
                    </p>

                    <small>
                      📍 Ecuador · {userSport}
                    </small>

                  </div>

                  <button className="opportunity-btn" type="button" disabled title="Función próximamente">
                    Próximamente
                  </button>

                </article>


                <article className="opportunity-card">

                  <div className="opportunity-icon">
                    🏋️
                  </div>

                  <div className="opportunity-info">

                    <span className="opportunity-tag">
                      PRÓXIMAMENTE
                    </span>

                    <h3>
                      Entrenadores
                    </h3>

                    <p>
                      Encuentra entrenadores y especialistas
                      relacionados con tu deporte.
                    </p>

                    <small>
                      📍 Ecuador
                    </small>

                  </div>

                  <Link to="/explore" className="opportunity-btn" style={{ textDecoration: 'none' }}>
                    Explorar
                  </Link>

                </article>

              </div>

            </section>

          </>

        )}


        {/* ENTRENADOR */}

        {userType === 'entrenador' && (

          <>

            <section className="dashboard-stats">

              <article className="dashboard-stat">
                <span>👥</span>

                <div>
                  <strong>0</strong>
                  <small>Deportistas</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>📋</span>

                <div>
                  <strong>0</strong>
                  <small>Servicios</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>📩</span>

                <div>
                  <strong>0</strong>
                  <small>Solicitudes</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>⭐</span>

                <div>
                  <strong>0%</strong>
                  <small>Perfil completado</small>
                </div>
              </article>

            </section>


            <section id="mi-perfil" className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <p className="section-label">
                    PERFIL PROFESIONAL
                  </p>

                  <h2>
                    Tu información
                  </h2>
                </div>

              </div>


              <div className="profile-details-grid">

                <div className="profile-detail">
                  <span>Deporte</span>
                  <strong>{user.sport || 'No especificado'}</strong>
                </div>

                <div className="profile-detail">
                  <span>Especialidad</span>
                  <strong>
                    {user.specialty || 'No especificada'}
                  </strong>
                </div>

                <div className="profile-detail">
                  <span>Experiencia</span>
                  <strong>
                    {user.experience || 'No especificada'}
                  </strong>
                </div>

                <div className="profile-detail">
                  <span>Ciudad</span>
                  <strong>
                    {user.city || 'No especificada'}
                  </strong>
                </div>

              </div>

            </section>


            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <p className="section-label">
                    CONECTA
                  </p>

                  <h2>
                    Encuentra deportistas
                  </h2>
                </div>

              </div>


              <div className="quick-actions">

                <button className="quick-action" type="button" onClick={() => navigate('/explore')}>
                  <span>🔎</span>

                  <div>
                    <strong>
                      Buscar deportistas
                    </strong>

                    <small>
                      Encuentra deportistas según deporte,
                      nivel y ubicación.
                    </small>
                  </div>
                </button>


                <button className="quick-action" type="button" disabled title="Función próximamente">
                  <span>➕</span>

                  <div>
                    <strong>
                      Publicar servicio
                    </strong>

                    <small>
                      Ofrece tus entrenamientos y servicios.
                    </small>
                  </div>
                </button>


                <button className="quick-action" type="button" disabled title="Función próximamente">
                  <span>📩</span>

                  <div>
                    <strong>
                      Solicitudes
                    </strong>

                    <small>
                      Revisa las solicitudes recibidas.
                    </small>
                  </div>
                </button>

              </div>

            </section>

          </>

        )}


        {/* CLUB */}

        {userType === 'club' && (

          <>

            <section className="dashboard-stats">

              <article className="dashboard-stat">
                <span>👥</span>

                <div>
                  <strong>0</strong>
                  <small>Deportistas</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>📢</span>

                <div>
                  <strong>0</strong>
                  <small>Oportunidades</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>📩</span>

                <div>
                  <strong>0</strong>
                  <small>Solicitudes</small>
                </div>
              </article>

              <article className="dashboard-stat">
                <span>⭐</span>

                <div>
                  <strong>0%</strong>
                  <small>Perfil completado</small>
                </div>
              </article>

            </section>


            <section id="mi-perfil" className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <p className="section-label">
                    PERFIL DEPORTIVO
                  </p>

                  <h2>
                    Información del club
                  </h2>
                </div>

              </div>


              <div className="profile-details-grid">

                <div className="profile-detail">
                  <span>Club / Academia</span>
                  <strong>{user.name}</strong>
                </div>

                <div className="profile-detail">
                  <span>Deporte</span>
                  <strong>
                    {user.sport || 'No especificado'}
                  </strong>
                </div>

                <div className="profile-detail">
                  <span>Ciudad</span>
                  <strong>
                    {user.city || 'No especificada'}
                  </strong>
                </div>

                <div className="profile-detail profile-description">
                  <span>Descripción</span>
                  <strong>
                    {user.description || 'Sin descripción'}
                  </strong>
                </div>

              </div>

            </section>


            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <p className="section-label">
                    TALENTO
                  </p>

                  <h2>
                    Encuentra nuevos talentos
                  </h2>
                </div>

              </div>


              <div className="quick-actions">

                <button className="quick-action" type="button" onClick={() => navigate('/explore')}>
                  <span>🔎</span>

                  <div>
                    <strong>
                      Buscar deportistas
                    </strong>

                    <small>
                      Encuentra jugadores según deporte,
                      posición y nivel.
                    </small>
                  </div>
                </button>


                <button className="quick-action" type="button" disabled title="Función próximamente">
                  <span>📢</span>

                  <div>
                    <strong>
                      Publicar oportunidad
                    </strong>

                    <small>
                      Publica pruebas, convocatorias
                      y oportunidades deportivas.
                    </small>
                  </div>
                </button>


                <button className="quick-action" type="button" disabled title="Función próximamente">
                  <span>📩</span>

                  <div>
                    <strong>
                      Solicitudes
                    </strong>

                    <small>
                      Gestiona las solicitudes de deportistas.
                    </small>
                  </div>
                </button>

              </div>

            </section>

          </>

        )}

<section className="sportmatch-ai-section">
  <div className="sportmatch-ai-content">
    <div className="sportmatch-ai-icon">
      🤖
    </div>

    <div>
      <h2>SportMatch AI</h2>

      <p>
        Tu asistente deportivo inteligente.
        Consulta sobre perfiles, búsqueda de
        talentos y funcionalidades de SportMatch.
      </p>

      <Link to="/ai" className="sportmatch-ai-button">
        Hablar con SportMatch AI
      </Link>
    </div>
  </div>
</section>

<ProfileVisibility />

      </main>


      <footer className="dashboard-footer">

        <div className="dashboard-logo">
          Sport<span>Match</span>
        </div>

        <p>
          © 2026 SportMatch. Todos los derechos reservados.
        </p>

      </footer>

    </div>
  )
}

export default Dashboard
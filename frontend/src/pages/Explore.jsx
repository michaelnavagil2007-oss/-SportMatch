
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Explore() {
    const [checkingAuth, setCheckingAuth] = useState(true)
const [authenticated, setAuthenticated] = useState(false)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('todos')
const [sportFilter, setSportFilter] = useState('todos')
const [positionFilter, setPositionFilter] = useState('todos')
const [levelFilter, setLevelFilter] = useState('todos')
useEffect(() => {

  let active = true

  async function checkSession() {
    const { data: { user }, error } =
      await supabase.auth.getUser()

    if (!active) return

    setAuthenticated(!error && !!user)
    setCheckingAuth(false)
  }

  checkSession()

  return () => {
    active = false
  }
}, [])


  useEffect(() => {
    let active = true

    async function loadProfiles() {
      const { data, error } = await supabase
        .from('sports_directory')
        .select(
          'id, name, user_type, sport, position, level, specialty'
        )
        .eq('is_public', true)
        .order('name')

      if (!active) return

      if (error) {
        setError('No se pudieron cargar los perfiles.')
      } else {
        setProfiles(data || [])
      }

      setLoading(false)
    }

    loadProfiles()

    return () => {
      active = false
    }
  }, [])

  
const filtered = profiles.filter((profile) => {
  const text = [
    profile.name,
    profile.sport,
    profile.position,
    profile.specialty
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const matchesSearch = text.includes(
    search.trim().toLowerCase()
  )

  const matchesType =
    type === 'todos' || profile.user_type === type

  const matchesSport =
    sportFilter === 'todos' ||
    profile.sport === sportFilter

  const matchesPosition =
    positionFilter === 'todos' ||
    profile.position === positionFilter

  const matchesLevel =
    levelFilter === 'todos' ||
    profile.level === levelFilter

  return (
    matchesSearch &&
    matchesType &&
    matchesSport &&
    matchesPosition &&
    matchesLevel
  )
})

if (checkingAuth) {
  return <p>Verificando sesión...</p>
}

if (!authenticated) {
  return <Navigate to="/login" replace />
}

  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <a href="/" className="dashboard-logo">
          Sport<span>Match</span>
        </a>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <div>
            <p className="section-label">DESCUBRE</p>
            <h1>Explorar talentos</h1>
            <p>
              Encuentra deportistas, entrenadores y clubes
              que forman parte de SportMatch.
            </p>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Buscar perfiles</h2>
          </div>

          <input
            type="search"
            placeholder="Buscar por nombre, deporte o posición"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px'
            }}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              padding: '12px',
              marginBottom: '20px'
            }}
          >
            <option value="todos">Todos los perfiles</option>
            <option value="deportista">Deportistas</option>
            <option value="entrenador">Entrenadores</option>
            <option value="club">Clubes</option>
          </select>

<div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px'
  }}
>
  <select
    value={sportFilter}
    onChange={(e) => setSportFilter(e.target.value)}
    style={{ padding: '12px', flex: '1 1 180px' }}
  >
    <option value="todos">Todos los deportes</option>
    {[...new Set(profiles.map(p => p.sport).filter(Boolean))]
      .sort()
      .map(sport => (
        <option key={sport} value={sport}>
          {sport}
        </option>
      ))}
  </select>

  <select
    value={positionFilter}
    onChange={(e) => setPositionFilter(e.target.value)}
    style={{ padding: '12px', flex: '1 1 180px' }}
  >
    <option value="todos">Todas las posiciones</option>
    {[...new Set(profiles.map(p => p.position).filter(Boolean))]
      .sort()
      .map(position => (
        <option key={position} value={position}>
          {position}
        </option>
      ))}
  </select>

  <select
    value={levelFilter}
    onChange={(e) => setLevelFilter(e.target.value)}
    style={{ padding: '12px', flex: '1 1 180px' }}
  >
    <option value="todos">Todos los niveles</option>
    {[...new Set(profiles.map(p => p.level).filter(Boolean))]
      .sort()
      .map(level => (
        <option key={level} value={level}>
          {level}
        </option>
      ))}
  </select>
</div>


          {loading && <p>Cargando perfiles...</p>}

          {error && <p role="alert">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p>No se encontraron perfiles públicos.</p>
          )}

          <div className="opportunity-grid">
            {filtered.map((profile) => (
              <article
                className="opportunity-card"
                key={profile.id}
              >
                <div className="opportunity-info">
                  <span className="opportunity-tag">
                    {profile.user_type}
                  </span>

                  <h3>{profile.name}</h3>

                  <p>
                    Deporte: {profile.sport || 'No especificado'}
                  </p>

                  {profile.user_type === 'deportista' && (
                    <>
                      <p>
                        Posición: {profile.position || 'No especificada'}
                      </p>
                      <p>
                        Nivel: {profile.level || 'No especificado'}
                      </p>
                    </>
                  )}

                  {profile.user_type === 'entrenador' && (
                    <p>
                      Especialidad: {profile.specialty || 'No especificada'}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

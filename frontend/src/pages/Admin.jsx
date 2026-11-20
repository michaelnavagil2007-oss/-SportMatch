
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadAdmin() {
      try {
        // Comprobar que existe una sesión válida
        const { data: { user }, error: authError } =
          await supabase.auth.getUser()

        if (authError || !user) {
          navigate('/login', { replace: true })
          return
        }

        // Consultar permisos del usuario
        const { data: adminAllowed, error: adminError } =
          await supabase.rpc('is_sportmatch_admin')

        if (adminError) throw adminError

        if (!adminAllowed) {
          if (active) {
            setError(
              'No tienes permisos para acceder al panel.'
            )
          }
          return
        }

        if (active) setIsAdmin(true)

        // Cargar mensajes reales desde Supabase
        const { data, error: messagesError } =
          await supabase
            .from('contact_messages')
            .select(
  'id, name, email, subject, message, status, created_at'
)
            .order('created_at', { ascending: false })

        if (messagesError) throw messagesError

        if (active) {
          setMessages(data || [])
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || 'Error al cargar el panel.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAdmin()

    return () => {
      active = false
    }
  }, [navigate])


async function updateMessageStatus(id, newStatus) {
  setError('')

  try {
    const { data, error: updateError } = await supabase
      .from('contact_messages')
      .update({ status: newStatus })
      .eq('id', id)
      .select('id, status')
      .single()

    if (updateError) throw updateError

    setMessages((previous) =>
      previous.map((item) =>
        item.id === data.id
          ? { ...item, status: data.status }
          : item
      )
    )
  } catch (err) {
    console.error('Error al actualizar mensaje:', err)

    setError(
      err.message ||
      'No se pudo actualizar el mensaje.'
    )
  }
}

  async function handleLogout() {
    const { error: logoutError } =
      await supabase.auth.signOut()

    if (logoutError) {
      setError(logoutError.message)
      return
    }

    navigate('/login', { replace: true })
  }

  const panelStyle = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px',
    color: '#fff'
  }

  const cardStyle = {
    padding: '20px',
    background: '#13243a',
    border: '1px solid #29415e',
    borderRadius: '12px',
    marginBottom: '16px',
    overflowWrap: 'anywhere'
  }

  if (loading) {
    return (
      <main style={panelStyle}>
        <p>Verificando permisos de administrador...</p>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main style={panelStyle}>
        <h1>Acceso restringido</h1>
        <p role="alert">
          {error || 'No tienes permisos.'}
        </p>
        <Link to="/dashboard">Volver al Dashboard</Link>
      </main>
    )
  }

  return (
    <div className="dashboard-page">
      <main style={panelStyle}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <div>
            <h1>SportMatch Admin</h1>
            <p>Panel privado de administración</p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cerrar sesión
          </button>
        </header>

        <section style={cardStyle}>
          <h2>Mensajes recibidos</h2>
          <p style={{ fontSize: '30px', fontWeight: 'bold' }}>
            {messages.length}
          </p>
        </section>

        <section>
          <h2 style={{ marginBottom: '20px' }}>
            Bandeja de contacto
          </h2>

          {error && (
            <p role="alert" style={{ color: '#ff9999' }}>
              {error}
            </p>
          )}

          {messages.length === 0 && !error && (
            <p>Todavía no hay mensajes recibidos.</p>
          )}

          {messages.map((item) => (
            <article key={item.id} style={cardStyle}>
              <h3>{item.subject}</h3>

              <p>
                <strong>Nombre:</strong> {item.name}
              </p>

              <p>
                <strong>Correo:</strong> {item.email}
              </p>

              <p>
                <strong>Fecha:</strong>{' '}
                {new Date(item.created_at)
                  .toLocaleString('es-EC')}
              </p>

              <hr style={{
                borderColor: '#29415e',
                margin: '16px 0'
              }} />

              <p style={{ whiteSpace: 'pre-wrap' }}>
                {item.message}
              </p>

<div
  style={{
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  }}
>
  <span
    style={{
      padding: '8px 12px',
      borderRadius: '8px',
      background:
        item.status === 'resolved'
          ? '#14532d'
          : '#78350f',
      color: '#ffffff',
      fontWeight: 'bold'
    }}
  >
    {item.status === 'resolved'
      ? 'Atendido'
      : 'Pendiente'}
  </span>

  <button
    type="button"
    onClick={() =>
      updateMessageStatus(
        item.id,
        item.status === 'resolved'
          ? 'pending'
          : 'resolved'
      )
    }
    style={{
      padding: '10px 16px',
      borderRadius: '8px',
      background: '#2563eb',
      color: '#ffffff',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    {item.status === 'resolved'
      ? 'Marcar como pendiente'
      : 'Marcar como atendido'}
  </button>
</div>

            </article>
          ))}
        </section>

        <Link
          to="/dashboard"
          style={{
            display: 'inline-block',
            marginTop: '20px'
          }}
        >
          Volver al Dashboard
        </Link>
      </main>
    </div>
  )
}

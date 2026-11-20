
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error(
          'Debes iniciar sesión para enviar un mensaje.'
        )
      }

      const name = form.name.trim()
      const email = form.email.trim()
      const subject = form.subject.trim()
      const message = form.message.trim()

      if (
        name.length < 2 ||
        subject.length < 3 ||
        message.length < 10
      ) {
        throw new Error(
          'Revisa los campos y escribe un mensaje de al menos 10 caracteres.'
        )
      }

      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user.id,
          name,
          email,
          subject,
          message
        })

      if (insertError) {
        throw insertError
      }

      setSuccess(
        '¡Tu mensaje se envió correctamente!'
      )

      setForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

    } catch (err) {
      console.error('Error al enviar contacto:', err)
      setError(
        err.message ||
        'No se pudo enviar el mensaje. Inténtalo nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #999',
    marginTop: '6px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    color: '#111',
    backgroundColor: '#fff'
  }

  return (
    <div className="dashboard-page contact-page">
      <header className="dashboard-navbar">
        <Link to="/" className="dashboard-logo">
          Sport<span>Match</span>
        </Link>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <div>
            <p className="section-label">
              CONTÁCTANOS
            </p>

            <h1>Contacto SportMatch</h1>

            <p>
              ¿Tienes preguntas, sugerencias o necesitas
              ayuda? Envíanos un mensaje.
            </p>
          </div>
        </section>

        <section className="dashboard-section">
          <div
  className="contact-card"
            style={{
              maxWidth: '650px',
              margin: '0 auto',
              padding: '24px'
            }}
          >
            <h2>Envíanos tu mensaje</h2>

            <p style={{ marginBottom: '20px' }}>
              Inicia sesión para utilizar el formulario.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="contact-name">
                Nombre completo
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                style={inputStyle}
                placeholder="Tu nombre"
              />

              <label htmlFor="contact-email">
                Correo electrónico
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                maxLength={254}
                style={inputStyle}
                placeholder="correo@ejemplo.com"
              />

              <label htmlFor="contact-subject">
                Asunto
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={150}
                style={inputStyle}
                placeholder="Motivo de tu mensaje"
              />

              <label htmlFor="contact-message">
                Mensaje
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={2000}
                rows={6}
                style={{
                  ...inputStyle,
                  resize: 'vertical'
                }}
                placeholder="Escribe aquí tu mensaje..."
              />

              {error && (
                <p
                  role="alert"
                  style={{ color: '#d94b4b' }}
                >
                  {error}
                </p>
              )}

              {success && (
                <p
                  role="status"
                  style={{ color: '#16856c' }}
                >
                  {success}
                </p>
              )}

              <button
                type="submit"
                className="logout-btn"
                disabled={loading}
                style={{
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading
                  ? 'Enviando mensaje...'
                  : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}


import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import { supabase } from '../lib/supabaseClient'

export default function Contact() {
  const captchaRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [captchaToken, setCaptchaToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

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

    setError('')
    setSuccess('')

    if (!captchaToken) {
      setError('Completa la verificación de seguridad.')
      return
    }

    setLoading(true)

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke('sportmatch-contact', {
          body: {
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
            captchaToken
          }
        })

      if (functionError) {
        let message = 'No se pudo enviar el mensaje.'

        if (functionError.context instanceof Response) {
          const result = await functionError.context
            .json()
            .catch(() => null)

          if (result?.error) {
            message = result.error
          }
        }

        throw new Error(message)
      }

      if (!data?.success) {
        throw new Error(
          data?.error || 'No se pudo confirmar el envío.'
        )
      }

      setSuccess('¡Tu mensaje se envió correctamente!')

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
      setCaptchaToken('')
      captchaRef.current?.reset()
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
            <p className="section-label">CONTÁCTANOS</p>
            <h1>Contacto SportMatch</h1>

            <p>
              ¿Tienes preguntas, sugerencias o necesitas
              ayuda? Envíanos un mensaje sin crear una cuenta.
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
              Completa los campos y verifica que eres una persona.
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

              <div style={{ marginBottom: '20px' }}>
                {siteKey ? (
                  <Turnstile
                    ref={captchaRef}
                    siteKey={siteKey}
                    onSuccess={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken('')}
                    onError={() => {
                      setCaptchaToken('')
                      setError(
                        'No se pudo cargar la verificación de seguridad.'
                      )
                    }}
                    options={{
                      theme: 'auto'
                    }}
                  />
                ) : (
                  <p role="alert">
                    Falta configurar la verificación de seguridad.
                  </p>
                )}
              </div>

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
                disabled={loading || !captchaToken || !siteKey}
                style={{
                  cursor: loading ? 'wait' : 'pointer',
                  opacity:
                    loading || !captchaToken || !siteKey
                      ? 0.6
                      : 1
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

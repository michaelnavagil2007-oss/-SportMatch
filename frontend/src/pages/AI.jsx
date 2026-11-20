
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AI() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function askAI(e) {
    e.preventDefault()
    if (loading || !message.trim()) return

    setLoading(true)
    setError('')
    setReply('')

    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error('Inicia sesión para utilizar SportMatch AI.')
      }

      const { data, error: functionError } =
        await supabase.functions.invoke('sportmatch-ai', {
          body: { message: message.trim() }
        })

      if (functionError) {
        const response = functionError.context
        let detail = null

        if (response && typeof response.json === 'function') {
          try {
            detail = await response.json()
          } catch {
            // La respuesta puede no contener JSON.
          }
        }

        throw new Error(
          detail?.error || functionError.message
        )
      }

      if (!data?.reply) {
        throw new Error('La IA no devolvió una respuesta.')
      }

      setReply(data.reply)
    } catch (err) {
      setError(err.message || 'Error al consultar la IA.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      maxWidth: '750px',
      margin: '40px auto',
      padding: '24px',
      color: '#fff'
    }}>
      <Link to="/dashboard">Volver al Dashboard</Link>

      <h1>SportMatch AI</h1>
      <p>Tu asistente inteligente deportivo.</p>

      <form onSubmit={askAI}>
        <label htmlFor="ai-question">
          ¿En qué podemos ayudarte?
        </label>

        <textarea
          id="ai-question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          required
          rows={5}
          placeholder="Escribe tu pregunta deportiva..."
          style={{
            display: 'block',
            width: '100%',
            boxSizing: 'border-box',
            margin: '12px 0',
            padding: '14px',
            borderRadius: '10px',
            background: '#fff',
            color: '#111',
            fontSize: '16px'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? 'Consultando IA...' : 'Preguntar a la IA'}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: '#ff9999' }}>
          {error}
        </p>
      )}

      {reply && (
        <section aria-live="polite" style={{
          marginTop: '24px',
          padding: '20px',
          background: '#13243a',
          border: '1px solid #29415e',
          borderRadius: '12px'
        }}>
          <h2>Respuesta de SportMatch AI</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {reply}
          </p>
        </section>
      )}
    </main>
  )
}

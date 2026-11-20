
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ProfileVisibility() {
  const [userId, setUserId] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function loadVisibility() {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser()

      if (!active) return

      if (authError || !user) {
        setMessage('No se pudo verificar tu sesión.')
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data, error } = await supabase
        .from('sports_directory')
        .select('is_public')
        .eq('id', user.id)
        .single()

      if (!active) return

      if (error) {
        setMessage('No se pudo cargar la visibilidad.')
      } else {
        setIsPublic(data.is_public)
      }

      setLoading(false)
    }

    loadVisibility()

    return () => {
      active = false
    }
  }, [])

  async function toggleVisibility() {
    if (!userId || saving) return

    setSaving(true)
    setMessage('')

    const newValue = !isPublic

    const { data, error } = await supabase
      .from('sports_directory')
      .update({ is_public: newValue })
      .eq('id', userId)
      .select('is_public')
      .single()

    if (error) {
      setMessage('No se pudo guardar el cambio.')
    } else {
      setIsPublic(data.is_public)
      setMessage('Visibilidad actualizada correctamente.')
    }

    setSaving(false)
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <p className="section-label">PRIVACIDAD</p>
          <h2>Visibilidad de mi perfil</h2>
        </div>
      </div>

      <p>
        Decide si otros usuarios registrados pueden
        encontrarte en SportMatch.
      </p>

      {loading ? (
        <p>Cargando configuración...</p>
      ) : (
        <>
          <p>
            Estado:{' '}
            <strong>
              {isPublic ? 'Público' : 'Privado'}
            </strong>
          </p>

          <button
            type="button"
            className="logout-btn"
            onClick={toggleVisibility}
            disabled={saving || !userId}
          >
            {saving
              ? 'Guardando...'
              : isPublic
                ? 'Ocultar mi perfil'
                : 'Mostrar mi perfil'}
          </button>
        </>
      )}

      {message && <p role="status">{message}</p>}
    </section>
  )
}

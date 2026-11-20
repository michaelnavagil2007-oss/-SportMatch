import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
function Register() {

  const [userType, setUserType] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    sport: '',
    position: '',
    dominantFoot: '',
    level: '',
    specialty: '',
    experience: '',
    description: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleContinue = () => {
    if (userType) {
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setErrorMessage('')
    setSuccessMessage('')

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            user_type: userType,
            name: formData.name.trim(),
            city: formData.city.trim(),
            sport: formData.sport.trim(),
            position: userType === 'deportista' ? formData.position.trim() : null,
            dominant_foot: userType === 'deportista' ? formData.dominantFoot : null,
            level: userType === 'deportista' ? formData.level : null,
            specialty: userType === 'entrenador' ? formData.specialty.trim() : null,
            experience: userType === 'entrenador' ? formData.experience.trim() : null,
            description: formData.description.trim() || null,
          },
        },
      })

      if (error) throw error
      if (!data.user) throw new Error('No se pudo iniciar el registro.')

      setSuccessMessage(
        'Solicitud de registro recibida. Revisa tu correo electrónico y confirma tu cuenta antes de iniciar sesión.'
      )
    } catch (error) {
      console.error('Error al registrar:', error)
      setErrorMessage(error.message || 'Ocurrió un error al crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          Sport<span>Match</span>
        </div>

        {step === 1 ? (
          <>
            <p className="login-label">
              CREA TU CUENTA
            </p>

            <h1>
              Regístrate
            </h1>

            <p className="login-description">
              Primero dinos qué tipo de usuario eres
              para personalizar tu experiencia.
            </p>

            <div className="user-type-grid">

              <button
                type="button"
                className={`user-type-card ${
                  userType === 'deportista' ? 'selected' : ''
                }`}
                onClick={() => setUserType('deportista')}
              >
                <span className="user-type-icon">⚽</span>

                <strong>
                  Deportista
                </strong>

                <small>
                  Busca oportunidades y desarrolla tu talento.
                </small>
              </button>

              <button
                type="button"
                className={`user-type-card ${
                  userType === 'entrenador' ? 'selected' : ''
                }`}
                onClick={() => setUserType('entrenador')}
              >
                <span className="user-type-icon">🏋️</span>

                <strong>
                  Entrenador
                </strong>

                <small>
                  Ofrece entrenamientos y conecta con deportistas.
                </small>
              </button>

              <button
                type="button"
                className={`user-type-card ${
                  userType === 'club' ? 'selected' : ''
                }`}
                onClick={() => setUserType('club')}
              >
                <span className="user-type-icon">🏟️</span>

                <strong>
                  Club / Academia
                </strong>

                <small>
                  Encuentra talento y publica oportunidades.
                </small>
              </button>

            </div>

            {userType && (
              <div className="selected-user-message">
                Has seleccionado:{' '}
                <strong>
                  {userType === 'deportista'
                    ? 'Deportista'
                    : userType === 'entrenador'
                      ? 'Entrenador'
                      : 'Club / Academia'}
                </strong>
              </div>
            )}

            <button
              type="button"
              className="primary-btn"
              disabled={!userType}
              onClick={handleContinue}
            >
              Continuar
            </button>

            <p className="register-text">
              ¿Ya tienes una cuenta?
            </p>

            <Link
              to="/login"
              className="back-btn register-link"
            >
              Iniciar sesión
            </Link>
          </>
        ) : (
          <>
            <p className="login-label">
              COMPLETA TU PERFIL
            </p>

            <h1>
              Tus datos
            </h1>

            <p className="login-description">
              Completa la información para crear tu perfil
              de {userType === 'deportista'
                ? 'deportista'
                : userType === 'entrenador'
                  ? 'entrenador'
                  : 'club o academia'}.
            </p>

            {errorMessage && (
              <p className="login-error" role="alert">{errorMessage}</p>
            )}

            {successMessage && (
              <div role="status">
                <p>{successMessage}</p>
                <Link to="/login" className="back-btn register-link">
                  Ir a iniciar sesión
                </Link>
              </div>
            )}

            {!successMessage && <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <label>
                {userType === 'club'
                  ? 'Nombre del club o academia'
                  : 'Nombre completo'}
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={
                  userType === 'club'
                    ? 'Nombre del club'
                    : 'Tu nombre completo'
                }
                required
              />

              <label>
                Correo electrónico
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu correo electrónico"
                required
              />

              <label>
                Contraseña
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                required
              />

              <label>
                Confirmar contraseña
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
              />

              <label>
                Ciudad
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ej. Guayaquil"
                required
              />

              <label>
                Deporte
              </label>

              <input
                type="text"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                placeholder="Ej. Fútbol"
                required
              />

              {userType === 'deportista' && (
                <>
                  <label>
                    Posición
                  </label>

                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Ej. Defensa central"
                  />

                  <label>
                    Pie dominante
                  </label>

                  <select
                    name="dominantFoot"
                    value={formData.dominantFoot}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Selecciona una opción
                    </option>
                    <option value="izquierdo">
                      Izquierdo
                    </option>
                    <option value="derecho">
                      Derecho
                    </option>
                    <option value="ambidiestro">
                      Ambidiestro
                    </option>
                  </select>

                  <label>
                    Nivel
                  </label>

                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Selecciona tu nivel
                    </option>
                    <option value="amateur">
                      Amateur
                    </option>
                    <option value="formativo">
                      Formativo
                    </option>
                    <option value="competitivo">
                      Competitivo
                    </option>
                    <option value="profesional">
                      Profesional
                    </option>
                  </select>
                </>
              )}

              {userType === 'entrenador' && (
                <>
                  <label>
                    Especialidad
                  </label>

                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Ej. Preparación física"
                    required
                  />

                  <label>
                    Experiencia
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Ej. 5 años"
                    required
                  />

                  <label>
                    Descripción
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre tu experiencia..."
                    rows="4"
                  />
                </>
              )}

              {userType === 'club' && (
                <>
                  <label>
                    Descripción
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe tu club o academia..."
                    rows="4"
                    required
                  />
                </>
              )}

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>

            </form>}

            <button
              type="button"
              className="back-btn"
              onClick={() => { setStep(1); setErrorMessage('') }}
            >
              ← Cambiar tipo de usuario
            </button>
          </>
        )}

      </div>

    </div>
  )
}

export default Register
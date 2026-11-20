import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault()

  setError('')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setError('El correo o la contraseña son incorrectos.')
    return
  }

  navigate('/dashboard')
}

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          Sport<span>Match</span>
        </div>

        <p className="login-label">
          BIENVENIDO DE NUEVO
        </p>

        <h1>
          Inicia sesión
        </h1>

        <p className="login-description">
          Accede a tu cuenta y continúa construyendo
          tu camino deportivo.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <label>
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu correo electrónico"
            required
          />

          <label>
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Iniciar sesión
          </button>

        </form>

        <p className="register-text">
          ¿No tienes una cuenta?
        </p>

        <Link
          to="/register"
          className="back-btn register-link"
        >
          Crear una cuenta
        </Link>

        <button
          type="button"
          className="back-btn"
          onClick={() => window.history.back()}
        >
          ← Volver
        </button>

      </div>

    </div>
  )
}

export default Login
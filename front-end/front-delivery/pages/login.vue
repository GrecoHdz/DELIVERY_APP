<template>
  <div class="login-container">
    <div class="login-box">
      <div class="header">
        <h1>Iniciar Sesión</h1>
        <p class="subtitle">Ingresa tus credenciales para acceder</p>
      </div>

      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="username">Usuario</label>
          <div class="input-group">
            <User class="icon" />
            <input
              type="text"
              v-model="username"
              id="username"
              required
              placeholder="Ingresa tu usuario"
              :disabled="loading"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-group">
            <Lock class="icon" />
            <input
              type="password"
              v-model="password"
              id="password"
              required
              placeholder="Ingresa tu contraseña"
              :disabled="loading"
            />
          </div>
        </div>
        <button type="submit" :disabled="loading" class="submit-btn">
          <Loader2 v-if="loading" class="spinner" />
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <div v-if="error" class="error-message">
          <AlertCircle class="icon" />
          <p>{{ error }}</p>
        </div>

        <div class="links">
          <nuxt-link to="/register" class="link">
            <UserPlus class="icon" />
            Registrarse
          </nuxt-link>
          <nuxt-link to="/forgot-password" class="link">
            <KeyRound class="icon" />
            ¿Olvidaste tu contraseña?
          </nuxt-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Estos componentes se usan en el template, así que mantenemos la importación
import { User, Lock, Loader2, AlertCircle, UserPlus, KeyRound } from 'lucide-vue-next'

// Autenticación desactivada temporalmente
// La autenticación será implementada más adelante
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

// Redirigir automáticamente al cargar la página
// Usamos setTimeout para asegurarnos de que la redirección ocurra después de que el componente esté montado
setTimeout(() => {
  console.log('Autenticación desactivada - redirigiendo automáticamente')
  router.push('/Dashboard_Cliente')
}, 100)

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    // Simular inicio de sesión exitoso
    console.log('Simulando inicio de sesión con:', username.value)

    // Redirigir a la página principal
    await router.push('/Dashboard_Cliente')
  } catch (err) {
    error.value = 'Error al iniciar sesión'
    console.error('Error simulado:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
}

.login-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #1e3c72;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1e3c72;
  font-weight: 500;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group .icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4facfe;
}

input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #4facfe;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(79, 172, 254, 0.3);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fde8e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message .icon {
  color: #e74c3c;
}

.links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  text-align: center;
}

.link {
  color: #4facfe;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.link:hover {
  color: #1e3c72;
}

.link .icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 480px) {
  .login-box {
    padding: 2rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>

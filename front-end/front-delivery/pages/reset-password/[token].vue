<template>
  <div class="reset-password-container">
    <div class="reset-password-box">
      <div class="header">
        <h1>Restablecer Contraseña</h1>
        <p class="subtitle">Ingresa tu nueva contraseña</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="password">Nueva Contraseña</label>
          <div class="input-group">
            <Lock class="icon" />
            <input 
              type="password" 
              v-model="password" 
              id="password" 
              required 
              placeholder="Ingresa tu nueva contraseña"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <div class="input-group">
            <Lock class="icon" />
            <input 
              type="password" 
              v-model="confirmPassword" 
              id="confirmPassword" 
              required 
              placeholder="Confirma tu nueva contraseña"
              :disabled="loading"
            />
          </div>
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
          <Loader2 v-if="loading" class="spinner" />
          {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
        </button>

        <div v-if="success" class="success-message">
          <CheckCircle class="icon" />
          <p>{{ success }}</p>
        </div>

        <div v-if="error" class="error-message">
          <AlertCircle class="icon" />
          <p>{{ error }}</p>
        </div>

        <div class="links">
          <nuxt-link to="/login" class="back-link">
            <ArrowLeft class="icon" />
            Volver al inicio de sesión
          </nuxt-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Lock, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-vue-next'

const { resetPassword } = useAuth()
const router = useRouter()
const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const error = ref(null)
const success = ref(null)
const loading = ref(false)

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loading.value = true
  error.value = null
  success.value = null
  
  try {
    await resetPassword({
      token: route.params.token,
      password: password.value
    })
    success.value = 'Contraseña actualizada exitosamente'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Error al restablecer la contraseña'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
}

.reset-password-box {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
}

.reset-password-box::before {
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
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e6f7ed;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-message .icon {
  color: #2ecc71;
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
  text-align: center;
}

.back-link {
  color: #4facfe;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #1e3c72;
}

.back-link .icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 480px) {
  .reset-password-box {
    padding: 2rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style> 
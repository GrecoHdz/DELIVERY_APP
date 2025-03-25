<template>
  <div class="register-container">
    <div class="register-box">
      <div class="header">
        <h1>Registro</h1>
        <p class="subtitle">Crea tu cuenta para comenzar</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="form">
        <div class="form-group">
          <label for="username">Usuario</label>
          <div class="input-group">
            <User class="icon" />
            <input 
              type="text" 
              v-model="username" 
              id="username" 
              required 
              placeholder="Ingresa tu nombre de usuario"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="nombre">Nombre Completo</label>
          <div class="input-group">
            <User class="icon" />
            <input 
              type="text" 
              v-model="nombre" 
              id="nombre" 
              required 
              placeholder="Ingresa tu nombre completo"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="identidad">Identidad</label>
          <div class="input-group">
            <IdCard class="icon" />
            <input 
              type="text" 
              v-model="identidad" 
              id="identidad" 
              required 
              placeholder="Ingresa tu número de identidad"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="fecha_nacimiento">Fecha de Nacimiento</label>
          <div class="input-group">
            <Calendar class="icon" />
            <input 
              type="date" 
              v-model="fecha_nacimiento" 
              id="fecha_nacimiento" 
              required 
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <div class="input-group">
            <Phone class="icon" />
            <input 
              type="tel" 
              v-model="telefono" 
              id="telefono" 
              required 
              placeholder="Ingresa tu número de teléfono"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="ciudad">Ciudad</label>
          <div class="input-group">
            <MapPin class="icon" />
            <select 
              v-model="id_ciudad" 
              id="ciudad" 
              required 
              :disabled="loading || ciudades.length === 0"
              class="select-input"
            >
              <option value="">Selecciona una ciudad</option>
              <option v-for="ciudad in ciudades" :key="ciudad.id_ciudad" :value="ciudad.id_ciudad">
                {{ ciudad.nombre_ciudad }}
              </option>
            </select>
            <div v-if="ciudades.length === 0" class="text-sm text-gray-500 mt-1">
              No hay ciudades disponibles
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <div class="input-group">
            <Mail class="icon" />
            <input 
              type="email" 
              v-model="email" 
              id="email" 
              required 
              placeholder="ejemplo@correo.com"
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
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>

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
import { User, Mail, Lock, Loader2, AlertCircle, ArrowLeft, IdCard, Calendar, Phone, MapPin } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const nombre = ref('')
const identidad = ref('')
const fecha_nacimiento = ref('')
const telefono = ref('')
const id_ciudad = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)
const ciudades = ref([])
const api = useApi()

// Cargar ciudades al montar el componente
onMounted(async () => {
  try {
    const data = await api.get('/ciudad')
    console.log('Datos de ciudades recibidos:', data)
    // Asegurarnos de que data sea un array
    ciudades.value = Array.isArray(data) ? data : []
    console.log('Ciudades asignadas:', ciudades.value)
  } catch (err) {
    console.error('Error al cargar ciudades:', err)
    error.value = 'Error al cargar las ciudades'
  }
})

const handleRegister = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Enviando datos de registro:', {
      usuario: username.value,
      clave: password.value,
      nombre: nombre.value,
      identidad: identidad.value,
      fecha_nacimiento: fecha_nacimiento.value,
      telefono: telefono.value,
      id_ciudad: id_ciudad.value,
      email: email.value
    })

    const response = await api.post('/usuarios', {
      usuario: username.value,
      clave: password.value,
      nombre: nombre.value,
      identidad: identidad.value,
      fecha_nacimiento: fecha_nacimiento.value,
      telefono: telefono.value,
      id_ciudad: id_ciudad.value,
      email: email.value
    })

    console.log('Respuesta del servidor:', response)
    router.push('/login')
  } catch (err) {
    console.error('Error completo:', err)
    if (err.response) {
      // El servidor respondió con un estado de error
      console.error('Datos de la respuesta:', err.response.data)
      error.value = err.response.data.message || 'Error al registrar usuario'
    } else if (err.request) {
      // La petición fue hecha pero no se recibió respuesta
      error.value = 'No se pudo conectar con el servidor. Por favor, verifica que el servidor esté en funcionamiento.'
    } else {
      // Error al configurar la petición
      error.value = 'Error al procesar la solicitud'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
}

.register-box {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
}

.register-box::before {
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
  text-align: center;
}

.back-link {
  color: #4facfe;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  .register-box {
    padding: 2rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}

.select-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234facfe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em;
  color: #333;
}

.select-input option {
  color: #333;
  background-color: white;
  padding: 0.5rem;
}

.select-input:focus {
  border-color: #4facfe;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.select-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #666;
}
</style>
  
<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
 
    <!-- Contenido Principal: Formulario de Login -->
    <div class="flex justify-center items-center min-h-[calc(100vh-120px)] p-4">
      <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="usuario" class="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              v-model="usuario"
              type="text"
              id="usuario"
              placeholder="Ingresa tu usuario"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-6">
            <label for="clave" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              v-model="clave"
              type="password"
              id="clave"
              placeholder="Ingresa tu contraseña"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            Iniciar Sesión
          </button>
        </form>
        <div class="mt-4 text-center">
          <label class="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              v-model="useMockData"
              class="form-checkbox h-4 w-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">Usar Mock Data</span>
          </label>
        </div>
        <div v-if="errorMessage" class="mt-4 text-center text-red-500 text-sm">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mt-4 text-center text-green-500 text-sm">
          {{ successMessage }}
        </div>
      </div>
    </div>
 
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'; // Importar Axios
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  X as XIcon
} from 'lucide-vue-next';

// Sidebar
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Perfil
const isProfileMenuOpen = ref(false);
const selectedProfile = ref("Cliente");

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const selectProfile = (profile) => {
  selectedProfile.value = profile;
  isProfileMenuOpen.value = false;
};

// Login
const usuario = ref("");
const clave = ref("");
const useMockData = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const router = useRouter()
const route = useRoute()
const handleLogin = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (useMockData.value) {
    // Mock data
    const mockUser = { usuario: "test", clave_hash: "$2a$10$examplehash" };
    const isMatch = await bcrypt.compare(clave.value, mockUser.clave_hash);

    if (usuario.value === mockUser.usuario && isMatch) {
      successMessage.value = "Login exitoso con mock data!";
    } else {
      errorMessage.value = "Usuario o contraseña incorrectos.";
    }
  } else {
    // API
    try {
      const response = await axios.post("http://localhost:4000/login", {
        usuario: usuario.value,
        clave: clave.value,
      });

      if (response.data.accessToken) {
        successMessage.value = "Login exitoso!";
        localStorage.setItem("token", response.data.accessToken);
        router.replace(route.query.to ?? "/Dashboard_Cliente")
      }
    } catch (error) {
      errorMessage.value = "Error en el login. Verifica tus credenciales.";
      console.error("Error en la petición:", error);
    }
  }
};
</script>
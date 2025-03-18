<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    <!-- Header -->
    <header class="bg-white shadow-md p-4">
      <div class="flex justify-between items-center">
        <!-- Sidebar a la izquierda -->
        <div @click="toggleSidebar" class="cursor-pointer">
          <MenuIcon class="text-blue-600" :size="24" />
        </div>
        <!-- Nombre de la app en el centro -->
        <div class="flex items-center space-x-2">
          <TruckIcon class="text-blue-600" :size="24" />
          <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
        </div>
        <!-- Notificaciones a la derecha -->
        <div class="relative">
          <BellIcon class="text-blue-600" :size="24" />
          <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50"
      :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">Opciones</h2>
          <XIcon @click="toggleSidebar" class="text-gray-700 cursor-pointer" :size="24" />
        </div>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Idioma</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Ver mi local</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Ser driver</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Perfil</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Soporte</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Configuración</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Cerrar sesión</a></li>
        </ul>
      </div>
    </div>

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

    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center">
          <HomeIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Inicio</span>
        </div>
        <div class="flex flex-col items-center">
          <HeartIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Favoritos</span>
        </div>
        <div class="flex flex-col items-center relative">
          <div class="bg-blue-600 rounded-full p-2">
            <ShoppingCartIcon class="text-white" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Carrito</span>
        </div>
        <div class="flex flex-col items-center">
          <ShoppingBagIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Pedidos</span>
        </div>
        <div class="flex flex-col items-center relative">
          <div @click="toggleProfileMenu" class="cursor-pointer">
            <UserIcon class="text-blue-600" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Perfil</span>
          <div v-if="isProfileMenuOpen" class="absolute bottom-10 bg-white shadow-lg rounded-lg p-2">
            <div @click="selectProfile('Cliente')" class="cursor-pointer text-sm text-gray-700 hover:bg-blue-100 p-2 rounded">Cliente</div>
            <div @click="selectProfile('Driver')" class="cursor-pointer text-sm text-gray-700 hover:bg-blue-100 p-2 rounded">Driver</div>
            <div @click="selectProfile('Local')" class="cursor-pointer text-sm text-gray-700 hover:bg-blue-100 p-2 rounded">Local</div>
          </div>
        </div>
      </div>
    </footer>
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
      }
    } catch (error) {
      errorMessage.value = "Error en el login. Verifica tus credenciales.";
      console.error("Error en la petición:", error);
    }
  }
};
</script>
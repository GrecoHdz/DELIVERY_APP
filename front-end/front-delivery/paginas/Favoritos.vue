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

    <!-- Contenido Principal -->
    <div class="container mx-auto p-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Tus Favoritos</h2>
      <div class="grid grid-cols-2 gap-4">
        <!-- Tarjeta de Producto Favorito -->
        <div
          v-for="producto in productosFavoritos"
          :key="producto.id"
          class="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 active:scale-95"
        >
          <div class="h-40 bg-gray-300 relative">
            <img
              :src="producto.image"
              :alt="producto.name"
              class="w-full h-full object-cover"
            />
            <!-- Corazón Táctil -->
            <div
              @click="toggleFavorito(producto.id)"
              class="absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer"
            >
              <HeartIcon
                :class="{
                  'text-red-500 fill-current': producto.isFavorito,
                  'text-gray-400': !producto.isFavorito,
                }"
                :size="16"
              />
            </div>
          </div>
          <div class="p-3">
            <h3 class="font-semibold text-gray-800">{{ producto.name }}</h3>
            <div class="flex items-center text-xs text-gray-500 mt-1">
              <StarIcon class="text-yellow-400 fill-current" :size="12" />
              <span class="ml-1">{{ producto.rating }}</span>
              <span class="mx-1">•</span>
              <span>{{ producto.price }}</span>
            </div>
            <button class="w-full mt-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all duration-300">
              Ver Detalles
            </button>
          </div>
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
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
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

// Datos de ejemplo para Productos Favoritos
const productosFavoritos = ref([
  {
    id: 1,
    name: "Hamburguesa Clásica",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    price: "$$",
    isFavorito: true, // Estado inicial del corazón
  },
  {
    id: 2,
    name: "Pizza Margarita",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    price: "$$$",
    isFavorito: true, // Estado inicial del corazón
  },
  {
    id: 3,
    name: "Sushi Variado",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    price: "$$$$",
    isFavorito: true, // Estado inicial del corazón
  },
  {
    id: 4,
    name: "Ensalada César",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    price: "$$",
    isFavorito: true, // Estado inicial del corazón
  },
]);

// Función para alternar el estado de favorito
const toggleFavorito = (id) => {
  const producto = productosFavoritos.value.find((p) => p.id === id);
  if (producto) {
    producto.isFavorito = !producto.isFavorito;
  }
};
</script>
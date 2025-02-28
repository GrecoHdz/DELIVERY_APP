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
        <h2 class="text-lg font-bold mb-4">Opciones</h2>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Idioma</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Cerrar sesión</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Ver mi local</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Ser driver</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Perfil</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Configuración</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Soporte</a></li>
        </ul>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="container mx-auto p-4">
      
      <!-- Sección de bienvenida -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Bienvenido, María</h1>
            <p class="text-gray-600">¿Qué vas a pedir hoy?</p>
            <div class="flex items-center mt-2">
              <MapPinIcon class="text-blue-600 mr-2" :size="18" />
              <span class="text-sm text-gray-600">Av. Principal 123, Ciudad</span>
            </div>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <MapPinIcon class="text-blue-600" :size="24" />
          </div>
        </div>
      </div>
      
            <!-- Barra de búsqueda -->
      <div class="relative mb-6">
        <SearchIcon class="absolute left-3 top-3 text-gray-400" :size="20" />
        <input 
          type="text" 
          placeholder="Buscar restaurantes o platillos..."
          class="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <!-- Sección de Categorías -->
<div class="mb-6"> 
  <div class="grid grid-cols-4 gap-2">
    <div class="bg-white rounded-lg shadow-sm p-2 flex flex-col items-center">
      <div class="bg-red-100 p-2 rounded-full mb-1">
        <PizzaIcon class="text-red-500" :size="20" />
      </div>
      <span class="text-xs text-gray-700 text-center">Pizza</span>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-2 flex flex-col items-center">
      <div class="bg-yellow-100 p-2 rounded-full mb-1">
        <CoffeeIcon class="text-yellow-500" :size="20" />
      </div>
      <span class="text-xs text-gray-700 text-center">Cafetería</span>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-2 flex flex-col items-center">
      <div class="bg-green-100 p-2 rounded-full mb-1">
        <SaladIcon class="text-green-500" :size="20" />
      </div>
      <span class="text-xs text-gray-700 text-center">Saludable</span>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-2 flex flex-col items-center">
      <div class="bg-blue-100 p-2 rounded-full mb-1">
        <UtensilsIcon class="text-blue-500" :size="20" />
      </div>
      <span class="text-xs text-gray-700 text-center">Más</span>
    </div>
  </div>
</div>

  <!-- Carrusel de promociones -->
      <div class="mb-6"> 
        <div class="relative overflow-hidden rounded-lg">
          <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div
              v-for="(slide, index) in slides"
              :key="index"
              class="min-w-full h-60 bg-cover bg-center flex-shrink-0"
              :style="{ backgroundImage: `url(${slide.image})` }"
            >
              <div class="bg-black bg-opacity-50 h-full flex flex-col justify-end p-4">
                <h3 class="text-white text-xl font-bold">{{ slide.title }}</h3>
                <p class="text-white">{{ slide.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
 
<!-- Sección de Locales -->
<div class="mb-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold text-gray-800">Recomendados</h2>
    <span class="text-blue-600 text-sm font-medium">Ver todos</span>
  </div>
  <div class="overflow-x-auto whitespace-nowrap pb-4">
    <div class="inline-flex space-x-4">
      <!-- Tarjeta 1 -->
      <div class="w-56 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
        <div class="h-32 bg-gray-300 relative">
          <div class="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <ClockIcon class="text-blue-600 mr-1" :size="12" />
            <span>25-35 min</span>
          </div>
          <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
            <HeartIcon class="text-gray-400" :size="16" />
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-gray-800">Cafetería Central</h3>
          <div class="flex items-center text-xs text-gray-500 mt-1">
            <StarIcon class="text-yellow-400 fill-current" :size="12" />
            <span class="ml-1">4.8</span>
            <span class="mx-1">•</span>
            <span>$$$</span>
            <span class="mx-1">•</span>
            <span>Cafetería</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta 2 -->
      <div class="w-56 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
        <div class="h-32 bg-gray-300 relative">
          <div class="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <ClockIcon class="text-blue-600 mr-1" :size="12" />
            <span>15-25 min</span>
          </div>
          <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
            <HeartIcon class="text-gray-400" :size="16" />
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-gray-800">Pizzería Italiana</h3>
          <div class="flex items-center text-xs text-gray-500 mt-1">
            <StarIcon class="text-yellow-400 fill-current" :size="12" />
            <span class="ml-1">4.5</span>
            <span class="mx-1">•</span>
            <span>$$</span>
            <span class="mx-1">•</span>
            <span>Pizzería</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta 3 -->
      <div class="w-56 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
        <div class="h-32 bg-gray-300 relative">
          <div class="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <ClockIcon class="text-blue-600 mr-1" :size="12" />
            <span>20-30 min</span>
          </div>
          <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
            <HeartIcon class="text-gray-400" :size="16" />
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-gray-800">Sushi Express</h3>
          <div class="flex items-center text-xs text-gray-500 mt-1">
            <StarIcon class="text-yellow-400 fill-current" :size="12" />
            <span class="ml-1">4.7</span>
            <span class="mx-1">•</span>
            <span>$$$</span>
            <span class="mx-1">•</span>
            <span>Sushi</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta 4 -->
      <div class="w-56 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
        <div class="h-32 bg-gray-300 relative">
          <div class="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <ClockIcon class="text-blue-600 mr-1" :size="12" />
            <span>10-20 min</span>
          </div>
          <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
            <HeartIcon class="text-gray-400" :size="16" />
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-gray-800">Burger King</h3>
          <div class="flex items-center text-xs text-gray-500 mt-1">
            <StarIcon class="text-yellow-400 fill-current" :size="12" />
            <span class="ml-1">4.2</span>
            <span class="mx-1">•</span>
            <span>$$</span>
            <span class="mx-1">•</span>
            <span>Hamburguesas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      <!-- Sección de Transporte -->
      <section class="mb-6">
        <h2 class="text-lg font-bold mb-2">🚖 Transporte</h2>
        <div class="overflow-x-auto whitespace-nowrap py-2">
          <div class="inline-flex space-x-4">
            <div
              v-for="item in transporte"
              :key="item.id"
              class="w-30 bg-white text-gray-900 rounded-xl overflow-hidden shadow-md"
            >
              <img
                :src="item.image"
                alt="item.name"
                class="w-full h-32 object-cover"
              />
              <div class="p-2">
                <h3 class="text-sm font-semibold">{{ item.name }}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Mandaditos -->
      <section class="mb-6">
        <h2 class="text-lg font-bold mb-2">📦 Mandaditos</h2>
        <div class="overflow-x-auto whitespace-nowrap py-2">
          <div class="inline-flex space-x-4">
            <div
              v-for="item in mandaditos"
              :key="item.id"
              class="w-40 bg-white text-gray-900 rounded-xl overflow-hidden shadow-md"
            >
              <img
                :src="item.image"
                alt="item.name"
                class="w-full h-32 object-cover"
              />
              <div class="p-2">
                <h3 class="text-sm font-semibold">{{ item.name }}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
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
import { ref, onMounted } from 'vue';
import { 
  Truck as TruckIcon, 
  Bell as BellIcon, 
  ShoppingCart as ShoppingCartIcon, 
  User as UserIcon, 
  MapPin as MapPinIcon, 
  Search as SearchIcon, 
  Heart as HeartIcon, 
  Home as HomeIcon,
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  Pizza as PizzaIcon,
  Coffee as CoffeeIcon,
  Salad as SaladIcon,
  Utensils as UtensilsIcon,
  Clock as ClockIcon,
  Star as StarIcon
} from 'lucide-vue-next';

// Datos de ejemplo para Transporte
const transporte = [
  { id: 1, name: "Uber", image: "https://pedirtaxi24h.app/wp-content/uploads/pedir-taxi-en-peligros-460x301.png"},
  { id: 2, name: "Rentar Auto", image: "https://mundoejecutivo.com.mx/wp-content/uploads/2024/09/donde-esta-permitido-pedir-uber-y-didi-en-el-aicm.jpg" },
  { id: 3, name: "Pedir Camión", image: "https://rlc.es/wp-content/uploads/2023/01/indemnizacion-descarga-camiones.jpg" },
];

// Datos de ejemplo para Mandaditos
const mandaditos = [
  { id: 1, name: "Enviar Paquete", image: "https://tiendasbingo.com/wp-content/uploads/2023/02/DELIVERY.webp" },
  { id: 2, name: "Traer Paquete", image: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://website.myrider.app/wp-content/uploads/2024/06/mandaditos_rider.webp" },
];

// Carrusel automático
const slides = [
  { image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", title: "50% DESCUENTO", description: "En tu primer pedido" },
  { image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", title: "ENVÍO GRATIS", description: "Pedidos +$20" },
  { image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", title: "2x1 EN POSTRES", description: "Válido hoy" },
];

const currentSlide = ref(0);

onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 5000);
});

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
</script>
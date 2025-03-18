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
    <div class="container mx-auto p-4" style="max-width: 99vw;">
      
<!-- Sección de Bienvenida -->
  <div class="welcome-section relative overflow-hidden rounded-lg shadow-md p-6 mb-6 bg-blue-600 text-white"> 
    <div class="neon-background"></div>
    <!-- Contenido de la sección -->
    <div class="welcome-content flex flex-col md:flex-row justify-between items-center"> 
      <div class="text-center md:text-left mb-4 md:mb-0">
        <h1 class="font-bold">Bienvenid@</h1>
        <h1 class="font-bold">{{ clientName }}</h1>
        <p class=" text-gray-200 mt-2">¿De que tienes ganas hoy?</p>
      </div> 
      <div class="flex flex-col items-center"> 
        <div class="bg-blue-100 p-4 rounded-full mb-4 floating-icon">
          <MapPinIcon class="text-blue-600" :size="24" />
        </div> 
        <select v-model="selectedLocation" class="location-selector bg-white text-blue-600 p-2 rounded-lg">
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.name }}
          </option>
        </select>
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
  <div class="categories-section mb-6">
       <h2 class="text-xl font-semibold text-gray-800">Categorias</h2>
    <div class="categories-grid grid grid-cols-4 gap-2">
      <!-- Categoría 1: Pizza -->
      <div 
        class="category-item bg-white rounded-lg shadow-sm p-2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-md"
      >
        <div class="bg-red-100 p-2 rounded-full mb-1">
          <PizzaIcon class="text-red-500" :size="20" />
        </div>
        <span class="text-xs text-gray-700 text-center">Comida Rapida</span>
      </div>

      <!-- Categoría 2: Cafetería -->
      <div 
        class="category-item bg-white rounded-lg shadow-sm p-2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-md"
      >
        <div class="bg-yellow-100 p-2 rounded-full mb-1">
          <CoffeeIcon class="text-yellow-500" :size="20" />
        </div>
        <span class="text-xs text-gray-700 text-center">Bebidas</span>
      </div>

      <!-- Categoría 3: Saludable -->
      <div 
        class="category-item bg-white rounded-lg shadow-sm p-2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-md"
      >
        <div class="bg-green-100 p-2 rounded-full mb-1">
          <SmartphoneIcon class="text-green-500" :size="20" />
        </div>
        <span class="text-xs text-gray-700 text-center">Tecnología</span>
      </div>

      <!-- Categoría 4: Más -->
      <div 
        class="category-item bg-white rounded-lg shadow-sm p-2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-md"
      >
        <div class="bg-blue-100 p-2 rounded-full mb-1">
          <PlusIcon  class="text-blue-500" :size="20" />
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
    <a href="paginas/locales.vue" class="text-blue-600 text-sm font-medium cursor-pointer">Ver todos</a>  </div>
  <div class="overflow-x-auto whitespace-nowrap pb-4">
    <div class="inline-flex space-x-4">
      <div class="flex space-x-4">
  <!-- Tarjeta 1 -->
  <div class="w-56 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
    <div class="h-32 bg-gray-300 relative">
      <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1498654896293-37a3987ea343?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhZmV0ZXJpYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="Cafetería Central" />
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
      <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1565084854426-94235c657ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpenplcmlhJTIwaXRhbGlhbmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="Pizzería Italiana" />
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
      <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1617957718112-8c994534b999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VzaGklMjBleHByZXNzfGVufDB8fDB8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="Sushi Express" />
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
      <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1553909384-b7430e90f454?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVyZ2VyJTIwa2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="Burger King" />
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
</div>


      
<!-- Sección de Locales con Diseño de Mosaico -->
<div class="mb-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold text-gray-800">Locales</h2>
    <span class="text-blue-600 text-sm font-medium">Ver todos</span>
  </div>
  <div class="grid grid-cols-2 gap-2">
    <!-- Tarjeta grande (destacada) -->
    <div class="col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
      <div class="h-48 bg-gray-300 relative">
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
    </div></div></div>
       
 

<!-- Afiliar -->  
<div class="af" style=text-align: center> 
  <div class="p-4 text-white">
    <h3 class="font-bold text-lg" >¡Afiliate con Nosotros!🚀</h3>
    <p class="text-sm" style=margin: 10px >Afiliate como local y <span class="font-bold">aumenta tus ventas</span> o unete como delivery y <span class="font-bold">gana dinero con cada entrega</span></p>
      <div class="affiliate-buttons">
        <button class="affiliate-btn local-btn">📍 Afiliarse como Local</button>
        <button class="affiliate-btn delivery-btn">🚴 Afiliarse como Delivery</button>
      </div>
    </div>
  </div> 
      
  <!-- Sección de Transporte -->  
  <div class="content">  
    <h2 class="text-xl font-semibold text-gray-800"style="text-align: left">Transporte</h2>  
    <p class="section-description" style="text-align: left">Elige la mejor opción para moverte.</p>

    <div class="transport-grid">
      <!-- Tarjeta para Uber -->
      <div class="transport-card uber">
        <div class="card-content">
          <i class="fas fa-taxi"></i>
          <h3>Uber</h3>
          <p>Viaja rápido y seguro con un servicio confiable.</p>
          <button class="card-button" @click="selectTransport('uber')">
            Solicitar
          </button>
        </div>
      </div>

      <!-- Tarjeta para Rentar Auto -->
      <div class="transport-card rentar">
        <div class="card-content">
          <i class="fas fa-car"></i>
          <h3>Rentar Auto</h3>
          <p>Explora a tu ritmo con un auto rentado.</p>
          <button class="card-button" @click="selectTransport('rentar')">
            Solicitar
          </button>
        </div>
      </div>

      <!-- Tarjeta para Flete -->
      <div class="transport-card flete">
        <div class="card-content">
          <i class="fas fa-truck"></i>
          <h3>Flete</h3>
          <p>Transporta tus pertenencias de manera segura.</p>
          <button class="card-button" @click="selectTransport('flete')">
            Solicitar
          </button>
        </div>
      </div>
    </div>
  </div> 


    <!-- Mandaditos -->
<div class="mb-6" style="text-align: center"> 
  <div class="bg-blue-600 rounded-lg p-4 text-white">
    <h3 class="font-bold text-lg" >📦 ¿Necesitas Mandaditos?</h3>
    <p class="text-sm" style="margin: 10px">Nos encargamos de tus recados de manera rápida, segura y confiable.
        ¡Déjanos ayudarte!</p>
      <div class="floating-icon"><i class="fas fa-box"></i></div>
      <button class="cta-button" style="margin: 10px" @click="solicitarMandadito">Solicitar Mandadito</button>
    </div>
  </div> 
      
</div> 
    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
  <div class="flex justify-around items-center">
    <div class="flex flex-col items-center">
      <a href="paginas/Dashboard_Cliente.vue" class="flex flex-col items-center">
        <HomeIcon class="text-blue-600" :size="20" />
        <span class="text-xs text-blue-600 mt-1">Inicio</span>
      </a>
    </div>
    <div class="flex flex-col items-center">
      <a href="paginas/Favoritos.vue" class="flex flex-col items-center">
        <HeartIcon class="text-blue-600" :size="20" />
        <span class="text-xs text-blue-600 mt-1">Favoritos</span>
      </a>
    </div>
    <div class="flex flex-col items-center relative">
      <a href="paginas/Carrito.vue" class="flex flex-col items-center"></a>
      <div class="bg-blue-600 rounded-full p-2">
        <ShoppingCartIcon class="text-white" :size="20" />
      </div>
      <span class="text-xs text-blue-600 mt-1">Carrito</span>
    </div>
    <div class="flex flex-col items-center">
      <a href="paginas/" class="flex flex-col items-center">
        <ShoppingBagIcon class="text-blue-600" :size="20" />
        <span class="text-xs text-blue-600 mt-1">Pedidos</span>
      </a>
    </div>
    <div class="flex flex-col items-center">
      <a href="paginas/Perfil.vue" class="flex flex-col items-center">
        <div class="cursor-pointer">
          <SettingsIcon class="text-blue-600" :size="20" />
        </div>
        <span class="text-xs text-blue-600 mt-1">Configuración</span>
      </a>
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
  Settings as SettingsIcon,
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
  Smartphone as SmartphoneIcon,
  Plus as PlusIcon ,
  Clock as ClockIcon,
  Star as StarIcon
} from 'lucide-vue-next';
const locations= [
        { id: 1, name: "Casa" },
        { id: 2, name: "Oficina" },
        { id: 3, name: "Universidad" },
];
const clientName= "GrecoHDZ";
const selectedLocation = 1;
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

<style scoped>
  .container {
  width: 99%;  
  max-width: 1000px;  
  margin: 0 auto;  
      padding-top: 70px;  
  padding-bottom: 95px;  
  
}
/* Estilos para la sección de bienvenida */ 
.welcome-section {
  position: relative;
  overflow: hidden;
  padding: 16px;  
  border-radius: 12px;  
  background-color: #3b82f6;  
  color: white;  
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  
  margin-bottom: 24px;  
} 
.neon-background {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 70%);
  border: 6px solid rgba(255, 255, 255, 0.9);  
  animation: neon-glow 6s linear infinite;
  z-index: 0;
} 
.welcome-content {
  position: relative;
  z-index: 1;  
  display: flex;
  flex-direction: row;  
  justify-content: space-between;  
  align-items: center;  
} 
.welcome-content h1 {
  font-size: 1.3rem;  
  font-weight: 800;
  margin-bottom: 8px;  
  text-align: left;
}
 
.welcome-content p {
  font-size: 0.8rem;  
  color: #e0e0e0;  
  margin-bottom: 16px;  
  text-align: left;
}
 
.floating-icon {
  font-size: 1.5rem;  
  color: white;
  margin-bottom: 12px;  
  animation: float 3s ease-in-out infinite;
}
 
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
} 
.location-selector {
  padding: 8px;  
  font-size: 0.875rem; 
  border: 2px solid rgba(255, 255, 255, 0.5); 
  border-radius: 8px;  
  background-color: white;
  color: #3b82f6;  
  cursor: pointer;
} 
@keyframes neon-glow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
@media (min-width: 768px) {
  .welcome-section {
    padding: 24px;  
  }

  .welcome-content h1 {
    font-size: 3rem;  
  }

  .welcome-content p {
    font-size: 1.5rem;  
  }
 
  .floating-icon {
    font-size: 2rem;  
    margin-bottom: 16px; 
  }

  .location-selector {
    padding: 12px; 
    font-size: 1rem;  
  }
}
/*Seccion de afiliados */
 .af{
   background: linear-gradient(135deg, #4facfe, #8300fe);
   border-radius: 15px;
 }
  
.affiliate-section {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  margin: 10px auto;
  background: linear-gradient(135deg, #4facfe, #8300fe);
  color: white;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);  
}

.affiliate-content h2 { 
  font-weight: bold; 
}

.affiliate-content p { 
  margin-bottom: 20px;
}

.affiliate-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 10px; 
}

.affiliate-btn {
  padding: 8px 15px;
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  flex: 1 1 120px;
  max-width: 180px;
}
  
/*Seccion de locales */
.local-btn {
  background: #ff7e5f;
  color: white;
}

.local-btn:hover {
  background: white;
  color: #ff7e5f;
}

.delivery-btn {
  background: #34c759;
  color: white;
}

.delivery-btn:hover {
  background: white;
  color: #34c759;
}
.mandaditos-announcement {
  background: linear-gradient(135deg, #0072ff 0%, #0066cc 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 40px 10px;
  margin-top: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: center;
  position: relative;
} 
@media (max-width: 768px) {
  .affiliate-content h2 {
    font-size: 1.5rem;  
  }

  .affiliate-content p {
    font-size: 1rem;  
  }

  .affiliate-btn {
    padding: 8px 16px;  
  }
}

/* Categoria */
.cta-button {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
.categories-section {
  margin-bottom: 25px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  
  gap: 15px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.category-item:active {
  transform: translateY(2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.category-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}
.category-name {
  font-size: 0.9rem;
  text-align: center;
}
  
/* Transporte */ 
.content {
  padding: 20px;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.section-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.transport-grid {
  display: flex;
  justify-content: space-between; 
  gap: 10px; 
  flex-wrap: wrap; 
}

.transport-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1 1 30%;
  min-width: 250px; 
  max-width: 300px; 
  text-align: center;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.transport-card:hover {
  transform: translateY(-5px);
}

.transport-card.uber {
  border: 2px solid #1fbad6;
  background-image: url("https://pedirtaxi24h.app/wp-content/uploads/pedir-taxi-en-peligros-460x301.png");
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
  position: relative; 
  color: white; 
  height: 250px; 
}

.transport-card.uber::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);  
  z-index: 1;  
}

.card-content {
  position: relative;  
  z-index: 2;  
}
.transport-card.rentar {
  border: 2px solid #1fbad6;
  background-image: url("https://mundoejecutivo.com.mx/wp-content/uploads/2024/09/donde-esta-permitido-pedir-uber-y-didi-en-el-aicm.jpg");
  background-size: cover;  
  background-position: center; 
  background-repeat: no-repeat;  
  position: relative;  
  color: white;  
  height: 250px;  
}

.transport-card.rentar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);  
  z-index: 1;  
}

.transport-card.flete {
  border: 2px solid #1fbad6;
  background-image: url("https://terramerida.com/wp-content/uploads/2023/04/Copia-de-Terra-Me%CC%81rida-1.png");
  background-size: cover;  
  background-position: center; 
  background-repeat: no-repeat; 
  position: relative; 
  color: white;  
  height: 250px;  
}

.transport-card.flete::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);  
  z-index: 1;  
}
 
.card-content i {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.card-content h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.card-content p {
  font-size: 1rem;
  color: white;
  margin-bottom: 20px; 
}

.card-button {
  background-color: #1fbad6;
  color: #fff;
  border: none;
  padding: 9px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
    position: absolute; /* Posiciona el botón de forma absoluta */
  top: 160px; /* Espacio desde el fondo de la tarjeta */
  left: 50%; /* Centra horizontalmente */
  transform: translateX(-50%); /* Ajusta para centrar correctamente */
}

.card-button:hover {
  background-color: #1998b0;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .transport-card {  
  min-width: 100px;  
  }
}

@media (max-width: 380px) {
  .transport-card {
    flex: 1 1 100%;  
    max-width: none;  
  }
} 
  /* Seccion mandaditos */
.mandaditos-announcement {
  width: 100%; /* Ancho del 100% */
  max-width: 1200px; /* Ancho máximo para pantallas grandes */
  margin: 0 auto; /* Centra la sección */
  padding: 15px; /* Espaciado interno reducido */
  background-color: #f9f9f9; /* Color de fondo */
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra */
}

.announcement-title {
  font-size: 1.8rem; /* Tamaño del título reducido */
  margin-bottom: 8px; /* Espaciado reducido */
}

.announcement-description {
  font-size: 1rem; /* Tamaño de la descripción reducido */
  margin-bottom: 15px; /* Espaciado reducido */
}

.cta-button {
  background-color: #1fbad6; /* Color del botón */
  color: #fff; /* Color del texto del botón */
  border: none;
  padding: 8px 16px; /* Espaciado del botón reducido */
  border-radius: 5px; /* Bordes redondeados del botón */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #1998b0; /* Cambia el color al pasar el ratón */
}

@media (max-width: 768px) {
  .announcement-title {
    font-size: 1.5rem; /* Tamaño reducido en pantallas pequeñas */
  }

  .announcement-description {
    font-size: 0.9rem; /* Tamaño reducido en pantallas pequeñas */
  }

  .cta-button {
    padding: 6px 12px; /* Tamaño reducido del botón en móviles */
  }
}

/* Footer */
header {
  position: fixed; /* Fija el header en la parte superior */
  top: 0; /* Alínea en la parte superior */
  left: 0; /* Alínea a la izquierda */
  right: 0; /* Alínea a la derecha */
  background-color: white; /* Color de fondo */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra inferior */
  z-index: 1000; /* Asegura que el header esté encima de otros elementos */
}

footer {
  position: fixed; /* Fija el footer en la parte inferior */
  bottom: 0; /* Alínea en la parte inferior */
  left: 0; /* Alínea a la izquierda */
  right: 0; /* Alínea a la derecha */
  background-color: white; /* Color de fondo */
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Sombra superior */
  z-index: 1000; /* Asegura que el footer esté encima de otros elementos */
}
/* Footer */
header {
  position: fixed;  
  top: 0;  
  left: 0;  
  right: 0;  
  background-color: white;  
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
  z-index: 1000;  
}

footer {
  position: fixed;  
  bottom: 0;  
  left: 0;  
  right: 0;  
  background-color: white;  
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);  
  z-index: 1000;  
}
</style>
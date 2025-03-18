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
          <button @click="toggleSidebar" class="text-gray-500">
            <XIcon :size="20" />
          </button>
        </div>
        
        <!-- Data source toggle -->
        <div class="mb-6 p-3 bg-blue-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Fuente de datos</h3>
          <div class="flex bg-white p-1 rounded-lg shadow-sm">
            <button 
              @click="useRealApi = false" 
              :class="!useRealApi ? 'bg-blue-600 text-white' : 'text-gray-700'"
              class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors"
            >
              Mock Data
            </button>
            <button 
              @click="useRealApi = true" 
              :class="useRealApi ? 'bg-blue-600 text-white' : 'text-gray-700'"
              class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors"
            >
              API Real
            </button>
          </div>
        </div>
        
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

    <!-- Overlay para cerrar sidebar -->
    <div 
      v-if="isSidebarOpen" 
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- Contenido principal -->
    <div class="container mx-auto p-4" style="max-width: 99vw;">
      <!-- Indicador de carga -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
      </div>
      
      <div v-else>
        <!-- Sección de Bienvenida -->
        <div class="welcome-section relative overflow-hidden rounded-lg shadow-md p-6 mb-6 bg-blue-600 text-white"> 
          <div class="neon-background"></div>
          <!-- Contenido de la sección -->
          <div class="welcome-content flex flex-col md:flex-row justify-between items-center"> 
            <div class="text-center md:text-left mb-4 md:mb-0">
              <h1 class="font-bold">Bienvenid@</h1>
              <h1 class="font-bold">{{ userData?.nombre || 'Usuario' }}</h1>
              <p class="text-gray-200 mt-2">¿De que tienes ganas hoy?</p>
            </div> 
            <div class="flex flex-col items-center"> 
              <div class="bg-blue-100 p-4 rounded-full mb-4 floating-icon">
                <MapPinIcon class="text-blue-600" :size="24" />
              </div> 
              <select v-model="selectedLocation" class="location-selector bg-white text-blue-600 p-2 rounded-lg">
                <option v-for="location in userLocations" :key="location.id_direccion_cliente" :value="location.id_direccion_cliente">
                  {{ location.alias_direccion }}
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
            v-model="searchQuery"
            placeholder="Buscar restaurantes o platillos..."
            class="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        
        <!-- Sección de Categorías -->
        <div class="categories-section mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Categorias</h2>
          <div class="categories-grid grid grid-cols-4 gap-2">
            <!-- Categoría 1: Comida Rápida -->
            <div 
              class="category-item bg-white rounded-lg shadow-sm p-2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-md"
            >
              <div class="bg-red-100 p-2 rounded-full mb-1">
                <PizzaIcon class="text-red-500" :size="20" />
              </div>
              <span class="text-xs text-gray-700 text-center">Comida Rapida</span>
            </div>

            <!-- Categoría 2: Bebidas -->
            <div 
              class="category-item bg-white rounded-lg shadow-sm p-2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-md"
            >
              <div class="bg-yellow-100 p-2 rounded-full mb-1">
                <CoffeeIcon class="text-yellow-500" :size="20" />
              </div>
              <span class="text-xs text-gray-700 text-center">Bebidas</span>
            </div>

            <!-- Categoría 3: Tecnología -->
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
                <PlusIcon class="text-blue-500" :size="20" />
              </div>
              <span class="text-xs text-gray-700 text-center">Más</span>
            </div>
          </div>
        </div>

        <!-- Carrusel de promociones -->
        <div class="mb-6"> 
          <div class="relative overflow-hidden rounded-lg">
            <div v-if="banners.length === 0" class="h-60 bg-gray-200 flex items-center justify-center">
              <p class="text-gray-500">No hay promociones disponibles</p>
            </div>
            <div 
              v-else
              class="flex transition-transform duration-500 ease-in-out" 
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div
                v-for="(banner, index) in banners"
                :key="index"
                class="min-w-full h-60 bg-cover bg-center flex-shrink-0"
                :style="{ backgroundImage: `url(${banner.imagen_url})` }"
              >
                <div class="bg-black bg-opacity-50 h-full flex flex-col justify-end p-4">
                  <h3 class="text-white text-xl font-bold">{{ banner.titulo }}</h3>
                  <p class="text-white">{{ banner.descripcion }}</p>
                </div>
              </div>
            </div>
            
            <!-- Indicadores de carrusel -->
            <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              <button 
                v-for="(_, index) in banners" 
                :key="index"
                @click="currentSlide = index"
                :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
                class="w-2 h-2 rounded-full transition-all"
              ></button>
            </div>
          </div>
        </div>
 
        <!-- Sección de Productos Recomendados -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Recomendados</h2>
            <a href="#" class="text-blue-600 text-sm font-medium cursor-pointer">Ver todos</a>
          </div>
          
          <div v-if="products.length === 0" class="bg-white rounded-lg p-8 text-center">
            <ShoppingBagIcon :size="48" class="mx-auto text-gray-300 mb-2" />
            <p class="text-gray-500">No hay productos recomendados</p>
          </div>
          
          <div v-else class="overflow-x-auto whitespace-nowrap pb-4">
            <div class="inline-flex space-x-4">
              <div class="flex space-x-4">
                <!-- Tarjeta de Producto 1 -->
                <div v-for="(product, index) in products.slice(0, 4)" :key="index" class="w-56 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div class="h-32 bg-gray-300 relative">
                    <img class="w-full h-full object-cover" :src="product.image" :alt="product.name" />
                    <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
                      <HeartIcon class="text-gray-400" :size="16" />
                    </div>
                  </div>
                  <div class="p-3">
                    <h3 class="font-semibold text-gray-800">{{ product.name }}</h3>
                    <div class="flex items-center justify-between mt-2">
                      <div class="text-sm font-bold text-blue-600">{{ product.price }}</div>
                      <button class="bg-blue-600 text-white text-xs px-2 py-1 rounded">Agregar</button>
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
          
          <div v-if="locales.length === 0" class="bg-white rounded-lg p-8 text-center">
            <StoreIcon :size="48" class="mx-auto text-gray-300 mb-2" />
            <p class="text-gray-500">No hay locales disponibles</p>
          </div>
          
          <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div 
              v-for="(local, index) in locales.slice(0, 6)" 
              :key="index" 
              class="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div class="h-40 bg-gray-300 relative">
                <img class="w-full h-full object-cover" :src="local.imagen_url" :alt="local.nombre_local" />
                <div class="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <ClockIcon class="text-blue-600 mr-1" :size="12" />
                  <span>{{ getRandomDeliveryTime() }}</span>
                </div>
                <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
                  <HeartIcon class="text-gray-400" :size="16" />
                </div>
              </div>
              <div class="p-3">
                <h3 class="font-semibold text-gray-800">{{ local.nombre_local }}</h3>
                <div class="flex items-center text-xs text-gray-500 mt-1">
                   
                  <span>{{ getCategoryForLocal(local) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Afiliar -->  
        <div class="af mb-6"> 
          <div class="p-4 text-white">
            <h3 class="font-bold text-lg">¡Afiliate con Nosotros!🚀</h3>
            <p class="text-sm" style="margin: 10px">Afiliate como local y <span class="font-bold">aumenta tus ventas</span> o unete como delivery y <span class="font-bold">gana dinero con cada entrega</span></p>
              <div class="affiliate-buttons">
                <button class="affiliate-btn local-btn">📍 Afiliarse como Local</button>
                <button class="affiliate-btn delivery-btn">🚴 Afiliarse como Delivery</button>
              </div>
            </div>
          </div> 
          
        <!-- Sección de Transporte -->  
        <div class="content mb-6">  
          <h2 class="text-xl font-semibold text-gray-800" style="text-align: left">Transporte</h2>  
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
            <h3 class="font-bold text-lg">📦 ¿Necesitas Mandaditos?</h3>
            <p class="text-sm" style="margin: 10px">Nos encargamos de tus recados de manera rápida, segura y confiable.
                ¡Déjanos ayudarte!</p>
              <div class="floating-icon"><i class="fas fa-box"></i></div>
              <button class="cta-button" style="margin: 10px" @click="solicitarMandadito">Solicitar Mandadito</button>
            </div>
          </div> 
      </div>
    </div> 
    
    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center">
          <a href="#" class="flex flex-col items-center">
            <HomeIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Inicio</span>
          </a>
        </div>
        <div class="flex flex-col items-center">
          <a href="#" class="flex flex-col items-center">
            <HeartIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Favoritos</span>
          </a>
        </div>
        <div class="flex flex-col items-center relative">
          <a href="#" class="flex flex-col items-center"></a>
          <div class="bg-blue-600 rounded-full p-2">
            <ShoppingCartIcon class="text-white" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Carrito</span>
        </div>
        <div class="flex flex-col items-center">
          <a href="#" class="flex flex-col items-center">
            <ShoppingBagIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Pedidos</span>
          </a>
        </div>
        <div class="flex flex-col items-center">
          <a href="#" class="flex flex-col items-center">
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
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
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
  Plus as PlusIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  X as XIcon,
  Store as StoreIcon
} from 'lucide-vue-next';

// Estado de carga y fuente de datos
const loading = ref(true);
const useRealApi = ref(false);
const API_URL = 'http://localhost:4000';

// Estado de la interfaz
const isSidebarOpen = ref(false);
const searchQuery = ref('');
const currentSlide = ref(0);

// Datos del usuario
const userData = ref(null);
const userLocations = ref([]);
const selectedLocation = ref('');

// Datos de la aplicación
const banners = ref([]);
const locales = ref([]);
const products = ref([]);

// Función para alternar la barra lateral
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Solicitar transporte
const selectTransport = (type) => {
  console.log(`Servicio de transporte seleccionado: ${type}`);
};

// Solicitar mandadito
const solicitarMandadito = () => {
  console.log('Mandadito solicitado');
};

// Cargar datos desde la API o mock data
const loadData = async () => {
  loading.value = true;
  
  try {
    if (useRealApi.value) {
      // Cargar datos desde la API
      await Promise.all([
        loadUserData(),
        loadUserLocations(),
        loadBanners(),
        loadLocales()
      ]);
      // Generar productos (no hay API para esto)
      generateMockProducts();
    } else {
      // Cargar datos simulados
      loadMockData();
    }
  } catch (error) {
    console.error('Error cargando datos:', error);
    // Fallback a datos mock en caso de error
    loadMockData();
  } finally {
    loading.value = false;
  }
};

// Funciones para cargar datos reales desde la API
const loadUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/clientes/1`); // ID del cliente fijo para demostración
    userData.value = response.data;
  } catch (error) {
    console.error('Error cargando datos del cliente:', error);
    throw error;
  }
};

const loadUserLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/direccionesclientes/1`); // ID del cliente fijo para demostración
    userLocations.value = response.data;
    if (userLocations.value.length > 0) {
      selectedLocation.value = userLocations.value[0].id_direccion_cliente;
    }
  } catch (error) {
    console.error('Error cargando direcciones del cliente:', error);
    throw error;
  }
};

const loadBanners = async () => {
  try {
    const response = await axios.get(`${API_URL}/banners`);
    banners.value = response.data.filter(banner => banner.activo);
  } catch (error) {
    console.error('Error cargando banners:', error);
    throw error;
  }
};

const loadLocales = async () => {
  try {
    const response = await axios.get(`${API_URL}/locales`);
    locales.value = response.data.filter(local => local.activo);
  } catch (error) {
    console.error('Error cargando locales:', error);
    throw error;
  }
};

// Función para generar productos random (no hay API)
const generateMockProducts = () => {
  const productNames = [
    'Café Americano', 'Hamburguesa Clásica', 'Pizza Margherita', 
    'Sushi Mix', 'Ensalada César', 'Pasta Carbonara', 
    'Tacos al Pastor', 'Smoothie de Frutas'
  ];
  
  const images = [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Café
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Hamburguesa
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Pizza
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Sushi
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Ensalada
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Pasta
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Tacos
    'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Smoothie
  ];
  
  products.value = productNames.map((name, index) => ({
    id: index + 1,
    name,
    price: `$${(5 + Math.random() * 15).toFixed(2)}`,
    image: images[index]
  }));
};

// Función para cargar datos mock
const loadMockData = () => {
  // Datos del usuario
  userData.value = {
    nombre: 'GrecoHDZ',
    telefono: '+1234567890',
    activo: true
  };
  
  // Direcciones del usuario
  userLocations.value = [
    { id_direccion_cliente: 1, alias_direccion: 'Casa', colonia: 'Colonia Centro', direccion_precisa: 'Calle Principal #123' },
    { id_direccion_cliente: 2, alias_direccion: 'Oficina', colonia: 'Zona Empresarial', direccion_precisa: 'Edificio Torre Alta, Piso 5' },
    { id_direccion_cliente: 3, alias_direccion: 'Universidad', colonia: 'Ciudad Universitaria', direccion_precisa: 'Campus Central' }
  ];
  selectedLocation.value = 1;
  
  // Banners publicitarios
  banners.value = [
    { 
      id_banner: 1, 
      titulo: '50% DESCUENTO', 
      descripcion: 'En tu primer pedido',
      imagen_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
      activo: true
    },
    { 
      id_banner: 2, 
      titulo: 'ENVÍO GRATIS', 
      descripcion: 'Pedidos +$20', 
      imagen_url: 'https://images.unsplash.com/photo-1498579397066-22750a3cb424?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
      activo: true
    },
    { 
      id_banner: 3, 
      titulo: '2x1 EN POSTRES', 
      descripcion: 'Válido hoy', 
      imagen_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
      activo: true
    }
  ];
  
  // Productos
  products.value = [
    {
      id: 1,
      name: 'Café Americano',
      price: '$3.99',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      name: 'Hamburguesa Clásica',
      price: '$8.99',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      name: 'Pizza Margherita',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 4,
      name: 'Sushi Mix',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    }
  ];
  
  // Locales
  locales.value = [
    {
      id_local: 1,
      nombre_local: 'Cafetería Central',
      imagen_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      apertura: '08:00:00',
      cierre: '20:00:00',
      activo: true
    },
    {
      id_local: 2,
      nombre_local: 'Pizzería Italiana',
      imagen_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      apertura: '11:00:00',
      cierre: '22:00:00',
      activo: true
    },
    {
      id_local: 3,
      nombre_local: 'Sushi Express',
      imagen_url: 'https://images.unsplash.com/photo-1617196701537-7329482cc9fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      apertura: '12:00:00',
      cierre: '23:00:00',
      activo: true
    },
    {
      id_local: 4,
      nombre_local: 'Burger King',
      imagen_url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      apertura: '10:00:00',
      cierre: '00:00:00',
      activo: true
    },
    {
      id_local: 5,
      nombre_local: 'Taquería El Paso',
      imagen_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      apertura: '10:00:00',
      cierre: '22:00:00',
      activo: true
    },
    {
      id_local: 6,
      nombre_local: 'Heladería Dulce',
      imagen_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      apertura: '11:00:00',
      cierre: '21:00:00',
      activo: true
    }
  ];
};

// Funciones de utilidad
const getRandomDeliveryTime = () => {
  const minTime = 15 + Math.floor(Math.random() * 15);
  const maxTime = minTime + 10;
  return `${minTime}-${maxTime} min`;
};

const getCategoryForLocal = (local) => {
  const categories = ['Café', 'Comida Rápida', 'Restaurante', 'Postres', 'Sushi', 'Pizzería'];
  
  // Intentar asignar por nombre
  if (local.nombre_local.toLowerCase().includes('café') || local.nombre_local.toLowerCase().includes('coffee')) {
    return 'Café';
  } 
  if (local.nombre_local.toLowerCase().includes('pizza')) {
    return 'Pizzería';
  }
  if (local.nombre_local.toLowerCase().includes('sushi')) {
    return 'Sushi';
  }
  if (local.nombre_local.toLowerCase().includes('burger')) {
    return 'Comida Rápida';
  }
  if (local.nombre_local.toLowerCase().includes('helad')) {
    return 'Postres';
  }
  if (local.nombre_local.toLowerCase().includes('taqu')) {
    return 'Comida Rápida';
  }
  
  // Si no hay coincidencia, asignar aleatoriamente
  return categories[Math.floor(Math.random() * categories.length)];
};

// Iniciar carrusel automático
const startCarouselInterval = () => {
  setInterval(() => {
    if (banners.value.length > 0) {
      currentSlide.value = (currentSlide.value + 1) % banners.value.length;
    }
  }, 5000);
};

// Observer para recargar datos cuando cambia el modo API/mock
watch(useRealApi, () => {
  loadData();
});

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
  startCarouselInterval();
});
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
    background-image: url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80");
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
    background-image: url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80");
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
    background-image: url("https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80");
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
</style>
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
   <!-- Header -->
   <HeaderComponent />

    <!-- Modal de Notificaciones (mantenido igual) -->
    <transition name="fade">
      <div v-if="isModalOpen" class="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
        <h3 class="font-bold text-lg mb-2 text-blue-600">Notificaciones</h3>
        <div v-if="notifications.length > 0">
          <div
            v-for="(notification, index) in notifications"
            :key="index"
            class="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            @click="markAsRead(notification.id)"
            :class="{ 'bg-gray-100': notification.read }"
          >
            <p class="text-sm text-gray-700">{{ notification.message }}</p>
            <span v-if="!notification.read" class="text-xs text-blue-500">Nueva</span>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">
          No tienes notificaciones nuevas.
        </div>
        <button
          @click="closeNotifications"
          class="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-500 transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </transition>

    <!-- Contenido Pricipal -->
    <div class="px-6 py-8 pb-32 max-w-7xl mx-auto">
      <!-- Header de Página con Diseño Mejorado -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Catálogo de Productos</h1>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <p class="text-indigo-600 text-lg">
            Nuestros productos <span class="text-indigo-800 font-semibold">de la más alta calidad</span>
          </p>
          <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-white p-1 rounded-full shadow-sm">
            <span class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm py-1 px-3 rounded-full shadow-sm">
              {{ useApiData ? 'Datos API' : 'Datos Locales' }}
            </span>
            <button
              @click="toggleDataSource"
              class="text-gray-500 hover:text-indigo-600 p-1"
              title="Cambiar fuente de datos"
            >
              <RefreshCwIcon :size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Panel de control y búsqueda -->
      <div class="mb-8 bg-white rounded-xl shadow-md p-6 border border-indigo-100">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Búsqueda -->
          <div class="relative">
            <label class="block text-xs font-medium text-indigo-600 mb-1 ml-1">Buscar</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar productos..."
              class="w-full pl-12 pr-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-base"
            >
            <SearchIcon class="absolute left-4 top-9 text-indigo-400" :size="20" />
          </div>

          <!-- Sucursal -->
          <div class="lg:col-span-2 order-2 lg:order-2">
            <label class="block text-xs font-medium text-indigo-600 mb-1 ml-1">Sucursal</label>
            <div class="relative">
              <select
  v-model="selectedBranch"
  class="w-full appearance-none bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-700"
  @change="branchChanged"
>
  <option v-for="branch in branches" :key="branch.id_direccion_local" :value="branch.id_direccion_local">
    {{ branch.colonia }} - {{ branch.direccion_precisa }}
  </option>
</select>
              <ChevronDownIcon class="absolute right-3 bottom-3 text-indigo-400" :size="18" />
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="relative w-20 h-20">
          <div class="absolute top-0 left-0 w-full h-full rounded-full border-8 border-indigo-200"></div>
          <div class="absolute top-0 left-0 w-full h-full rounded-full border-8 border-transparent border-t-indigo-600 animate-spin"></div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="bg-red-50 p-6 rounded-xl shadow-md text-center my-10">
        <AlertTriangleIcon :size="50" class="text-red-500 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-red-700 mb-2">Error al cargar los productos</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="fetchData"
          class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Reintentar
        </button>
      </div>

      <!-- Mensaje sin resultados -->
      <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="bg-indigo-50 p-6 rounded-full mb-6">
          <PackageXIcon :size="80" class="text-indigo-300" />
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">No se encontraron productos</h3>
        <p class="text-indigo-600 mb-6 max-w-md">
          Intenta con otra búsqueda o selecciona otra sucursal
        </p>
      </div>

      <!-- Grid de Productos Mejorado -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-indigo-100 relative transform hover:-translate-y-1 flex flex-col"
        >
          <!-- Badges (ofertas) -->
          <div v-if="product.discountedPrice" class="absolute top-3 left-3 z-10">
            <div class="bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center">
              <TagIcon :size="12" class="mr-1" />
              Oferta
            </div>
          </div>

          <!-- Imagen del producto -->
          <div class="relative h-56 overflow-hidden bg-indigo-50">
            <img
              :src="product.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen'"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- Información del producto -->
          <div class="p-5 pt-4 flex-grow flex flex-col">
            <!-- Nombre y precio -->
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-lg line-clamp-2 pr-2">
                {{ product.name }}
              </h3>
              <div>
                <div v-if="product.discountedPrice" class="flex flex-col items-end">
                  <span class="line-through text-gray-500 text-sm">${{ formatPrice(product.price) }}</span>
                  <span class="font-bold text-red-600 text-lg">${{ formatPrice(product.discountedPrice) }}</span>
                </div>
                <div v-else class="font-bold text-indigo-600 text-lg">
                  ${{ formatPrice(product.price) }}
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ product.description || 'Sin descripción disponible' }}
            </p>

            <!-- Botón de agregar al carrito -->
            <button
              @click="openModal(product)"
              class="mt-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <ShoppingCartIcon :size="18" />
              <span>Agregar al carrito</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <transition name="modal">
      <div v-if="selectedProduct" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto z-10 overflow-hidden">
            <!-- Header del modal -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white">
                Detalles del Producto
              </h2>
              <button @click="closeModal" class="text-white hover:text-indigo-100">
                <XIcon :size="24" />
              </button>
            </div>

            <div class="p-6">
              <!-- Imagen del producto -->
              <div class="rounded-xl overflow-hidden h-56 mb-6">
                <img
                  :src="selectedProduct.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen'"
                  :alt="selectedProduct.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Nombre y precio -->
              <div class="flex justify-between items-start mb-4">
                <h3 class="font-bold text-gray-800 text-xl">
                  {{ selectedProduct.name }}
                </h3>
                <div>
                  <div v-if="selectedProduct.discountedPrice" class="flex flex-col items-end">
                    <span class="line-through text-gray-500 text-sm">${{ formatPrice(selectedProduct.price) }}</span>
                    <span class="font-bold text-red-600 text-xl">${{ formatPrice(selectedProduct.discountedPrice) }}</span>
                  </div>
                  <div v-else class="font-bold text-indigo-600 text-xl">
                    ${{ formatPrice(selectedProduct.price) }}
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <p class="text-gray-600 mb-6">
                {{ selectedProduct.description || 'Sin descripción disponible' }}
              </p>

              <!-- Cantidad -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <div class="flex items-center max-w-xs mx-auto">
                  <button
                    @click="decrementQuantity"
                    class="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold w-10 h-10 rounded-l-lg flex items-center justify-center transition-colors"
                  >
                    <MinusIcon :size="18" />
                  </button>
                  <div class="flex-1 bg-indigo-50 h-10 flex items-center justify-center text-xl font-bold text-indigo-700">
                    {{ quantity }}
                  </div>
                  <button
                    @click="incrementQuantity"
                    class="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold w-10 h-10 rounded-r-lg flex items-center justify-center transition-colors"
                  >
                    <PlusIcon :size="18" />
                  </button>
                </div>
              </div>

              <!-- Atributos (Sabor, Tamaño) -->
              <div v-if="selectedProduct.attributes && selectedProduct.attributes.length > 0" class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Atributos</label>
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="attribute in selectedProduct.attributes" :key="attribute.id"
                      :class="['flex items-center justify-center p-3 rounded-lg cursor-pointer border transition-colors',
                                selectedAttribute === attribute.id
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300']"
                      @click="selectedAttribute = attribute.id">
                    <div class="text-center">
                      <div class="font-medium">{{ attribute.name }}: {{ attribute.value }}</div>
                      <div v-if="attribute.price" class="text-xs mt-1" :class="selectedAttribute === attribute.id ? 'text-indigo-100' : 'text-gray-500'">
                        +${{ formatPrice(attribute.price) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Extras -->
              <div v-if="selectedProduct.extras && selectedProduct.extras.length > 0" class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Extras</label>
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="extra in selectedProduct.extras" :key="extra.id"
                      :class="['flex items-center p-3 rounded-lg cursor-pointer border transition-colors',
                                extra.selected
                                  ? 'bg-indigo-50 border-indigo-300'
                                  : 'bg-white border-gray-200 hover:border-indigo-200']"
                      @click="extra.selected = !extra.selected">
                    <input
                      type="checkbox"
                      :checked="extra.selected"
                      class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      @click.stop
                    >
                    <div class="ml-3">
                      <div class="font-medium text-gray-700">{{ extra.name }}</div>
                      <div class="text-xs text-gray-500">+${{ formatPrice(extra.price) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón de agregar al carrito -->
              <button
                @click="addToCart(selectedProduct)"
                class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ShoppingCartIcon :size="18" />
                <span>Agregar al Carrito - ${{ formatPrice(totalPrice) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast de notificación -->
    <transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-8 right-8 p-4 rounded-xl shadow-xl z-50 max-w-sm flex items-center gap-3"
        :class="toastClasses"
      >
        <div class="p-2 bg-white bg-opacity-25 rounded-full">
          <component :is="toastIcon" :size="20" class="text-white" />
        </div>
        <p class="text-white font-medium">{{ toast.message }}</p>
        <button @click="toast.show = false" class="ml-auto text-white hover:text-gray-200">
          <XIcon :size="16" />
        </button>
      </div>
    </transition>


    <!-- Footer -->
    <FooterComponent />

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  Home as HomeIcon,
  Heart as HeartIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  ChevronDown as ChevronDownIcon,
  PackageX as PackageXIcon,
  Tag as TagIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-vue-next';

const selectedProfile = ref("Cliente");
const router = useRouter();

const redirectToProfile = () => {
  switch (selectedProfile.value) {
    case 'Cliente':
      router.push('/Dashboard_Cliente');
      break;
    case 'Local':
      router.push('/Dashboard_Local');
      break;
    case 'Delivery':
      router.push('/Dashboard_Driver');
      break;
    default:
      break;
  }
};
// Estado para alternar entre API y mock data
const useApiData = ref(false);
const loading = ref(false);
const error = ref(null);

// API URL
const API_URL = 'http://localhost:4000';

// Variables Globales
const localId = ref(10); // ID fijo del local para este ejemplo
const id_cliente = 18; // Reemplazar con el ID del cliente real
const id_direccion_cliente = 3; // Reemplazar con el ID de la dirección del cliente real
const idPedido = ref(null);
const carritoIndicador = ref(false);

// Variables para almacenar datos
const localName = ref("Mini Sper Diprocon");
const branches = ref([
  { id_direccion_local: 1, colonia: "Sucursal Centro", direccion_precisa: "Dirección 1" },
  { id_direccion_local: 2, colonia: "Sucursal Norte", direccion_precisa: "Dirección 2" },
]);
const products = ref([]);

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "American BBQ Single",
    description: "A flame-grilled whopper patty, topped with American cheese, fresh slices of tomato and crisp lettuce, and finished with a zesty BBQ sauce and golden crispy onions.",
    price: 3.80,
    discountedPrice: 3.80,
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    attributes: [
      { id: 1, name: "Tamaño", value: "Regular", price: 0 },
      { id: 2, name: "Tamaño", value: "Large", price: 1.00 },
    ],
    extras: [
      { id: 101, name: "Tomato", price: 1.00, selected: false },
      { id: 102, name: "Lettuce", price: 0.50, selected: false },
      { id: 103, name: "Onion", price: 0.50, selected: false },
    ],
  },
  {
    id: 2,
    name: "Fried Cheese Wonton",
    description: "Crispy fried cream cheese wontons are filled with cream cheese, lemon and green onions.",
    price: 2.00,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    name: "Chicken Dumplings",
    description: "With a side of fried rice or supreme soy noodles, and steamed chinese greens.",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 4,
    name: "Whopper",
    description: "A flame-grilled beef patty, topped with tomatoes, fresh cut lettuce, mayo, ketchup, pickles, and onions.",
    price: 2.00,
    image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 5,
    name: "Cheeseburger",
    description: "Juicy beef patty with melted cheese, pickles, onions, and ketchup.",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a9ec03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 6,
    name: "Veggie Wrap",
    description: "Fresh vegetables wrapped in a soft tortilla with hummus and avocado.",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 7,
    name: "Spicy Chicken Sandwich",
    description: "Crispy chicken fillet with spicy mayo, lettuce, and pickles.",
    price: 5.00,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a9ec03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 8,
    name: "French Fries",
    description: "Golden crispy fries served with ketchup or mayo.",
    price: 1.50,
    image: "https://images.unsplash.com/photo-1526234362653-3b75a0ad0746?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 9,
    name: "Chocolate Milkshake",
    description: "Creamy chocolate milkshake topped with whipped cream.",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
  },
  {
    id: 10,
    name: "Apple Pie",
    description: "Warm apple pie with a flaky crust and cinnamon sugar topping.",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1348&q=80",
  },
];

const searchQuery = ref("");
const selectedBranch = ref(branches.value[0]?.id || null);
const selectedProduct = ref(null);
const quantity = ref(1);
const selectedAttribute = ref(null);

// Toast notifications
const toast = ref({
  show: false,
  type: 'success',
  message: ''
});

const toastClasses = computed(() => {
  switch (toast.value.type) {
    case 'success': return 'bg-gradient-to-r from-emerald-500 to-green-500';
    case 'error': return 'bg-gradient-to-r from-rose-500 to-red-500';
    case 'warning': return 'bg-gradient-to-r from-amber-500 to-yellow-500';
    case 'info': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
});

const toastIcon = computed(() => {
  switch (toast.value.type) {
    case 'success': return CheckCircleIcon;
    case 'error': return AlertCircleIcon;
    case 'warning': return AlertTriangleIcon;
    case 'info': return InfoIcon;
    default: return InfoIcon;
  }
});

// Función para mostrar toast
const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    type,
    message
  };

  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Configuración del socket
const socket = io('http://localhost:4000');

// Función para cargar sucursales desde la API
const fetchBranches = async () => {
  if (!useApiData.value) return;
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`${API_URL}/direccionesLocales/${localId.value}`);

    if (response.data) {
      if (response.data.length > 0) {
        branches.value = response.data;
        selectedBranch.value = response.data[0].id_direccion_local;
      } else {
        branches.value = [];
        selectedBranch.value = null;
      }
    }
  } catch (err) {
    console.error("Error al cargar sucursales:", err);
    error.value = `Error al cargar las sucursales: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// Función para formatear precios
const formatPrice = (price) => {
  if (price === undefined || price === null) return '0.00';
  return parseFloat(price).toFixed(2);
};

// Función para cargar productos desde la API
const fetchProducts = async () => {
  if (!useApiData.value) {
    // Usar mock data
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular carga
    products.value = mockProducts;
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // 1. Primero obtener productos por sucursal
    const productoSucursalResponse = await axios.get(`${API_URL}/productosucursal/sucursal/${selectedBranch.value}`);

    if (!productoSucursalResponse.data || productoSucursalResponse.data.length === 0) {
      products.value = [];
      loading.value = false;
      return;
    }

    // 2. Obtener todos los productos del local
    const allProductsResponse = await axios.get(`${API_URL}/productos/${localId.value}`);
    const allProducts = allProductsResponse.data || [];

    // 3. Combinar datos de productos con sus relaciones de sucursal
    const productsList = [];

    for (const productoSucursal of productoSucursalResponse.data) {
      // Buscar información completa del producto
      const productData = allProducts.find(p => p.id_producto === productoSucursal.id_producto);

      if (productData) {
        // Inicializar el producto con datos básicos
        const product = {
          id: productData.id_producto,
          name: productData.nombre_producto,
          description: productData.descripcion_producto,
          // Usar el precio de la sucursal
          price: parseFloat(productoSucursal.precio || 0),
          // Si existe precioofertafinal en la sucursal, usarlo como precio con descuento
          discountedPrice: productoSucursal.precioofertafinal ? parseFloat(productoSucursal.precioofertafinal) :
                          (productoSucursal.preciooferta ? parseFloat(productoSucursal.preciooferta) : null),
          image: productData.imagen_url,
          attributes: [],
          extras: []
        };

        try {
          // 4. Cargar atributos del producto
          const atributosResponse = await axios.get(`${API_URL}/atributos/${productData.id_producto}`);

          if (atributosResponse.data && Array.isArray(atributosResponse.data)) {
            // Mapear atributos al formato esperado
            product.attributes = atributosResponse.data.map(attr => ({
              id: attr.id_atributo,
              name: attr.nombre_atributo,
              value: attr.valor,
              price: parseFloat(attr.precio_adicional || 0)
            }));
          }
        } catch (err) {
          console.error(`Error al cargar atributos del producto ${productData.id_producto}:`, err);
        }

        try {
          // 5. Cargar extras del producto
          const extrasResponse = await axios.get(`${API_URL}/extra/${productData.id_producto}`);

          if (extrasResponse.data && Array.isArray(extrasResponse.data)) {
            // Mapear extras al formato esperado
            product.extras = extrasResponse.data
              .filter(extra => extra.activo) // Solo considerar extras activos
              .map(extra => ({
                id: extra.id || extra.nombre, // Usar el ID si existe, si no el nombre como identificador
                name: extra.nombre,
                price: parseFloat(extra.precio || 0),
                selected: false // Estado inicial no seleccionado
              }));
          }
        } catch (err) {
          console.error(`Error al cargar extras del producto ${productData.id_producto}:`, err);
        }

        productsList.push(product);
      }
    }

    products.value = productsList;

  } catch (err) {
    console.error("Error al cargar productos:", err);
    error.value = `Error al cargar los productos: ${err.message}`;
    // Fallback a datos mock en caso de error
    products.value = mockProducts;
    showToast('Error al cargar productos de la API. Mostrando datos locales.', 'warning');
  } finally {
    loading.value = false;
  }
};

// Función para cargar datos según la fuente seleccionada
const fetchData = async () => {
  await fetchBranches();
  await fetchProducts();
};

// Alternar entre API y datos mock
const toggleDataSource = () => {
  useApiData.value = !useApiData.value;
  showToast(`Usando ${useApiData.value ? 'datos de la API' : 'datos locales'}`, 'info');
  fetchData();
  checkCartStatus();
};

// Observar cambios en el modo de datos para recargar
watch(useApiData, fetchData);

// Observar cambios en la sucursal seleccionada
const branchChanged = () => {
  console.log("Sucursal seleccionada:", selectedBranch.value);
  if (selectedBranch.value) {
    fetchProducts(); // Llamar a fetchProducts solo si hay una sucursal seleccionada
  } else {
    console.warn("No se ha seleccionado ninguna sucursal.");
  }
};

// Filtrar productos por búsqueda
const filteredProducts = computed(() => {
  if (!products.value) return [];
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// Abrir modal con detalles del producto
const openModal = (product) => {
  // Resetear extras si existen
  if (product.extras) {
    product.extras.forEach(extra => extra.selected = false);
  }

  selectedProduct.value = product;
  selectedAttribute.value = product.attributes && product.attributes.length > 0 ? product.attributes[0].id : null;
  quantity.value = 1;
};

// Cerrar modal
const closeModal = () => {
  selectedProduct.value = null;
};

// Incrementar cantidad
const incrementQuantity = () => {
  quantity.value++;
};

// Decrementar cantidad
const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// Calcular precio total
const totalPrice = computed(() => {
  if (!selectedProduct.value) return 0;

  // Precio base (normal o con descuento)
  let basePrice = selectedProduct.value.discountedPrice || selectedProduct.value.price;

  // Precio del atributo seleccionado
  const attribute = selectedProduct.value.attributes?.find(attr => attr.id === selectedAttribute.value);
  const attributePrice = attribute ? attribute.price : 0;

  // Precio de los extras seleccionados
  const extrasPrice = selectedProduct.value.extras?.filter(extra => extra.selected)
    .reduce((sum, extra) => sum + extra.price, 0) || 0;

  return (basePrice + attributePrice + extrasPrice) * quantity.value;
});

// Agregar al carrito
const addToCart = async (product) => {
  try {
    // Validar que se haya seleccionado una sucursal
    if (!selectedBranch.value) {
      showToast('Por favor selecciona una sucursal', 'error');
      return;
    }

    // Validar que se haya seleccionado una dirección de cliente
    if (!id_direccion_cliente) {
      showToast('Por favor selecciona una dirección de entrega', 'error');
      return;
    }

    // Calcular el precio final
    const finalPrice = totalPrice.value;

    // Obtener el atributo seleccionado si existe
    const selectedAttributeDetails = product.attributes?.find(attr => attr.id === selectedAttribute.value);

    // Obtener los extras seleccionados
    const selectedExtras = product.extras?.filter(extra => extra.selected) || [];

    // Crear un objeto para almacenar los atributos seleccionados
    const attributesData = selectedAttributeDetails ? {
      [selectedAttributeDetails.name]: {
        id: selectedAttributeDetails.id,
        value: selectedAttributeDetails.value,
        price: selectedAttributeDetails.price
      }
    } : {};

    // Crear un objeto para almacenar los extras seleccionados
    const extrasData = selectedExtras.reduce((acc, extra) => {
      acc[extra.id] = {
        name: extra.name,
        price: extra.price
      };
      return acc;
    }, {});

    if (useApiData.value) {
      // MODO API: Realizar llamadas reales a la API

      // 1. Crear el pedido
      const pedidoResponse = await axios.post(`${API_URL}/pedidos/${id_cliente}`, {
        id_local: localId.value,
        id_direccion_cliente: id_direccion_cliente,
        id_direccion_local: selectedBranch.value,
      });

      // 2. Obtener el ID del pedido
      idPedido.value = pedidoResponse.data.id_pedido;
      console.log("ID del pedido:", idPedido.value);

      // 3. Crear el detalle del pedido (carrito)
      const detalleData = {
        id_pedido: parseInt(idPedido.value),
        id_producto: parseInt(product.id),
        nombre_producto: product.name.substring(0, 255),
        precio_unitario: parseFloat(product.discountedPrice || product.price),
        cantidad: parseInt(quantity.value),
        subtotal: parseFloat(finalPrice),
        atributos: attributesData,
        extras: extrasData
      };

      console.log('Enviando datos al carrito:', detalleData);

      try {
        await axios.post(`${API_URL}/carrito/${idPedido.value}`, detalleData);

        // Emitir evento de nuevo pedido a través del socket
        socket.emit('nuevo_pedido', {
          id_pedido: idPedido.value,
          id_cliente: id_cliente,
          id_local: localId.value,
          id_direccion_cliente: id_direccion_cliente,
          id_direccion_local: selectedBranch.value,
          fecha_pedido: new Date().toISOString(),
          estado: 'pendiente',
          items: [{
            nombre_producto: product.name,
            cantidad: quantity.value,
            precio_unitario: product.discountedPrice || product.price,
            subtotal: finalPrice,
            atributos: attributesData,
            extras: extrasData
          }]
        });

        // Actualizar el contador del carrito
        await checkCartStatus();

        // Mostrar notificación de éxito
        showToast(`${quantity.value} ${product.name} agregado al carrito`, 'success');
      } catch (error) {
        console.error('Error al crear el detalle del pedido:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Error al crear el detalle del pedido');
      }
    } else {
      // MODO SIMULACIÓN
      await new Promise(resolve => setTimeout(resolve, 800));
      idPedido.value = Math.floor(Math.random() * 1000) + 1; // Generar ID aleatorio para demo

      console.log('Item agregado al carrito:', {
        id_pedido: idPedido.value,
        producto: product.name,
        cantidad: quantity.value,
        atributos: attributesData,
        extras: extrasData,
        precio_total: finalPrice
      });

      // Activa el marcador en modo mock
      cartHasItems.value = true;

      // Mostrar notificación de éxito
      showToast(`${quantity.value} ${product.name} agregado al carrito`, 'success');
    }

    // Cerrar modal después de agregar al carrito
    closeModal();

  } catch (error) {
    console.error('Error al agregar al carrito:', error);

    // Manejar diferentes tipos de errores
    if (error.response) {
      // Error de respuesta del servidor
      const errorMessage = error.response.data.message || 'Error al agregar al carrito';
      showToast(errorMessage, 'error');
    } else if (error.request) {
      // Error de red
      showToast('Error de conexión. Por favor verifica tu conexión a internet.', 'error');
    } else {
      // Otros errores
      showToast('Error al agregar al carrito: ' + error.message, 'error');
    }
  }
};

const checkCartStatus = async () => {
  if (useApiData.value) {
    try {
      const response = await axios.get(`${API_URL}/pedidos/count/${id_cliente}`);
      console.log("respuesta del carrito: ", JSON.stringify(response.data));  // Convertir a cadena para ver todo el objeto
      if (response.data.hasPedidos) {
      // Mostrar el punto en el carrito
      carritoIndicador.value = true;
    } else {
      carritoIndicador.value = false;
    }
  } catch (error) {
    console.error('Error al obtener el indicador del carrito:', error);
  }
}
};

// Inicialización
onMounted(() => {
  fetchBranches().then(() => {});
});
</script>

<style>
/* Animaciones para modal */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animación para toast */
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Utilidades de clipping text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
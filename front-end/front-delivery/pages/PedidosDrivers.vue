<template>
  <div class="app-container" :class="isDarkMode ? 'dark' : ''">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <TruckIcon :size="24" />
          <span>DeliveryPro</span>
        </div>
        
        <div class="header-controls">
          <!-- Selector de fuente de datos y notificaciones a la derecha -->
        <div class="flex items-center space-x-4">
          <div class="relative inline-block">
            <select 
              v-model="dataSource" 
              class="pl-3 pr-8 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchOrders"
              :disabled="loading"
            >
              <option value="mock">Datos de ejemplo</option>
              <option value="api">API Local</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDownIcon :size="14" class="text-gray-500 dark:text-gray-400" />
            </div>
            <div v-if="loading" class="absolute right-10 top-1">
              <div class="w-4 h-4 border-2 border-t-blue-600 border-blue-600 rounded-full animate-spin"></div> </div>
            </div>
          </div>
          <select
            v-model="selectedProfile"
            @change="redirectToProfile"
            class="profile-selector"
            
          >
            <option value="Cliente">Cliente</option>
            <option value="Local">Local</option>
            <option value="Delivery">Delivery</option>
            <option value="Admin">Admin</option>
            <option value="SuperAdmin">SuperAdmin</option>
          </select>        
          <div class="notification-icon">
            <BellIcon :size="20" />
            <div
              v-if="unreadNotifications.length > 0"
              class="notification-badge"
            >
              {{ unreadNotifications.length }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Pestañas -->
    <div class="tabs">
      <button
        @click="activeTab = 'pending'"
        :class="['tab-button', activeTab === 'pending' ? 'active' : '']"
      >
        Pendientes
      </button>
      <button
        @click="activeTab = 'accepted'"
        :class="['tab-button', activeTab === 'accepted' ? 'active' : '']"
      >
        Aceptados
      </button>
    </div>

    <!-- Contenido Principal -->
    <main class="main-content">
      <!-- Pedidos Pendientes - Vista de Tarjetas -->
      <div v-if="activeTab === 'pending'" class="cards-container">
        <!-- Estado vacío -->
        <div v-if="pendingOrdersNotSent.length === 0" class="empty-state">
          <PackageSearchIcon :size="60" />
          <p>No hay pedidos pendientes disponibles</p>
          <p class="empty-subtitle">Las nuevas solicitudes aparecerán aquí</p>
        </div>
        
        <!-- Contenedor de tarjetas estilo Tinder -->
        <div v-else class="cards-stack">
          <div 
            v-for="(order, index) in pendingOrdersNotSent" 
            :key="order.id"
            class="order-card"
            :class="{ 
              'active': currentCardIndex === index
            }"
            :style="getCardStyle(index)"
            @touchstart="startDrag"
            @touchmove="onDrag"
            @touchend="endDrag"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
          >
            <div class="card-header">
              <div class="order-number">Pedido #{{ order.id }}</div>
              <div class="order-time">{{ formatDate(order.time) }}</div>
            </div>
            
            <div class="order-details">
              <div class="detail-row">
                <StoreIcon :size="18" />
                <div class="location">
                  <span class="location-label">Recoger en:</span>
                  <span class="location-address">{{ order.storeLocation }}</span>
                </div>
              </div>
              
              <div class="location-divider">
                <div class="divider-line"></div>
                <div class="divider-dot"></div>
              </div>
              
              <div class="detail-row">
                <MapPinIcon :size="18" />
                <div class="location">
                  <span class="location-label">Entregar en:</span>
                  <div class="location-address">
                    {{ order.destination }}
                    <InfoIcon 
                      :size="16" 
                      class="address-icon" 
                      @click="viewFullAddress('Dirección de entrega', order.fullDestination)" 
                    />
                  </div>
                </div>
              </div>
              
              <div class="product-actions">
                <button @click="viewProducts(order.products)" class="view-products-button">
                  <EyeIcon :size="16" />
                  <span>Ver Productos ({{ order.products.length }})</span>
                </button>
              </div>
            </div>
            
            <div class="card-actions">
              <button class="action-skip" @click="skipOrder(order.id)">
                <XIcon :size="16" />
                <span>Omitir</span>
              </button>
              <button class="action-send" @click="openFareModal(order.id)">
                <SendIcon :size="16" />
                <span>Enviar Tarifa</span>
              </button>
            </div>
            
            <div class="swipe-overlay">
              <div class="swipe-indicator skip" v-if="swipeDirection === 'left'">
                <XIcon :size="24" />
                <span>OMITIR</span>
              </div>
              <div class="swipe-indicator send" v-if="swipeDirection === 'right'">
                <SendIcon :size="24" />
                <span>TARIFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pedidos Aceptados -->
      <div v-if="activeTab === 'accepted'" class="accepted-orders">
        <div v-if="acceptedOrders.length === 0" class="empty-state">
          <TruckIcon :size="60" />
          <p>No tienes pedidos aceptados</p>
          <p class="empty-subtitle">Los pedidos aceptados aparecerán aquí</p>
        </div>
        
        <div v-else class="accepted-list">
          <div v-for="order in acceptedOrders" :key="order.id" class="accepted-card two-column">
            <div class="order-info-column">
              <div class="order-header">
                <div class="order-title">
                  <div class="order-number">Pedido #{{ order.id }}</div>
                  <div class="order-status" :class="order.isPickedUp ? 'delivering' : 'pickup'">
                    {{ order.isPickedUp ? 'En camino' : 'Por recoger' }}
                  </div>
                </div>
                <div class="order-fare">L. {{ Number(order.fare).toFixed(2) }}</div>
              </div>
              
              <div class="order-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{width: getProgressWidth(order)}"></div>
                </div>
                <div class="progress-steps">
                  <div class="progress-step" :class="{'completed': true}">
                    <div class="step-icon">
                      <CheckIcon v-if="true" :size="14" />
                    </div>
                    <span>Aceptado</span>
                  </div>
                  <div class="progress-step" :class="{'completed': order.isPickedUp}">
                    <div class="step-icon">
                      <CheckIcon v-if="order.isPickedUp" :size="14" />
                      <span v-else>2</span>
                    </div>
                    <span>Recogido</span>
                  </div>
                  <div class="progress-step" :class="{'completed': order.isDelivered}">
                    <div class="step-icon">
                      <CheckIcon v-if="order.isDelivered" :size="14" />
                      <span v-else>3</span>
                    </div>
                    <span>Entregado</span>
                  </div>
                </div>
              </div>
              
              <div class="order-info-section">
                <h4 class="section-title">Detalles del pedido</h4>
                <div class="info-row">
                  <div class="info-label">Aceptado:</div>
                  <div class="info-value">{{ formatDate(order.acceptedAt) }}</div>
                </div>
                <div class="info-row prep-time">
                  <div class="info-label">Tiempo de preparación:</div>
                  <div class="info-value prep-value">
                    <ClockIcon :size="16" />
                    <span>{{ order.prepTime }} minutos</span>
                  </div>
                </div>
                <div class="info-row products-row">
                  <div class="info-label">Productos:</div>
                  <div @click="viewProducts(order.products)" class="view-products-icon">
                    <EyeIcon :size="16" />
                  </div>
                </div>
              </div>
              
              <div class="order-locations">
                <div class="location-row">
                  <div class="location-icon pickup">
                    <StoreIcon :size="16" />
                  </div>
                  <div class="location-text">{{ order.storeLocation }}</div>
                </div>
                
                <div class="location-row">
                  <div class="location-icon dropoff">
                    <MapPinIcon :size="16" />
                  </div>
                  <div class="location-text">
                    {{ order.destination }}
                    <InfoIcon 
                      :size="16" 
                      class="address-icon" 
                      @click="viewFullAddress('Dirección de entrega', order.fullDestination)" 
                    />
                  </div>
                </div>
              </div>
              
              <div class="order-details-row">
                <div class="detail-col">
                  <PhoneIcon :size="16" />
                  <span>{{ order.clientPhone }}</span>
                </div>
                <div class="detail-col">
                  <UserIcon :size="16" />
                  <span>{{ order.clientName }}</span>
                </div>
              </div>
              
              <div class="order-actions">
                <button 
                  v-if="!order.isPickedUp" 
                  @click="showPickupModal(order.id)" 
                  class="action-button pickup-button"
                >
                  <ShoppingBagIcon :size="16" />
                  <span>Marcar como Recogido</span>
                </button>
                <button 
                  v-if="order.isPickedUp && !order.isDelivered" 
                  @click="showDeliveryCodeModal(order.id)" 
                  class="action-button deliver-button"
                >
                  <CheckIcon :size="16" />
                  <span>Marcar como Entregado</span>
                </button>
              </div>
            </div>
            
            <div class="map-column">
              <div class="map-preview" :id="'map-' + order.id"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="flex flex-col items-center">
          <a href="/Dashboard_Driver" class="flex flex-col items-center">
            <HomeIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Inicio</span>
          </a>
        </div>
        <div class="flex flex-col items-center">
          <a href="PedidosDrivers" class="flex flex-col items-center">
            <ShoppingBagIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Pedidos</span>
          </a>
        </div>
      </div>
    </footer>
    
    <!-- Modal para Enviar Tarifa -->
    <div v-if="fareModalOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Enviar Tarifa</h3>
          <button @click="closeFareModal" class="close-button">
            <XIcon :size="16" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="order-summary">
            <div class="summary-row">
              <StoreIcon :size="16" />
              <span>{{ selectedOrder ? selectedOrder.storeLocation : '' }}</span>
            </div>
            <div class="summary-row">
              <MapPinIcon :size="16" />
              <span>{{ selectedOrder ? selectedOrder.destination : '' }}</span>
            </div>
          </div>
          
          <div class="fare-input-container">
            <span class="currency-label">L.</span>
            <input
              v-model="fareAmount"
              type="number"
              placeholder="Ingresa tu tarifa"
              class="fare-input"
              min="1"
            />
          </div>
          
          <div class="suggested-fares">
            <p>Tarifas sugeridas:</p>
            <div class="fare-buttons">
              <button 
                v-for="amount in [50, 75, 100]" 
                :key="amount"
                @click="fareAmount = amount"
                :class="['fare-button', fareAmount == amount ? 'selected' : '']"
              >
                L. {{ amount }}
              </button>
            </div>
          </div>
          
          <!-- Botón de auto-asignar solo para Admin y SuperAdmin -->
          <div v-if="['Admin', 'SuperAdmin'].includes(selectedProfile)" class="auto-assign-option">
            <button @click="autoAssignOrder(selectedOrderId)" class="auto-assign-button">
              <CheckIcon :size="16" />
              <span>Auto-asignar con tarifa de L. 85</span>
            </button>
            <p class="auto-assign-note">Como {{ selectedProfile }}, puedes asignar este pedido automáticamente sin esperar la aprobación del cliente.</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="sendFare" class="modal-button confirm" :disabled="!fareAmount">
            <SendIcon :size="16" />
            <span>{{ ['Admin', 'SuperAdmin'].includes(selectedProfile) ? 'Enviar y Asignar' : 'Enviar Tarifa' }}</span>
          </button>
          <button @click="closeFareModal" class="modal-button cancel">
            <XIcon :size="16" />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal para Ver Productos -->
    <div v-if="productsModalOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Productos</h3>
          <button @click="closeProductsModal" class="close-button">
            <XIcon :size="16" />
          </button>
        </div>
        
        <div class="modal-body">
          <ul class="products-list">
            <li 
              v-for="product in selectedProducts" 
              :key="product.id"
              class="product-item"
            >
              <div class="product-details">
                <div class="product-icon">
                  <ShoppingBagIcon :size="14" />
                </div>
                <span class="product-name">{{ product.name }}</span>
              </div>
              <div class="product-quantity">x{{ product.quantity }}</div>
            </li>
          </ul>
        </div>
        
        <div class="modal-footer">
          <button @click="closeProductsModal" class="modal-button cancel full-width">
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal para ver dirección completa -->
    <div v-if="addressModalOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="address-modal-header">
          <h3>{{ selectedAddress.title }}</h3>
          <button @click="closeAddressModal" class="close-button">
            <XIcon :size="16" />
          </button>
        </div>
        
        <div class="address-detail-container">
          <div class="address-detail-row">
            <MapPinIcon :size="20" />
            <div>
              <div class="address-detail-label">Dirección completa:</div>
              <div class="address-detail-value">{{ selectedAddress.address }}</div>
            </div>
          </div>
          
          <div class="address-action-row">
            <button @click="closeAddressModal" class="address-action-button secondary">
              <XIcon :size="16" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para Tiempo Estimado de Llegada -->
    <div v-if="estimatedTimeModalOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Tiempo Estimado de Llegada</h3>
          <button @click="closeEstimatedTimeModal" class="close-button">
            <XIcon :size="16" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="estimated-time-info">
            <p>¿Cuánto tiempo estimas que tardarás en llegar al destino?</p>
          </div>
          
          <div class="time-input-container">
            <input
              v-model="estimatedArrivalTime"
              type="number"
              placeholder="Tiempo en minutos"
              class="time-input"
              min="1"
            />
            <span class="time-label">minutos</span>
          </div>
          
          <div class="suggested-times">
            <p>Tiempos sugeridos:</p>
            <div class="time-buttons">
              <button 
                v-for="time in [10, 15, 20, 25, 30]" 
                :key="time"
                @click="estimatedArrivalTime = time"
                :class="['time-button', estimatedArrivalTime == time ? 'selected' : '']"
              >
                {{ time }} min
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="confirmPickupWithTime" class="modal-button confirm" :disabled="!estimatedArrivalTime">
            <CheckIcon :size="16" />
            <span>Confirmar</span>
          </button>
          <button @click="closeEstimatedTimeModal" class="modal-button cancel">
            <XIcon :size="16" />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal para Código de Entrega -->
    <div v-if="deliveryCodeModalOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirmar Entrega</h3>
          <button @click="closeDeliveryCodeModal" class="close-button">
            <XIcon :size="16" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="estimated-time-info">
            <p>Por favor, ingresa el código de entrega proporcionado por el cliente:</p>
          </div>
          
          <div class="delivery-code-container">
            <input
              v-model="deliveryCode"
              type="text"
              placeholder="Código de entrega"
              class="delivery-code-input"
              maxlength="6"
            />
          </div>
          
          <div v-if="deliveryCodeError" class="delivery-code-error">
            <AlertCircleIcon :size="16" />
            <span>{{ deliveryCodeError }}</span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="confirmDeliveryWithCode" class="modal-button confirm" :disabled="!deliveryCode">
            <CheckIcon :size="16" />
            <span>Confirmar Entrega</span>
          </button>
          <button @click="closeDeliveryCodeModal" class="modal-button cancel">
            <XIcon :size="16" />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Notificaciones Toast -->
    <div class="toast-container">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
          <div class="toast-icon">
            <CheckCircleIcon v-if="toast.type === 'success'" :size="16" />
            <AlertCircleIcon v-if="toast.type === 'info'" :size="16" />
            <XCircleIcon v-if="toast.type === 'error'" :size="16" />
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button @click="dismissToast(toast.id)" class="toast-close">
            <XIcon :size="12" />
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Eye as EyeIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  Check as CheckIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  X as XIcon,
  Store as StoreIcon,
  Package as PackageIcon,
  Send as SendIcon,
  PackageSearch as PackageSearchIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  ChevronDown as ChevronDownIcon,
  RefreshCw as RefreshCwIcon
} from "lucide-vue-next";
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
      case 'Delivery':
      router.push('/Dashboard_Driver');  
      break;
      case 'Delivery':
      router.push('/Dashboard_Superadmin');  
      break;
    default:
      break;
  }
};
// Fuente de datos
const dataSource = ref('mock');
const loading = ref(false);
const error = ref(null);

// Configuración de direcciones para todos los pedidos
const fixedLocations = {
  cliente: {
    direccion: 'Ceutec, La Ceiba',
    latitud: 15.768179164281971,
    longitud: -86.78981884103158
  },
  local: {
    direccion: 'Mall Megaplaza, Local 45',
    latitud: 15.771274584888115,
    longitud: -86.79179628996306
  }
};

// Datos mockup para pedidos (pendientes y aceptados)
const mockPendingOrders = [
  {
    id: 101,
    time: "2023-12-15T10:30:00",
    productCount: 3,
    storeLocation: "Burger King - Mall Megaplaza",
    destination: "Ceutec, La Ceiba",
    fullDestination: "Ceutec, La Ceiba",
    products: [
      { id: 1, name: "Hamburguesa Clásica", quantity: 2 },
      { id: 2, name: "Papas Fritas", quantity: 1 },
    ],
    fareSent: false,
    fareAmount: null,
    direccion_cliente: fixedLocations.cliente,
    direccion_local: fixedLocations.local
  },
  {
    id: 102,
    time: "2023-12-15T09:45:00",
    productCount: 5,
    storeLocation: "Supermercado La Colonia - Mall Megaplaza",
    destination: "Ceutec, La Ceiba",
    fullDestination: "Ceutec, La Ceiba",
    products: [
      { id: 3, name: "Pizza Pepperoni", quantity: 1 },
      { id: 4, name: "Refresco", quantity: 4 },
    ],
    fareSent: true,
    fareAmount: 85,
    direccion_cliente: fixedLocations.cliente,
    direccion_local: fixedLocations.local
  },
  {
    id: 103,
    time: "2023-12-15T08:20:00",
    productCount: 2,
    storeLocation: "Farmacia Kielsa - Mall Megaplaza",
    destination: "Ceutec, La Ceiba",
    fullDestination: "Ceutec, La Ceiba",
    products: [
      { id: 5, name: "Medicamentos", quantity: 2 },
    ],
    fareSent: false,
    fareAmount: null,
    direccion_cliente: fixedLocations.cliente,
    direccion_local: fixedLocations.local
  },
];

const mockAcceptedOrders = [
  {
    id: 104,
    clientName: "Juan Pérez",
    clientPhone: "9955-6677",
    productCount: 2,
    storeLocation: "Plaza Mundo - Mall Megaplaza",
    destination: "Ceutec, La Ceiba",
    fullDestination: "Ceutec, La Ceiba",
    prepTime: 15,
    fare: 90,
    acceptedAt: "2023-12-15T14:30:00",
    isPickedUp: false,
    isDelivered: false,
    progress: 33,
    deliveryCode: "123456",
    products: [
      { id: 6, name: "Hamburguesa Doble", quantity: 1 },
      { id: 7, name: "Refresco Grande", quantity: 1 }
    ],
    direccion_cliente: fixedLocations.cliente,
    direccion_local: fixedLocations.local
  },
];

// Theme
const isDarkMode = ref(false);

// Sidebar
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Perfil seleccionado
const selectedProfile = ref("Delivery");

// Pestañas
const activeTab = ref("pending");

// Datos para pedidos
const pendingOrders = ref([]);
const acceptedOrders = ref([]);

// Mapa de Leaflet
const maps = ref({});
const mapInitialized = ref({});

// Filtrar pedidos pendientes sin ofertas enviadas
const pendingOrdersNotSent = computed(() => {
  return pendingOrders.value.filter(order => !order.fareSent);
});

// Función principal para obtener los pedidos según la fuente de datos
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  pendingOrders.value = [];
  acceptedOrders.value = [];

  try {
    if (dataSource.value === 'mock') {
      // Simular retardo de red para datos mock
      await new Promise(resolve => setTimeout(resolve, 800));
      pendingOrders.value = [...mockPendingOrders];
      acceptedOrders.value = [...mockAcceptedOrders];
    } else {
      // Obtener datos reales de la API
      const response = await fetch('http://localhost:4000/pedidos');
      
      if (!response.ok) {
        throw new Error(`Error al obtener pedidos: ${response.status}`);
      }
      
      const allOrders = await response.json();
      
      // Mapear datos de la API al formato esperado
      const mappedOrders = await mapOrdersFromAPI(allOrders);
      
      // Dividir en pendientes y aceptados
      pendingOrders.value = mappedOrders.pendingOrders;
      acceptedOrders.value = mappedOrders.acceptedOrders;
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = dataSource.value === 'mock' 
      ? 'Error al cargar los datos de ejemplo. Por favor intenta de nuevo.' 
      : 'Error al conectar con la API local. Asegúrate que http://localhost:4000 esté disponible.';
  } finally {
    loading.value = false;
  }
};

// Mapear datos de la API al formato esperado por la UI
const mapOrdersFromAPI = async (apiOrders) => {
  try {
    // Obtener detalles de pedidos
    const detallesResponse = await fetch('http://localhost:4000/carrito');
    if (!detallesResponse.ok) {
      throw new Error(`Error al obtener detalles de pedidos: ${detallesResponse.status}`);
    }
    const detalles = await detallesResponse.json();
    
    // Obtener información de clientes
    const clientesResponse = await fetch('http://localhost:4000/clientes');
    if (!clientesResponse.ok) {
      throw new Error(`Error al obtener clientes: ${clientesResponse.status}`);
    }
    const clientes = await clientesResponse.json();
    
    // Arreglos para separar pedidos
    const pendingOrders = [];
    const acceptedOrders = [];
    
    // Procesar cada pedido
    apiOrders.forEach(pedido => {
      // Encontrar detalles asociados al pedido
      const pedidoDetalles = detalles.filter(d => d.id_pedido === pedido.id_pedido);
      
      // Encontrar cliente asociado al pedido
      const cliente = clientes.find(c => c.id_cliente === pedido.id_cliente);
      
      // Extraer productos del pedido
      const products = pedidoDetalles.map(detalle => ({
        id: detalle.id_pedido_detalle,
        name: detalle.nombre_producto,
        quantity: detalle.cantidad,
        price: parseFloat(detalle.precio_unitario)
      }));
      
      // Formatear la ubicación del local con Mall Megaplaza
      const storeLocation = `Local #${pedido.id_local} - Mall Megaplaza`;
      
      // Crear objeto base del pedido
      const baseOrder = {
        id: pedido.id_pedido,
        time: pedido.fecha_pedido,
        productCount: products.length,
        storeLocation: storeLocation,
        destination: "Ceutec, La Ceiba",
        fullDestination: "Ceutec, La Ceiba",
        products: products,
        direccion_cliente: fixedLocations.cliente,
        direccion_local: fixedLocations.local,
        deliveryCode: "123456" // Código de entrega fijo para todos los pedidos
      };
      
      // Separar pedidos según su estado
      if (pedido.estado === 'pendiente_local' || pedido.estado === 'pendiente_deposito') {
        // Este pedido está pendiente para drivers
        pendingOrders.push({
          ...baseOrder,
          fareSent: false,
          fareAmount: null
        });
      } else if (pedido.estado === 'preparando_pedido' || pedido.estado === 'en_camino') {
        // Este pedido ya está asignado/aceptado
        acceptedOrders.push({
          ...baseOrder,
          clientName: cliente ? cliente.nombre : 'Cliente sin nombre',
          clientPhone: cliente ? cliente.telefono : 'Sin teléfono',
          prepTime: pedido.tiempo_preparacion_estimado || 15,
          fare: parseFloat(pedido.tarifa || 85), // Asegurar que la tarifa sea un número
          acceptedAt: pedido.fecha_pedido,
          isPickedUp: pedido.estado === 'en_camino',
          isDelivered: pedido.estado === 'entregado',
          progress: pedido.estado === 'preparando_pedido' ? 33 : 
                  pedido.estado === 'en_camino' ? 66 : 
                  pedido.estado === 'entregado' ? 100 : 33
        });
      }
    });
    
    return {
      pendingOrders,
      acceptedOrders
    };
  } catch (error) {
    console.error('Error mapping API data:', error);
    throw error;
  }
};

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return date.toLocaleDateString('es-ES', options);
};

// Control de tarjetas (estilo Tinder)
const currentCardIndex = ref(0);
const swipeDirection = ref(null);
const dragStartX = ref(0);
const dragOffsetX = ref(0);
const isDragging = ref(false);

const getCardStyle = (index) => {
  if (index !== currentCardIndex.value) {
    return {
      transform: `translateX(${(index - currentCardIndex.value) * 10}px) translateY(${(index - currentCardIndex.value) * 8}px) scale(${1 - (index - currentCardIndex.value) * 0.05})`,
      opacity: `${1 - (index - currentCardIndex.value) * 0.2}`,
      zIndex: `${pendingOrdersNotSent.value.length - index}`
    };
  }
  
  if (isDragging.value) {
    return {
      transform: `translateX(${dragOffsetX.value}px) rotate(${dragOffsetX.value * 0.05}deg)`,
      zIndex: `${pendingOrdersNotSent.value.length + 1}`
    };
  }
  
  return {
    zIndex: `${pendingOrdersNotSent.value.length + 1}`
  };
};

const startDrag = (event) => {
  if (currentCardIndex.value >= pendingOrdersNotSent.value.length) {
    return;
  }
  
  isDragging.value = true;
  dragStartX.value = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
  dragOffsetX.value = 0;
  
  event.preventDefault();
};

const onDrag = (event) => {
  if (!isDragging.value) return;
  
  const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
  dragOffsetX.value = currentX - dragStartX.value;
  
  // Determinar dirección de deslizamiento
  if (dragOffsetX.value > 50) {
    swipeDirection.value = 'right';
  } else if (dragOffsetX.value < -50) {
    swipeDirection.value = 'left';
  } else {
    swipeDirection.value = null;
  }
};

const endDrag = () => {
  if (!isDragging.value) return;
  
  if (dragOffsetX.value > 100) {
    // Enviar tarifa (deslizamiento derecha)
    openFareModal(pendingOrdersNotSent.value[currentCardIndex.value].id);
  } else if (dragOffsetX.value < -100) {
    // Omitir pedido (deslizamiento izquierda)
    skipOrder(pendingOrdersNotSent.value[currentCardIndex.value].id);
  }
  
  resetCardDrag();
};

const resetCardDrag = () => {
  isDragging.value = false;
  dragOffsetX.value = 0;
  swipeDirection.value = null;
};

// Modal para enviar tarifa
const fareModalOpen = ref(false);
const fareAmount = ref("");
const selectedOrderId = ref(null);
const selectedOrder = computed(() => {
  return pendingOrders.value.find(order => order.id === selectedOrderId.value);
});

const openFareModal = (orderId) => {
  selectedOrderId.value = orderId;
  fareAmount.value = "";
  fareModalOpen.value = true;
};

const closeFareModal = () => {
  fareModalOpen.value = false;
  fareAmount.value = "";
  selectedOrderId.value = null;
};

const sendFare = () => {
  if (!fareAmount.value) return;
  
  // Convertir fareAmount a número
  const numericFare = Number(fareAmount.value);
  
  // Si estamos usando la API, intentar enviar la tarifa
  if (dataSource.value === 'api') {
    // Aquí se implementaría la llamada a la API para enviar la tarifa
    // Por ejemplo:
    // fetch(`http://localhost:4000/pedidos/${selectedOrderId.value}/fare`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fare: numericFare })
    // });
  }
  
  const order = pendingOrders.value.find(o => o.id === selectedOrderId.value);
  if (order) {
    order.fareSent = true;
    order.fareAmount = numericFare;
    
    // Si es Admin o SuperAdmin, asignar automáticamente
    if (selectedProfile.value === 'Admin' || selectedProfile.value === 'SuperAdmin') {
      const orderIndex = pendingOrders.value.findIndex(o => o.id === selectedOrderId.value);
      
      // Asignar inmediatamente sin esperar respuesta del cliente
      acceptedOrders.value.unshift({
        id: order.id,
        clientName: "Cliente " + order.id,
        clientPhone: "9" + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
        productCount: order.productCount,
        storeLocation: order.storeLocation,
        destination: order.destination,
        fullDestination: order.fullDestination,
        prepTime: Math.floor(Math.random() * 10) + 10,
        fare: numericFare,
        acceptedAt: new Date().toISOString(),
        isPickedUp: false,
        isDelivered: false,
        progress: 33,
        products: order.products,
        direccion_cliente: order.direccion_cliente,
        direccion_local: order.direccion_local,
        deliveryCode: "123456" // Código de entrega para el nuevo pedido
      });
      
      // Eliminar de pendientes
      pendingOrders.value.splice(orderIndex, 1);
      
      // Ajustar índice de tarjeta actual si es necesario
      if (currentCardIndex.value >= pendingOrdersNotSent.value.length) {
        currentCardIndex.value = Math.max(0, pendingOrdersNotSent.value.length - 1);
      }
      
      showToast("Pedido asignado", `Como ${selectedProfile.value}, has sido asignado automáticamente al pedido #${order.id}`, "success");
      
      // Cambiar a la pestaña de aceptados
      activeTab.value = "accepted";
    } else {
      // Para usuarios normales, mostrar que la tarifa fue enviada y esperar respuesta
      showToast("Tarifa enviada", `Has enviado una tarifa de L. ${numericFare} para el pedido #${selectedOrderId.value}`, "success");
      
      // Simular respuesta del cliente después de un tiempo (solo para datos mock)
      if (dataSource.value === 'mock') {
        setTimeout(() => {
          const orderIndex = pendingOrders.value.findIndex(o => o.id === selectedOrderId.value);
          
          // 70% de probabilidad de aceptación
          if (Math.random() > 0.3) {
            // Aceptar oferta
            acceptedOrders.value.unshift({
              id: order.id,
              clientName: "Cliente " + order.id,
              clientPhone: "9" + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
              productCount: order.productCount,
              storeLocation: order.storeLocation,
              destination: order.destination,
              fullDestination: order.fullDestination,
              prepTime: Math.floor(Math.random() * 10) + 10,
              fare: numericFare,
              acceptedAt: new Date().toISOString(),
              isPickedUp: false,
              isDelivered: false,
              progress: 33,
              products: order.products,
              direccion_cliente: order.direccion_cliente,
              direccion_local: order.direccion_local,
              deliveryCode: "123456" // Código de entrega para el nuevo pedido
            });
            
            // Eliminar de pendientes
            pendingOrders.value.splice(orderIndex, 1);
            
            // Ajustar índice de tarjeta actual si es necesario
            if (currentCardIndex.value >= pendingOrdersNotSent.value.length) {
              currentCardIndex.value = Math.max(0, pendingOrdersNotSent.value.length - 1);
            }
            
            showToast("¡Tarifa aceptada!", `Tu tarifa para el pedido #${order.id} ha sido aceptada`, "success");
            
            // Cambiar a la pestaña de aceptados
            activeTab.value = "accepted";
          } else {
            // Rechazar oferta
            order.fareSent = false;
            order.fareAmount = null;
            showToast("Tarifa rechazada", `Tu tarifa para el pedido #${order.id} fue rechazada`, "error");
          }
        }, Math.floor(Math.random() * 3000) + 2000);
      }
    }
  }
  
  closeFareModal();
};

// Auto asignación para admin/superadmin
const autoAssignOrder = (orderId) => {
  if (selectedProfile.value === 'Admin' || selectedProfile.value === 'SuperAdmin') {
    // Si estamos usando la API, intentar auto-asignar el pedido
    if (dataSource.value === 'api') {
      // Aquí se implementaría la llamada a la API para auto-asignar
      // Por ejemplo:
      // fetch(`http://localhost:4000/pedidos/${orderId}/auto-assign`, {
      //   method: 'POST'
      // });
    }
    
    const order = pendingOrders.value.find(o => o.id === orderId);
    if (order) {
      // Tarifa fija para auto-asignación
      const fixedFare = 85;
      
      acceptedOrders.value.unshift({
        id: order.id,
        clientName: "Cliente " + order.id,
        clientPhone: "9" + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
        productCount: order.productCount,
        storeLocation: order.storeLocation,
        destination: order.destination,
        fullDestination: order.fullDestination,
        prepTime: Math.floor(Math.random() * 10) + 10,
        fare: fixedFare,
        acceptedAt: new Date().toISOString(),
        isPickedUp: false,
        isDelivered: false,
        progress: 33,
        products: order.products,
        direccion_cliente: order.direccion_cliente,
        direccion_local: order.direccion_local,
        deliveryCode: "123456" // Código de entrega para el nuevo pedido
      });
      
      // Eliminar de pendientes
      const orderIndex = pendingOrders.value.findIndex(o => o.id === orderId);
      pendingOrders.value.splice(orderIndex, 1);
      
      // Ajustar índice de tarjeta actual si es necesario
      if (currentCardIndex.value >= pendingOrdersNotSent.value.length) {
        currentCardIndex.value = Math.max(0, pendingOrdersNotSent.value.length - 1);
      }
      
      showToast("Pedido auto-asignado", `Como ${selectedProfile.value}, te has asignado automáticamente el pedido #${order.id}`, "success");
      
      // Cambiar a la pestaña de aceptados
      activeTab.value = "accepted";
      
      // Cerrar el modal
      closeFareModal();
    }
  } else {
    showToast("No autorizado", "Solo Admin y SuperAdmin pueden auto-asignarse pedidos", "error");
  }
};

// Omitir pedido
const skipOrder = (orderId) => {
  const orderIndex = pendingOrders.value.findIndex(o => o.id === orderId);
  
  if (orderIndex !== -1) {
    // Mover la tarjeta al final del mazo o eliminarla
    const order = pendingOrders.value.splice(orderIndex, 1)[0];
    
    // Opcionalmente, puedes volver a agregar la tarjeta al final
    // pendingOrders.value.push(order);
    
    // Ajustar índice de tarjeta actual si es necesario
    if (currentCardIndex.value >= pendingOrdersNotSent.value.length) {
      currentCardIndex.value = Math.max(0, pendingOrdersNotSent.value.length - 1);
    }
    
    showToast("Pedido omitido", `Has omitido el pedido #${orderId}`, "info");
  }
};

// Cancelar oferta
const cancelOffer = (orderId) => {
  // Si estamos usando la API, intentar cancelar la oferta
  if (dataSource.value === 'api') {
    // Aquí se implementaría la llamada a la API para cancelar la oferta
    // Por ejemplo:
    // fetch(`http://localhost:4000/pedidos/${orderId}/cancel-fare`, {
    //   method: 'POST'
    // });
  }
  
  const order = pendingOrders.value.find(o => o.id === orderId);
  if (order) {
    order.fareSent = false;
    order.fareAmount = null;
    showToast("Oferta cancelada", `Has cancelado tu oferta para el pedido #${orderId}`, "info");
  }
};

// Modal para ver productos
const productsModalOpen = ref(false);
const selectedProducts = ref([]);

const viewProducts = (products) => {
  selectedProducts.value = products;
  productsModalOpen.value = true;
};

const closeProductsModal = () => {
  productsModalOpen.value = false;
};

// Modal para ver dirección completa
const addressModalOpen = ref(false);
const selectedAddress = ref({
  title: "",
  address: ""
});

const viewFullAddress = (title, address) => {
  selectedAddress.value = {
    title,
    address
  };
  addressModalOpen.value = true;
};

const closeAddressModal = () => {
  addressModalOpen.value = false;
};

// Modal para tiempo estimado de llegada
const estimatedTimeModalOpen = ref(false);
const estimatedArrivalTime = ref("");
const pickupOrderId = ref(null);

const showPickupModal = (orderId) => {
  pickupOrderId.value = orderId;
  estimatedArrivalTime.value = "";
  estimatedTimeModalOpen.value = true;
};

const closeEstimatedTimeModal = () => {
  estimatedTimeModalOpen.value = false;
  estimatedArrivalTime.value = "";
  pickupOrderId.value = null;
};

const confirmPickupWithTime = () => {
  if (!estimatedArrivalTime.value) return;
  
  markAsPickedUp(pickupOrderId.value, estimatedArrivalTime.value);
  closeEstimatedTimeModal();
};

// Modal para código de entrega
const deliveryCodeModalOpen = ref(false);
const deliveryCode = ref("");
const deliveryCodeError = ref("");
const deliveryOrderId = ref(null);

const showDeliveryCodeModal = (orderId) => {
  deliveryOrderId.value = orderId;
  deliveryCode.value = "";
  deliveryCodeError.value = "";
  deliveryCodeModalOpen.value = true;
};

const closeDeliveryCodeModal = () => {
  deliveryCodeModalOpen.value = false;
  deliveryCode.value = "";
  deliveryCodeError.value = "";
  deliveryOrderId.value = null;
};

const confirmDeliveryWithCode = () => {
  if (!deliveryCode.value) return;
  
  const order = acceptedOrders.value.find(o => o.id === deliveryOrderId.value);
  if (order) {
    // En un escenario real, el código vendría desde el servidor/API
    // Aquí usamos el código fijo "123456" para la demostración
    if (deliveryCode.value === order.deliveryCode) {
      markAsDelivered(deliveryOrderId.value);
      closeDeliveryCodeModal();
    } else {
      deliveryCodeError.value = "Código incorrecto. Por favor verifica e intenta de nuevo.";
    }
  }
};

// Marcar como recogido
const markAsPickedUp = (orderId, estimatedTime) => {
  // Si estamos usando la API, intentar marcar como recogido
  if (dataSource.value === 'api') {
    // Aquí se implementaría la llamada a la API para marcar como recogido
    // Por ejemplo:
    // fetch(`http://localhost:4000/pedidos/${orderId}/pickup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ estimatedTime })
    // });
  }
  
  const order = acceptedOrders.value.find((o) => o.id === orderId);
  if (order) {
    order.isPickedUp = true;
    order.progress = 66;
    order.estimatedArrivalTime = estimatedTime;
    showToast("Pedido recogido", `Has marcado el pedido #${orderId} como recogido`, "success");
  }
};

// Marcar como entregado
const markAsDelivered = (orderId) => {
  // Si estamos usando la API, intentar marcar como entregado
  if (dataSource.value === 'api') {
    // Aquí se implementaría la llamada a la API para marcar como entregado
    // Por ejemplo:
    // fetch(`http://localhost:4000/pedidos/${orderId}/deliver`, {
    //   method: 'POST'
    // });
  }
  
  const order = acceptedOrders.value.find((o) => o.id === orderId);
  if (order) {
    order.isDelivered = true;
    order.progress = 100;
    
    showToast("Pedido entregado", `¡Gracias! El pedido #${orderId} ha sido entregado con éxito`, "success");
    
    // Eliminar el pedido después de un tiempo
    setTimeout(() => {
      acceptedOrders.value = acceptedOrders.value.filter(o => o.id !== orderId);
    }, 3000);
  }
};

// Obtener ancho de la barra de progreso
const getProgressWidth = (order) => {
  return `${order.progress}%`;
};

// Inicializar mapa con Leaflet
const initMap = (order) => {
  // Verificar si el mapa ya está inicializado para esta orden
  if (mapInitialized.value[order.id]) return;
  
  // Esperar a que el DOM esté listo
  setTimeout(() => {
    const mapContainer = document.getElementById(`map-${order.id}`);
    if (!mapContainer) return;
    
    // Limpiar el contenedor si ya tiene un mapa
    if (maps.value[order.id]) {
      maps.value[order.id].remove();
      maps.value[order.id] = null;
    }
    
    // Asegurarse de que Leaflet esté disponible
    if (!window.L) {
      console.error('Leaflet no está disponible');
      return;
    }
    
    // Inicializar mapa
    const map = L.map(mapContainer, {
      center: [order.direccion_cliente.latitud, order.direccion_cliente.longitud],
      zoom: 13,
      scrollWheelZoom: false,
      zIndex: 1 // Asignar z-index bajo para que los modales aparezcan encima
    });
    
    // Agregar capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Crear marcadores personalizados
    const storeIcon = L.icon({
      iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    const clientIcon = L.icon({
      iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Agregar marcadores
    const storeMarker = L.marker([order.direccion_local.latitud, order.direccion_local.longitud], {icon: storeIcon})
      .addTo(map)
      .bindPopup("<b>Recoger aquí</b><br>" + order.storeLocation);
    
    const clientMarker = L.marker([order.direccion_cliente.latitud, order.direccion_cliente.longitud], {icon: clientIcon})
      .addTo(map)
      .bindPopup("<b>Entregar aquí</b><br>" + order.destination);
    
    // Dibujar ruta
    const route = L.polyline([
      [order.direccion_local.latitud, order.direccion_local.longitud],
      [order.direccion_cliente.latitud, order.direccion_cliente.longitud]
    ], {
      color: '#5D5CDE',
      weight: 5,
      opacity: 0.7
    }).addTo(map);
    
    // Ajustar la vista para que se vean ambos puntos
    map.fitBounds(route.getBounds(), {
      padding: [30, 30]
    });
    
    // Guardar referencia al mapa
    maps.value[order.id] = map;
    mapInitialized.value[order.id] = true;
  }, 100);
};

// Remover el mapa existente
const clearMap = (orderId) => {
  if (maps.value[orderId]) {
    maps.value[orderId].remove();
    maps.value[orderId] = null;
    mapInitialized.value[orderId] = false;
  }
};

// Reinicializar todos los mapas
const reinitializeMaps = () => {
  acceptedOrders.value.forEach(order => {
    clearMap(order.id);
    // Pequeño retraso para asegurar que el DOM esté listo
    setTimeout(() => {
      initMap(order);
    }, 100);
  });
};

// Carga dinámica de Leaflet
const loadLeaflet = () => {
  if (window.L) {
    // Leaflet ya está cargado, inicializa los mapas
    reinitializeMaps();
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    // Cargar la hoja de estilos CSS si no está cargada
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(cssLink);
    }
    
    // Cargar el script JS si no está cargado
    if (!document.querySelector('script[src*="leaflet.js"]')) {
      const jsScript = document.createElement('script');
      jsScript.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js';
      jsScript.onload = () => {
        reinitializeMaps();
        resolve();
      };
      jsScript.onerror = reject;
      document.head.appendChild(jsScript);
    } else {
      reinitializeMaps();
      resolve();
    }
  });
};

// Observar cambios en la pestaña activa
watch(activeTab, (newTab) => {
  if (newTab === 'accepted' && acceptedOrders.value.length > 0) {
    // Cargar Leaflet e inicializar los mapas cuando cambiamos a la pestaña de "Aceptados"
    loadLeaflet();
  }
});

// Observar cambios en los pedidos aceptados
watch(acceptedOrders, (newAcceptedOrders) => {
  if (activeTab.value === 'accepted' && newAcceptedOrders.length > 0) {
    // Inicializar mapas para nuevos pedidos aceptados
    loadLeaflet();
  }
});

// Notificaciones
const notifications = ref([
  { id: 1, message: "Nuevo pedido recibido.", read: false },
  { id: 2, message: "Pedido #101 aceptado.", read: true },
]);

const unreadNotifications = computed(() => notifications.value.filter((n) => !n.read));

// Toast notifications
const toasts = ref([]);
let toastIdCounter = 0;

const showToast = (title, message, type = "info") => {
  const id = toastIdCounter++;
  toasts.value.push({ id, title, message, type });
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    dismissToast(id);
  }, 4000);
};

const dismissToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};

// Inicializar la aplicación
onMounted(() => {
  // Comprobar tema al montar el componente
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true;
  }

  // Escuchar cambios en el tema
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        isDarkMode.value = true;
      } else {
        isDarkMode.value = false;
      }
    });
  }
  
  // Cargar pedidos iniciales
  fetchOrders();
  
  // Simular nuevos pedidos después de un tiempo (solo si usamos datos mock)
  setTimeout(() => {
    if (dataSource.value === 'mock' && pendingOrders.value.length < 5) {
      pendingOrders.value.push({
        id: 105,
        time: new Date().toISOString(),
        productCount: 4,
        storeLocation: "Pollo Campero - Mall Megaplaza",
        destination: "Ceutec, La Ceiba",
        fullDestination: "Ceutec, La Ceiba",
        products: [
          { id: 6, name: "Pollo Frito", quantity: 2 },
          { id: 7, name: "Papas Fritas", quantity: 1 },
          { id: 8, name: "Refresco", quantity: 1 },
        ],
        fareSent: false,
        fareAmount: null,
        direccion_cliente: fixedLocations.cliente,
        direccion_local: fixedLocations.local
      });
      
      showToast("Nuevo pedido", "Tienes un nuevo pedido disponible", "info");
    }
  }, 10000);
});
</script>

<style scoped>
/* Estilos base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.app-container.dark {
  background-color: #121826;
  color: #f3f4f6;
}

/* Header */
.header {
  background-color: #5D5CDE;
  color: white;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

.dark .header {
  background-color: #1f2937;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-selector {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
}

.profile-selector option {
  background-color: #5D5CDE;
  color: white;
}

.dark .profile-selector option {
  background-color: #1f2937;
}

.notification-icon {
  position: relative;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tabs */
.tabs {
  display: flex;
  background-color: white;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .tabs {
  background-color: #1f2937;
  border-bottom-color: #374151;
}

.tab-button {
  flex: 1;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.dark .tab-button {
  color: #9ca3af;
}

.tab-button.active {
  background-color: #5D5CDE;
  color: white;
}

.dark .tab-button.active {
  background-color: #3b82f6;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 4rem;
}

/* Empty state */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9ca3af;
  text-align: center;
}

.dark .empty-state {
  color: #6b7280;
}

.empty-state svg {
  color: #5D5CDE;
  margin-bottom: 1rem;
}

.dark .empty-state svg {
  color: #3b82f6;
}

.empty-subtitle {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Cards */
.cards-container {
  height: calc(100vh - 190px);
  position: relative;
  overflow: hidden;
}

.cards-stack {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.order-card {
  position: absolute;
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  touch-action: pan-y;
}

.dark .order-card {
  background: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.order-card.active {
  cursor: grab;
}

.order-card.active:active {
  cursor: grabbing;
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .card-header {
  border-bottom-color: #374151;
}

.order-number {
  font-weight: 600;
  color: #5D5CDE;
}

.dark .order-number {
  color: #3b82f6;
}

.order-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .order-time {
  color: #9ca3af;
}

.order-details {
  padding: 1rem;
}

.detail-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.detail-row svg {
  color: #5D5CDE;
  flex-shrink: 0;
}

.dark .detail-row svg {
  color: #3b82f6;
}

.location {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.location-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.dark .location-label {
  color: #9ca3af;
}

.location-address {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-icon {
  color: #5D5CDE;
  cursor: pointer;
}

.dark .address-icon {
  color: #3b82f6;
}

.location-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 1rem;
}

.divider-line {
  width: 1px;
  height: 10px;
  background-color: #d1d5db;
}

.dark .divider-line {
  background-color: #4b5563;
}

.divider-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #d1d5db;
}

.dark .divider-dot {
  background-color: #4b5563;
}

.product-actions {
  margin-bottom: 1rem;
}

.view-products-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .view-products-button {
  background-color: #374151;
  color: #e5e7eb;
}

.view-products-button:hover {
  background-color: #e5e7eb;
}

.dark .view-products-button:hover {
  background-color: #4b5563;
}

.view-products-button svg {
  margin-right: 0.5rem;
  color: #5D5CDE;
}

.dark .view-products-button svg {
  color: #3b82f6;
}

.waiting-status {
  display: flex;
  align-items: center;
  background-color: rgba(245, 158, 11, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.dark .waiting-status {
  background-color: rgba(245, 158, 11, 0.15);
}

.waiting-icon {
  margin-right: 0.75rem;
  color: #f59e0b;
}

.waiting-text {
  flex: 1;
}

.waiting-title {
  font-weight: 600;
  color: #f59e0b;
  margin-bottom: 0.25rem;
}

.waiting-description {
  font-size: 0.875rem;
  color: #d97706;
}

.dark .waiting-description {
  color: #fbbf24;
}

.card-actions {
  display: flex;
  padding: 0 1rem 1rem;
  gap: 0.5rem;
}

.action-skip, .action-send, .action-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-skip {
  background-color: #f3f4f6;
  color: #4b5563;
  flex: 2;
}

.dark .action-skip {
  background-color: #374151;
  color: #e5e7eb;
}

.action-send {
  background-color: #5D5CDE;
  color: white;
  flex: 3;
}

.dark .action-send {
  background-color: #3b82f6;
}

.action-cancel {
  background-color: #ef4444;
  color: white;
  flex: 1;
}

.action-skip svg, .action-send svg, .action-cancel svg {
  margin-right: 0.5rem;
}

.swipe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}

.swipe-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  border-radius: 1rem;
  opacity: 0.9;
}

.swipe-indicator.skip {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 3px solid #ef4444;
}

.swipe-indicator.send {
  background-color: rgba(93, 92, 222, 0.2);
  color: #5D5CDE;
  border: 3px solid #5D5CDE;
}

.dark .swipe-indicator.send {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 3px solid #3b82f6;
}

/* Auto-assign option in modal */
.auto-assign-option {
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(93, 92, 222, 0.1);
  border-radius: 0.5rem;
  border: 1px dashed #5D5CDE;
}

.dark .auto-assign-option {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.auto-assign-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background-color: #5D5CDE;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

.dark .auto-assign-button {
  background-color: #3b82f6;
}

.auto-assign-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .auto-assign-button:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.auto-assign-button svg {
  margin-right: 0.5rem;
}

.auto-assign-note {
  font-size: 0.75rem;
  color: #5D5CDE;
  text-align: center;
}

.dark .auto-assign-note {
  color: #3b82f6;
}

/* Accepted orders */
.accepted-orders {
  padding-bottom: 1rem;
}

.accepted-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accepted-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dark .accepted-card {
  background-color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.two-column {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .two-column {
    grid-template-columns: 1fr 1fr;
  }
}

.order-info-column {
  padding: 1rem;
}

.map-column {
  min-height: 300px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.map-preview {
  height: 100%;
  min-height: 300px;
  background-color: #f3f4f6;
  position: relative;
  overflow: hidden;
  border-radius: 0 1rem 1rem 0;
  z-index: 1;
}

.dark .map-preview {
  background-color: #374151;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .order-header {
  border-bottom-color: #374151;
}

.order-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.order-status.pickup {
  background-color: #f59e0b;
  color: white;
}

.order-status.delivering {
  background-color: #5D5CDE;
  color: white;
}

.dark .order-status.delivering {
  background-color: #3b82f6;
}

.order-fare {
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;
}

.dark .order-fare {
  color: #34d399;
}

.order-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 0.375rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.dark .progress-bar {
  background-color: #4b5563;
}

.progress-fill {
  height: 100%;
  background-color: #5D5CDE;
  border-radius: 0.25rem;
  transition: width 0.5s ease;
}

.dark .progress-fill {
  background-color: #3b82f6;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33.33%;
}

.step-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .step-icon {
  background-color: #4b5563;
  color: #e5e7eb;
}

.progress-step.completed .step-icon {
  background-color: #5D5CDE;
  color: white;
}

.dark .progress-step.completed .step-icon {
  background-color: #3b82f6;
}

.progress-step span {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .progress-step span {
  color: #9ca3af;
}

.progress-step.completed span {
  color: #5D5CDE;
  font-weight: 500;
}

.dark .progress-step.completed span {
  color: #3b82f6;
}

.order-info-section {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.75rem;
}

.dark .order-info-section {
  background-color: #374151;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #5D5CDE;
}

.dark .section-title {
  color: #3b82f6;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .info-label {
  color: #9ca3af;
}

.info-value {
  font-weight: 500;
}

.prep-time {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark .prep-time {
  border-top-color: #4b5563;
}

.prep-value {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #5D5CDE;
}

.dark .prep-value {
  color: #3b82f6;
}

.products-row {
  margin-top: 0.5rem;
}

.view-products-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #5D5CDE;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .view-products-icon {
  background-color: #3b82f6;
}

.view-products-icon:hover {
  transform: scale(1.1);
}

.order-locations {
  margin-bottom: 1rem;
}

.location-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.location-row:last-child {
  margin-bottom: 0;
}

.location-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.location-icon.pickup {
  background-color: rgba(93, 92, 222, 0.1);
  color: #5D5CDE;
}

.dark .location-icon.pickup {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.location-icon.dropoff {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dark .location-icon.dropoff {
  background-color: rgba(239, 68, 68, 0.2);
}

.location-text {
  font-size: 0.875rem;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-details-row {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.dark .order-details-row {
  border-top-color: #374151;
}

.detail-col {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .detail-col {
  color: #d1d5db;
}

.detail-col svg {
  color: #5D5CDE;
}

.dark .detail-col svg {
  color: #3b82f6;
}

.order-actions {
  padding-top: 1rem;
}

.action-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button svg {
  margin-right: 0.5rem;
}

.pickup-button {
  background-color: #5D5CDE;
  color: white;
}

.dark .pickup-button {
  background-color: #3b82f6;
}

.deliver-button {
  background-color: #10b981;
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .action-button:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Footer */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #5D5CDE;
  z-index: 10;
}

.dark .footer {
  background-color: #1f2937;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  gap: 0.25rem;
  cursor: pointer;
}

.footer-item svg {
  margin-bottom: 4px;
}

.footer-item-circle {
  background-color: white;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  margin-top: -0.75rem;
}

.footer-item-circle svg {
  margin-bottom: 0;
  color: #5D5CDE;
}

.dark .footer-item-circle svg {
  color: #3b82f6;
}

.footer-item.active {
  color: white;
  font-weight: 600;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.3s forwards;
}

.dark .modal-container {
  background-color: #1f2937;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .modal-header {
  border-bottom-color: #374151;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #5D5CDE;
}

.dark .modal-header h3 {
  color: #3b82f6;
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.dark .close-button {
  color: #9ca3af;
}

.close-button:hover {
  background-color: #f3f4f6;
}

.dark .close-button:hover {
  background-color: #374151;
}

.modal-body {
  padding: 1rem;
}

.order-summary {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.dark .order-summary {
  background-color: #374151;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-row svg {
  color: #5D5CDE;
}

.dark .summary-row svg {
  color: #3b82f6;
}

.fare-input-container, .time-input-container, .delivery-code-container {
  position: relative;
  margin-bottom: 1rem;
}

.currency-label, .time-label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.125rem;
  font-weight: 600;
  color: #5D5CDE;
}

.dark .currency-label, .dark .time-label {
  color: #3b82f6;
}

.currency-label {
  left: 1rem;
}

.time-label {
  right: 1rem;
}

.fare-input, .time-input, .delivery-code-input {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.2s;
}

.fare-input {
  padding-left: 2.5rem;
}

.time-input {
  padding-right: 5rem;
}

.dark .fare-input, .dark .time-input, .dark .delivery-code-input {
  background-color: #374151;
  border-color: #4b5563;
  color: white;
}

.fare-input:focus, .time-input:focus, .delivery-code-input:focus {
  border-color: #5D5CDE;
}

.dark .fare-input:focus, .dark .time-input:focus, .dark .delivery-code-input:focus {
  border-color: #3b82f6;
}

.suggested-fares, .suggested-times {
  margin-bottom: 1rem;
}

.suggested-fares p, .suggested-times p {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .suggested-fares p, .dark .suggested-times p {
  color: #9ca3af;
}

.fare-buttons, .time-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.fare-button, .time-button {
  flex: 1;
  min-width: 4.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
  background-color: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .fare-button, .dark .time-button {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

.fare-button.selected, .time-button.selected {
  border-color: #5D5CDE;
  background-color: rgba(93, 92, 222, 0.1);
  color: #5D5CDE;
}

.dark .fare-button.selected, .dark .time-button.selected {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.estimated-time-info {
  margin-bottom: 1rem;
}

.estimated-time-info p {
  font-size: 1rem;
  line-height: 1.5;
}

.delivery-code-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ef4444;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dark .modal-footer {
  border-top-color: #374151;
}

.modal-button {
  padding: 0.875rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-button svg {
  margin-right: 0.5rem;
}

.modal-button.confirm {
  background-color: #5D5CDE;
  color: white;
}

.dark .modal-button.confirm {
  background-color: #3b82f6;
}

.modal-button.confirm:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.dark .modal-button.confirm:disabled {
  background-color: #4b5563;
  color: #6b7280;
}

.modal-button.cancel {
  background-color: #f3f4f6;
  color: #4b5563;
}

.dark .modal-button.cancel {
  background-color: #374151;
  color: #d1d5db;
}

.modal-button.full-width {
  width: 100%;
}

.modal-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Products Modal */
.products-list {
  list-style: none;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .product-item {
  border-bottom-color: #374151;
}

.product-item:last-child {
  border-bottom: none;
}

.product-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-icon {
  color: #5D5CDE;
}

.dark .product-icon {
  color: #3b82f6;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.product-quantity {
  font-weight: 600;
  color: #5D5CDE;
}

.dark .product-quantity {
  color: #3b82f6;
}

/* Address Modal */
.address-modal-header {
  background-color: #5D5CDE;
  color: white;
  padding: 1rem;
  text-align: center;
  position: relative;
}

.dark .address-modal-header {
  background-color: #3b82f6;
}

.address-modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
}

.address-detail-container {
  padding: 1rem;
}

.address-detail-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.address-detail-row svg {
  color: #5D5CDE;
  flex-shrink: 0;
}

.dark .address-detail-row svg {
  color: #3b82f6;
}

.address-detail-label {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #6b7280;
}

.dark .address-detail-label {
  color: #9ca3af;
}

.address-detail-value {
  font-size: 1rem;
}

.address-action-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.address-action-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.address-action-button.primary {
  background-color: #5D5CDE;
  color: white;
}

.dark .address-action-button.primary {
  background-color: #3b82f6;
}

.address-action-button.secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}

.dark .address-action-button.secondary {
  background-color: #374151;
  color: #d1d5db;
}

.address-action-button svg {
  margin-right: 0.5rem;
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
}

.toast {
  display: flex;
  align-items: flex-start;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 0.75rem;
  animation: slideIn 0.3s forwards;
}

.dark .toast {
  background-color: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.info {
  border-left: 4px solid #5D5CDE;
}

.dark .toast.info {
  border-left: 4px solid #3b82f6;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast-icon {
  margin-right: 0.75rem;
}

.toast.success .toast-icon {
  color: #10b981;
}

.toast.info .toast-icon {
  color: #5D5CDE;
}

.dark .toast.info .toast-icon {
  color: #3b82f6;
}

.toast.error .toast-icon {
  color: #ef4444;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #111827;
}

.dark .toast-title {
  color: #f9fafb;
}

.toast-message {
  font-size: 0.875rem;
  color: #4b5563;
}

.dark .toast-message {
  color: #d1d5db;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
}

.dark .toast-close {
  color: #6b7280;
}

/* Animaciones */
@keyframes slideIn {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Responsive */
@media (max-width: 380px) {
  .order-card {
    max-width: 320px;
  }
  
  .action-skip, .action-send, .action-cancel {
    font-size: 0.8125rem;
    padding: 0.625rem;
  }
  
  .footer-content {
    padding: 0.375rem 0;
  }
  
  .footer-item {
    font-size: 0.6875rem;
  }
  
  .footer-item-circle {
    width: 2rem;
    height: 2rem;
  }
}
</style>
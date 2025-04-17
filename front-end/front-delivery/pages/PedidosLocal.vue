<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
     <!-- Header -->
     <HeaderLocal />

    <!-- Contenido Principal -->
    <div class="local-orders-page p-4">
      <h1 class="text-2xl font-bold text-blue-600 mb-6">Gestión de Pedidos</h1>

      <!-- Selector de fuente de datos -->
      <div class="mb-6 flex items-center justify-end">
        <div class="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
          <span class="text-sm font-medium text-gray-700">Fuente de datos:</span>
          <select 
            v-model="dataSource" 
            class="border border-gray-300 rounded p-1 text-sm"
            @change="fetchOrders"
          >
            <option value="mock">Datos de ejemplo</option>
            <option value="api">API Local</option>
          </select>
          <button 
            v-if="loading" 
            class="text-gray-500 cursor-not-allowed p-1"
            disabled
          >
            <div class="w-5 h-5 border-2 border-t-blue-600 border-blue-600 rounded-full animate-spin"></div>
          </button>
          <button 
            v-else 
            @click="fetchOrders" 
            class="text-blue-600 hover:text-blue-800 p-1"
            title="Actualizar datos"
          >
            <RefreshCwIcon :size="18" />
          </button>
        </div>
      </div>

      <!-- Pestañas -->
      <div class="tabs flex space-x-4 mb-6">
        <button
          @click="activeTab = 'received'"
          :class="[
            'tab-button',
            activeTab === 'received' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600',
          ]"
        >
          Pedidos Recibidos
        </button>
        <button
          @click="activeTab = 'accepted'"
          :class="[
            'tab-button',
            activeTab === 'accepted' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600',
          ]"
        >
          Pedidos Aceptados
        </button>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
        <p class="font-medium">{{ error }}</p>
        <button 
          @click="fetchOrders" 
          class="mt-2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Botones de acciones en masa (solo en pestaña de Recibidos) -->
      <div v-if="activeTab === 'received' && selectedOrders.length > 0" class="mb-4 flex space-x-2">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          @click="openAcceptModalForSelected"
        >
          Aceptar Seleccionados
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          @click="openRejectModalForSelected"
        >
          Rechazar Seleccionados
        </button>
      </div>

      <!-- Lista de Pedidos Recibidos -->
      <div v-if="activeTab === 'received'" class="orders-grid">
        <div
          v-for="order in receivedOrders"
          :key="order.id"
          class="order-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Checkbox para seleccionar el pedido -->
          <div class="flex justify-between items-center mb-2">
            <input
              type="checkbox"
              v-model="selectedOrders"
              :value="order.id"
              class="form-checkbox text-blue-600"
            />
            <h3 class="text-lg font-bold text-blue-600">Pedido #{{ order.id }}</h3>
            <span class="text-sm text-gray-500">{{ order.date }} - {{ order.time }}</span>
          </div>

          <!-- Sección de productos -->
          <div class="border p-2 rounded-lg mb-2">
            <h4 class="text-md font-semibold text-blue-600 mb-2">Productos:</h4>
            <ul class="space-y-1">
              <li v-for="item in order.items" :key="item.id" class="text-sm text-gray-700">
                {{ item.name }} (x{{ item.quantity }})
                <div v-if="item.attributes && item.attributes.length > 0" class="text-xs text-gray-500 ml-2">
                  {{ item.attributes.join(", ") }}
                </div>
                <div v-if="item.extras && item.extras.length > 0" class="text-xs text-gray-500 ml-2">
                  Extras: {{ item.extras.join(", ") }}
                </div>
              </li>
            </ul>
          </div>

          <!-- Método de pago, tipo de pedido y total -->
          <div class="flex gap-2 mt-2">
            <div class="bg-blue-50 p-2 rounded-lg text-center flex-1">
              <p class="text-xs text-gray-600">Método de Pago</p>
              <p class="text-sm font-bold text-blue-600">{{ order.paymentMethod }}</p>
            </div>
            <div class="bg-green-50 p-2 rounded-lg text-center flex-1">
              <p class="text-xs text-gray-600">Tipo de Pedido</p>
              <p class="text-sm font-bold text-green-600">{{ order.orderType }}</p>
            </div>
            <div class="bg-purple-50 p-2 rounded-lg text-center flex-1">
              <p class="text-xs text-gray-600">Total</p>
              <p class="text-sm font-bold text-purple-600">${{ formatPrice(order.total) }}</p>
            </div>
          </div>

          <!-- Sección inferior: Cliente, botones y detalles -->
          <div class="flex justify-between items-center mt-2">
            <p class="text-gray-700"><span class="font-semibold">Cliente:</span> {{ order.customer }}</p>
            <div class="flex space-x-2">
              <button
                class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200 text-sm"
                @click="openAcceptModal(order.id)"
              >
                Aceptar
              </button>
              <button
                class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                @click="openRejectModal(order.id)"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Pedidos Aceptados -->
      <div v-if="activeTab === 'accepted'" >
        <!-- Filtros -->
        <div class="filters mb-6 flex flex-wrap gap-2 sm:gap-4 items-end">
          <!-- Filtro por fecha -->
          <div class="flex-1 min-w-[120px]">
            <label class="block text-gray-700 mb-2 text-sm">Filtrar por fecha:</label>
            <input
              type="date"
              v-model="filterDate"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <!-- Filtro por nombre del cliente -->
          <div class="flex-1 min-w-[120px]">
            <label class="block text-gray-700 mb-2 text-sm">Buscar por nombre:</label>
            <input
              type="text"
              v-model="filterCustomerName"
              placeholder="Nombre del cliente"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <!-- Filtro por estado -->
          <div class="flex-1 min-w-[120px]">
            <label class="block text-gray-700 mb-2 text-sm">Filtrar por estado:</label>
            <select
              v-model="filterStatus"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="preparation">En preparación</option>
              <option value="completed">Pedidos listos</option>
            </select>
          </div>
        </div>

        <!-- Lista de pedidos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="order in filteredAcceptedOrders"
            :key="order.id"
            class="order-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <!-- Identificador de estado -->
            <div
              class="status-badge mb-2 p-1 rounded-lg text-center text-sm"
              :class="{
                'bg-yellow-100 text-yellow-700': order.status === 'preparation',
                'bg-green-100 text-green-700': order.status === 'completed',
              }"
            >
              {{ order.status === "preparation" ? "En preparación" : "Terminado" }}
            </div>

            <!-- Sección superior: Número de pedido y fecha -->
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-bold text-blue-600">Pedido #{{ order.id }}</h3>
              <span class="text-sm text-gray-500">{{ order.date }} - {{ order.time }}</span>
            </div>

            <!-- Sección de productos -->
            <div class="border p-2 rounded-lg mb-2">
              <h4 class="text-md font-semibold text-blue-600 mb-2">Productos:</h4>
              <ul class="space-y-1">
                <li v-for="item in order.items" :key="item.id" class="text-sm text-gray-700">
                  {{ item.name }} (x{{ item.quantity }})
                  <div v-if="item.attributes && item.attributes.length > 0" class="text-xs text-gray-500 ml-2">
                    {{ item.attributes.join(", ") }}
                  </div>
                  <div v-if="item.extras && item.extras.length > 0" class="text-xs text-gray-500 ml-2">
                    Extras: {{ item.extras.join(", ") }}
                  </div>
                </li>
              </ul>
            </div>

            <!-- Sección inferior: Cliente y botón "Pedido listo" -->
            <div class="flex justify-between items-center mt-2">
              <p class="text-gray-700"><span class="font-semibold">Cliente:</span> {{ order.customer }}</p>
              <button
                v-if="order.status === 'preparation'"
                class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                @click="markOrderAsCompleted(order.id)"
              >
                Pedido Listo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar aceptación/rechazo de varios pedidos -->
    <transition name="fade">
      <div v-if="isBulkActionModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-lg font-bold text-blue-600 mb-4">
            {{ isAccepting ? "Aceptar Pedidos" : "Rechazar Pedidos" }}
          </h3>
          <p class="text-gray-700 mb-4">
            ¿Estás seguro de que deseas {{ isAccepting ? "aceptar" : "rechazar" }} los
            {{ selectedOrders.length }} pedidos seleccionados?
          </p>

          <!-- Input para tiempo estimado (si se acepta) -->
          <div v-if="isAccepting" class="mb-4">
            <label class="block text-gray-700 mb-2">Tiempo estimado de preparación (minutos):</label>
            <input
              type="number"
              v-model="estimatedTime"
              placeholder="Ej: 30"
              class="w-full p-2 border rounded-lg"
            />
          </div>

          <!-- Input para razones de rechazo (si se rechaza) -->
          <div v-else class="mb-4">
            <label class="block text-gray-700 mb-2">Razón de rechazo:</label>
            <input
              type="text"
              v-model="rejectionReason"
              placeholder="Ej: Falta de stock, horario no disponible"
              class="w-full p-2 border rounded-lg"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              @click="closeBulkActionModal"
            >
              Cancelar
            </button>
            <button
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              v-if="isAccepting"
              @click="confirmBulkAccept"
            >
              Aceptar
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              v-else
              @click="confirmBulkReject"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para aceptar/rechazar pedidos individuales -->
    <transition name="fade">
      <div v-if="isIndividualActionModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-lg font-bold text-blue-600 mb-4">
            {{ isAccepting ? "Aceptar Pedido" : "Rechazar Pedido" }}
          </h3>
          <p class="text-gray-700 mb-4">
            ¿Estás seguro de que deseas {{ isAccepting ? "aceptar" : "rechazar" }} el pedido seleccionado?
          </p>

          <!-- Input para tiempo estimado (si se acepta) -->
          <div v-if="isAccepting" class="mb-4">
            <label class="block text-gray-700 mb-2">Tiempo estimado de preparación (minutos):</label>
            <input
              type="number"
              v-model="estimatedTime"
              placeholder="Ej: 30"
              class="w-full p-2 border rounded-lg"
            />
          </div>

          <!-- Input para razones de rechazo (si se rechaza) -->
          <div v-else class="mb-4">
            <label class="block text-gray-700 mb-2">Razón de rechazo:</label>
            <input
              type="text"
              v-model="rejectionReason"
              placeholder="Ej: Falta de stock, horario no disponible"
              class="w-full p-2 border rounded-lg"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              @click="closeIndividualActionModal"
            >
              Cancelar
            </button>
            <button
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              v-if="isAccepting"
              @click="confirmIndividualAccept"
            >
              Aceptar
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              v-else
              @click="confirmIndividualReject"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </transition>

     <!-- Footer -->
     <FooterLocal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  X as XIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-vue-next';
import { io } from 'socket.io-client';

const isModalOpen = ref(false); 
const router = useRouter();

// Funciones para el manejo de notificaciones
const showNotifications = () => {
  isModalOpen.value = true;
};

const closeNotifications = () => {
  isModalOpen.value = false;
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
};
const notifications = ref([
  { id: 1, message: "Tu pedido ha sido enviado.", read: false },
  { id: 2, message: "Nuevo descuento disponible.", read: false },
  { id: 3, message: "Actualización de la app disponible.", read: true },
]);
const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read);
});
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
// Sidebar
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Perfil
const isProfileMenuOpen = ref(false);
const selectedProfile = ref("Local");

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const selectProfile = (profile) => {
  selectedProfile.value = profile;
  isProfileMenuOpen.value = false;
};

// Fuente de datos
const dataSource = ref('mock');
const loading = ref(false);
const error = ref(null);

// Datos de ejemplo para pedidos
const mockOrders = [
  {
    id: 1,
    date: "25 de Octubre, 2023",
    time: "14:30",
    customer: "Juan Pérez",
    total: 15.5,
    paymentMethod: "Transferencia",
    orderType: "Delivery",
    items: [
      {
        id: 1,
        name: "American BBQ Single",
        quantity: 2,
        attributes: ["Grande", "Picante"],
        extras: ["Extra queso", "Tomate"],
      },
      { id: 2, name: "Fried Cheese Wonton", quantity: 1 },
    ],
    status: "received",
  },
  {
    id: 2,
    date: "24 de Octubre, 2023",
    time: "12:45",
    customer: "María Gómez",
    total: 10.0,
    paymentMethod: "Efectivo",
    orderType: "Comer en local",
    items: [
      { id: 3, name: "Chicken Dumplings", quantity: 1 },
      { id: 4, name: "French Fries", quantity: 2 },
    ],
    status: "received",
  },
  {
    id: 3,
    date: "25 de Octubre, 2023",
    time: "14:30",
    customer: "Juan Pérez",
    total: 15.5,
    paymentMethod: "Transferencia",
    orderType: "Delivery",
    items: [
      {
        id: 34,
        name: "American BBQ Single",
        quantity: 2,
        attributes: ["Grande", "Picante"],
        extras: ["Extra queso", "Tomate"],
      },
      { id: 2, name: "Fried Cheese Wonton", quantity: 1 },
    ],
    status: "received",
  },
  {
    id: 4,
    date: "24 de Octubre, 2023",
    time: "12:45",
    customer: "María Gómez",
    total: 10.0,
    paymentMethod: "Efectivo",
    orderType: "Comer en local",
    items: [
      { id: 3, name: "Chicken Dumplings", quantity: 1 },
      { id: 4, name: "French Fries", quantity: 2 },
    ],
    status: "received",
  },
];

// Estado de la aplicación
const orders = ref([]);
const activeTab = ref("received");

// Pestañas y filtros
const filterDate = ref("");
const filterCustomerName = ref("");
const filterStatus = ref("");

// Pedidos seleccionados
const selectedOrders = ref([]);

// Modales
const isBulkActionModalOpen = ref(false);
const isIndividualActionModalOpen = ref(false);
const isAccepting = ref(false);
const estimatedTime = ref(null);
const rejectionReason = ref("");
const selectedOrderId = ref(null);

// Socket configuration
const socket = ref(null);

const inicializarSocket = () => {
  socket.value = io('http://localhost:4000', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.value.on('connect', () => {
    console.log('Local conectado al servidor de websockets');
  });

  socket.value.on('disconnect', () => {
    console.log('Local desconectado del servidor de websockets');
  });
};

// Función para obtener pedidos
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (dataSource.value === 'mock') {
      // Simular retardo de red
      await new Promise(resolve => setTimeout(resolve, 800));
      orders.value = [...mockOrders];
    } else {
      // Obtener datos de la API
      const response = await fetch('http://localhost:4000/pedidos');
      
      if (!response.ok) {
        throw new Error(`Error al obtener pedidos: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapear datos de la API al formato esperado por la UI
      orders.value = await mapOrdersFromAPI(data);
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

// Mapear datos de la API al formato de la UI
const mapOrdersFromAPI = async (apiOrders) => {
  try {
    // Obtener todos los detalles de pedidos para relacionarlos
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
    
    // Transformar datos al formato esperado por la UI
    return apiOrders.map(pedido => {
      // Encontrar detalles asociados al pedido
      const pedidoDetalles = detalles.filter(d => d.id_pedido === pedido.id_pedido);
      
      // Encontrar cliente asociado al pedido
      const cliente = clientes.find(c => c.id_cliente === pedido.id_cliente);
      
      // Formatear fecha para la UI
      const fechaPedido = new Date(pedido.fecha_pedido);
      
      return {
        id: pedido.id_pedido,
        date: formatDateForDisplay(fechaPedido),
        time: formatTimeForDisplay(fechaPedido),
        customer: cliente ? cliente.nombre : 'Cliente Desconocido',
        total: pedidoDetalles.reduce((sum, item) => sum + parseFloat(item.subtotal), 0),
        paymentMethod: pedidoDetalles.length > 0 ? pedidoDetalles[0].metodopago : 'Desconocido',
        orderType: pedidoDetalles.length > 0 ? pedidoDetalles[0].tipopedido : 'Desconocido',
        items: pedidoDetalles.map(detalle => ({
          id: detalle.id_pedido_detalle,
          name: detalle.nombre_producto,
          quantity: detalle.cantidad,
          attributes: detalle.atributos ? Object.values(detalle.atributos) : [],
          extras: [],
          price: parseFloat(detalle.precio_unitario)
        })),
        status: mapApiStatusToUI(pedido.estado)
      };
    });
  } catch (error) {
    console.error('Error mapping API data:', error);
    throw error;
  }
};

// Mapear estado de la API al formato de la UI
const mapApiStatusToUI = (apiStatus) => {
  switch (apiStatus) {
    case 'pendiente_local':
      return 'received';
    case 'preparando_pedido':
      return 'preparation';
    case 'en_camino':
    case 'entregado':
      return 'completed';
    default:
      return 'received';
  }
};

// Formatear fecha para mostrar en la UI (25 de Octubre, 2023)
const formatDateForDisplay = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

// Formatear hora para mostrar en la UI (14:30)
const formatTimeForDisplay = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

// Formatear precio
const formatPrice = (price) => {
  return price ? price.toFixed(2) : '0.00';
};

// Pedidos filtrados según la pestaña activa
const receivedOrders = computed(() => 
  orders.value.filter(order => order.status === 'received')
);

const filteredAcceptedOrders = computed(() => {
  let filtered = orders.value.filter(order => 
    order.status === 'preparation' || order.status === 'completed'
  );

  // Filtrar por fecha
  if (filterDate.value) {
    filtered = filtered.filter(order => order.date === filterDate.value);
  }

  // Filtrar por nombre del cliente
  if (filterCustomerName.value) {
    filtered = filtered.filter(order =>
      order.customer.toLowerCase().includes(filterCustomerName.value.toLowerCase())
    );
  }

  // Filtrar por estado
  if (filterStatus.value) {
    filtered = filtered.filter(order => order.status === filterStatus.value);
  }

  return filtered;
});

// Abrir modal para aceptar/rechazar varios pedidos
const openAcceptModalForSelected = () => {
  if (selectedOrders.value.length > 0) {
    isAccepting.value = true;
    isBulkActionModalOpen.value = true;
  } else {
    alert("Por favor, selecciona al menos un pedido.");
  }
};

const openRejectModalForSelected = () => {
  if (selectedOrders.value.length > 0) {
    isAccepting.value = false;
    isBulkActionModalOpen.value = true;
  } else {
    alert("Por favor, selecciona al menos un pedido.");
  }
};

// Abrir modal para aceptar/rechazar un pedido individual
const openAcceptModal = (orderId) => {
  selectedOrderId.value = orderId;
  isAccepting.value = true;
  isIndividualActionModalOpen.value = true;
};

const openRejectModal = (orderId) => {
  selectedOrderId.value = orderId;
  isAccepting.value = false;
  isIndividualActionModalOpen.value = true;
};

// Cerrar modales
const closeBulkActionModal = () => {
  isBulkActionModalOpen.value = false;
  estimatedTime.value = null;
  rejectionReason.value = "";
};

const closeIndividualActionModal = () => {
  isIndividualActionModalOpen.value = false;
  estimatedTime.value = null;
  rejectionReason.value = "";
};

// Modificar la función de confirmación individual
const confirmIndividualAccept = async () => {
  if (!estimatedTime.value) {
    alert("Por favor, ingresa un tiempo estimado de preparación.");
    return;
  }
  
  try {
    const order = orders.value.find((order) => order.id === selectedOrderId.value);
    
    if (socket.value && socket.value.connected) {
      socket.value.emit('pedido_aceptado', {
        pedidoId: selectedOrderId.value,
        tiempoEstimado: estimatedTime.value,
        detallesPedido: order
      });
    }

    // Actualizar la UI
    if (order) {
      order.status = "preparation";
      order.estimatedTime = estimatedTime.value;
    }
    
    alert("Pedido aceptado exitosamente.");
    closeIndividualActionModal();
  } catch (error) {
    console.error('Error al aceptar el pedido:', error);
    alert(`Error al aceptar el pedido: ${error.message}`);
  }
};

// Modificar la función de rechazo individual
const confirmIndividualReject = async () => {
  if (!rejectionReason.value) {
    alert("Por favor, ingresa una razón de rechazo.");
    return;
  }
  
  try {
    const order = orders.value.find((order) => order.id === selectedOrderId.value);

    if (socket.value && socket.value.connected) {
      socket.value.emit('pedido_rechazado', {
        pedidoId: selectedOrderId.value,
        razonRechazo: rejectionReason.value,
        detallesPedido: order
      });
    }

    // Actualizar la UI
    orders.value = orders.value.filter((order) => order.id !== selectedOrderId.value);
    
    alert("Pedido rechazado exitosamente.");
    closeIndividualActionModal();
  } catch (error) {
    console.error('Error al rechazar el pedido:', error);
    alert(`Error al rechazar el pedido: ${error.message}`);
  }
};

// Modificar la función de aceptación masiva
const confirmBulkAccept = async () => {
  if (!estimatedTime.value) {
    alert("Por favor, ingresa un tiempo estimado de preparación.");
    return;
  }

  try {
    const selectedOrdersDetails = orders.value.filter(order => selectedOrders.value.includes(order.id));

    if (socket.value && socket.value.connected) {
      socket.value.emit('pedidos_aceptados_masivo', {
        pedidosIds: selectedOrders.value,
        tiempoEstimado: estimatedTime.value,
        detallesPedidos: selectedOrdersDetails
      });
    }

    // Actualizar la UI
    selectedOrders.value.forEach((id) => {
      const order = orders.value.find((order) => order.id === id);
      if (order) {
        order.status = "preparation";
        order.estimatedTime = estimatedTime.value;
      }
    });
    
    alert("Pedidos seleccionados aceptados exitosamente.");
    selectedOrders.value = [];
    closeBulkActionModal();
  } catch (error) {
    console.error('Error al aceptar los pedidos:', error);
    alert(`Error al aceptar los pedidos: ${error.message}`);
  }
};

// Modificar la función de rechazo masivo
const confirmBulkReject = async () => {
  if (!rejectionReason.value) {
    alert("Por favor, ingresa una razón de rechazo.");
    return;
  }
  
  try {
    const selectedOrdersDetails = orders.value.filter(order => selectedOrders.value.includes(order.id));

    if (socket.value && socket.value.connected) {
      socket.value.emit('pedidos_rechazados_masivo', {
        pedidosIds: selectedOrders.value,
        razonRechazo: rejectionReason.value,
        detallesPedidos: selectedOrdersDetails
      });
    }

    // Actualizar la UI
    orders.value = orders.value.filter((order) => !selectedOrders.value.includes(order.id));
    
    alert("Pedidos seleccionados rechazados exitosamente.");
    selectedOrders.value = [];
    closeBulkActionModal();
  } catch (error) {
    console.error('Error al rechazar los pedidos:', error);
    alert(`Error al rechazar los pedidos: ${error.message}`);
  }
};

// Marcar pedido como completado
const markOrderAsCompleted = async (orderId) => {
  if (dataSource.value === 'api') {
    try {
      // En una implementación real, aquí habría una llamada a la API
      // Ejemplo:
      // await fetch(`http://localhost:4000/pedidos/${orderId}/completar`, {
      //   method: 'POST'
      // });
      
      // Simulamos tiempo de espera
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error completing order:', error);
      alert(`Error al completar el pedido: ${error.message}`);
      return;
    }
  }

  // Actualizar la UI
  const order = orders.value.find((order) => order.id === orderId);
  if (order) {
    order.status = "completed";
  }
  
  alert(`Pedido #${orderId} marcado como completado.`);
};

// Cargar datos iniciales
onMounted(() => {
  fetchOrders();
  inicializarSocket();
});

// Agregar onBeforeUnmount para limpiar la conexión
onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<style scoped>
.local-orders-page {
  padding-bottom: 100px; /* Espacio para el footer */
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}
 
.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tab-button {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.status-badge {
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.filters {
  margin-bottom: 1.5rem;
}

.filters input,
.filters select {
  width: 100%;
  max-width: 100%;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.status-badge {
  font-weight: 600;
}

/* Responsividad */
@media (max-width: 640px) {
  .filters {
    flex-wrap: nowrap; /* Mantener en una sola fila */
    overflow-x: auto; /* Permitir desplazamiento horizontal si es necesario */
    gap: 4px; /* Espaciado más pequeño */
  }

  .filters div {
    min-width: 100px; /* Ancho mínimo para cada filtro */
  }

  .filters label {
    font-size: 0.8rem; /* Tamaño de fuente más pequeño */
  }

  .filters input,
  .filters select,
  .filters button {
    font-size: 0.8rem; /* Tamaño de fuente más pequeño */
    padding: 0.5rem; /* Padding más pequeño */
  }
}
</style>
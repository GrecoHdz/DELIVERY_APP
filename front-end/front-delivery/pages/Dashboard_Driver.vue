<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
  <!-- Header (mantenido igual) -->
  <header class="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <TruckIcon class="text-blue-600" :size="24" />
        <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
      </div>
      <div class="flex items-center space-x-4">
        <select v-model="selectedProfile" @change="redirectToProfile" class="p-1 text-center bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-bold focus:outline-none">
          <option value="Cliente">Cliente</option>
          <option value="Local">Local</option>
          <option value="Delivery">Delivery</option>
        </select>
        <div class="relative cursor-pointer" @click="showNotifications">
          <BellIcon class="text-blue-600" :size="24" />
          <div v-if="unreadNotifications.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {{ unreadNotifications.length }}
          </div>
        </div>
      </div>
    </header>

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

    <!-- Contenido Principal del Dashboard -->
    <div class="dashboard-container p-4">
      <!-- Título del Dashboard -->
      <h1 class="text-2xl font-bold text-blue-600 mb-6">Dashboard del Driver</h1>

      <!-- Botones de Recargar Membresía y Soporte -->
      <div class="flex space-x-4 mb-6">
        <button
          @click="showMembershipModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Recargar Membresía
        </button>
        <button
          @click="showSupportModal = true"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Soporte
        </button>
      </div>

      <!-- Estadísticas de Entrega -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Estadísticas de Entrega</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-blue-100 rounded-lg text-center">
            <p class="text-gray-600 text-sm">Entregas Hoy</p>
            <p class="text-xl font-bold text-blue-600">{{ deliveryStats.deliveriesToday }}</p>
          </div>
          <div class="p-4 bg-green-100 rounded-lg text-center">
            <p class="text-gray-600 text-sm">Ganancias Hoy</p>
            <p class="text-xl font-bold text-green-600">${{ deliveryStats.earningsToday }}</p>
          </div>
          <div class="p-4 bg-yellow-100 rounded-lg text-center">
            <p class="text-gray-600 text-sm">Entregas Última Semana</p>
            <p class="text-xl font-bold text-yellow-600">{{ deliveryStats.deliveriesLastWeek }}</p>
          </div>
          <div class="p-4 bg-purple-100 rounded-lg text-center">
            <p class="text-gray-600 text-sm">Ganancias Última Semana</p>
            <p class="text-xl font-bold text-purple-600">${{ deliveryStats.earningsLastWeek }}</p>
          </div>
        </div>
      </div>

      <!-- Membresía Restante -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Membresía Restante</h2>
        <div class="relative h-4 bg-gray-400 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-600 rounded-full"
            :style="{ width: `${(membershipBalance / 300) * 100}%` }"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            L {{ membershipBalance }}
          </div>
        </div>
        <p class="text-sm text-gray-600 mt-2">
          <span :class="{ 'text-red-500': membershipBalance < 75 }">
            {{ membershipBalance < 75 ? "¡Saldo bajo! Recarga tu membresía." : "Saldo en buen estado." }}
          </span>
        </p>
      </div>

      <!-- Historial de Pedidos -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Historial</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm p-3 border border-blue-200 flex items-center justify-between"
          >
            <div>
              <p class="text-sm text-gray-600">{{ order.customerAddress }}</p>
              <p class="text-sm font-bold text-blue-600">{{ order.customer }}</p>
            </div>
            <button
              @click="openOrderDetails(order)"
              class="text-blue-600 hover:text-blue-700"
            >
              <InfoIcon :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles del Pedido -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Detalles del Pedido</h2>
        <p class="text-sm text-gray-600"><span class="font-medium">Cliente:</span> {{ selectedOrder.customer }}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Origen:</span> {{ selectedOrder.storeAddress }}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Destino:</span> {{ selectedOrder.customerAddress }}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Fecha:</span> {{ selectedOrder.deliveryDate }}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Cobro:</span> ${{ selectedOrder.payment }}</p>
        <div class="flex justify-end mt-4">
          <button
            @click="selectedOrder = null"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Recarga de Membresía -->
    <div v-if="showMembershipModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Recargar Membresía</h2>
        <p class="text-gray-600 mb-4">
          La membresía es un saldo que usas para trabajar. Por cada entrega, se deduce el 20% del valor del pedido. Cuando el saldo se agote, recárgalo para seguir trabajando.
        </p>
        <input
          type="number"
          v-model="membershipAmount"
          placeholder="Monto de la recarga"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 mb-4"
        />
        <input
          type="text"
          v-model="membershipReceiptUrl"
          placeholder="URL del comprobante"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 mb-4"
        />
        <div class="flex justify-end space-x-4">
          <button
            @click="showMembershipModal = false"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            @click="rechargeMembership"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Recargar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Recarga Exitosa -->
    <div v-if="rechargeSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-11/12 max-w-md text-center">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Recarga Exitosa</h2>
        <p class="text-gray-600 mb-4">Tu membresía ha sido recargada con éxito.</p>
        <button
          @click="rechargeSuccess = false"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>

    <!-- Modal de Soporte -->
    <div v-if="showSupportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Soporte</h2>
        <input
          type="text"
          v-model="supportTitle"
          placeholder="Título"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 mb-4"
        />
        <textarea
          v-model="supportMessage"
          placeholder="Mensaje"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 mb-4"
          rows="4"
        ></textarea>
        <div class="flex justify-end space-x-4">
          <button
            @click="showSupportModal = false"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            @click="sendSupportMessage"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Ticket Enviado -->
    <div v-if="ticketSent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-11/12 max-w-md text-center">
        <h2 class="text-lg font-bold text-blue-600 mb-4">Ticket Enviado</h2>
        <p class="text-gray-600 mb-4">Tu ticket de soporte ha sido enviado con éxito.</p>
        <button
          @click="ticketSent = false"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center cursor-pointer" @click="currentTab = 'home'">
          <HomeIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Inicio</span>
        </div>
        <div class="flex flex-col items-center">
          <a href="PedidosDrivers" class="flex flex-col items-center">
            <ShoppingBagIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Pedidos</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Info as InfoIcon,
} from "lucide-vue-next";

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
// Datos de ejemplo para historial de pedidos
const orders = ref([
  {
    id: 1,
    customer: "Juan Pérez",
    customerAddress: "Calle 123, Colonia Centro",
    storeAddress: "Avenida Principal 456",
    deliveryDate: "2023-10-15",
    payment: 25.99,
  },
  {
    id: 2,
    customer: "Ana Gómez",
    customerAddress: "Calle 456, Colonia Norte",
    storeAddress: "Avenida Secundaria 789",
    deliveryDate: "2023-10-16",
    payment: 15.99,
  },
]);
 
const selectedProfile = ref("Delivery");

// Estadísticas de entrega
const deliveryStats = ref({
  deliveriesToday: 8,
  earningsToday: 120,
  deliveriesLastWeek: 45,
  earningsLastWeek: 800,
});

// Membresía
const membershipBalance = ref(70.0);
const showMembershipModal = ref(false);
const membershipAmount = ref(null);
const membershipReceiptUrl = ref("");
const rechargeSuccess = ref(false);

// Modal de Detalles del Pedido
const selectedOrder = ref(null);

// Soporte
const showSupportModal = ref(false);
const supportTitle = ref("");
const supportMessage = ref("");
const ticketSent = ref(false);

// Filtrar pedidos asignados
const filteredOrders = computed(() => {
  return orders.value;
});

// Abrir detalles del pedido
const openOrderDetails = (order) => {
  selectedOrder.value = order;
};

// Recargar Membresía
const rechargeMembership = () => {
  if (membershipAmount.value && membershipReceiptUrl.value) {
    membershipBalance.value += parseFloat(membershipAmount.value);
    showMembershipModal.value = false;
    rechargeSuccess.value = true;
    membershipAmount.value = null;
    membershipReceiptUrl.value = "";
  }
};

// Enviar mensaje de soporte
const sendSupportMessage = () => {
  if (supportTitle.value && supportMessage.value) {
    console.log("Mensaje de soporte enviado:", { title: supportTitle.value, message: supportMessage.value });
    showSupportModal.value = false;
    ticketSent.value = true;
    supportTitle.value = "";
    supportMessage.value = "";
  }
};
</script>

<style scoped>
.dashboard-container {
  padding-bottom: 100px; /* Espacio para el footer */
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .dashboard-container {
    padding-bottom: 150px; /* Más espacio para el footer en móviles */
  }
}
</style>
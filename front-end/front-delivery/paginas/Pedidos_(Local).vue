<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    <!-- Header -->
    <header class="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <TruckIcon class="text-blue-600" :size="24" />
        <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
      </div>
      <div class="flex items-center space-x-4">
        <select
          v-model="selectedProfile"
          class="p-1 text-center bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-bold focus:outline-none"
        >
          <option value="Cliente">Cliente</option>
          <option value="Local">Local</option>
          <option value="Delivery">Delivery</option>
        </select>
        <div class="relative cursor-pointer" @click="showNotifications">
          <BellIcon class="text-blue-600" :size="24" />
          <div
            v-if="unreadNotifications.length > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1"
          >
            {{ unreadNotifications.length }}
          </div>
        </div>
      </div>
    </header>

    <!-- Modal de Notificaciones -->
    <transition name="fade">
      <div
        v-if="isModalOpen"
        class="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50"
      >
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
        <div v-else class="text-sm text-gray-500">No tienes notificaciones nuevas.</div>
        <button
          @click="closeNotifications"
          class="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-500 transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </transition>

    <!-- Contenido Principal -->
    <div class="local-orders-page p-4">
      <h1 class="text-2xl font-bold text-blue-600 mb-6">Gestión de Pedidos</h1>

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

      <!-- Lista de Pedidos Recibidos -->
      <div v-if="activeTab === 'received'" class="orders-grid">
        <div
          v-for="order in receivedOrders"
          :key="order.id"
          class="order-card bg-white rounded-lg shadow-md p-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-blue-600">Pedido #{{ order.id }}</h3>
            <span class="text-sm text-gray-500">{{ order.date }}</span>
          </div>
          <div class="mb-4">
            <p class="text-gray-700"><span class="font-semibold">Cliente:</span> {{ order.customer }}</p>
            <p class="text-gray-700"><span class="font-semibold">Total:</span> ${{ order.total.toFixed(2) }}</p>
            <p class="text-gray-700"><span class="font-semibold">Método de Pago:</span> {{ order.paymentMethod }}</p>
            <p class="text-gray-700"><span class="font-semibold">Tipo de Pedido:</span> {{ order.orderType }}</p>
          </div>
          <div class="mb-4">
            <h4 class="text-md font-semibold text-blue-600">Productos:</h4>
            <ul class="list-disc list-inside text-gray-700">
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} (x{{ item.quantity }})
                <span v-if="item.attributes" class="text-xs text-gray-500">
                  {{ item.attributes.join(", ") }}
                </span>
                <span v-if="item.extras" class="text-xs text-gray-500">
                  Extras: {{ item.extras.join(", ") }}
                </span>
              </li>
            </ul>
          </div>
          <div class="flex justify-end space-x-2">
            <button
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              @click="acceptOrder(order.id)"
            >
              Aceptar
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              @click="openRejectModal(order.id)"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Pedidos Aceptados -->
      <div v-if="activeTab === 'accepted'" class="orders-grid">
        <div
          v-for="order in acceptedOrders"
          :key="order.id"
          class="order-card bg-white rounded-lg shadow-md p-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-blue-600">Pedido #{{ order.id }}</h3>
            <span class="text-sm text-gray-500">{{ order.date }}</span>
          </div>
          <div class="mb-4">
            <p class="text-gray-700"><span class="font-semibold">Cliente:</span> {{ order.customer }}</p>
            <p class="text-gray-700"><span class="font-semibold">Total:</span> ${{ order.total.toFixed(2) }}</p>
            <p class="text-gray-700"><span class="font-semibold">Método de Pago:</span> {{ order.paymentMethod }}</p>
            <p class="text-gray-700"><span class="font-semibold">Tipo de Pedido:</span> {{ order.orderType }}</p>
          </div>
          <div class="mb-4">
            <h4 class="text-md font-semibold text-blue-600">Productos:</h4>
            <ul class="list-disc list-inside text-gray-700">
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} (x{{ item.quantity }})
                <span v-if="item.attributes" class="text-xs text-gray-500">
                  {{ item.attributes.join(", ") }}
                </span>
                <span v-if="item.extras" class="text-xs text-gray-500">
                  Extras: {{ item.extras.join(", ") }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Rechazar Pedido -->
    <transition name="fade">
      <div v-if="rejectModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-lg font-bold text-blue-600 mb-4">Rechazar Pedido</h3>
          <textarea
            v-model="rejectReason"
            class="w-full p-2 border rounded-lg mb-4"
            placeholder="Ej: Falta de stock, horario no disponible..."
          ></textarea>
          <div class="flex justify-end space-x-2">
            <button
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              @click="closeRejectModal"
            >
              Cancelar
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              @click="rejectOrder"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </transition>

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
        <div class="flex flex-col items-center">
          <div class="cursor-pointer">
            <SettingsIcon class="text-blue-600" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Configuración</span>
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
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
} from "lucide-vue-next";

// Datos de ejemplo para pedidos
const orders = ref([
  {
    id: 1,
    date: "25 de Octubre, 2023",
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
    customer: "María Gómez",
    total: 10.0,
    paymentMethod: "Efectivo",
    orderType: "Comer en local",
    items: [
      { id: 3, name: "Chicken Dumplings", quantity: 1 },
      { id: 4, name: "French Fries", quantity: 2 },
    ],
    status: "accepted",
  },
]);

// Pestañas
const activeTab = ref("received");

// Pedidos recibidos y aceptados
const receivedOrders = computed(() => orders.value.filter((order) => order.status === "received"));
const acceptedOrders = computed(() => orders.value.filter((order) => order.status === "accepted"));

// Modal de rechazo
const rejectModalOpen = ref(false);
const rejectReason = ref("");
const selectedOrderId = ref(null);

const openRejectModal = (id) => {
  selectedOrderId.value = id;
  rejectModalOpen.value = true;
};

const closeRejectModal = () => {
  rejectModalOpen.value = false;
  rejectReason.value = "";
};

const rejectOrder = () => {
  if (rejectReason.value) {
    alert(`Pedido #${selectedOrderId.value} rechazado. Razón: ${rejectReason.value}`);
    orders.value = orders.value.filter((order) => order.id !== selectedOrderId.value);
    closeRejectModal();
  } else {
    alert("Por favor, ingresa una razón para rechazar el pedido.");
  }
};

const acceptOrder = (id) => {
  const order = orders.value.find((order) => order.id === id);
  if (order) {
    order.status = "accepted";
    alert(`Pedido #${id} aceptado.`);
  }
};

// Notificaciones
const notifications = ref([
  { id: 1, message: "Nuevo pedido recibido.", read: false },
  { id: 2, message: "Pedido #1 aceptado.", read: true },
]);
const isModalOpen = ref(false);
const unreadNotifications = computed(() => notifications.value.filter((n) => !n.read));

const showNotifications = () => (isModalOpen.value = true);
const closeNotifications = () => (isModalOpen.value = false);
const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) notification.read = true;
};
</script>

<style scoped>
.local-orders-page {
  padding-bottom: 100px; /* Espacio para el footer */
}

.tabs {
  margin-bottom: 20px;
}

.tab-button {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.order-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
</style>
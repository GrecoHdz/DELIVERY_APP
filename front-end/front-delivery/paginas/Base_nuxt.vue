<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100"> 
  <header class="bg-white shadow-md px-4 py-3 flex justify-between items-center">
    <div class="flex items-center space-x-2">
      <TruckIcon class="text-blue-600" :size="24" />
      <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
    </div>
    <div class="flex items-center space-x-4">
      <select v-model="selectedProfile" class="p-1 text-center bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-bold focus:outline-none">
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
      <!-- Modal de Notificaciones -->
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

    <!-- Contenido Principal -->
    <div class="p-4">
      <!-- Aquí va el contenido principal -->
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
import { ref, computed } from 'vue';
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
} from 'lucide-vue-next';

// Estado del modal de notificaciones
const isModalOpen = ref(false);

// Datos de notificaciones en formato JSON (simulando una base de datos)
const notifications = ref([
  {
    id: 1,
    message: "Tu pedido ha sido enviado.",
    read: false,
  },
  {
    id: 2,
    message: "Nuevo descuento disponible.",
    read: false,
  },
  {
    id: 3,
    message: "Actualización de la app disponible.",
    read: true,
  },
]);

// Computed para obtener las notificaciones no leídas
const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read);
});

// Función para abrir el modal de notificaciones
const showNotifications = () => {
  isModalOpen.value = true;
};

// Función para cerrar el modal y marcar todas las notificaciones como leídas
const closeNotifications = () => {
  isModalOpen.value = false;
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

// Función para marcar una notificación como leída
const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

// Selector de perfil
const selectedProfile = ref("Cliente");
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
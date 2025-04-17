<template>
  <div>
    <header class="fixed top-0 left-0 right-0 bg-white shadow-md px-3 py-3 flex justify-between items-center text-lg z-50"> 
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
    </header>

    <!-- Espaciador para el header fijo -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Truck as TruckIcon, Bell as BellIcon } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const { auth } = useAuth();
const selectedProfile = ref("Cliente");

const notifications = ref([
  { id: 1, message: "Tu pedido ha sido enviado.", read: false },
  { id: 2, message: "Nuevo descuento disponible.", read: false },
  { id: 3, message: "Actualización de la app disponible.", read: true },
]);

const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read);
});

const isModalOpen = ref(false);
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

const redirectToProfile = () => {
  console.log('Intentando redirigir a:', selectedProfile.value);

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
      console.log('Perfil no válido');
      break;
  }
};
</script>

<style scoped>
header {
  height: 64px;
}
</style>

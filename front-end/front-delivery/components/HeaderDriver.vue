<template>
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
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { Truck as TruckIcon, Bell as BellIcon } from 'lucide-vue-next';
  
  const selectedProfile = ref("Driver");
  const notifications = ref([
    { id: 1, message: "Tu pedido ha sido enviado.", read: false },
    { id: 2, message: "Nuevo descuento disponible.", read: false },
    { id: 3, message: "Actualización de la app disponible.", read: true },
  ]);
  const unreadNotifications = computed(() => {
    return notifications.value.filter((notification) => !notification.read);
  });
  
  const showNotifications = () => {
    isModalOpen.value = true;
  };
  
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
  </script>
  
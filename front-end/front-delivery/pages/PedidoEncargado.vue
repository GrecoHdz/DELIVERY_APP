<template>
  <transition name="fade">
    <div class="waiting-page min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-blue-100">
      <!-- Ícono Animado -->
      <div class="waiting-icon animate-pulse">
        <svg class="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <!-- Mensaje de Espera -->
      <h1 class="text-3xl font-bold text-gray-800 mt-6">Pedido Encargado con Éxito</h1>
      <p class="text-gray-600 mt-2">Estamos esperando la confirmación del local.</p>

      <!-- Número de Orden y Fecha -->
      <div class="order-details bg-white p-6 rounded-lg shadow-md mt-8 text-center">
        <p class="text-gray-700">
          <span class="font-semibold">Número de Orden:</span>
          <span class="text-blue-600"> #{{ orderData.orderNumber }}</span>
        </p>
        <p class="text-gray-700 mt-2"><span class="font-semibold">Fecha:</span> {{ orderData.date }}</p>
      </div>

      <!-- Botón de Ver Pedido -->
      <button class="view-order-button mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-200">
        Ver Pedido
      </button>

      <!-- Mensaje de Espera Adicional -->
      <p class="text-gray-500 text-sm mt-4">Por favor, espera unos segundos mientras el local confirma tu pedido.</p>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Simulación de datos de un JSON
const orderData = ref({
  orderNumber: '',
  date: ''
});

// Función para cargar los datos del pedido
const loadOrderData = () => {
  // Simulación de una llamada a una API o carga de un JSON
  setTimeout(() => {
    orderData.value = {
      orderNumber: '123456',
      date: '25 de Octubre, 2023'
    };
  }, 1000); // Simula un retardo de 1 segundo
};

// Cargar los datos cuando el componente se monta
onMounted(() => {
  loadOrderData();
});
</script>

<style scoped>
.waiting-page {
  padding: 20px;
}

.waiting-icon {
  animation: pulse 1.5s infinite;
}
.text-blue-600{
  font-weight: 700;
}
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.order-details {
  max-width: 300px;
  width: 100%;
}

.view-order-button {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.view-order-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* Animación de entrada */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
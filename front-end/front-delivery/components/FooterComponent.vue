<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 z-10">
    <div class="flex justify-around items-center">
      <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Dashboard_Cliente')">
        <HomeIcon class="text-blue-600" :size="20" />
        <span class="text-xs text-blue-600 mt-1">Inicio</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Favoritos')">
        <HeartIcon class="text-blue-600" :size="20" />
        <span class="text-xs text-blue-600 mt-1">Favoritos</span>
      </div>
      <div class="flex flex-col items-center relative cursor-pointer" @click="redirectTo('/Carrito')">
        <div class="bg-blue-600 rounded-full p-2">
          <ShoppingCartIcon class="text-white" :size="20" />
        </div>
        <span class="text-xs text-blue-600 mt-1">Carrito</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Pedidos')">
        <ShoppingBagIcon class="text-blue-600" :size="20" />
        <span class="text-xs text-blue-600 mt-1">Pedidos</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Perfil')">
        <SettingsIcon class="text-blue-600" :size="20" />
        <span class="text-xs text-blue-600 mt-1">Configuración</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Home as HomeIcon, Heart as HeartIcon, ShoppingCart as ShoppingCartIcon, ShoppingBag as ShoppingBagIcon, Settings as SettingsIcon } from 'lucide-vue-next';

// Función mejorada para redirigir con recarga completa
const redirectTo = (url) => {
  window.location.replace(url); // Reemplaza la URL y fuerza una recarga
};
</script>

<style scoped>
/* Asegúrate de que el footer tenga un fondo sólido y un z-index adecuado */
footer {
  background-color: white; /* Fondo sólido */
  z-index: 10; /* Asegura que esté por encima del contenido */
}
</style>

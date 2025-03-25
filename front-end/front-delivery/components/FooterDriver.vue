<template>
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center">
          <NuxtLink to="/Dashboard_Driver" class="flex flex-col items-center">
            <HomeIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Inicio</span>
          </NuxtLink>
        </div>  
        <div class="flex flex-col items-center">
          <NuxtLink to="/PedidosDrivers" class="flex flex-col items-center"> 
            <ShoppingBagIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Pedidos</span>
          </NuxtLink>
        </div> 
      </div>
    </footer>
  </template>
  
  <script setup>
  import { Home as HomeIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-vue-next';
  </script>
  
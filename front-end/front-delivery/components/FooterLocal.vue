 
  <template>
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Dashboard_Local')">
          <HomeIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Inicio</span>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/productoslocal')">
          <LucideClipboardList class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Productos</span>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Pedidos')">
          <ShoppingBagIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Pedidos</span>
        </div> 
      </div>
    </footer>
  </template>
  
  <script setup>
  import { Home as HomeIcon, Clipboard as LucideClipboardList, ShoppingCart as ShoppingCartIcon, ShoppingBag as ShoppingBagIcon, Settings as SettingsIcon } from 'lucide-vue-next';
  
  // Función mejorada para redirigir con recarga completa
  const redirectTo = (url) => {
    window.location.replace(url); // Reemplaza la URL y fuerza una recarga
  };
  </script>
  
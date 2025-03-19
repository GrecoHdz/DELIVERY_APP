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

    <!-- Contenido Principal (Modificado según requerimientos) -->
    <div class="container mx-auto p-4 pb-24">
      <!-- Selector de Modo -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold mb-0 text-gray-800">Tus Favoritos</h2>
        <div class="flex items-center p-2 bg-white rounded-lg shadow-sm">
          <span class="text-sm text-gray-600 mr-2">Modo:</span>
          <button 
            @click="toggleMode" 
            class="relative inline-flex items-center w-14 h-7 rounded-full transition-colors focus:outline-none"
            :class="isDemoMode ? 'bg-gray-300' : 'bg-blue-600'"
          >
            <span 
              class="inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-200 ease-in-out"
              :class="isDemoMode ? 'translate-x-1' : 'translate-x-8'"
            ></span>
          </button>
          <span class="text-xs font-medium ml-2" :class="isDemoMode ? 'text-gray-500' : 'text-blue-600'">
            {{ isDemoMode ? 'Demo' : 'API' }}
          </span>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded my-4">
        <p>{{ error }}</p>
        <button @click="loadFavoritos" class="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
          Reintentar
        </button>
      </div>

      <!-- Sin favoritos -->
      <div v-else-if="productosFavoritos.length === 0" class="flex flex-col items-center justify-center my-12 text-center">
        <HeartIcon :size="48" class="text-gray-300 mb-4" />
        <p class="text-gray-500 text-lg mb-4">No tienes favoritos guardados</p>
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all">
          Explorar productos
        </button>
      </div>

      <!-- Grid de Productos -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Tarjeta de Producto Favorito -->
        <div
          v-for="producto in productosFavoritos"
          :key="producto.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <!-- Contenedor de imagen con overlays -->
          <div class="h-48 bg-gray-200 relative overflow-hidden">
            <img
              :src="producto.image"
              :alt="producto.name"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            
            <!-- Overlay oscuro gradiente para mejor legibilidad del texto -->
            <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            
            <!-- Overlay del nombre del local -->
            <div class="absolute bottom-0 left-0 right-0 p-3 text-white">
              <p class="text-sm font-medium">{{ producto.localName }}</p>
            </div>
            
            <!-- Corazón Táctil -->
            <div
              @click="toggleFavorito(producto.id)"
              class="absolute top-3 right-3 bg-white p-2 rounded-full cursor-pointer shadow-md transform transition hover:scale-110 z-10"
            >
              <HeartIcon
                :class="{
                  'text-red-500 fill-current': producto.isFavorito,
                  'text-gray-400': !producto.isFavorito,
                }"
                :size="18"
              />
            </div>
            
            <!-- Etiqueta de precio -->
            <div class="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md z-10">
              {{ producto.price }}
            </div>
          </div>
          
          <!-- Contenido de la tarjeta con altura fija -->
          <div class="p-4 flex flex-col h-[100px]">
            <h3 class="font-semibold text-gray-800 text-base mb-auto line-clamp-2 overflow-hidden">{{ producto.name }}</h3>
            <button 
              @click="openModal(producto)" 
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-sm"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal de Detalles -->
      <div v-if="modalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Cabecera del modal -->
          <div class="relative h-48">
            <img :src="selectedProduct.image" :alt="selectedProduct.name" class="w-full h-full object-cover">
            <div class="absolute top-2 right-2">
              <button @click="closeModal" class="bg-white p-1 rounded-full shadow-md">
                <XIcon :size="20" class="text-gray-700" />
              </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 class="text-white text-xl font-bold">{{ selectedProduct.name }}</h3>
            </div>
          </div>
          
          <!-- Contenido del modal -->
          <div class="p-4">
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600 text-sm">Precio:</span>
                <span class="font-bold text-blue-600">{{ selectedProduct.price }}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600 text-sm">ID Producto:</span>
                <span class="font-medium">{{ selectedProduct.id_producto || selectedProduct.id }}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600 text-sm">Local:</span>
                <span class="font-medium">{{ selectedProduct.localName }}</span>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4 mb-4">
              <p class="text-sm text-gray-700">
                Este producto está en tus favoritos. Puedes eliminarlo de favoritos o agregarlo a tu carrito.
              </p>
            </div>
            
            <!-- Botones de acción -->
            <div class="flex gap-2">
              <button 
                @click="toggleFavorito(selectedProduct.id); closeModal()"
                class="flex-1 bg-red-100 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
              >
                Eliminar de favoritos
              </button>
              <button 
                class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center">
          <a href="/Dashboard_Cliente" class="flex flex-col items-center">
            <HomeIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Inicio</span>
          </a>
        </div>
        <div class="flex flex-col items-center">
          <a href="/Favoritos" class="flex flex-col items-center">
            <HeartIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Favoritos</span>
          </a>
        </div>
        <div class="flex flex-col items-center relative">
          <a href="/Carrito" class="flex flex-col items-center"></a>
          <div class="bg-blue-600 rounded-full p-2">
            <ShoppingCartIcon class="text-white" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Carrito</span>
        </div>
        <div class="flex flex-col items-center">
          <a href="PedidosCliente" class="flex flex-col items-center">
            <ShoppingBagIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Pedidos</span>
          </a>
        </div>
        <div class="flex flex-col items-center">
          <a href="/Perfil" class="flex flex-col items-center">
            <div class="cursor-pointer">
              <SettingsIcon class="text-blue-600" :size="20" />
            </div>
            <span class="text-xs text-blue-600 mt-1">Configuración</span>
          </a>
        </div>
      </div>
    </footer>>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  X as XIcon,
  Settings as SettingsIcon
} from 'lucide-vue-next';

// Estado para modo de datos (Demo/API)
const isDemoMode = ref(true);
const isLoading = ref(false);
const error = ref(null);


const isModalOpen = ref(false);
const selectedProfile = ref("Cliente");
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

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Perfil
const isProfileMenuOpen = ref(false); 

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const selectProfile = (profile) => {
  selectedProfile.value = profile;
  isProfileMenuOpen.value = false;
};

// Toggle modo demo/producción
const toggleMode = () => {
  isDemoMode.value = !isDemoMode.value;
  loadFavoritos();
};

// Estado para el modal
const modalVisible = ref(false);
const selectedProduct = ref({});

// Abrir modal con producto seleccionado
const openModal = (producto) => {
  selectedProduct.value = producto;
  modalVisible.value = true;
};

// Cerrar modal
const closeModal = () => {
  modalVisible.value = false;
};

// Datos de ejemplo para Productos Favoritos (modo demo)
const demoProductos = [
  {
    id: 1,
    name: "Hamburguesa Clásica",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: "$8.99",
    isFavorito: true,
    id_local: 101,
    localName: "Nichas Burger Premium",
    id_producto: 1001
  },
  {
    id: 2,
    name: "Pizza Margarita",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: "$12.50",
    isFavorito: true,
    id_local: 102,
    localName: "Pizza Inn Deluxe",
    id_producto: 1002
  },
  {
    id: 3,
    name: "Sushi Variado",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: "$15.99",
    isFavorito: true,
    id_local: 103,
    localName: "Sushi Master",
    id_producto: 1003
  },
  {
    id: 4,
    name: "Ensalada César",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    price: "$7.99",
    isFavorito: true,
    id_local: 101,
    localName: "Nichas Burger Premium",
    id_producto: 1004
  },
];

// Estado de productos favoritos
const productosFavoritos = ref([]);

// Cargar favoritos según el modo
const loadFavoritos = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    if (isDemoMode.value) {
      // Modo demo - usar datos locales
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      productosFavoritos.value = [...demoProductos];
    } else {
      // Modo API - obtener datos reales
      const response = await fetch('http://localhost:4000/favoritos');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const favoritos = await response.json();
      
      // Primero, necesitamos obtener los locales para mostrar sus nombres
      const localesResponse = await fetch('http://localhost:4000/locales');
      
      if (!localesResponse.ok) {
        throw new Error(`Error al obtener locales: ${localesResponse.status}`);
      }
      
      const locales = await localesResponse.json();
      
      // Mapear la respuesta de la API al formato que necesita nuestra UI
      // Solo usando los datos que existen en el controller
      productosFavoritos.value = favoritos.map(fav => {
        // Buscar el local correspondiente para obtener su nombre
        const local = locales.find(l => l.id === fav.id_local);
        const localName = local ? local.nombre_local : `Local #${fav.id_local}`;
        
        return {
          id: fav.id,
          name: `Producto #${fav.id_producto}`,
          image: fav.imagen_url || "https://via.placeholder.com/300?text=Producto",
          price: fav.precio || "$0.00",
          isFavorito: true,
          id_producto: fav.id_producto,
          id_local: fav.id_local,
          localName: localName,
          id_cliente: fav.id_cliente
        };
      });
    }
  } catch (err) {
    console.error('Error al cargar favoritos:', err);
    error.value = 'No se pudieron cargar tus favoritos. Verifica tu conexión.';
    productosFavoritos.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Función para alternar el estado de favorito
const toggleFavorito = async (id) => {
  const producto = productosFavoritos.value.find((p) => p.id === id);
  
  if (!producto) return;
  
  if (isDemoMode.value) {
    // Modo demo - simplemente alternar el estado
    producto.isFavorito = !producto.isFavorito;
    
    // Si ya no es favorito, eliminarlo de la lista después de una animación
    if (!producto.isFavorito) {
      setTimeout(() => {
        productosFavoritos.value = productosFavoritos.value.filter(p => p.id !== id);
      }, 500);
    }
  } else {
    // Modo API
    try {
      if (producto.isFavorito) {
        // Eliminar de favoritos
        const response = await fetch(`http://localhost:4000/favoritos/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Si se eliminó correctamente, quitarlo de la UI
        productosFavoritos.value = productosFavoritos.value.filter(p => p.id !== id);
      } else {
        // Agregar a favoritos
        const clienteId = 1; // Aquí deberías usar el ID real del cliente logueado
        
        const response = await fetch(`http://localhost:4000/favoritos/${clienteId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_producto: producto.id_producto || producto.id,
            id_local: producto.id_local || 1
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Actualizar el estado después de añadir
        producto.isFavorito = true;
      }
    } catch (err) {
      console.error('Error al actualizar favorito:', err);
      // Mostrar un mensaje de error
      error.value = 'No se pudo actualizar el favorito. Intenta de nuevo.';
      setTimeout(() => {
        error.value = null;
      }, 3000);
    }
  }
};

// Cargar datos cuando se monta el componente
onMounted(() => {
  loadFavoritos();
});
</script>

<style>
/* Transiciones para el modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Prevenir scroll cuando el modal está abierto */
body.modal-open {
  overflow: hidden;
}
</style>
<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <!-- Header -->
      <header class="bg-white shadow-md p-4">
        <div class="flex justify-between items-center">
          <!-- Sidebar a la izquierda -->
          <div @click="toggleSidebar" class="cursor-pointer">
            <MenuIcon class="text-blue-600" :size="24" />
          </div>
          <!-- Nombre de la app en el centro -->
          <div class="flex items-center space-x-2">
            <TruckIcon class="text-blue-600" :size="24" />
            <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
          </div>
          <!-- Notificaciones a la derecha -->
          <div class="relative">
            <BellIcon class="text-blue-600" :size="24" />
            <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</div>
          </div>
        </div>
      </header>
  
      <!-- Sidebar -->
      <div
        class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50"
        :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }"
      >
        <div class="p-4">
          <h2 class="text-lg font-bold mb-4">Opciones</h2>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-700 hover:text-blue-600">Idioma</a></li>
            <li><a href="#" class="text-gray-700 hover:text-blue-600">Cerrar sesión</a></li>
            <li><a href="#" class="text-gray-700 hover:text-blue-600">Ver mi local</a></li>
            <li><a href="#" class="text-gray-700 hover:text-blue-600">Ser driver</a></li>
            <li><a href="#" class="text-gray-700 hover:text-blue-600">Perfil</a></li>
            <li><a href="#" class="text-gray-700 hover:text-blue-600">Configuración</a></li>
            <li><a href="#" class="text-gray-700 hover:text-blue-600">Soporte</a></li>
          </ul>
        </div>
      </div>
  
      <!-- Contenido Principal -->
      <div class="container mx-auto p-4 pb-24">
        <!-- Selector de Modo -->
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-xl font-semibold text-gray-800">Locales Disponibles</h1>
          <div class="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
            <span class="text-sm text-gray-600">Modo:</span>
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
  
        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-sm p-3 mb-6">
          <div class="flex flex-wrap gap-3">
            <!-- Buscador -->
            <div class="flex-grow min-w-[200px]">
              <div class="relative">
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="18" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar locales..."
                  class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base"
                />
              </div>
            </div>
            
            <!-- Filtro por tipo de servicio (solo en modo Demo) -->
            <div v-if="isDemoMode" class="min-w-[150px]">
              <select
                v-model="selectedCategory"
                class="w-full py-2 px-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-base appearance-none pr-8"
              >
                <option value="">Todas las categorías</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Estado de carga -->
        <div v-if="isLoading" class="flex justify-center my-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
  
        <!-- Mensaje de error -->
        <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded my-4">
          <p>{{ error }}</p>
          <button @click="loadLocales" class="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
            Reintentar
          </button>
        </div>
  
        <!-- Sin locales -->
        <div v-else-if="filteredLocales.length === 0" class="flex flex-col items-center justify-center my-12 text-center">
          <StoreIcon :size="48" class="text-gray-300 mb-4" />
          <p class="text-gray-500 text-lg mb-4">No se encontraron locales con los filtros actuales</p>
          <button @click="resetFilters" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all">
            Limpiar filtros
          </button>
        </div>
  
        <!-- Grid de Locales -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Tarjeta de Local -->
          <div
            v-for="local in filteredLocales"
            :key="local.id"
            class="local-card bg-white rounded-xl shadow-md overflow-hidden"
          >
            <!-- Imagen -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="local.image" 
                :alt="local.name" 
                class="w-full h-full object-cover"
              />
              
              <!-- Badge de estado -->
              <div 
                v-if="isDemoMode || local.activo !== undefined"
                class="absolute top-3 left-3 py-1 px-3 rounded-full text-xs font-semibold shadow-md"
                :class="(isDemoMode ? local.isOpen : local.activo) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
              >
                {{ (isDemoMode ? local.isOpen : local.activo) ? 'Abierto' : 'Cerrado' }}
              </div>
            </div>
            
            <!-- Información del local -->
            <div class="p-4">
              <h3 class="font-bold text-gray-800 text-lg truncate">{{ local.name }}</h3>
              
              <!-- Horario -->
              <div v-if="local.apertura && local.cierre" class="text-sm text-gray-500 my-2">
                <ClockIcon :size="16" class="inline-block mr-1" />
                <span>{{ local.apertura }} - {{ local.cierre }}</span>
              </div>
              
              <!-- Demo badge -->
              <div v-if="isDemoMode" class="my-2">
                <div class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                  {{ local.category }}
                </div>
              </div>
              
              <!-- Info de cliente y disponibilidad -->
              <div v-if="!isDemoMode && local.pedidos_restantes !== undefined" class="text-sm text-gray-600 my-2">
                <span>Pedidos disponibles: {{ local.pedidos_restantes }}</span>
              </div>
              
              <!-- Botón de acción -->
              <button 
                @click="visitLocal(local.id)" 
                class="w-full mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Visitar Local
              </button>
            </div>
          </div>
        </div>
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
          <div class="flex flex-col items-center relative">
            <div @click="toggleProfileMenu" class="cursor-pointer">
              <UserIcon class="text-blue-600" :size="20" />
            </div>
            <span class="text-xs text-blue-600 mt-1">Perfil</span>
            <div v-if="isProfileMenuOpen" class="absolute bottom-10 bg-white shadow-lg rounded-lg p-2">
              <div @click="selectProfile('Cliente')" class="cursor-pointer text-sm text-gray-700 hover:bg-blue-100 p-2 rounded">Cliente</div>
              <div @click="selectProfile('Driver')" class="cursor-pointer text-sm text-gray-700 hover:bg-blue-100 p-2 rounded">Driver</div>
              <div @click="selectProfile('Local')" class="cursor-pointer text-sm text-gray-700 hover:bg-blue-100 p-2 rounded">Local</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import {
    Truck as TruckIcon,
    Bell as BellIcon,
    ShoppingCart as ShoppingCartIcon,
    User as UserIcon,
    Heart as HeartIcon,
    Home as HomeIcon,
    Menu as MenuIcon,
    ShoppingBag as ShoppingBagIcon,
    X as XIcon,
    Search as SearchIcon,
    Clock as ClockIcon,
    Store as StoreIcon,
    Check as CheckIcon
  } from 'lucide-vue-next';
  
  // Estado para modo de datos (Demo/API)
  const isDemoMode = ref(true);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Sidebar
  const isSidebarOpen = ref(false);
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  // Perfil
  const isProfileMenuOpen = ref(false);
  const selectedProfile = ref("Cliente");
  
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
    loadLocales();
  };
  
  // Filtros
  const selectedCategory = ref("");
  const searchQuery = ref("");
  
  // Resetear filtros
  const resetFilters = () => {
    selectedCategory.value = "";
    searchQuery.value = "";
  };
  
  // Datos de ejemplo para el modo demo
  const demoLocales = [
    {
      id: 1,
      name: "E-Coffe Shop",
      location: "Calle Principal #123, Centro",
      category: "Cafetería",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      isOpen: true,
      apertura: "7:00 AM",
      cierre: "9:00 PM"
    },
    {
      id: 2,
      name: "Pizza Inn Deluxe",
      location: "Avenida Central #456, Zona 10",
      category: "Pizza",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      isOpen: true,
      apertura: "11:00 AM",
      cierre: "10:00 PM"
    },
    {
      id: 3,
      name: "Ibagari Restaurant",
      location: "Plaza del Sol #789, Boulevard",
      category: "Restaurante",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      isOpen: true,
      apertura: "12:00 PM",
      cierre: "11:00 PM"
    },
    {
      id: 4,
      name: "Heladería Gelato Artesanal",
      location: "Calle del Parque #101, Jardines",
      category: "Postres",
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      isOpen: false,
      apertura: "10:00 AM",
      cierre: "8:00 PM"
    },
    {
      id: 5,
      name: "Nichas Burger Premium",
      location: "Avenida Libertad #202, Comercial",
      category: "Comida Rápida",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      isOpen: true,
      apertura: "11:00 AM",
      cierre: "9:00 PM"
    }
  ];
  
  // Estado para almacenar los locales
  const locales = ref([]);
  
  // Categorías disponibles (solo para modo demo)
  const categories = computed(() => {
    if (!isDemoMode.value) return [];
    return [...new Set(demoLocales.map((local) => local.category))];
  });
  
  // Locales filtrados
  const filteredLocales = computed(() => {
    return locales.value.filter((local) => {
      // Si no estamos en modo demo, no filtramos por categoría
      const matchesCategory = !isDemoMode.value || 
                              !selectedCategory.value || 
                              local.category === selectedCategory.value;
      
      const matchesSearch =
        !searchQuery.value ||
        local.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (local.location && local.location.toLowerCase().includes(searchQuery.value.toLowerCase()));
  
      return matchesCategory && matchesSearch;
    });
  });
  
  // Cargar locales según el modo
  const loadLocales = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (isDemoMode.value) {
        // Modo demo - usar datos locales
        await new Promise(resolve => setTimeout(resolve, 600)); // Simular retraso de red
        locales.value = [...demoLocales];
      } else {
        // Modo API - obtener datos reales
        const response = await fetch('http://localhost:4000/locales');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const apiLocales = await response.json();
        
        // Mapear la respuesta de la API al formato que necesita nuestra UI
        // SOLO usando campos que existen en el controller
        locales.value = apiLocales.map(local => {
          return {
            id: local.id,
            name: local.nombre_local || `Local #${local.id}`,
            image: local.imagen_url || "https://via.placeholder.com/500x300?text=Sin+Imagen",
            apertura: local.apertura,
            cierre: local.cierre,
            activo: local.activo,
            pedidos_restantes: local.pedidos_restantes,
            // Campos adicionales para uso interno
            id_cliente: local.id_cliente,
            rtn: local.rtn,
            usuario_empleado: local.usuario_empleado
          };
        });
      }
    } catch (err) {
      console.error('Error al cargar locales:', err);
      error.value = 'No se pudieron cargar los locales. Verifica tu conexión.';
      locales.value = [];
    } finally {
      isLoading.value = false;
    }
  };
  
  // Método para visitar un local
  const visitLocal = (id) => {
    console.log(`Visitando local con ID: ${id}`);
    // Aquí podrías implementar la navegación a la página de detalle del local
  };
  
  // Cargar datos cuando se monta el componente
  onMounted(() => {
    loadLocales();
  });
  </script>
  
  <style>
  /* Estilos generales para las tarjetas */
  .local-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .local-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  /* Asegurar que la página no haga scroll horizontal */
  html, body {
    max-width: 100%;
    overflow-x: hidden;
  }
  </style>
<template> 
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100"> 
    <!-- Header --> 
    <header class="bg-white shadow-md p-4"> 
    <div class="flex justify-between items-center"> 
    <div @click="toggleSidebar" class="cursor-pointer"> 
    <MenuIcon class="text-blue-600" :size="24" />
    </div> 
    <div class="flex items-center space-x-2"> 
    <TruckIcon class="text-blue-600" :size="24" />
    <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
    </div>
    <div class="relative">
    <BellIcon class="text-blue-600" :size="24" />
    <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</div>
    </div>
    </div>
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50"
      :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">Opciones</h2>
          <XIcon @click="toggleSidebar" class="text-gray-700 cursor-pointer" :size="24" />
        </div>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Idioma</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Ver mi local</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Ser driver</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Perfil</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Soporte</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Configuración</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600">Cerrar sesión</a></li>
        </ul>
      </div>
    </div> 
    </header>
        <!-- Contenedor del Mapa -->
      <div id="map" class="mt-4 h-64 rounded-lg shadow-inner"></div>
    </div>
    <!-- Selector de Pedidos -->
    <div class="bg-white p-4 top-0 z-40">
      <div class="flex justify-around">
        <button
          @click="selectedTab = 'recent'"
          :class="{
            'text-blue-600 border-b-2 border-blue-600': selectedTab === 'recent',
            'text-gray-500': selectedTab !== 'recent',
          }"
          class="text-sm font-medium focus:outline-none transition-all duration-300"
        >
          Pedidos Recientes
        </button>
        <button
          @click="selectedTab = 'active'"
          :class="{
            'text-blue-600 border-b-2 border-blue-600': selectedTab === 'active',
            'text-gray-500': selectedTab !== 'active',
          }"
          class="text-sm font-medium focus:outline-none transition-all duration-300"
        >
          Pedidos Activos
        </button>
      </div>
    </div>
    
    <!-- Contenido Principal -->
    <div class="container mx-auto p-4">
      <!-- Pedidos Activos -->
      <div v-if="selectedTab === 'active'" class="space-y-4">
        <div
          v-for="(pedido, index) in pedidosActivos"
          :key="pedido.id"
          class="bg-white rounded-lg shadow-md p-4 transform transition-transform duration-300 active:scale-95"
        >
          <div class="flex items-center">
            <div class="w-16 h-16 bg-gray-300 rounded-lg mr-3 flex items-center justify-center">
              <span class="text-2xl font-bold text-gray-600">{{ index + 1 }}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">{{ pedido.cliente }}</h3>
              <div class="flex items-center text-xs text-gray-500 mt-1">
                <span>{{ pedido.direccion }}</span>
              </div>
              <div class="text-xs text-gray-500 mt-1">Total: ${{ pedido.total }}</div>
              <div class="text-xs text-gray-500 mt-1">Estado: {{ pedido.estado }}</div>
            </div>
            <button
              @click="openModal(pedido)"
              class="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all duration-300"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
      <div class="bg-white rounded-lg shadow-md p-6 max-w-3xl w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Factura de Pedido</h3>
    
        <div class="grid grid-cols-1 gap-4"> 
          <!-- Resumen del Pedido -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen</h3>
          <div class="space-y-2">
            <div
              v-for="producto in productosCarrito"
              :key="producto.id"
              class="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg"
            >
              <!-- Foto del Producto -->
              <div class="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  :src="producto.foto"
                  :alt="producto.nombre"
                  class="w-full h-full object-cover"
                />
              </div>
              <!-- Nombre con Cantidad Flotante -->
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <h3 class="text-sm font-semibold text-gray-800">{{ producto.nombre }}</h3>
                  <!-- Cantidad en Círculo Flotante -->
                  <div class="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {{ producto.cantidad }}
                  </div>
                </div>
                <!-- Atributos y Extras -->
                <div class="text-xs text-gray-500 mt-1">
                  <span v-if="Object.values(producto.atributos).length > 0">
                    {{ Object.values(producto.atributos).join(", ") }}
                  </span>
                  <div>
                    <span v-if="producto.extras.length > 0">
                      {{ producto.extras.join(", ") }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- Precio Grande -->
              <div class="flex-shrink-0">
                <div class="text-lg font-semibold text-blue-600">
                  ${{ producto.precio_unitario * producto.cantidad }}
                </div>
              </div>
            </div>
          </div>
    
          <div class="mt-1">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold">${{ subtotal }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Descuento</span>
                <span class="font-semibold">${{ descuento }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total</span>
                <span class="font-semibold text-blue-600">${{ total }}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
       <!-- Sección de Delivery -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Delivery</h3>
      <div class="text-sm text-gray-600">  
        <div class="flex justify-between">
          <span class="text-gray-600">Delivery</span>
          <span class="font-semibold text-blue-600">${{ total }}</span>
        </div>
        <p>Tiempo Aproximado: <span class="font-semibold">30 minutos</span></p>
        <p>Ubicación del Local: <span class="font-semibold">{{ localAddress }}</span></p>
        <p>Ubicación de Entrega: <span class="font-semibold">{{ deliveryAddress }}</span></p>
      </div>
    
    
    
        <div class="mt-4">
          <button @click="closeModal" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">Cerrar</button>
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
    import { ref, onMounted, computed } from 'vue';
    import {
      Truck as TruckIcon,
      Bell as BellIcon,
      ShoppingCart as ShoppingCartIcon,
      User as UserIcon,
      Heart as HeartIcon,
      Home as HomeIcon,
      Menu as MenuIcon,
      ShoppingBag as ShoppingBagIcon,
      X as XIcon
    } from 'lucide-vue-next';
    
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
    
    // Simulación de pedidos
    const pedidosActivos = ref([]);
    const pedidosRecientes = ref([]);
    const selectedPedido = ref({});
    const isModalOpen = ref(false);
    const estadosPedido = ['Pendiente Local', 'Pendiente Depósito', 'Realizando Pedido', 'Pedido en Camino', 'Entregado'];
    const currentEstado = ref(0);
    
    const openModal = (pedido) => {
      selectedPedido.value = pedido;
      isModalOpen.value = true;
      currentEstado.value = estadosPedido.indexOf(pedido.estado); // Asignar el estado actual
    };
    
    const closeModal = () => {
      isModalOpen.value = false;
    };
    
    const fetchPedidos = async () => {
      // Simulación de API
      const data = [
        { 
          id: 1, 
          cliente: "Pedro Martínez", 
          direccion: "Col. Centro, Calle 5", 
          total: 250, 
          estado: "Pedido en Camino",
          metodoPago: "Efectivo",
          tipoPedido: "Delivery",
          notas: "Entregar en la puerta.",
          productos: [
            { id: 1, nombre: "Pizza Margarita", cantidad: 1, precio_unitario: 10, foto: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
            { id: 2, nombre: "Hamburguesa Clásica", cantidad: 2, precio_unitario: 8, foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
          ]
        },
        { 
          id: 2, 
          cliente: "Ana López", 
          direccion: "Av. Principal, Casa 34", 
          total: 180, 
          estado: "Pendiente Depósito",
          metodoPago: "Transferencia",
          tipoPedido: "Comer en el Restaurante",
          notas: "",
          productos: [
            { id: 3, nombre: "Ensalada César", cantidad: 1, precio_unitario: 7, foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
            { id: 4, nombre: "Soda", cantidad: 3, precio_unitario: 2, foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
          ]
        }
      ];
    
      // Separar pedidos activos y recientes
      pedidosActivos.value = data.filter(p => p.estado !== "Entregado");
      pedidosRecientes.value = data.filter(p => p.estado === "Entregado");
    };
    
    onMounted(fetchPedidos);
    
    // Selector de pestañas
    const selectedTab = ref('recent');
    
    // Pestañas
    const pestañaActiva = ref("productos");
    
    // Datos del Carrito
    const productosCarrito = ref([
      {
        id: 1,
        nombre: "Pizza Margarita",
        foto: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        precio_unitario: 10,
        cantidad: 2,
        subtotal: 20,
        atributos: { Tamaño: "Mediana", Sabor: "Jamón" },
        extras: ["Extra queso", "Sin cebolla"],
      },
      {
        id: 2,
        nombre: "Hamburguesa Clásica",
        foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        precio_unitario: 8,
        cantidad: 1,
        subtotal: 8,
        atributos: { Tamaño: "Grande", Sabor: "Queso" },
        extras: ["Papas fritas", "Salsa extra"],
      },
    ]);
    
    // Notas Generales
    const notasGenerales = ref("");
    
    // Tipo de Pedido
    const tipoPedido = ref("delivery");
    
    // Método de Pago
    const metodoPago = ref("transferencia");
    const montoEfectivo = ref(0);
    
    // Cupón de Descuento
    const codigoDescuento = ref("");
    const descuentoValido = ref(false);
    const mensajeDescuento = ref("");
    
    const validarDescuento = () => {
      if (codigoDescuento.value === "DESCUENTO10") {
        descuentoValido.value = true;
        mensajeDescuento.value = "Descuento aplicado: 10%";
      } else {
        descuentoValido.value = false;
        mensajeDescuento.value = "Código de descuento inválido";
      }
    };
    
    // Conductores
    const conductores = ref([
      { id: 1, name: "Juan Pérez" },
      { id: 2, name: "Ana Gómez" },
      { id: 3, name: "Carlos Ruiz" },
    ]);
    const conductorSeleccionado = ref(null);
    
    // Resumen del Pedido
    const subtotal = computed(() => {
      return productosCarrito.value.reduce((total, producto) => total + producto.subtotal, 0);
    });
    
    const descuento = computed(() => {
      return descuentoValido.value ? subtotal.value * 0.1 : 0;
    });
    
    const total = computed(() => {
      return subtotal.value - descuento.value;
    });
    
    // Cambiar Cantidad
    const aumentarCantidad = (id) => {
      const producto = productosCarrito.value.find((p) => p.id === id);
      if (producto) {
        producto.cantidad += 1;
        producto.subtotal = producto.cantidad * producto.precio_unitario;
      }
    };
    
    const disminuirCantidad = (id) => {
      const producto = productosCarrito.value.find((p) => p.id === id);
      if (producto && producto.cantidad > 1) {
        producto.cantidad -= 1;
        producto.subtotal = producto.cantidad * producto.precio_unitario;
      }
    };
    
    // Eliminar Producto del Carrito
    const eliminarProducto = (id) => {
      productosCarrito.value = productosCarrito.value.filter((producto) => producto.id !== id);
    };
    
    // Realizar Pedido
    const realizarPedido = () => {
      alert("Pedido realizado con éxito");
    };
    
    // Función para cargar Google Maps
    const loadGoogleMaps = async () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }
    
        const script = document.createElement('script');
        script.src = `AIzaSyAdrFzFZd4yJa_1CcN8HJv9cV270Qh0-Mo`;
        script.async = true;
        script.defer = true;
    
        window.initMap = () => {
          resolve();
        };
    
        script.onerror = () => {
          reject(new Error('Error al cargar Google Maps'));
        };
    
        document.head.appendChild(script);
      });
    };
    
    // Inicializar el mapa después de cargar Google Maps
    onMounted(async () => {
      try {
        await loadGoogleMaps();
    
        const map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.603722, lng: -58.381592 }, // Buenos Aires
          zoom: 15,
        });
    
        new google.maps.Marker({
          position: { lat: -34.603722, lng: -58.381592 },
          map: map,
          title: 'Ubicación de prueba',
        });
      } catch (error) {
        console.error('Error al cargar el mapa:', error);
      }
    });
    </script>
    
    <style scoped>
    #map {
      width: 85%;
      height: 56px; /* Ajusta el tamaño según tus necesidades */
    }
    </style>
    ----------------------------------------------------------------------------------
    <template>
      <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <!-- Header -->
        <header class="bg-white shadow-md p-4">
          <div class="flex justify-between items-center">
            <div @click="toggleSidebar" class="cursor-pointer">
              <MenuIcon class="text-blue-600" :size="24" />
            </div>
            <div class="flex items-center space-x-2">
              <TruckIcon class="text-blue-600" :size="24" />
              <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
            </div>
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
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold">Opciones</h2>
              <XIcon @click="toggleSidebar" class="text-gray-700 cursor-pointer" :size="24" />
            </div>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-700 hover:text-blue-600">Idioma</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">Ver mi local</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">Ser driver</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">Perfil</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">Soporte</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">Configuración</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">Cerrar sesión</a></li>
            </ul>
          </div>
        </div>
    
        <!-- Selector de Pedidos -->
        <div class="bg-white p-4 shadow-sm sticky top-0 z-40">
          <div class="flex justify-around">
            <button
              @click="selectedTab = 'recent'"
              :class="{
                'text-blue-600 border-b-2 border-blue-600': selectedTab === 'recent',
                'text-gray-500': selectedTab !== 'recent',
              }"
              class="text-sm font-medium focus:outline-none transition-all duration-300"
            >
              Pedidos Recientes
            </button>
            <button
              @click="selectedTab = 'active'"
              :class="{
                'text-blue-600 border-b-2 border-blue-600': selectedTab === 'active',
                'text-gray-500': selectedTab !== 'active',
              }"
              class="text-sm font-medium focus:outline-none transition-all duration-300"
            >
              Pedidos Activos
            </button>
          </div>
        </div>
    
        <!-- Contenido Principal -->
        <div class="container mx-auto p-4">
          <!-- Pedidos Activos -->
          <div v-if="selectedTab === 'active'" class="space-y-4">
            <div
              v-for="(pedido, index) in pedidosActivos"
              :key="pedido.id"
              class="bg-white rounded-lg shadow-md p-4 transform transition-transform duration-300 active:scale-95"
            >
              <div class="flex items-center">
                <div class="w-16 h-16 bg-gray-300 rounded-lg mr-3 flex items-center justify-center">
                  <span class="text-2xl font-bold text-gray-600">{{ index + 1 }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800">{{ pedido.cliente }}</h3>
                  <div class="flex items-center text-xs text-gray-500 mt-1">
                    <span>{{ pedido.direccion }}</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Total: ${{ pedido.total }}</div>
                  <div class="text-xs text-gray-500 mt-1">Estado: {{ pedido.estado }}</div>
                </div>
                <button
                  @click="openModal(pedido)"
                  class="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all duration-300"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60"> <!-- z-60 para asegurar que esté encima -->
          <div class="bg-white rounded-lg shadow-md p-6 max-w-md w-full"> <!-- Tamaño ajustado a más ancho -->
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Factura de Pedido</h3>
    
            <!-- Resumen de Productos -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen de Productos</h3>
              <div class="space-y-2">
                <div
                  v-for="producto in productosCarrito"
                  :key="producto.id"
                  class="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg"
                >
                  <!-- Foto del Producto -->
                  <div class="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      :src="producto.foto"
                      :alt="producto.nombre"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <!-- Nombre con Cantidad Flotante -->
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h3 class="text-sm font-semibold text-gray-800">{{ producto.nombre }}</h3>
                      <!-- Cantidad en Círculo Flotante -->
                      <div class="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        {{ producto.cantidad }}
                      </div>
                    </div>
                    <!-- Atributos y Extras -->
                    <div class="text-xs text-gray-500 mt-1">
                      <span v-if="Object.values(producto.atributos).length > 0">
                        {{ Object.values(producto.atributos).join(", ") }}
                      </span>
                      <div>
                        <span v-if="producto.extras.length > 0">
                          {{ producto.extras.join(", ") }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- Precio Grande con Animación -->
                  <div class="flex-shrink-0">
                    <div class="text-lg font-semibold text-blue-600">
                      ${{ producto.precio_unitario * producto.cantidad }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Resumen de Método de Pago y Tipo de Pedido -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen de Pago y Tipo de Pedido</h3>
              <div class="space-y-2">
                <p class="text-sm text-gray-600">
                  Método de Pago: <span class="font-semibold">{{ metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia' }}</span>
                </p>
                <p v-if="metodoPago === 'efectivo'" class="text-sm text-gray-600">
                  Monto en Efectivo: <span class="font-semibold">${{ montoEfectivo }}</span>
                </p>
                <p class="text-sm text-gray-600">
                  Tipo de Pedido: <span class="font-semibold">{{ tipoPedido === 'delivery' ? 'Delivery' : 'Comer en el Restaurante' }}</span>
                </p>
              </div>
            </div>
    
            <!-- Resumen del Pedido -->
            <div class="bg-white rounded-lg shadow-md p-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-semibold">${{ subtotal }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Descuento</span>
                  <span class="font-semibold">${{ descuento }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total</span>
                  <span class="font-semibold text-blue-600">${{ total }}</span>
                </div>
              </div>
            </div>
    
            <div class="mt-4">
              <button @click="closeModal" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">Cerrar</button>
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
      X as XIcon
    } from 'lucide-vue-next';
    
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
    
    // Simulación de pedidos
    const pedidosActivos = ref([]);
    const pedidosRecientes = ref([]);
    const selectedPedido = ref({});
    const isModalOpen = ref(false);
    const estadosPedido = ['Pendiente Local', 'Pendiente Depósito', 'Realizando Pedido', 'Pedido en Camino', 'Entregado'];
    const currentEstado = ref(0);
    
    const openModal = (pedido) => {
      selectedPedido.value = pedido;
      isModalOpen.value = true;
      currentEstado.value = estadosPedido.indexOf(pedido.estado); // Asignar el estado actual
    };
    
    const closeModal = () => {
      isModalOpen.value = false;
    };
    
    const fetchPedidos = async () => {
      // Simulación de API
      const data = [
        { 
          id: 1, 
          cliente: "Pedro Martínez", 
          direccion: "Col. Centro, Calle 5", 
          total: 250, 
          estado: "Pedido en Camino",
          metodoPago: "Efectivo",
          tipoPedido: "Delivery",
          notas: "Entregar en la puerta.",
          productos: [
            { id: 1, nombre: "Pizza Margarita", cantidad: 1, precio_unitario: 10, foto: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
            { id: 2, nombre: "Hamburguesa Clásica", cantidad: 2, precio_unitario: 8, foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
          ]
        },
        { 
          id: 2, 
          cliente: "Ana López", 
          direccion: "Av. Principal, Casa 34", 
          total: 180, 
          estado: "Pendiente Depósito",
          metodoPago: "Transferencia",
          tipoPedido: "Comer en el Restaurante",
          notas: "",
          productos: [
            { id: 3, nombre: "Ensalada César", cantidad: 1, precio_unitario: 7, foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
            { id: 4, nombre: "Soda", cantidad: 3, precio_unitario: 2, foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
          ]
        }
      ];
    
      // Separar pedidos activos y recientes
      pedidosActivos.value = data.filter(p => p.estado !== "Entregado");
      pedidosRecientes.value = data.filter(p => p.estado === "Entregado");
    };
    
    onMounted(fetchPedidos);
    
    // Selector de pestañas
    const selectedTab = ref('recent');
    
     
    
    // Pestañas
    const pestañaActiva = ref("productos");
    
    // Datos del Carrito
    const productosCarrito = ref([
      {
        id: 1,
        nombre: "Pizza Margarita",
        foto: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        precio_unitario: 10,
        cantidad: 2,
        subtotal: 20,
        atributos: { Tamaño: "Mediana", Sabor: "Jamón" },
        extras: ["Extra queso", "Sin cebolla"],
      },
      {
        id: 2,
        nombre: "Hamburguesa Clásica",
        foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        precio_unitario: 8,
        cantidad: 1,
        subtotal: 8,
        atributos: { Tamaño: "Grande", Sabor: "Queso" },
        extras: ["Papas fritas", "Salsa extra"],
      },
    ]);
    
    // Notas Generales
    const notasGenerales = ref("");
    
    // Tipo de Pedido
    const tipoPedido = ref("delivery");
    
    // Método de Pago
    const metodoPago = ref("transferencia");
    const montoEfectivo = ref(0);
    
    // Cupón de Descuento
    const codigoDescuento = ref("");
    const descuentoValido = ref(false);
    const mensajeDescuento = ref("");
    
    const validarDescuento = () => {
      if (codigoDescuento.value === "DESCUENTO10") {
        descuentoValido.value = true;
        mensajeDescuento.value = "Descuento aplicado: 10%";
      } else {
        descuentoValido.value = false;
        mensajeDescuento.value = "Código de descuento inválido";
      }
    };
    
    // Conductores
    const conductores = ref([
      { id: 1, name: "Juan Pérez" },
      { id: 2, name: "Ana Gómez" },
      { id: 3, name: "Carlos Ruiz" },
    ]);
    const conductorSeleccionado = ref(null);
    
    // Resumen del Pedido
    const subtotal = computed(() => {
      return productosCarrito.value.reduce((total, producto) => total + producto.subtotal, 0);
    });
    
    const descuento = computed(() => {
      return descuentoValido.value ? subtotal.value * 0.1 : 0;
    });
    
    const total = computed(() => {
      return subtotal.value - descuento.value;
    });
    
    // Cambiar Cantidad
    const aumentarCantidad = (id) => {
      const producto = productosCarrito.value.find((p) => p.id === id);
      if (producto) {
        producto.cantidad += 1;
        producto.subtotal = producto.cantidad * producto.precio_unitario;
      }
    };
    
    const disminuirCantidad = (id) => {
      const producto = productosCarrito.value.find((p) => p.id === id);
      if (producto && producto.cantidad > 1) {
        producto.cantidad -= 1;
        producto.subtotal = producto.cantidad * producto.precio_unitario;
      }
    };
    
    // Eliminar Producto del Carrito
    const eliminarProducto = (id) => {
      productosCarrito.value = productosCarrito.value.filter((producto) => producto.id !== id);
    };
    
    // Realizar Pedido
    const realizarPedido = () => {
      alert("Pedido realizado con éxito");
    };
    </script>
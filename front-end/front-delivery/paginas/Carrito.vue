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
        <!-- Selector de datos y notificaciones a la derecha -->
        <div class="flex items-center space-x-3">
          <div class="relative inline-block">
            <select 
              v-model="dataSource" 
              class="pl-2 pr-6 py-1 text-xs rounded-md border border-gray-300 bg-white text-gray-700 appearance-none"
              @change="fetchCartItems"
              :disabled="loading"
            >
              <option value="mock">Datos de ejemplo</option>
              <option value="api">API Local</option>
            </select>
            <div class="absolute inset-y-0 right-1 flex items-center pointer-events-none">
              <ChevronDownIcon :size="12" class="text-gray-500" />
            </div>
            <div v-if="loading" class="absolute right-8 top-1">
              <div class="w-3 h-3 border-2 border-t-blue-600 border-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <div class="relative">
            <BellIcon class="text-blue-600" :size="24" />
            <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</div>
          </div>
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

    <!-- Mensaje de error -->
    <div v-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg mx-4 my-2">
      <p class="font-medium">{{ error }}</p>
      <button 
        @click="fetchCartItems" 
        class="mt-2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    </div>

    <!-- Contenido Principal -->
    <div class="container mx-auto p-4">
      <!-- Pestañas -->
      <div class="flex space-x-4 mb-6">
        <button
          @click="pestañaActiva = 'productos'"
          :class="{'bg-blue-600 text-white': pestañaActiva === 'productos', 'bg-gray-100 text-gray-700': pestañaActiva !== 'productos'}"
          class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
        >
          Productos y Notas
        </button>
        <button
          @click="pestañaActiva = 'pago'"
          :class="{'bg-blue-600 text-white': pestañaActiva === 'pago', 'bg-gray-100 text-gray-700': pestañaActiva !== 'pago'}"
          class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
        >
          Pago y Tipo de Pedido
        </button>
        <button
          @click="pestañaActiva = 'resumen'"
          :class="{'bg-blue-600 text-white': pestañaActiva === 'resumen', 'bg-gray-100 text-gray-700': pestañaActiva !== 'resumen'}"
          class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
        >
          Cupón y Resumen
        </button>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading && !error" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>

      <!-- Carrito vacío -->
      <div v-else-if="productosCarrito.length === 0 && !loading && !error" class="bg-white p-8 rounded-lg shadow-md text-center">
        <ShoppingCartIcon class="w-20 h-20 mx-auto mb-4 text-gray-400" />
        <h3 class="text-xl font-medium text-gray-900">Tu carrito está vacío</h3>
        <p class="mt-2 text-gray-500">No tienes productos en tu carrito de compras.</p>
        <button class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Explorar productos
        </button>
      </div>

      <!-- Contenido normal del carrito -->
      <div v-else>
        <!-- Pestaña de Productos y Notas Adicionales -->
        <div v-if="pestañaActiva === 'productos'">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Carrito de Compras</h2>

          <!-- Lista de Productos en el Carrito -->
          <div class="bg-white rounded-lg shadow-md p-2 mb-4">
            <div class="space-y-2">
              <div
                v-for="producto in productosCarrito"
                :key="producto.id"
                class="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg"
              >
                <!-- Foto del Producto -->
                <div class="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    :src="producto.foto || 'https://via.placeholder.com/80?text=' + encodeURIComponent(producto.nombre)"
                    :alt="producto.nombre"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- Nombre, Precio Unitario y Subtotal -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-semibold text-gray-800">{{ producto.nombre }}</h3>
                    <!-- Cantidad en Círculo Flotante -->
                    <div class="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                      {{ producto.cantidad }}
                    </div> 
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Precio Unitario: ${{ producto.precio_unitario }} 
                  </div>
                  <div class="text-xs text-gray-500 mt-1"> 
                    Subtotal: ${{ producto.precio_unitario * producto.cantidad }}
                  </div>
                </div>
                <!-- Contador de Cantidad y Botón de Eliminar -->
                <div class="flex items-center space-x-1">
                  <!-- Botón de Disminuir o Eliminar -->
                  <button
                    @click="disminuirCantidad(producto.id)"
                    class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-200 transition-all duration-300"
                  >
                    <template v-if="producto.cantidad > 1">
                      -
                    </template>
                    <template v-else>
                      <TrashIcon :size="12" />
                    </template>
                  </button>
                  <!-- Cantidad -->
                  <span class="text-sm">{{ producto.cantidad }}</span>
                  <!-- Botón de Aumentar -->
                  <button
                    @click="aumentarCantidad(producto.id)"
                    class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-200 transition-all duration-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Campo de Notas Generales -->
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Notas Adicionales</label>
            <textarea
              v-model="notasGenerales"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="3"
              placeholder="Escribe aquí tus notas..."
            ></textarea>
          </div>
        </div>

        <!-- Pestaña de Pago y Tipo de Pedido -->
        <div v-if="pestañaActiva === 'pago'">
          <!-- Selección de Método de Pago -->
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Método de Pago</h3>
            <div class="flex space-x-4">
              <button
                @click="metodoPago = 'transferencia'"
                :class="{'bg-blue-600 text-white': metodoPago === 'transferencia', 'bg-gray-100 text-gray-700': metodoPago !== 'transferencia'}"
                class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Transferencia
              </button>
              <button
                @click="metodoPago = 'efectivo'"
                :class="{'bg-blue-600 text-white': metodoPago === 'efectivo', 'bg-gray-100 text-gray-700': metodoPago !== 'efectivo'}"
                class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Efectivo
              </button>
            </div>
            <!-- Input para el monto en efectivo -->
            <div v-if="metodoPago === 'efectivo'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Monto en Efectivo</label>
              <input
                v-model="montoEfectivo"
                type="number"
                class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ingresa el monto en efectivo"
              />
            </div>
          </div>

          <!-- Selección de Tipo de Pedido -->
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Tipo de Pedido</h3>
            <div class="flex space-x-4">
              <button
                @click="tipoPedido = 'delivery'"
                :class="{'bg-blue-600 text-white': tipoPedido === 'delivery', 'bg-gray-100 text-gray-700': tipoPedido !== 'delivery'}"
                class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Delivery
              </button>
              <!-- Botón "Comer en el restaurante" solo visible si el pago no es en efectivo -->
              <button
                v-if="metodoPago !== 'efectivo'"
                @click="tipoPedido = 'restaurante'"
                :class="{'bg-blue-600 text-white': tipoPedido === 'restaurante', 'bg-gray-100 text-gray-700': tipoPedido !== 'restaurante'}"
                class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Comer en el Restaurante
              </button>
            </div>
            <!-- Mensaje de advertencia si el pago es en efectivo -->
            <p v-if="metodoPago === 'efectivo'" class="text-sm text-red-600 mt-2">
              No puedes seleccionar "Comer en el restaurante" si el pago es en efectivo.
            </p>
          </div>
        </div>

        <div class="pb-16"> <!-- Padding inferior para evitar que el footer tape el contenido -->
          <!-- Pestaña de Cupón y Resumen del Pedido -->
          <div v-if="pestañaActiva === 'resumen'">
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
                      :src="producto.foto || 'https://via.placeholder.com/80?text=' + encodeURIComponent(producto.nombre)"
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
                        <span v-if="producto.extras && producto.extras.length > 0">
                          {{ producto.extras.join(", ") }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- Precio Grande con Animación -->
                  <div class="flex-shrink-0">
                    <div class="text-lg font-semibold text-blue-600 relative inline-block animate-underline">
                      ${{ producto.precio_unitario * producto.cantidad }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Resumen de Notas Adicionales -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Notas Adicionales</h3>
              <p class="text-sm text-gray-600">{{ notasGenerales || "No hay notas adicionales." }}</p>
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
            <!-- Selección de Conductor (solo si el tipo de pedido es delivery) -->
            <div v-if="tipoPedido === 'delivery'" class="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Seleccionar Conductor</h3>
              <select
                v-model="conductorSeleccionado"
                class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option v-for="conductor in conductores" :key="conductor.id" :value="conductor.id">
                  {{ conductor.name }}
                </option>
              </select>
            </div>
            <!-- Campo de Cupón de Descuento -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Código de Descuento</label>
              <div class="flex space-x-2">
                <input
                  v-model="codigoDescuento"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ingresa tu código de descuento"
                />
                <button
                  @click="validarDescuento"
                  :disabled="validandoCupon"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <template v-if="validandoCupon">
                    <div class="w-4 h-4 border-2 border-t-white border-white rounded-full animate-spin mx-auto"></div>
                  </template>
                  <template v-else>
                    Validar
                  </template>
                </button>
              </div>
              <p v-if="mensajeDescuento" class="text-sm mt-2" :class="{'text-green-600': cuponValido, 'text-red-600': !cuponValido}">
                {{ mensajeDescuento }}
              </p>
              <!-- Vista previa del cupón (si está disponible) -->
              <div v-if="cuponActual && cuponActual.imagen_url" class="mt-4 p-2 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <div class="flex-shrink-0 mr-3">
                    <img :src="cuponActual.imagen_url" alt="Cupón" class="w-20 h-20 object-cover rounded-lg" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold">{{ cuponActual.codigo_cupon }}</p>
                    <p class="text-xs text-gray-600">
                      {{ cuponActual.tipo_descuento === 'porcentaje' ? `${cuponActual.descuento}% de descuento` : `$${cuponActual.descuento} de descuento` }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Expira: {{ formatDate(cuponActual.fecha_vencimiento) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Resumen del Pedido -->
            <div class="bg-white rounded-lg shadow-md p-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-semibold">${{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">
                    Descuento
                    <span v-if="cuponActual" class="text-xs">({{ cuponActual.codigo_cupon }})</span>
                  </span>
                  <span class="font-semibold text-green-600">-${{ formatPrice(descuento) }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span class="text-gray-800 font-medium">Total</span>
                  <span class="font-bold text-blue-600">${{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>
            <!-- Botón de Ordenar -->
            <div class="pb-4 pt-4"> <!-- Padding inferior para separar el botón del footer -->
              <button
                @click="realizarPedido"
                class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Ordenar
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
  Trash as TrashIcon,
  ChevronDown as ChevronDownIcon,
} from 'lucide-vue-next';

// Fuente de datos
const dataSource = ref('mock');
const loading = ref(false);
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

// Pestañas
const pestañaActiva = ref("productos");

// Datos mockup del Carrito
const mockProductosCarrito = [
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
];

// Cupones de ejemplo para datos mock
const mockCupones = [
  {
    id_cupon: 1,
    id_local: 1,
    tipo_descuento: "porcentaje",
    codigo_cupon: "DESCUENTO10",
    descuento: 10,
    limite_uso: 100,
    usos_actuales: 45,
    fecha_vencimiento: "2024-12-31",
    imagen_url: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    activo: 1
  },
  {
    id_cupon: 2,
    id_local: 2,
    tipo_descuento: "fijo",
    codigo_cupon: "FIJO5",
    descuento: 5,
    limite_uso: 50,
    usos_actuales: 25,
    fecha_vencimiento: "2024-10-15",
    imagen_url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    activo: 1
  },
  {
    id_cupon: 3,
    id_local: 1,
    tipo_descuento: "porcentaje",
    codigo_cupon: "PROMO20",
    descuento: 20,
    limite_uso: 25,
    usos_actuales: 25, // Agotado
    fecha_vencimiento: "2024-08-30",
    imagen_url: null,
    activo: 1
  }
];

// Datos del carrito actual
const productosCarrito = ref([]);

// Notas Generales
const notasGenerales = ref("");

// Tipo de Pedido
const tipoPedido = ref("delivery");

// Método de Pago
const metodoPago = ref("transferencia");
const montoEfectivo = ref(0);

// Cupón de Descuento
const codigoDescuento = ref("");
const cuponValido = ref(false);
const mensajeDescuento = ref("");
const validandoCupon = ref(false);
const cuponActual = ref(null);

// Conductores
const conductores = ref([
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "Ana Gómez" },
  { id: 3, name: "Carlos Ruiz" },
]);
const conductorSeleccionado = ref(null);

// Función para obtener los productos del carrito
const fetchCartItems = async () => {
  loading.value = true;
  error.value = null;
  productosCarrito.value = [];

  try {
    if (dataSource.value === 'mock') {
      // Simular retardo de red para datos mock
      await new Promise(resolve => setTimeout(resolve, 800));
      productosCarrito.value = JSON.parse(JSON.stringify(mockProductosCarrito));
    } else {
      // Obtener datos reales de la API
      const response = await fetch('http://localhost:4000/carrito');
      
      if (!response.ok) {
        throw new Error(`Error al obtener carrito: ${response.status}`);
      }
      
      const detalles = await response.json();
      
      // Formatear los datos para que coincidan con nuestro formato
      productosCarrito.value = detalles.map(item => ({
        id: item.id_pedido_detalle,
        nombre: item.nombre_producto,
        precio_unitario: parseFloat(item.precio_unitario),
        cantidad: item.cantidad,
        subtotal: parseFloat(item.subtotal),
        atributos: item.atributos || {},
        extras: [],
        foto: null // Las API generalmente no incluyen fotos
      }));
    }
  } catch (err) {
    console.error('Error fetching cart items:', err);
    error.value = dataSource.value === 'mock' 
      ? 'Error al cargar los datos de ejemplo del carrito. Por favor intenta de nuevo.' 
      : 'Error al conectar con la API local. Asegúrate que http://localhost:4000 esté disponible.';
  } finally {
    loading.value = false;
  }
};

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  
  const date = new Date(dateString);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

// Formatear precio
const formatPrice = (value) => {
  if (!value && value !== 0) return '0.00';
  return parseFloat(value).toFixed(2);
};

// Validar cupón de descuento
const validarDescuento = async () => {
  if (!codigoDescuento.value.trim()) {
    mensajeDescuento.value = "Por favor, ingresa un código de descuento";
    cuponValido.value = false;
    cuponActual.value = null;
    return;
  }
  
  validandoCupon.value = true;
  mensajeDescuento.value = "";
  cuponValido.value = false;
  cuponActual.value = null;
  
  try {
    if (dataSource.value === 'mock') {
      // Simular validación con datos mock
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Buscar el cupón en los datos mock
      const cupon = mockCupones.find(c => c.codigo_cupon === codigoDescuento.value);
      
      if (!cupon) {
        mensajeDescuento.value = "Código de descuento no encontrado";
        return;
      }
      
      // Verificar si el cupón está activo
      if (cupon.activo !== 1) {
        mensajeDescuento.value = "Este cupón no está activo";
        return;
      }
      
      // Verificar si el cupón ha alcanzado su límite de uso
      if (cupon.limite_uso > 0 && cupon.usos_actuales >= cupon.limite_uso) {
        mensajeDescuento.value = "Este cupón ha alcanzado su límite de uso";
        return;
      }
      
      // Verificar si el cupón ha expirado
      const fechaVencimiento = new Date(cupon.fecha_vencimiento);
      if (fechaVencimiento < new Date()) {
        mensajeDescuento.value = "Este cupón ha expirado";
        return;
      }
      
      // Cupón válido
      cuponValido.value = true;
      cuponActual.value = cupon;
      
      const tipoDescuento = cupon.tipo_descuento === 'porcentaje' ? '%' : '$';
      mensajeDescuento.value = `Cupón aplicado: ${tipoDescuento === '%' ? cupon.descuento + '%' : '$' + cupon.descuento} de descuento`;
      
    } else {
      // Validar con la API real
      const response = await fetch(`http://localhost:4000/cupon/validar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo: codigoDescuento.value,
          subtotal: subtotal.value // Enviar el subtotal para calcular descuentos correctamente
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al validar cupón: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.valido) {
        cuponValido.value = true;
        cuponActual.value = data.cupon;
        
        const tipoDescuento = data.cupon.tipo_descuento === 'porcentaje' ? '%' : '$';
        mensajeDescuento.value = `Cupón aplicado: ${tipoDescuento === '%' ? data.cupon.descuento + '%' : '$' + data.cupon.descuento} de descuento`;
      } else {
        mensajeDescuento.value = data.mensaje || "Código de descuento inválido";
      }
    }
  } catch (err) {
    console.error('Error validating coupon:', err);
    mensajeDescuento.value = "Error al validar el cupón. Intenta de nuevo.";
  } finally {
    validandoCupon.value = false;
  }
};

// Resumen del Pedido
const subtotal = computed(() => {
  return productosCarrito.value.reduce((total, producto) => total + (producto.precio_unitario * producto.cantidad), 0);
});

const descuento = computed(() => {
  if (!cuponValido.value || !cuponActual.value) return 0;
  
  // Calcular descuento según el tipo
  if (cuponActual.value.tipo_descuento === 'porcentaje') {
    return (subtotal.value * cuponActual.value.descuento) / 100;
  } else {
    // Descuento fijo (no puede ser mayor que el subtotal)
    return Math.min(cuponActual.value.descuento, subtotal.value);
  }
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
    
    // Si estamos usando la API, actualizar en el servidor
    if (dataSource.value === 'api') {
      updateCartItemQuantity(id, producto.cantidad);
    }
  }
};

const disminuirCantidad = (id) => {
  const producto = productosCarrito.value.find((p) => p.id === id);
  if (producto) {
    if (producto.cantidad > 1) {
      producto.cantidad -= 1;
      producto.subtotal = producto.cantidad * producto.precio_unitario;
      
      // Si estamos usando la API, actualizar en el servidor
      if (dataSource.value === 'api') {
        updateCartItemQuantity(id, producto.cantidad);
      }
    } else {
      eliminarProducto(id);
    }
  }
};

// Actualizar cantidad en la API
const updateCartItemQuantity = async (id, newQuantity) => {
  try {
    // Esta es una simulación - en un caso real, se haría una llamada a la API
    console.log(`Actualizando cantidad del producto ${id} a ${newQuantity} en la API`);
    
    // Ejemplo de cómo sería la llamada a la API:
    // await fetch(`http://localhost:4000/carrito/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ cantidad: newQuantity })
    // });
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
};

// Eliminar Producto del Carrito
const eliminarProducto = (id) => {
  // Si estamos usando la API, eliminar en el servidor
  if (dataSource.value === 'api') {
    deleteCartItem(id);
  }
  
  productosCarrito.value = productosCarrito.value.filter((producto) => producto.id !== id);
};

// Eliminar producto en la API
const deleteCartItem = async (id) => {
  try {
    // Esta es una simulación - en un caso real, se haría una llamada a la API
    console.log(`Eliminando producto ${id} en la API`);
    
    // Ejemplo de cómo sería la llamada a la API:
    // await fetch(`http://localhost:4000/carrito/${id}`, {
    //   method: 'DELETE'
    // });
  } catch (error) {
    console.error('Error deleting cart item:', error);
  }
};

// Realizar Pedido
const realizarPedido = async () => {
  if (productosCarrito.value.length === 0) {
    alert("No hay productos en el carrito");
    return;
  }
  
  try {
    loading.value = true;
    
    if (dataSource.value === 'api') {
      // Preparar los datos del pedido
      const pedidoData = {
        metodoPago: metodoPago.value,
        tipoPedido: tipoPedido.value,
        montoEfectivo: metodoPago.value === 'efectivo' ? montoEfectivo.value : null,
        notasGenerales: notasGenerales.value,
        descuento: descuento.value,
        id_cupon: cuponValido.value && cuponActual.value ? cuponActual.value.id_cupon : null,
        conductorId: tipoPedido.value === 'delivery' ? conductorSeleccionado.value : null,
        total: total.value,
        productos: productosCarrito.value.map(p => ({
          id: p.id,
          cantidad: p.cantidad
        }))
      };
      
      // Esta es una simulación - en un caso real, se haría una llamada a la API
      console.log('Enviando pedido a la API:', pedidoData);
      
      // Ejemplo de cómo sería la llamada a la API:
      // const response = await fetch('http://localhost:4000/pedidos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(pedidoData)
      // });
      
      // if (!response.ok) {
      //   throw new Error(`Error al crear pedido: ${response.status}`);
      // }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular tiempo de respuesta
      
      // Limpiar carrito después de un pedido exitoso
      productosCarrito.value = [];
      notasGenerales.value = "";
      codigoDescuento.value = "";
      cuponValido.value = false;
      cuponActual.value = null;
      mensajeDescuento.value = "";
    }
    
    alert("Pedido realizado con éxito");
    pestañaActiva.value = "productos";
  } catch (error) {
    console.error('Error creating order:', error);
    alert(`Error al realizar el pedido: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  fetchCartItems();
});
</script>

<style>
@keyframes scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-scale {
  animation: scale 1s ease-in-out infinite;
}

.animate-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.animate-underline:hover::after {
  transform: scaleX(1);
}
</style>
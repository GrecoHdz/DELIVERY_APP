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
    <div class="container mx-auto p-4">
      <!-- Pestañas -->
      <div class="flex space-x-4 mb-6">
        <button
          @click="pestañaActiva = 'productos'"
          :class="{'bg-blue-600 text-white': pestañaActiva === 'productos', 'bg-gray-100 text-gray-700': pestañaActiva !== 'productos'}"
          class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
        >
          Productos y Resumen
        </button>
        <button
          @click="pestañaActiva = 'pago'"
          :class="{'bg-blue-600 text-white': pestañaActiva === 'pago', 'bg-gray-100 text-gray-700': pestañaActiva !== 'pago'}"
          class="flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-300"
        >
          Tipo de Pedido y Pago
        </button>
      </div>

      <!-- Pestaña de Productos y Resumen -->
      <div v-if="pestañaActiva === 'productos'"> 

        <!-- Lista de Productos en el Carrito -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <div class="space-y-4">
            <div
              v-for="producto in productosCarrito"
              :key="producto.id"
              class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <!-- Foto del Producto -->
              <div class="w-24 h-24 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  :src="producto.foto"
                  :alt="producto.nombre"
                  class="w-full h-full object-cover"
                />
              </div>
              <!-- Nombre, Atributos y Extras -->
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800">{{ producto.nombre }}</h3>
                <div class="text-xs text-gray-500 mt-1">
                  <span v-for="(value, key) in producto.atributos" :key="key" class="mr-2">
                    {{ key }}: {{ value }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  <span v-for="extra in producto.extras" :key="extra" class="mr-2">
                    {{ extra }}
                  </span>
                </div>
                <!-- Precio y Cantidad -->
                <div class="flex items-center justify-between mt-2">
                  <span class="text-sm font-semibold">${{ producto.precio_unitario * producto.cantidad }}</span>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="disminuirCantidad(producto.id)"
                      class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      -
                    </button>
                    <span class="text-sm">{{ producto.cantidad }}</span>
                    <button
                      @click="aumentarCantidad(producto.id)"
                      class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <!-- Botón de Borrar -->
              <button
                @click="eliminarProducto(producto.id)"
                class="text-red-500 hover:text-red-700"
              >
                <TrashIcon :size="16" />
              </button>
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
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
            >
              Validar
            </button>
          </div>
          <p v-if="mensajeDescuento" class="text-sm mt-2" :class="{'text-green-600': descuentoValido, 'text-red-600': !descuentoValido}">
            {{ mensajeDescuento }}
          </p>
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
      </div>

  <!-- Pestaña de Tipo de Pedido y Pago -->
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

        <!-- Selección de Conductor -->
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
      </div>

      <!-- Botón de Ordenar -->
      <button
        @click="realizarPedido"
        class="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-300"
      >
        Ordenar
      </button>
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
import { ref, computed } from 'vue';
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

// Mét

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
  const selectedTab = ref('cart');
const tabClass = (tab) => `text-sm font-medium p-2 ${selectedTab.value === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`;

const cartItems = ref([
  { id: 1, name: "Pizza Mediana", price: 10, quantity: 2, subtotal: 20, image: "https://via.placeholder.com/80" },
  { id: 2, name: "Hamburguesa Doble", price: 8, quantity: 1, subtotal: 8, image: "https://via.placeholder.com/80" },
]);

const removeFromCart = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
};
 

const customer = ref({ name: '', address: '' });
</script> 

---------------------------------------------------------------
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
          :src="producto.foto"
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
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
        >
          Validar
        </button>
      </div>
      <p v-if="mensajeDescuento" class="text-sm mt-2" :class="{'text-green-600': descuentoValido, 'text-red-600': !descuentoValido}">
        {{ mensajeDescuento }}
      </p>
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
  </div>        </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

 <style>@keyframes scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-scale {
  animation: scale 1s ease-in-out infinite;
}</style>
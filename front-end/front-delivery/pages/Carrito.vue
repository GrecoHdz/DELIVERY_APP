<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    <!-- Header -->
    <HeaderComponent />

    <!-- Modal de Notificaciones (actualizado con soporte de sockets) -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
        <h3 class="font-bold text-lg mb-2 text-blue-600">Notificaciones</h3>
        <div v-if="notifications.length > 0" class="max-h-64 overflow-y-auto">
          <div
            v-for="(notification, index) in notifications"
            :key="index"
            class="p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-2 border-b border-gray-100"
            @click="markAsRead(notification.id)"
            :class="{ 'bg-gray-100': notification.read, 'animate-pulse': !notification.read }"
          >
            <p class="text-sm text-gray-700">{{ notification.message }}</p>
            <div class="flex justify-between items-center mt-1">
              <span v-if="!notification.read" class="text-xs text-blue-500">Nueva</span>
              <span class="text-xs text-gray-400">{{ formatNotificationTime(notification.time) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 py-4 text-center">
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
    <div class="container mx-auto p-4 pb-20">
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
          
          <!-- Selección de Conductor (rediseñado como botón que abre un modal) -->
          <div v-if="tipoPedido === 'delivery'" class="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Seleccionar Conductor</h3>
            <p class="text-sm text-gray-600 mb-3">
              Haz clic en el botón para ver las ofertas disponibles de conductores en tiempo real.
            </p>
            <button 
              @click="abrirSelectorConductor" 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <CarIcon class="mr-2" :size="18" />
              Ver ofertas de conductores
            </button>
            
            <div v-if="conductorSeleccionado" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-sm font-medium text-gray-700">Conductor seleccionado:</p>
              <div class="flex items-center mt-2">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  <UserIcon :size="18" />
                </div>
                <div>
                  <p class="font-semibold text-blue-700">
                    {{ conductores.find(c => c.id === conductorSeleccionado)?.name || 'Conductor' }}
                  </p>
                  <p class="text-xs text-gray-500">ID: #{{ conductorSeleccionado }}</p>
                </div>
                <button 
                  @click="conductorSeleccionado = null" 
                  class="ml-auto text-red-500 hover:text-red-700"
                >
                  <XIcon :size="16" />
                </button>
              </div>
            </div>
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
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
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
          
          <!-- Botón de Ordenar  @click="realizarPedido" -->
          <div class="pb-4 pt-4">
            <button 
              @click="realizarPedido" 
              class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              :disabled="loading"
            >
              <template v-if="loading">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              </template>
              <template v-else>
                Ordenar
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Selector de Conductor (Rediseñado) -->
    <div v-if="mostrarSelectorConductor" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-fade-in-up">
        <!-- Cabecera del modal -->
        <div class="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 class="text-lg font-bold">Ofertas de conductores</h2>
          <button @click="cerrarSelectorConductor" class="text-white focus:outline-none">
            <XIcon :size="20" />
          </button>
        </div>
        
  <!-- Estado de carga de ofertas -->
  <div v-if="cargandoOfertas" class="p-8 flex flex-col items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
    <p class="text-gray-600 text-center">Esperando ofertas de conductores cercanos...</p>
    <p class="text-sm text-gray-500 mt-2">Las ofertas aparecerán automáticamente</p>
  </div>
        
        <!-- Sin ofertas disponibles -->
        <div v-else-if="ofertasConductores.length === 0" class="p-8 text-center">
          <CarIcon class="mx-auto text-gray-400 mb-3" :size="48" />
          <p class="text-gray-600 font-medium">No hay conductores disponibles</p>
          <p class="text-sm text-gray-500 mt-2">Espera un momento, las ofertas aparecerán pronto</p>
        </div>
        
        <!-- Lista de ofertas -->
        <div v-else class="overflow-y-auto max-h-[60vh]">
          <div class="p-4">
            <p class="text-sm text-gray-500 mb-3">
              Selecciona una oferta. Nuevas ofertas aparecerán automáticamente.
                <span class="inline-flex items-center text-blue-500 cursor-pointer"
        @click="mostrarModal = true"
      >
    <InfoIcon class="w-4 h-4 ml-1" /></span> 
            </p>

 <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-5 rounded-lg shadow-lg w-80">
        <h2 class="text-lg font-semibold mb-2">Información</h2>
        <p class="text-gray-700">Precio de carrera es lo que te cobraría un taxi ida y vuelta.</p>
        <div class="mt-4 text-right">
          <button 
            @click="mostrarModal = false" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
            
            <!-- Lista de ofertas de conductores -->
            <div class="space-y-3">
              <div 
                v-for="oferta in ofertasConductores" 
                :key="oferta.id"
                class="border border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-all cursor-pointer relative"
                :class="{'border-2 border-blue-600 bg-blue-50': conductorSeleccionado === oferta.id}"
                @click="seleccionarConductor(oferta.id)"
              >
                <!-- Indicador de nueva oferta -->
                <div 
                  v-if="oferta.recienLlegado" 
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs py-1 px-2 rounded-full animate-pulse"
                >
                  ¡Nuevo!
                </div>
                
                <!-- Contenido de la oferta -->
                <div class="flex items-center">
                  <!-- Avatar del conductor -->
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                    <UserIcon :size="20" />
                  </div>
                  
                  <!-- Información del conductor y precio -->
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">{{ oferta.name }}</h3>
                  </div>
                  
                  <!-- Precio destacado -->
                  <div class="text-lg font-bold text-blue-600">
                    ${{ oferta.precio }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Botones de acción -->
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <div class="flex space-x-3">
              <button 
                @click="cerrarSelectorConductor" 
                class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button 
                @click="confirmarSeleccionConductor" 
                class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!conductorSeleccionado"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div> 
         

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
  Settings as SettingsIcon,
  Car as CarIcon,
  X as XIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Store as StoreIcon,
  MapPin as MapPinIcon,
  Info as InfoIcon
} from 'lucide-vue-next';
import { io } from 'socket.io-client';
import axios from 'axios';

const mostrarInfo = () => {
  alert("Precio de carrera es lo que te cobraría un taxi ida y vuelta");
};
const router = useRouter(); 
const mostrarModal = ref(false);
const socket = ref(null);

// Inicializar la conexión WebSocket
const inicializarSocket = () => {
  // En un entorno real, se utilizaría la URL del servidor
  socket.value = io('https://api.deliverypro.com', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Eventos del socket
  socket.value.on('connect', () => {
    console.log('Conectado al servidor de websockets');
    
    // Registrar el usuario para recibir notificaciones
    socket.value.emit('register-user', { 
      userId: 'user123', // Esto vendría de la autenticación real
      role: 'cliente'
    });
  });

  // Manejar notificaciones entrantes
  socket.value.on('notification', (data) => {
    // Añadir la notificación a la lista
    notifications.value.unshift({
      id: Date.now(),
      message: data.message,
      read: false,
      time: new Date()
    });
    
    // Reproducir sonido de notificación
    const audio = new Audio('https://cdn.jsdelivr.net/npm/notification-sounds@1.0.0/notification-1.mp3');
    audio.play().catch(error => console.log('Error reproduciendo sonido:', error));
  });

  // Manejar ofertas de conductores
  socket.value.on('nueva-oferta-conductor', (oferta) => {
    if (!ofertasConductores.value.some(o => o.id === oferta.id)) {
      // Marcar como recién llegado para animar
      oferta.recienLlegado = true;
      ofertasConductores.value.push(oferta);
      
      // Después de 3 segundos, quitar la marca de recién llegado
      setTimeout(() => {
        const index = ofertasConductores.value.findIndex(o => o.id === oferta.id);
        if (index !== -1) {
          ofertasConductores.value[index].recienLlegado = false;
        }
      }, 3000);
    }
  });

  // Manejar desconexiones
  socket.value.on('disconnect', () => {
    console.log('Desconectado del servidor de websockets');
  });

  // Manejar errores
  socket.value.on('error', (error) => {
    console.error('Error de socket:', error);
  });
};

// Cerrar la conexión WebSocket al desmontar el componente
onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

// ===== NOTIFICACIONES =====
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

// Formatear la hora de la notificación
const formatNotificationTime = (time) => {
  if (!time) return '';
  
  const now = new Date();
  const notifTime = new Date(time);
  const diffMs = now - notifTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  
  return notifTime.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short'
  });
};

// Datos de notificaciones
const notifications = ref([
  { id: 1, message: "Tu pedido ha sido enviado.", read: false, time: new Date(Date.now() - 5 * 60000) },
  { id: 2, message: "Nuevo descuento disponible.", read: false, time: new Date(Date.now() - 60 * 60000) },
  { id: 3, message: "Actualización de la app disponible.", read: true, time: new Date(Date.now() - 24 * 60 * 60000) },
]);

const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read);
});

// ===== SELECTOR DE CONDUCTOR =====
// Estado del modal de selección de conductor
const mostrarSelectorConductor = ref(false);
const cargandoOfertas = ref(false);
const ofertasConductores = ref([]);

// Abrir el selector de conductor
const abrirSelectorConductor = () => {
  mostrarSelectorConductor.value = true;
  cargandoOfertas.value = true;
  ofertasConductores.value = [];
  
  // Emitir evento al socket para solicitar conductores disponibles
  if (socket.value && socket.value.connected) {
    socket.value.emit('buscar-conductores', {
      lat: 19.4326, // Simulamos ubicación
      lng: -99.1332,
      tipo_pedido: 'comida'
    });
  }
    
  // Simulamos la llegada automática de ofertas después de 2 segundos de espera
  setTimeout(() => {
    const ofertasIniciales = [
      {
        id: 1,
        name: "Precio de Carrera",
        precio: 0.00,
        recienLlegado: false
      }, 
    ];
    
    ofertasConductores.value = ofertasIniciales;
    cargandoOfertas.value = false;
    
    // Simulamos que llegan más ofertas cada pocos segundos
    setTimeout(() => {
      const nuevaOferta1 = {
        id: 3,
        name: "Carlos Ruiz",
        precio: 50.00,
        recienLlegado: true
      };
      
      ofertasConductores.value.push(nuevaOferta1);
      
      setTimeout(() => {
        ofertasConductores.value.find(o => o.id === 3).recienLlegado = false;
      }, 3000);
    }, 3000);
    
    setTimeout(() => {
      const nuevaOferta2 = {
        id: 4,
        name: "Sofía Méndez",
        precio: 42.00,
        recienLlegado: true
      };
      
      ofertasConductores.value.push(nuevaOferta2);
      
      setTimeout(() => {
        ofertasConductores.value.find(o => o.id === 4).recienLlegado = false;
      }, 3000);
    }, 7000);
    
    setTimeout(() => {
      const nuevaOferta3 = {
        id: 5,
        name: "Mario Castro",
        precio: 38.00,
        recienLlegado: true
      };
      
      ofertasConductores.value.push(nuevaOferta3);
      
      setTimeout(() => {
        ofertasConductores.value.find(o => o.id === 5).recienLlegado = false;
      }, 3000);
    }, 12000);
  }, 2000);
};

// Cerrar el selector de conductor
const cerrarSelectorConductor = () => {
  mostrarSelectorConductor.value = false;
};

// Seleccionar un conductor
const seleccionarConductor = (id) => {
  conductorSeleccionado.value = id;
};

// Confirmar selección de conductor
const confirmarSeleccionConductor = () => {
  if (conductorSeleccionado.value) {
    // En un entorno real, enviaríamos la selección al servidor
    if (socket.value && socket.value.connected) {
      socket.value.emit('seleccionar-conductor', {
        conductorId: conductorSeleccionado.value,
        pedidoId: 'pedido123' // Esto sería un ID real de pedido
      });
    }
    
    mostrarSelectorConductor.value = false;
    
    // Agregamos una notificación de confirmación
    notifications.value.unshift({
      id: Date.now(),
      message: `Has seleccionado un conductor para tu pedido. Tarifa: $${ofertasConductores.value.find(o => o.id === conductorSeleccionado.value)?.precio || '0.00'}`,
      read: false,
      time: new Date()
    });
  }
};

// ===== MODAL DE ENVÍO DE TARIFA (PARA CONDUCTOR) =====
const fareModalOpen = ref(false);
const fareAmount = ref(75); // Valor por defecto
const selectedOrder = ref(null);

// Abrir modal de tarifa
const openFareModal = (order) => {
  selectedOrder.value = order;
  fareAmount.value = 75; // Reset a valor predeterminado
  fareModalOpen.value = true;
};

// Cerrar modal de tarifa
const closeFareModal = () => {
  fareModalOpen.value = false;
  selectedOrder.value = null;
};

// Enviar tarifa
const submitFare = () => {
  if (fareAmount.value <= 0) return;
  
  // En un entorno real, enviaríamos la oferta al servidor
  if (socket.value && socket.value.connected) {
    socket.value.emit('enviar-oferta', {
      orderId: selectedOrder.value?.id,
      amount: fareAmount.value,
      driverId: 'driver123' // Esto vendría de la autenticación real
    });
  }
  
  // Simulamos respuesta exitosa
  notifications.value.unshift({
    id: Date.now(),
    message: `Has enviado una oferta de $${fareAmount.value} para el pedido #${selectedOrder.value?.id || '123'}`,
    read: false,
    time: new Date()
  });
  
  fareModalOpen.value = false;
  selectedOrder.value = null;
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
  { id: 4, name: "Sofía Méndez" },
  { id: 5, name: "Mario Castro" },
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
        cantidad: p.cantidad,
        nombre: p.nombre,
        precio_unitario: p.precio_unitario,
        atributos: p.atributos,
        extras: p.extras
      }))
    };

    // Emitir el evento de realizar pedido
    if (socket.value && socket.value.connected) {
      socket.value.emit('realizar_pedido', pedidoData);
    } else {
      throw new Error('No hay conexión con el servidor');
    }

    // Escuchar la respuesta del servidor
    socket.value.once('pedido_confirmado', async (response) => {
      try {
        // Si es un pedido de delivery, crear la oferta del driver
        if (tipoPedido.value === 'delivery' && conductorSeleccionado.value) {
          // Obtener el precio de la oferta del driver usando el ID del pedido
          const ofertaResponse = await axios.get(`http://localhost:4000/ofertadriver/pedido/${response.orderId}`);
          const precioOferta = ofertaResponse.data.precio_oferta;

          const ofertaData = {
            id_viaje: response.orderId,
            id_pedido: response.orderId,
            id_vehiculo: conductorSeleccionado.value.vehiculo_id,
            precio_oferta: precioOferta
          };

          // Crear la oferta del driver
          await axios.post(`http://localhost:4000/ofertadriver/${conductorSeleccionado.value.id}`, ofertaData);
          
          // Agregar notificación de oferta creada
          notifications.value.unshift({
            id: Date.now(),
            message: `Oferta de delivery creada para tu pedido #${response.orderId} con precio de $${precioOferta}`,
            read: false,
            time: new Date()
          });
        }

        // Limpiar carrito después de un pedido exitoso
        productosCarrito.value = [];
        notasGenerales.value = "";
        codigoDescuento.value = "";
        cuponValido.value = false;
        cuponActual.value = null;
        mensajeDescuento.value = "";
        
        // Agregar notificación de pedido
        notifications.value.unshift({
          id: Date.now(),
          message: `Tu pedido #${response.orderId} ha sido enviado exitosamente`,
          read: false,
          time: new Date()
        });

        // Redirigir a la página de seguimiento
        router.push('/PedidoEncargado');
      } catch (error) {
        console.error('Error al crear la oferta del driver:', error);
        // No interrumpimos el flujo si falla la creación de la oferta
        // pero mostramos una notificación
        notifications.value.unshift({
          id: Date.now(),
          message: `Tu pedido fue creado pero hubo un problema al asignar el conductor. Por favor contacta a soporte.`,
          read: false,
          time: new Date()
        });
      }
    });

    socket.value.once('pedido_error', (error) => {
      throw new Error(error.message);
    });

  } catch (error) {
    console.error('Error al realizar el pedido:', error);
    alert(`Error al realizar el pedido: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  fetchCartItems();
  inicializarSocket();
  
  // Simulamos un pedido para el modal de envío de tarifa (perspectiva del conductor)
  selectedOrder.value = {
    id: '123',
    storeLocation: 'Restaurante El Buen Sabor, Av. Principal #123',
    destination: 'Calle Las Flores #456, Colonia Centro'
  };
  
  // Ejemplo para el uso del modal de envío de tarifa
  // openFareModal(selectedOrder.value);
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

/* Animaciones para el modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Animación para entradas emergentes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

/* Animación de pulso para nuevas notificaciones/ofertas */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
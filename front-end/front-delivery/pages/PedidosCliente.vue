<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pb-20">
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

    
    <!-- Contenido Principal -->
    <div class="customer-orders-page p-4">
      <h1 class="text-2xl font-bold text-blue-600 mb-6">Mis Pedidos</h1>

      <!-- Selector de fuente de datos -->
      <div class="mb-6 flex items-center justify-end">
        <div class="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
          <span class="text-sm font-medium text-gray-700">Fuente de datos:</span>
          <select 
            v-model="dataSource" 
            class="border border-gray-300 rounded p-1 text-sm"
            @change="fetchOrders"
          >
            <option value="mock">Datos de ejemplo</option>
            <option value="api">API Local</option>
          </select>
          <button 
            v-if="loading" 
            class="text-gray-500 cursor-not-allowed p-1"
            disabled
          >
            <div class="w-5 h-5 border-2 border-t-blue-600 border-blue-600 rounded-full animate-spin"></div>
          </button>
          <button 
            v-else 
            @click="fetchOrders" 
            class="text-blue-600 hover:text-blue-800 p-1"
            title="Actualizar datos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          </button>
        </div>
      </div>

      <!-- Pestañas -->
      <div class="tabs flex space-x-4 mb-6">
        <button
          @click="activeTab = 'active'"
          :class="[
            'tab-button',
            activeTab === 'active' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600',
          ]"
        >
          Pedidos Activos
        </button>
        <button
          @click="activeTab = 'past'"
          :class="[
            'tab-button',
            activeTab === 'past' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600',
          ]"
        >
          Historial de Pedidos
        </button>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
        <p class="font-medium">{{ error }}</p>
        <button 
          @click="fetchOrders" 
          class="mt-2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Pedidos Activos -->
      <div v-if="activeTab === 'active'">
        <div v-if="loading" class="flex justify-center my-8">
          <div class="w-12 h-12 border-4 border-t-blue-600 border-blue-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="activeOrders.length === 0" class="bg-white p-8 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto text-gray-400 mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No tienes pedidos activos</h3>
          <p class="text-gray-500 mb-4">¡Explora nuestros restaurantes y realiza tu primer pedido!</p>
          <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Ver Restaurantes
          </button>
        </div>

        <div v-else class="space-y-6">
          <div 
            v-for="order in activeOrders" 
            :key="order.id_pedido" 
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <!-- Barra de estado -->
            <div class="w-full bg-gray-200 h-2">
              <div 
                class="bg-blue-600 h-2" 
                :style="{width: getProgressPercentage(order.estado) + '%'}"
              ></div>
            </div>

            <!-- Estados del pedido -->
            <div class="flex justify-between px-4 py-2 text-xs text-gray-600 border-b">
              <div class="flex flex-col items-center">
                <div :class="['rounded-full w-4 h-4 mb-1', getStateClass('pendiente_local')]"></div>
                <span>Pendiente</span>
              </div>
              <div class="flex flex-col items-center" v-if="order.metodo_pago === 'transferencia'">
                <div :class="['rounded-full w-4 h-4 mb-1', getStateClass('pendiente_deposito', order.estado)]"></div>
                <span>Pago</span>
              </div>
              <div class="flex flex-col items-center">
                <div :class="['rounded-full w-4 h-4 mb-1', getStateClass('preparando_pedido', order.estado)]"></div>
                <span>Preparación</span>
              </div>
              <div class="flex flex-col items-center">
                <div :class="['rounded-full w-4 h-4 mb-1', getStateClass('en_camino', order.estado)]"></div>
                <span>En camino</span>
              </div>
              <div class="flex flex-col items-center">
                <div :class="['rounded-full w-4 h-4 mb-1', getStateClass('entregado', order.estado)]"></div>
                <span>Entregado</span>
              </div>
            </div>

            <!-- Header del pedido -->
            <div class="flex justify-between items-center p-4 border-b">
              <h3 class="text-lg font-bold text-blue-600">Pedido #{{ order.id_pedido }}</h3>
              <div class="flex items-center">
                <div 
                  :class="[
                    'status-badge px-3 py-1 rounded-full text-xs font-medium',
                    getStatusBadgeClass(order.estado)
                  ]"
                >
                  {{ getStatusText(order.estado) }}
                </div>
                <span class="text-sm text-gray-500 ml-2">{{ formatDateTime(order.fecha_pedido) }}</span>
              </div>
            </div>

            <!-- Info del local -->
            <div class="p-4 border-b">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                  <div class="ml-3">
                    <h4 class="font-medium">{{ order.local?.nombre || 'Restaurante' }}</h4>
                    <div class="flex items-center text-sm text-gray-600 mt-1">
                      <div class="flex items-center cursor-pointer" @click="showLocationModal(order, 'local')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-red-500 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span class="truncate max-w-[200px]">{{ order.direccion_local?.direccion || 'Dirección del local' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div v-if="order.estado === 'preparando_pedido' && order.tiempo_preparacion_estimado" class="text-sm bg-yellow-100 text-yellow-800 p-2 rounded">
                    <span class="font-medium">Tiempo est. preparación:</span> {{ order.tiempo_preparacion_estimado }} min
                  </div>
                  <div v-if="order.estado === 'en_camino' && order.tiempo_llegada_estimado" class="text-sm bg-blue-100 text-blue-800 p-2 rounded">
                    <span class="font-medium">Tiempo est. llegada:</span> {{ order.tiempo_llegada_estimado }} min
                  </div>
                </div>
              </div>
            </div>

            <!-- Dirección de entrega -->
            <div class="p-4 border-b" v-if="order.tipo_pedido === 'domicilio'">
              <h4 class="font-medium mb-2">Dirección de entrega</h4>
              <div class="flex items-center text-sm text-gray-600">
                <div class="flex items-center cursor-pointer" @click="showLocationModal(order, 'cliente')">
                  <svg xmlns="http://www.w3.org/2000/svg" class="text-green-500 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{{ order.direccion_cliente?.direccion || 'Tu dirección' }}</span>
                </div>
              </div>
            </div>

            <!-- Estado del pedido - Información específica por estado -->
            <!-- Estado: pendiente_deposito - Mostrar información bancaria -->
            <div v-if="order.estado === 'pendiente_deposito'" class="p-4 border-b bg-yellow-50">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-yellow-800">Pendiente de pago</h4>
                  <p class="text-sm text-yellow-700 mt-1">Por favor realiza el pago para que el local procese tu pedido.</p>
                </div>
                <button 
                  @click="showPaymentModal(order)" 
                  class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Realizar Pago
                </button>
              </div>
            </div>

            <!-- Estado: en_camino - Mostrar mapa -->
            <div v-if="order.estado === 'en_camino' && order.tipo_pedido === 'domicilio'" class="p-4 border-b">
              <button 
                @click="showMapModal(order)" 
                class="w-full bg-blue-100 text-blue-800 p-3 rounded-lg flex items-center justify-center hover:bg-blue-200 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                Ver Ubicación en Mapa
              </button>
            </div>

            <!-- Resumen de productos -->
            <div class="p-4 border-b">
              <h4 class="font-medium mb-2">Resumen del pedido</h4>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div 
                  v-for="(item, index) in order.items" 
                  :key="index"
                  class="flex justify-between text-sm"
                >
                  <div>
                    <span class="font-medium">{{ item.cantidad }}x</span> {{ item.nombre_producto }}
                    <div v-if="item.atributos && Object.keys(item.atributos).length > 0" class="text-xs text-gray-500 ml-6">
                      <div v-for="(value, key) in item.atributos" :key="key">
                        {{ key }}: {{ value }}
                      </div>
                    </div>
                    <div v-if="item.extras && item.extras.length > 0" class="text-xs text-gray-500 ml-6">
                      <div>Extras: {{ item.extras.join(', ') }}</div>
                    </div>
                  </div>
                  <div class="font-medium">${{ formatPrice(item.subtotal) }}</div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t flex justify-between font-bold">
                <div>Total</div>
                <div>${{ formatPrice(calculateOrderTotal(order)) }}</div>
              </div>
            </div>

            <!-- Método de pago y tipo de entrega -->
            <div class="p-4 flex flex-wrap gap-3">
              <div class="flex-1 min-w-[140px] bg-gray-100 p-2 rounded text-sm">
                <span class="block text-gray-500 text-xs">Método de pago</span>
                <span class="font-medium">{{ getPrettyPaymentMethod(order.metodo_pago) }}</span>
              </div>
              <div class="flex-1 min-w-[140px] bg-gray-100 p-2 rounded text-sm">
                <span class="block text-gray-500 text-xs">Tipo de entrega</span>
                <span class="font-medium">{{ getPrettyDeliveryType(order.tipo_pedido) }}</span>
              </div>
            </div>

            <!-- Acciones disponibles según el estado -->
            <div class="p-4 bg-gray-50 flex justify-end space-x-3">
              <!-- Botón para cancelar pedido (sólo disponible en estados iniciales) -->
              <button 
                v-if="['pendiente_local', 'pendiente_deposito'].includes(order.estado) && !order.has_deposit"
                @click="confirmCancelOrder(order)"
                class="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              >
                Cancelar Pedido
              </button>

              <!-- Botón para reportar problema (solo disponible en estado entregado) -->
              <button 
                v-if="order.estado === 'entregado'"
                @click="showComplaintModal(order)"
                class="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition"
              >
                Reportar Problema
              </button>

              <!-- Botón para contactar al comercio -->
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pedidos Pasados (Historial) -->
      <div v-if="activeTab === 'past'">
        <!-- Filtros para historial -->
        <div class="filters mb-6 flex flex-wrap gap-2 sm:gap-4 items-end">
          <!-- Filtro por fecha -->
          <div class="flex-1 min-w-[120px]">
            <label class="block text-gray-700 mb-2 text-sm">Filtrar por fecha:</label>
            <input
              type="date"
              v-model="filterDate"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <!-- Filtro por restaurante -->
          <div class="flex-1 min-w-[120px]">
            <label class="block text-gray-700 mb-2 text-sm">Buscar por restaurante:</label>
            <input
              type="text"
              v-model="filterRestaurantName"
              placeholder="Nombre del restaurante"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <!-- Reset filtros -->
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center my-8">
          <div class="w-12 h-12 border-4 border-t-blue-600 border-blue-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="filteredPastOrders.length === 0" class="bg-white p-8 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto text-gray-400 mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No se encontraron pedidos</h3>
          <p class="text-gray-500">No hay pedidos que coincidan con los filtros seleccionados.</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="order in filteredPastOrders" 
            :key="order.id_pedido" 
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <!-- Header del pedido -->
            <div class="flex justify-between items-center p-4 border-b">
              <h3 class="text-lg font-bold text-blue-600">Pedido #{{ order.id_pedido }}</h3>
              <div class="flex items-center">
                <div 
                  :class="[
                    'status-badge px-3 py-1 rounded-full text-xs font-medium',
                    order.estado === 'entregado' ? 'bg-green-100 text-green-800' : 
                    order.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ getStatusText(order.estado) }}
                </div>
                <span class="text-sm text-gray-500 ml-2">{{ formatDateTime(order.fecha_pedido) }}</span>
              </div>
            </div>

            <!-- Info del local -->
            <div class="p-4 border-b">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <div class="ml-3">
                  <h4 class="font-medium">{{ order.local?.nombre || 'Restaurante' }}</h4>
                </div>
              </div>
            </div>

            <!-- Resumen de productos (colapsable) -->
            <div class="p-4 border-b">
              <div class="flex justify-between items-center cursor-pointer" @click="toggleOrderDetails(order.id_pedido)">
                <h4 class="font-medium">Resumen del pedido</h4>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  :class="{'transform rotate-180': expandedOrders.includes(order.id_pedido)}"
                  class="transition-transform" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <div v-if="expandedOrders.includes(order.id_pedido)" class="mt-3 space-y-2">
                <div 
                  v-for="(item, index) in order.items" 
                  :key="index"
                  class="flex justify-between text-sm"
                >
                  <div>
                    <span class="font-medium">{{ item.cantidad }}x</span> {{ item.nombre_producto }}
                  </div>
                  <div class="font-medium">${{ formatPrice(item.subtotal) }}</div>
                </div>
                <div class="mt-3 pt-3 border-t flex justify-between font-bold">
                  <div>Total</div>
                  <div>${{ formatPrice(calculateOrderTotal(order)) }}</div>
                </div>
              </div>
            </div>

            <!-- Método de pago y fecha de entrega -->
            <div class="p-4 flex flex-wrap gap-3">
              <div class="flex-1 min-w-[140px] bg-gray-100 p-2 rounded text-sm">
                <span class="block text-gray-500 text-xs">Método de pago</span>
                <span class="font-medium">{{ getPrettyPaymentMethod(order.metodo_pago) }}</span>
              </div>
              <div class="flex-1 min-w-[140px] bg-gray-100 p-2 rounded text-sm">
                <span class="block text-gray-500 text-xs">Entregado el</span>
                <span class="font-medium">{{ order.fecha_entrega ? formatDate(order.fecha_entrega) : 'N/A' }}</span>
              </div>
            </div>

            <!-- Mensaje de rechazo si aplica -->
            <div v-if="order.estado === 'rechazado' && order.razon_rechazo" class="p-4 bg-red-50 text-red-800">
              <h4 class="font-medium mb-1">Pedido rechazado</h4>
              <p class="text-sm">{{ order.razon_rechazo }}</p>
            </div>

            <!-- Quejas realizadas -->
            <div v-if="order.queja" class="p-4 bg-orange-50 text-orange-800">
              <h4 class="font-medium mb-1">Problema reportado</h4>
              <p class="text-sm">{{ order.queja.comentario }}</p>
              <img v-if="order.queja.imagen_url" :src="order.queja.imagen_url" class="mt-2 rounded-lg max-w-full h-auto max-h-32" alt="Imagen de queja">
            </div>

            <!-- Acciones en el historial -->
            <div class="p-4 bg-gray-50 flex justify-end space-x-3">
              <button 
                v-if="order.estado === 'entregado' && !order.queja"
                @click="showComplaintModal(order)"
                class="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition"
              >
                Reportar Problema
              </button>
              <button 
                class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
                @click="reorderItems(order)"
              >
                Ordenar Nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para realizar pago -->
    <transition name="fade">
      <div v-if="showPaymentModalFlag" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-blue-600">Realizar Pago</h3>
              <button @click="closePaymentModal" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg mb-4">
              <h4 class="font-medium text-yellow-800 mb-2">Información bancaria</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Banco:</span> {{ currentOrder?.cuenta_bancaria?.banco || 'Banco Nacional' }}</p>
                <p><span class="font-medium">Titular:</span> {{ currentOrder?.cuenta_bancaria?.titular || currentOrder?.local?.nombre || 'Restaurante' }}</p>
                <p><span class="font-medium">Cuenta:</span> {{ currentOrder?.cuenta_bancaria?.numero || '123456789' }}</p>
                <p><span class="font-medium">Tipo:</span> {{ currentOrder?.cuenta_bancaria?.tipo || 'Cuenta Corriente' }}</p>
                <p class="font-bold text-yellow-900 mt-3">Monto a pagar: ${{ formatPrice(calculateOrderTotal(currentOrder)) }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Adjuntar comprobante de pago</label>
              <div 
                class="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:bg-blue-50 transition cursor-pointer"
                @click="triggerFileInput"
              >
                <input 
                  type="file" 
                  ref="fileInput" 
                  class="hidden"
                  accept="image/*"
                  @change="handleFileChange"
                />
                
                <div v-if="!receiptImage">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto text-blue-500 mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <p class="text-sm text-gray-600 mb-1">Click para subir imagen</p>
                  <p class="text-xs text-gray-500">JPG, PNG (máx. 5MB)</p>
                </div>
                
                <div v-else class="relative">
                  <img :src="receiptImageUrl" class="max-h-48 mx-auto rounded-lg" alt="Comprobante" />
                  <button 
                    @click.stop="removeImage" 
                    class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
              
              <div v-if="uploadingImage" class="mt-2 flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-t-blue-600 border-blue-600 rounded-full animate-spin mr-2"></div>
                <span class="text-sm text-gray-600">Subiendo imagen...</span>
              </div>
              
              <div v-if="uploadError" class="mt-2 text-red-600 text-sm">
                {{ uploadError }}
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Número de comprobante (opcional)</label>
              <input 
                type="text" 
                v-model="receiptNumber" 
                placeholder="Ej: Número de transacción"
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div class="flex justify-end">
              <button 
                @click="submitPaymentReceipt" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                :disabled="!receiptImage || uploadingImage"
                :class="{'opacity-50 cursor-not-allowed': !receiptImage || uploadingImage}"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para reportar problema (queja) -->
    <transition name="fade">
      <div v-if="showComplaintModalFlag" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-blue-600">Reportar Problema</h3>
              <button @click="closeComplaintModal" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Descripción del problema</label>
              <textarea 
                v-model="complaintText" 
                rows="4"
                placeholder="Describe el problema que tuviste con este pedido..."
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Adjuntar imagen (opcional)</label>
              <div 
                class="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:bg-blue-50 transition cursor-pointer"
                @click="triggerComplaintFileInput"
              >
                <input 
                  type="file" 
                  ref="complaintFileInput" 
                  class="hidden"
                  accept="image/*"
                  @change="handleComplaintFileChange"
                />
                
                <div v-if="!complaintImage">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto text-blue-500 mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <p class="text-sm text-gray-600 mb-1">Click para subir imagen</p>
                  <p class="text-xs text-gray-500">JPG, PNG (máx. 5MB)</p>
                </div>
                
                <div v-else class="relative">
                  <img :src="complaintImageUrl" class="max-h-48 mx-auto rounded-lg" alt="Imagen de queja" />
                  <button 
                    @click.stop="removeComplaintImage" 
                    class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
              
              <div v-if="uploadingComplaintImage" class="mt-2 flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-t-blue-600 border-blue-600 rounded-full animate-spin mr-2"></div>
                <span class="text-sm text-gray-600">Subiendo imagen...</span>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button 
                @click="submitComplaint" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                :disabled="!complaintText || complaintText.trim() === '' || uploadingComplaintImage"
                :class="{'opacity-50 cursor-not-allowed': !complaintText || complaintText.trim() === '' || uploadingComplaintImage}"
              >
                Enviar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para mostrar mapa -->
    <transition name="fade">
      <div v-if="showMapModalFlag" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-xl font-bold text-blue-600">Seguimiento de Pedido</h3>
            <button @click="closeMapModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="relative h-[60vh]">
            <div id="map" class="h-full w-full"></div>
            <div class="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg">
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm font-medium">Tiempo estimado de llegada:</div>
                  <div class="text-xl font-bold text-blue-600">{{ currentOrder?.tiempo_llegada_estimado || 15 }} minutos</div>
                </div>
                <div>
                  <div class="text-sm font-medium">Repartidor:</div>
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <span class="font-medium">{{ currentOrder?.driver?.nombre || 'Juan Pérez' }}</span>
                  </div>
                </div>
                <button class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">
                  Contactar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para confirmar cancelación -->
    <transition name="fade">
      <div v-if="showCancelConfirmModalFlag" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full">
          <div class="p-6">
            <div class="mb-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto text-red-500 mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              <h3 class="text-xl font-bold text-gray-800">¿Cancelar pedido?</h3>
              <p class="text-gray-600 mt-2">¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.</p>
            </div>
            
            <div class="flex justify-center space-x-4">
              <button 
                @click="closeCancelConfirmModal" 
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                No, mantener pedido
              </button>
              <button 
                @click="cancelOrder" 
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Sí, cancelar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para mostrar ubicación -->
    <transition name="fade">
      <div v-if="showLocationModalFlag" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-lg w-full">
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-xl font-bold text-blue-600">
              {{ locationModalType === 'local' ? 'Ubicación del Restaurante' : 'Dirección de Entrega' }}
            </h3>
            <button @click="closeLocationModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="h-[300px]">
            <div id="location-map" class="h-full w-full"></div>
          </div>
          
          <div class="p-4">
            <h4 class="font-medium mb-2">{{ locationModalType === 'local' ? 'Restaurante' : 'Dirección de entrega' }}</h4>
            <p class="text-gray-700">
              {{ locationModalType === 'local' 
                ? (currentOrder?.direccion_local?.direccion || 'Dirección del restaurante') 
                : (currentOrder?.direccion_cliente?.direccion || 'Tu dirección de entrega') }}
            </p>
          </div>
        </div>
      </div>
    </transition>

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
    </footer>
  </div>
</template>

<script>
// Importaciones que se realizarían en Nuxt
 import { ref, computed, onMounted } from 'vue'
// import axios from 'axios'
// import io from 'socket.io-client'
import { 
  Truck as TruckIcon, 
  Bell as BellIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Heart as HeartIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  Search as SearchIcon,
  ChevronDown as ChevronDownIcon,
  PackageX as PackageXIcon,
  Tag as TagIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-vue-next';
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
const isModalOpen = ref(false); 
const notificationsEnabled = ref(true);
const selectedProfile = ref("Cliente");
export default {
  name: 'CustomerOrdersPage',
  data() {
    return {
      // Control de UI
      isSidebarOpen: false,
      activeTab: 'active',
      error: null,
      loading: false,
      expandedOrders: [], 
      // Fuente de datos
      dataSource: 'mock',
      
      // Datos de pedidos
      orders: [],
      
      // Filtros de historial
      filterDate: '',
      filterRestaurantName: '',
      
      // Estado de modales
      showPaymentModalFlag: false,
      showComplaintModalFlag: false,
      showMapModalFlag: false,
      showCancelConfirmModalFlag: false,
      showLocationModalFlag: false,
      locationModalType: 'local', // 'local' o 'cliente'
      
      // Datos para modal de pago
      currentOrder: null,
      receiptImage: null,
      receiptImageUrl: null,
      receiptNumber: '',
      uploadingImage: false,
      uploadError: null,
      
      // Datos para modal de queja
      complaintText: '',
      complaintImage: null,
      complaintImageUrl: null,
      uploadingComplaintImage: false,
      
      // Socket.io
      socket: null,
      
      // Para mapa
      map: null,
      locationMap: null
    }
  },
  computed: {
    // Filtrar pedidos activos (no entregados, no cancelados, no rechazados)
    activeOrders() {
      return this.orders.filter(order => 
        !['entregado', 'cancelado', 'rechazado'].includes(order.estado)
      );
    },
    
    // Filtrar pedidos pasados (entregados, cancelados o rechazados)
    pastOrders() {
      return this.orders.filter(order => 
        ['entregado', 'cancelado', 'rechazado'].includes(order.estado)
      );
    },
    
    // Aplicar filtros a pedidos pasados
    filteredPastOrders() {
      let filtered = [...this.pastOrders];
      
      // Filtrar por fecha
      if (this.filterDate) {
        const filterDateObj = new Date(this.filterDate);
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.fecha_pedido);
          return orderDate.toDateString() === filterDateObj.toDateString();
        });
      }
      
      // Filtrar por nombre de restaurante
      if (this.filterRestaurantName.trim() !== '') {
        const searchTerm = this.filterRestaurantName.toLowerCase();
        filtered = filtered.filter(order => 
          order.local?.nombre?.toLowerCase().includes(searchTerm)
        );
      }
      
      return filtered;
    }
  },
  methods: {
    // Control de UI
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    
    resetFilters() {
      this.filterDate = '';
      this.filterRestaurantName = '';
    },
    
    toggleOrderDetails(orderId) {
      if (this.expandedOrders.includes(orderId)) {
        this.expandedOrders = this.expandedOrders.filter(id => id !== orderId);
      } else {
        this.expandedOrders.push(orderId);
      }
    },
    
    // Formateo de datos
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    
    formatDateTime(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    },
    
    formatPrice(price) {
      if (!price) return '0.00';
      return parseFloat(price).toFixed(2);
    },
    
    calculateOrderTotal(order) {
      if (!order || !order.items || !Array.isArray(order.items)) return 0;
      return order.items.reduce((total, item) => total + parseFloat(item.subtotal || 0), 0);
    },
    
    getPrettyPaymentMethod(method) {
      const methods = {
        'efectivo': 'Efectivo',
        'transferencia': 'Transferencia bancaria',
        'tarjeta': 'Tarjeta de crédito/débito'
      };
      return methods[method] || method;
    },
    
    getPrettyDeliveryType(type) {
      const types = {
        'domicilio': 'Entrega a domicilio',
        'recoger': 'Recoger en local',
        'comer_local': 'Comer en local'
      };
      return types[type] || type;
    },
    
    getStatusText(status) {
      const statusMap = {
        'pendiente_local': 'Pendiente de aceptación',
        'pendiente_deposito': 'Pendiente de pago',
        'preparando_pedido': 'En preparación',
        'en_camino': 'En camino',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado',
        'rechazado': 'Rechazado'
      };
      return statusMap[status] || status;
    },
    
    getStatusBadgeClass(status) {
      const classMap = {
        'pendiente_local': 'bg-gray-100 text-gray-800',
        'pendiente_deposito': 'bg-yellow-100 text-yellow-800',
        'preparando_pedido': 'bg-orange-100 text-orange-800',
        'en_camino': 'bg-blue-100 text-blue-800',
        'entregado': 'bg-green-100 text-green-800',
        'cancelado': 'bg-red-100 text-red-800',
        'rechazado': 'bg-red-100 text-red-800'
      };
      return classMap[status] || 'bg-gray-100 text-gray-800';
    },
    
    getStateClass(state, currentState) {
      // Devuelve la clase para el círculo de estado en la barra de progreso
      const states = ['pendiente_local', 'pendiente_deposito', 'preparando_pedido', 'en_camino', 'entregado'];
      const currentIndex = states.indexOf(currentState);
      const stateIndex = states.indexOf(state);
      
      if (stateIndex < 0) return 'bg-gray-300'; // Estado no válido
      
      if (stateIndex < currentIndex || state === currentState) {
        return 'bg-blue-600'; // Estado completado o actual
      }
      
      return 'bg-gray-300'; // Estado pendiente
    },
    
    getProgressPercentage(currentState) {
      // Calcula el porcentaje para la barra de progreso
      const states = ['pendiente_local', 'pendiente_deposito', 'preparando_pedido', 'en_camino', 'entregado'];
      const stateIndex = states.indexOf(currentState);
      
      if (stateIndex < 0) return 0;
      
      return (stateIndex / (states.length - 1)) * 100;
    },
    
    // Gestión de datos
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      
      try {
        if (this.dataSource === 'api') {
          // Lógica para obtener datos de la API
          // const response = await axios.get('http://localhost:4000/pedidos');
          // this.orders = response.data;
          
          // Simulamos error de API para propósitos de demo
          // Descomenta la línea de arriba y borra esto cuando tengas la API funcionando
          this.error = "No se pudo conectar a la API. Usando datos de ejemplo.";
          this.dataSource = 'mock';
          await this.fetchMockData();
        } else {
          await this.fetchMockData();
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        this.error = "Error al cargar los pedidos. Por favor intenta nuevamente.";
      } finally {
        this.loading = false;
      }
    },
    
    async fetchMockData() {
      // Simulación de datos para demostración
      this.orders = [
        {
          id_pedido: 101,
          id_cliente: 1,
          id_local: 5,
          id_driver: 3,
          id_direccion_cliente: 10,
          id_direccion_local: 5,
          tiempo_preparacion_estimado: 20,
          tiempo_llegada_estimado: 15,
          fecha_pedido: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hora atrás
          estado: 'en_camino',
          metodo_pago: 'efectivo',
          tipo_pedido: 'domicilio',
          local: {
            nombre: 'Burger King',
            telefono: '12345678'
          },
          direccion_cliente: {
            direccion: 'Ceutec, La Ceiba',
            latitud: 15.768179164281971, 
            longitud: -86.78981884103158
          },
          direccion_local: {
            direccion: 'Mall Megaplaza, Local 45, La Ceiba',
            latitud: 15.771274584888115, 
            longitud: -86.79179628996306
          },
          items: [
            {
              id_pedido_detalle: 201,
              nombre_producto: 'Whopper',
              cantidad: 2,
              precio_unitario: 5.99,
              subtotal: 11.98,
              atributos: {
                'Tipo de pan': 'Normal',
                'Tamaño': 'Grande'
              },
              extras: ['Queso extra', 'Bacon']
            },
            {
              id_pedido_detalle: 202,
              nombre_producto: 'Papas Fritas',
              cantidad: 1,
              precio_unitario: 2.50,
              subtotal: 2.50,
              atributos: {
                'Tamaño': 'Grande'
              },
              extras: []
            }
          ]
        },
        {
          id_pedido: 102,
          id_cliente: 1,
          id_local: 8,
          id_direccion_cliente: 10,
          id_direccion_local: 8,
          tiempo_preparacion_estimado: 30,
          fecha_pedido: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
          estado: 'pendiente_deposito',
          metodo_pago: 'transferencia',
          tipo_pedido: 'domicilio',
          has_deposit: false,
          local: {
            nombre: 'Sushi Express',
            telefono: '87654321'
          },
          direccion_cliente: {
            direccion: 'Calle Principal 123, Ciudad'
          },
          direccion_local: {
            direccion: 'Av. Central 456, Ciudad'
          },
          cuenta_bancaria: {
            banco: 'Banco Nacional',
            titular: 'Sushi Express S.A.',
            numero: '1234-5678-9012-3456',
            tipo: 'Cuenta Corriente'
          },
          items: [
            {
              id_pedido_detalle: 203,
              nombre_producto: 'Combo Sushi',
              cantidad: 1,
              precio_unitario: 15.99,
              subtotal: 15.99,
              atributos: {},
              extras: ['Wasabi extra', 'Gari extra']
            }
          ]
        },
        {
          id_pedido: 103,
          id_cliente: 1,
          id_local: 3,
          id_direccion_cliente: 10,
          id_direccion_local: 3,
          fecha_pedido: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
          fecha_entrega: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
          estado: 'entregado',
          metodo_pago: 'efectivo',
          tipo_pedido: 'domicilio',
          local: {
            nombre: 'Pizza Hut',
            telefono: '12343211'
          },
          items: [
            {
              id_pedido_detalle: 204,
              nombre_producto: 'Pizza Hawaiana',
              cantidad: 1,
              precio_unitario: 12.99,
              subtotal: 12.99
            },
            {
              id_pedido_detalle: 205,
              nombre_producto: 'Coca-Cola',
              cantidad: 2,
              precio_unitario: 1.50,
              subtotal: 3.00
            }
          ]
        },
        {
          id_pedido: 104,
          id_cliente: 1,
          id_local: 9,
          id_direccion_cliente: 10,
          id_direccion_local: 9,
          fecha_pedido: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
          estado: 'rechazado',
          razon_rechazo: 'El local está cerrando en este momento y no podemos procesar más pedidos.',
          metodo_pago: 'efectivo',
          tipo_pedido: 'domicilio',
          local: {
            nombre: 'Taco Bell',
            telefono: '98765432'
          },
          items: [
            {
              id_pedido_detalle: 206,
              nombre_producto: 'Combo Tacos',
              cantidad: 1,
              precio_unitario: 8.99,
              subtotal: 8.99
            }
          ]
        },
        {
          id_pedido: 105,
          id_cliente: 1,
          id_local: 12,
          id_direccion_cliente: 10,
          id_direccion_local: 12,
          tiempo_preparacion_estimado: 15,
          fecha_pedido: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutos atrás
          estado: 'preparando_pedido',
          metodo_pago: 'tarjeta',
          tipo_pedido: 'comer_local',
          local: {
            nombre: 'Café Delicioso',
            telefono: '56781234'
          },
          items: [
            {
              id_pedido_detalle: 207,
              nombre_producto: 'Desayuno Completo',
              cantidad: 1,
              precio_unitario: 9.99,
              subtotal: 9.99
            },
            {
              id_pedido_detalle: 208,
              nombre_producto: 'Café Americano',
              cantidad: 1,
              precio_unitario: 2.50,
              subtotal: 2.50
            }
          ]
        }
      ];
      
      // Simulación de carga
      await new Promise(resolve => setTimeout(resolve, 800));
    },
    
    // Modales de pago
    showPaymentModal(order) {
      this.currentOrder = order;
      this.receiptImage = null;
      this.receiptImageUrl = null;
      this.receiptNumber = '';
      this.uploadError = null;
      this.showPaymentModalFlag = true;
    },
    
    closePaymentModal() {
      this.showPaymentModalFlag = false;
      setTimeout(() => {
        this.currentOrder = null;
        this.receiptImage = null;
        this.receiptImageUrl = null;
      }, 300);
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validación del archivo
      if (!file.type.match('image.*')) {
        this.uploadError = 'Por favor selecciona una imagen';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.uploadError = 'La imagen no debe superar los 5MB';
        return;
      }
      
      this.receiptImage = file;
      this.receiptImageUrl = URL.createObjectURL(file);
      this.uploadError = null;
    },
    
    removeImage() {
      this.receiptImage = null;
      if (this.receiptImageUrl) {
        URL.revokeObjectURL(this.receiptImageUrl);
      }
      this.receiptImageUrl = null;
      this.$refs.fileInput.value = '';
    },
    
    async submitPaymentReceipt() {
      if (!this.receiptImage) {
        this.uploadError = 'Por favor adjunta un comprobante de pago';
        return;
      }
      
      this.uploadingImage = true;
      
      try {
        // Simular subida de imagen a Cloudinary
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Aquí iría el código real para subir a Cloudinary y guardar en la API
        /*
        const formData = new FormData();
        formData.append('file', this.receiptImage);
        formData.append('upload_preset', 'tu_preset');
        
        const response = await axios.post('https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload', formData);
        const imageUrl = response.data.secure_url;
        
        await axios.post('http://localhost:4000/pagos/transferencia', {
          id_pedido: this.currentOrder.id_pedido,
          num_comprobante: this.receiptNumber,
          imagen_url: imageUrl
        });
        */
        
        // Actualizar el estado localmente
        const orderIndex = this.orders.findIndex(order => order.id_pedido === this.currentOrder.id_pedido);
        if (orderIndex >= 0) {
          this.orders[orderIndex].estado = 'preparando_pedido';
          this.orders[orderIndex].has_deposit = true;
        }
        
        this.closePaymentModal();
        
        // Mostrar notificación de éxito
        alert('Pago registrado correctamente. El local procesará tu pedido pronto.');
        
      } catch (err) {
        console.error("Error submitting payment:", err);
        this.uploadError = "Error al procesar el pago. Por favor intenta nuevamente.";
      } finally {
        this.uploadingImage = false;
      }
    },
    
    // Modales de queja
    showComplaintModal(order) {
      this.currentOrder = order;
      this.complaintText = '';
      this.complaintImage = null;
      this.complaintImageUrl = null;
      this.showComplaintModalFlag = true;
    },
    
    closeComplaintModal() {
      this.showComplaintModalFlag = false;
      setTimeout(() => {
        this.currentOrder = null;
        this.complaintText = '';
        this.complaintImage = null;
        this.complaintImageUrl = null;
      }, 300);
    },
    
    triggerComplaintFileInput() {
      this.$refs.complaintFileInput.click();
    },
    
    handleComplaintFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validación del archivo
      if (!file.type.match('image.*')) {
        alert('Por favor selecciona una imagen');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      this.complaintImage = file;
      this.complaintImageUrl = URL.createObjectURL(file);
    },
    
    removeComplaintImage() {
      this.complaintImage = null;
      if (this.complaintImageUrl) {
        URL.revokeObjectURL(this.complaintImageUrl);
      }
      this.complaintImageUrl = null;
      this.$refs.complaintFileInput.value = '';
    },
    
    async submitComplaint() {
      if (!this.complaintText || this.complaintText.trim() === '') {
        alert('Por favor describe el problema');
        return;
      }
      
      this.uploadingComplaintImage = true;
      
      try {
        // Simular envío y procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Aquí iría el código real para subir a Cloudinary y guardar en la API
        /*
        let imageUrl = null;
        
        if (this.complaintImage) {
          const formData = new FormData();
          formData.append('file', this.complaintImage);
          formData.append('upload_preset', 'tu_preset');
          
          const response = await axios.post('https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload', formData);
          imageUrl = response.data.secure_url;
        }
        
        await axios.post('http://localhost:4000/quejalocal', {
          id_cliente: 1, // Esto vendría del usuario autenticado
          id_local: this.currentOrder.id_local,
          id_pedido: this.currentOrder.id_pedido,
          comentario: this.complaintText,
          imagen_url: imageUrl
        });
        */
        
        // Actualizar el pedido localmente
        const orderIndex = this.orders.findIndex(order => order.id_pedido === this.currentOrder.id_pedido);
        if (orderIndex >= 0) {
          this.orders[orderIndex].queja = {
            comentario: this.complaintText,
            imagen_url: this.complaintImageUrl,
            fecha: new Date().toISOString()
          };
        }
        
        this.closeComplaintModal();
        
        // Mostrar notificación de éxito
        alert('Tu reporte ha sido enviado. El restaurante revisará tu caso pronto.');
        
      } catch (err) {
        console.error("Error submitting complaint:", err);
        alert("Error al enviar el reporte. Por favor intenta nuevamente.");
      } finally {
        this.uploadingComplaintImage = false;
      }
    },
    
    // Modal de mapa
    showMapModal(order) {
      this.currentOrder = order;
      this.showMapModalFlag = true;
      
      // Inicializar mapa en el siguiente tick
      this.$nextTick(() => {
        this.initMap();
      });
    },
    
    closeMapModal() {
      this.showMapModalFlag = false;
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    },
    
    initMap() {
      if (!window.L) {
        console.error('Leaflet not loaded');
        return;
      }
      
      // Eliminar mapa existente si lo hay
      if (this.map) {
        this.map.remove();
      }
      
      // Crear nuevo mapa
      this.map = L.map('map').setView([14.0818, -87.2068], 13);
      
      // Agregar capa de mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      
      if (this.currentOrder) {
        // Marcar ubicación del cliente
        if (this.currentOrder.direccion_cliente?.latitud && this.currentOrder.direccion_cliente?.longitud) {
          const clientMarker = L.marker([
            this.currentOrder.direccion_cliente.latitud,
            this.currentOrder.direccion_cliente.longitud
          ]).addTo(this.map);
          
          clientMarker.bindPopup("Tu ubicación").openPopup();
        }
        
        // Marcar ubicación del local
        if (this.currentOrder.direccion_local?.latitud && this.currentOrder.direccion_local?.longitud) {
          const localIcon = L.divIcon({
            html: `<div class="bg-blue-600 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-white" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                   </div>`,
            className: '',
            iconSize: [24, 24]
          });
          
          const restaurantMarker = L.marker([
            this.currentOrder.direccion_local.latitud,
            this.currentOrder.direccion_local.longitud
          ], { icon: localIcon }).addTo(this.map);
          
          restaurantMarker.bindPopup(this.currentOrder.local?.nombre || "Restaurante");
        }
        
        // Ubicación simulada del repartidor
        if (this.currentOrder.estado === 'en_camino') {
          // Calcular punto intermedio entre cliente y local para simular posición del repartidor
          const clientLat = this.currentOrder.direccion_cliente?.latitud || 15.771569671157208;
          const clientLng = this.currentOrder.direccion_cliente?.longitud || -86.79169616596653;
          const localLat = this.currentOrder.direccion_local?.latitud || 15.768209275604825;
          const localLng = this.currentOrder.direccion_local?.longitud ||  -86.79169616596653;
          
          const driverLat = (clientLat + localLat) / 2;
          const driverLng = (clientLng + localLng) / 2;
          
                    
          // Dibujar ruta
          const polyline = L.polyline([
            [localLat, localLng],
            [driverLat, driverLng],
            [clientLat, clientLng]
          ], {color: 'blue', dashArray: '5, 10'}).addTo(this.map);
          
          // Ajustar la vista
          this.map.fitBounds(polyline.getBounds(), {padding: [50, 50]});
        } else {
          // Si no hay ruta, centrar en el cliente
          this.map.setView([clientLat, clientLng], 13);
        }
      }
    },
    
    // Modal de ubicación
    showLocationModal(order, type) {
      this.currentOrder = order;
      this.locationModalType = type;
      this.showLocationModalFlag = true;
      
      // Inicializar mapa en el siguiente tick
      this.$nextTick(() => {
        this.initLocationMap();
      });
    },
    
    closeLocationModal() {
      this.showLocationModalFlag = false;
      if (this.locationMap) {
        this.locationMap.remove();
        this.locationMap = null;
      }
    },
    
    initLocationMap() {
      if (!window.L) {
        console.error('Leaflet not loaded');
        return;
      }
      
      // Eliminar mapa existente si lo hay
      if (this.locationMap) {
        this.locationMap.remove();
      }
      
      // Obtener las coordenadas según el tipo
      let lat, lng, title;
      
      if (this.locationModalType === 'local') {
        lat = this.currentOrder?.direccion_local?.latitud || 15.771569671157208;
        lng = this.currentOrder?.direccion_local?.longitud || -86.79169616596653;
        title = this.currentOrder?.local?.nombre || 'Restaurante';
      } else {
        lat = this.currentOrder?.direccion_cliente?.latitud || 15.768209275604825;
        lng = this.currentOrder?.direccion_cliente?.longitud ||  -86.78990644952853;
        title = 'Tu ubicación';
      }
      
      // Crear nuevo mapa
      this.locationMap = L.map('location-map').setView([lat, lng], 15);
      
      // Agregar capa de mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.locationMap);
      
      // Agregar marcador
      const marker = L.marker([lat, lng]).addTo(this.locationMap);
      marker.bindPopup(title).openPopup();
    },
    
    // Cancelación de pedido
    confirmCancelOrder(order) {
      this.currentOrder = order;
      this.showCancelConfirmModalFlag = true;
    },
    
    closeCancelConfirmModal() {
      this.showCancelConfirmModalFlag = false;
      setTimeout(() => {
        this.currentOrder = null;
      }, 300);
    },
    
    async cancelOrder() {
      try {
        // Simular cancelación
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Actualizar estado localmente
        const orderIndex = this.orders.findIndex(order => order.id_pedido === this.currentOrder.id_pedido);
        if (orderIndex >= 0) {
          this.orders[orderIndex].estado = 'cancelado';
        }
        
        this.closeCancelConfirmModal();
        
        // Mostrar notificación
        alert('Pedido cancelado correctamente');
        
      } catch (err) {
        console.error("Error cancelling order:", err);
        alert("Error al cancelar el pedido. Por favor intenta nuevamente.");
      }
    },
    
    // Reordenar pedido anterior
    reorderItems(order) {
      // Aquí iría la lógica para reordenar
      alert('Función de reordenar en desarrollo. Esta acción enviaría los productos al carrito.');
    },
    
    // Socket.io para actualizaciones en tiempo real
    initSocket() {
      // Inicializar socket.io para recibir actualizaciones en tiempo real
      /*
      this.socket = io('http://localhost:4000');
      
      this.socket.on('connect', () => {
        console.log('Socket conectado');
        
        // Suscribirse a actualizaciones de pedidos del cliente (id_cliente vendría de la sesión)
        this.socket.emit('subscribe_customer_orders', { id_cliente: 1 });
      });
      
      this.socket.on('order_update', (updatedOrder) => {
        // Actualizar el pedido en la lista local
        const index = this.orders.findIndex(order => order.id_pedido === updatedOrder.id_pedido);
        if (index >= 0) {
          this.orders.splice(index, 1, updatedOrder);
        }
      });
      
      this.socket.on('disconnect', () => {
        console.log('Socket desconectado');
      });
      */
    }
  },
  mounted() {
    // Inicializar datos
    this.fetchOrders();
    
    // Inicializar socket para actualizaciones en tiempo real
    this.initSocket();
    
    // Detectar preferencia de color
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
    
    // Cargar Leaflet desde CDN si no está disponible
    if (!window.L) {
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(linkElement);
      
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      document.head.appendChild(scriptElement);
    }
  },
  beforeUnmount() {
    // Limpiar socket al desmontar
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
</script>

<style>
.tab-button {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.status-badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg p-6 max-w-md w-full mx-4;
}

/* Animaciones */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Soporte para modo oscuro */
@media (prefers-color-scheme: dark) {
  .dark body {
    @apply bg-gray-900 text-white;
  }
  
  .dark .bg-white {
    @apply bg-gray-800;
  }
  
  .dark .text-gray-700 {
    @apply text-gray-300;
  }
  
  .dark .text-gray-600 {
    @apply text-gray-400;
  }
  
  .dark .border {
    @apply border-gray-700;
  }
  
  .dark .bg-gray-100 {
    @apply bg-gray-700;
  }
   
  
  .dark .modal-content {
    @apply bg-gray-800;
  }
}
</style>
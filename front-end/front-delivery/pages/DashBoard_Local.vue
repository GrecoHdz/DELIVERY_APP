<template>
  <div class="min-h-screen bg-white">
     <!-- Header -->
     <HeaderLocal />

    <!-- Contenido Principal -->
    <div class="container mx-auto px-4 pb-20 pt-6">
      <!-- Información del local y toggle de datos -->
      <LocalInfoHeader
        :localInfo="local"
        :dataSource="fuenteDatos"
        @update:dataSource="fuenteDatos = $event; cargarDatos()"
      />

      <!-- Tarjetas de estado principales -->
      <StatusCards
        :localInfo="local"
        :membresia="membresia"
        :estadisticas="estadisticas"
      />

      <!-- Cobro semanal con lista de productos vendidos -->
      <div class="bg-white rounded-xl shadow mb-8 border border-gray-100">
<div class="border-b border-gray-100 p-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between">
    <!-- Ícono y texto -->
    <div class="flex items-center">
      <div class="p-3 bg-amber-100 rounded-full mr-4">
        <ReceiptIcon class="text-amber-600" :size="20" />
      </div>
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-800">Cobro Semanal</h2>
        <p class="text-gray-600 text-sm sm:text-base">El cobro se realiza automáticamente cada domingo a las 11:59 PM</p>
      </div>
    </div>

    <!-- Botones de exportación -->
    <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
      <button @click="exportToExcel" class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
        Exportar Excel
      </button>
      <button @click="exportToPDF" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
        Exportar PDF
      </button>
    </div>
  </div>
</div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <!-- Productos vendidos esta semana -->
          <div class="lg:col-span-2 p-6 border-r border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Productos Vendidos esta Semana</h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left border-b border-gray-100">
                    <th class="py-2 px-4 text-gray-600 font-medium">Producto</th>
                    <th class="py-2 px-4 text-gray-600 font-medium">Cantidad</th>
                    <th class="py-2 px-4 text-gray-600 font-medium">Precio Unitario</th>
                    <th class="py-2 px-4 text-gray-600 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(producto, index) in productosVendidosSemana" :key="index"
                      :class="{'bg-gray-50': index % 2 === 0}">
                    <td class="py-3 px-4 text-gray-800">{{ producto.nombre }}</td>
                    <td class="py-3 px-4 text-gray-800">{{ producto.cantidad }}</td>
                    <td class="py-3 px-4 text-gray-800">L. {{ producto.precio }}</td>
                    <td class="py-3 px-4 font-medium text-gray-800">L. {{ (producto.cantidad * producto.precio).toFixed(2) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t border-gray-100">
                    <td colspan="2" class="py-3 px-4"></td>
                    <td class="py-3 px-4 font-medium text-gray-800">Total Ventas:</td>
                    <td class="py-3 px-4 font-bold text-gray-800">L. {{ totalVentasSemana }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Resumen del cobro -->
          <div class="p-6 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen del Cobro</h3>
            <div class="space-y-4">
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Pedidos extra ({{ pedidosExtra }})</span>
                <span class="text-gray-800 font-medium">L. {{ calcularCostoPedidosExtra() }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Comisión app (15%)</span>
                <span class="text-gray-800 font-medium">L. {{ calcularComisionApp() }}</span>
              </div>
              <div class="flex justify-between py-3 text-lg">
                <span class="font-bold text-gray-800">Total a pagar:</span>
                <span class="font-bold text-gray-800">L. {{ calcularTotalPago() }}</span>
              </div>

              <div class="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-800">
                <p class="flex items-center text-sm">
                  <InfoIcon :size="16" class="mr-2 text-amber-500 flex-shrink-0" />
                  El cobro del {{ formatearFecha(fechaProximoCobro) }} incluirá todos los pedidos y comisiones hasta el domingo a las 11:59 PM
                </p>
              </div>

              <button @click="openHistorialCobros" class="w-full mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center">
                <FileTextIcon :size="16" class="mr-2" />
                Ver historial de cobros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pestañas de Secciones -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <ul class="flex flex-wrap -mb-px">
            <li v-for="tab in tabs" :key="tab.id" class="mr-2">
              <button
                @click="currentTab = tab.id"
                class="py-2 px-4 text-sm font-medium border-b-2 transition-colors"
                :class="currentTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'"
              >
                <component :is="tab.icon" :size="16" class="inline-block mr-1" />
                {{ tab.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contenido de las Pestañas -->
      <div class="mb-8">
        <!-- Pestaña: Planes de Membresía -->
        <div v-if="currentTab === 'planes'" class="space-y-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <CrownIcon :size="20" class="mr-2 text-amber-500" />
            Planes de Membresía
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Plan Gratuito -->
            <div
              class="bg-white rounded-xl shadow overflow-hidden transition-all"
              :class="membresia.id_membresia === 1 ? 'ring-2 ring-blue-500' : ''"
            >
              <div class="bg-gray-50 p-4 text-center border-b">
                <h3 class="text-xl font-bold text-gray-800">Gratuita</h3>
                <p class="text-3xl font-bold text-blue-600 mt-2">L. 0</p>
                <p class="text-sm text-gray-500">por semana</p>
              </div>
              <div class="p-6">
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Visibilidad normal</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">5 pedidos gratis semanales</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">L. 25 por pedido extra</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">1 producto recomendado</span>
                  </li>
                  <li class="flex items-start text-gray-400">
                    <XIcon :size="16" class="text-gray-300 mt-1 mr-3 flex-shrink-0" />
                    <span>Mayor visibilidad</span>
                  </li>
                  <li class="flex items-start text-gray-400">
                    <XIcon :size="16" class="text-gray-300 mt-1 mr-3 flex-shrink-0" />
                    <span>Estadísticas avanzadas</span>
                  </li>
                </ul>

                <button
                  @click="openMembresiaComprobanteModal(1)"
                  class="w-full mt-6 px-4 py-2 rounded-lg text-center"
                  :class="membresia.id_membresia === 1 ? 'bg-gray-100 text-gray-800 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'"
                >
                  {{ membresia.id_membresia === 1 ? 'Plan Actual' : 'Adquirir' }}
                </button>
              </div>
            </div>

            <!-- Plan Básico -->
            <div
              class="bg-white rounded-xl shadow overflow-hidden transition-all"
              :class="membresia.id_membresia === 2 ? 'ring-2 ring-blue-500' : ''"
            >
              <div class="bg-blue-50 p-4 text-center border-b">
                <h3 class="text-xl font-bold text-blue-700">Básica</h3>
                <p class="text-3xl font-bold text-blue-600 mt-2">L. 150</p>
                <p class="text-sm text-gray-500">por semana</p>
              </div>
              <div class="p-6">
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Mayor visibilidad en búsqueda</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">15 pedidos gratis semanales</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">L. 15 por pedido extra</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">2 productos recomendados</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Estadística de producto</span>
                  </li>
                  <li class="flex items-start text-gray-400">
                    <XIcon :size="16" class="text-gray-300 mt-1 mr-3 flex-shrink-0" />
                    <span>Banners publicitarios</span>
                  </li>
                </ul>

                <button
                  @click="openMembresiaComprobanteModal(2)"
                  class="w-full mt-6 px-4 py-2 rounded-lg text-center"
                  :class="membresia.id_membresia === 2 ? 'bg-gray-100 text-gray-800 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'"
                >
                  {{ membresia.id_membresia === 2 ? 'Plan Actual' : 'Adquirir' }}
                </button>
              </div>
            </div>

            <!-- Plan Premium -->
            <div
              class="bg-white rounded-xl shadow overflow-hidden transition-all relative"
              :class="membresia.id_membresia === 3 ? 'ring-2 ring-purple-500' : ''"
            >
              <!-- Etiqueta recomendado -->
              <div class="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 transform rotate-45 translate-x-8 translate-y-2">
                <span class="text-xs font-bold">RECOMENDADO</span>
              </div>

              <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-center border-b">
                <h3 class="text-xl font-bold text-white">Premium</h3>
                <p class="text-3xl font-bold text-white mt-2">L. 250</p>
                <p class="text-sm text-white/80">por semana</p>
              </div>
              <div class="p-6">
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Pedidos ilimitados semanales</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Prioridad en resultados de búsqueda</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Notificaciones personalizadas</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Banners publicitarios</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">5 productos recomendados</span>
                  </li>
                  <li class="flex items-start">
                    <CheckIcon :size="16" class="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700">Todas las estadísticas</span>
                  </li>
                </ul>

                <button
                  @click="openMembresiaComprobanteModal(3)"
                  class="w-full mt-6 px-4 py-2 rounded-lg text-center"
                  :class="membresia.id_membresia === 3 ? 'bg-gray-100 text-gray-800 cursor-default' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-opacity'"
                >
                  {{ membresia.id_membresia === 3 ? 'Plan Actual' : 'Adquirir' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pestaña: Cupones -->
        <div v-if="currentTab === 'cupones'" class="space-y-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 flex items-center">
              <TicketIcon :size="20" class="mr-2 text-green-500" />
              Cupones de Descuento
            </h2>
            <button
              @click="openCuponModal()"
              class="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <PlusIcon :size="16" class="mr-1" />
              Crear Cupón
            </button>
          </div>

          <div class="overflow-x-auto bg-white shadow rounded-xl border border-gray-100">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50 text-left text-gray-600 text-sm border-b border-gray-100">
                  <th class="p-4">Código</th>
                  <th class="p-4">Tipo</th>
                  <th class="p-4">Descuento</th>
                  <th class="p-4">Límite de uso</th>
                  <th class="p-4">Vencimiento</th>
                  <th class="p-4">Estado</th>
                  <th class="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cupon, index) in cupones" :key="index"
                    class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="p-4 font-medium text-gray-800">{{ cupon.codigo_cupon }}</td>
                  <td class="p-4 text-gray-700">{{ cupon.tipo_descuento === 'porcentaje' ? 'Porcentaje' : 'Monto Fijo' }}</td>
                  <td class="p-4 text-gray-700">
                    {{ cupon.tipo_descuento === 'porcentaje' ? cupon.descuento + '%' : 'L. ' + cupon.descuento }}
                  </td>
                  <td class="p-4 text-gray-700">{{ cupon.limite_uso }}</td>
                  <td class="p-4 text-gray-700">{{ formatearFecha(cupon.fecha_vencimiento) }}</td>
                  <td class="p-4">
                    <span
                      :class="cupon.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      class="px-2 py-1 rounded-full text-xs"
                    >
                      {{ cupon.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex justify-end space-x-1">
                      <button @click="editCupon(cupon)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <EditIcon :size="16" />
                      </button>
                      <button @click="toggleCuponStatus(cupon)" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            :class="cupon.activo ? 'text-amber-600' : 'text-green-600'">
                        <component :is="cupon.activo ? BanIcon : CheckIcon" :size="16" />
                      </button>
                      <button @click="deleteCupon(cupon)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="cupones.length === 0">
                  <td colspan="7" class="p-6 text-center text-gray-500">
                    No hay cupones disponibles. Crea tu primer cupón para atraer más clientes.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pestaña: Sucursales -->
        <div v-if="currentTab === 'sucursales'" class="space-y-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 flex items-center">
              <StoreIcon :size="20" class="mr-2 text-indigo-500" />
              Sucursales
            </h2>
            <button
              @click="openSucursalModal()"
              class="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <PlusIcon :size="16" class="mr-1" />
              Agregar Sucursal
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="(sucursal, index) in sucursales"
              :key="index"
              class="bg-white rounded-xl shadow overflow-hidden group hover:shadow-md transition-shadow border border-gray-100"
            >
              <div class="p-4 border-b border-gray-100">
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-gray-800">{{ sucursal.nombre }}</h3>
                  <span
                    :class="sucursal.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="text-xs px-2 py-1 rounded-full"
                  >
                    {{ sucursal.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mt-1">{{ sucursal.ciudad }} - {{ sucursal.colonia }}</p>
              </div>

              <div class="p-4">
                <p class="text-gray-700 text-sm mb-3 flex items-start">
                  <MapPinIcon :size="16" class="text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{{ sucursal.direccion_precisa }}</span>
                </p>
                <p class="text-gray-700 text-sm mb-3 flex items-start">
                  <ClockIcon :size="16" class="text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{{ formatearHora(sucursal.apertura) }} - {{ formatearHora(sucursal.cierre) }}</span>
                </p>

                <div class="flex justify-between items-center mt-4">
                  <button
                    @click="viewSucursalOnMap(sucursal)"
                    class="text-blue-600 text-sm flex items-center hover:text-blue-700 transition-colors"
                  >
                    <MapIcon :size="16" class="mr-1" />
                    Ver en mapa
                  </button>
                  <div class="flex space-x-1">
                    <button @click="editSucursal(sucursal)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <EditIcon :size="16" />
                    </button>
                    <button @click="toggleSucursalStatus(sucursal)" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            :class="sucursal.activo ? 'text-amber-600' : 'text-green-600'">
                      <component :is="sucursal.activo ? BanIcon : CheckIcon" :size="16" />
                    </button>
                    <button @click="deleteSucursal(sucursal)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <TrashIcon :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="sucursales.length === 0" class="col-span-full p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
              <StoreIcon :size="48" class="text-gray-400 mx-auto mb-2" />
              <p>No hay sucursales registradas</p>
              <button
                @click="openSucursalModal()"
                class="mt-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                Agregar primera sucursal
              </button>
            </div>
          </div>
        </div>

        <!-- Pestaña: Banners Publicitarios -->
        <div v-if="currentTab === 'banners'" class="space-y-6">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <ImageIcon :size="20" class="mr-2 text-red-500" />
                Banners Publicitarios
              </h2>
              <div v-if="membresia.id_membresia < 3" class="ml-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                Premium
              </div>
            </div>
            <button
              @click="openBannerModal"
              class="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              :class="{'opacity-50 cursor-not-allowed': membresia.id_membresia < 3}"
              :disabled="membresia.id_membresia < 3"
            >
              <PlusIcon :size="16" class="mr-1" />
              Agregar Banner
            </button>
          </div>

          <!-- Mensaje Premium -->
          <div v-if="membresia.id_membresia < 3" class="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <CrownIcon :size="20" class="text-amber-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <p class="font-medium text-amber-800">Función disponible solo en plan Premium</p>
                <p class="text-amber-700 text-sm mt-1">Los banners publicitarios te permiten mostrar promociones especiales a tus clientes directamente en la aplicación.</p>
                <button
                  @click="openMembresiaComprobanteModal(3)"
                  class="mt-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Mejorar a Premium
                </button>
              </div>
            </div>
          </div>

          <!-- Listado de banners -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            :class="{'opacity-50 pointer-events-none': membresia.id_membresia < 3}"
          >
            <div
              v-for="banner in banners"
              :key="banner.id_banner"
              class="bg-white rounded-xl shadow overflow-hidden group hover:shadow-md transition-shadow border border-gray-100"
            >
              <div class="relative h-40">
                <img :src="banner.imagen_url" alt="Banner" class="w-full h-full object-cover">
                <div class="absolute top-0 right-0 m-2">
                  <span
                    :class="banner.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="text-xs px-2 py-1 rounded-full"
                  >
                    {{ banner.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                >
                  <div class="p-3 text-white w-full">
                    <h3 class="font-bold truncate">{{ banner.titulo }}</h3>
                    <p class="text-sm opacity-90 truncate">{{ banner.descripcion }}</p>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-800 truncate mb-1">{{ banner.titulo }}</h3>
                <p class="text-gray-600 text-sm line-clamp-2 h-10 mb-3">{{ banner.descripcion }}</p>
                <div class="flex justify-between items-center">
                  <a
                    :href="banner.url_destino"
                    target="_blank"
                    class="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                  >
                    Ver destino
                  </a>
                  <div class="flex space-x-1">
                    <button @click="editBanner(banner)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <EditIcon :size="16" />
                    </button>
                    <button @click="toggleBannerStatus(banner)" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            :class="banner.activo ? 'text-amber-600' : 'text-green-600'">
                      <component :is="banner.activo ? BanIcon : CheckIcon" :size="16" />
                    </button>
                    <button @click="deleteBanner(banner)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <TrashIcon :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="banners.length === 0 && membresia.id_membresia >= 3" class="col-span-full p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
              <ImageIcon :size="48" class="text-gray-400 mx-auto mb-2" />
              <p>No hay banners publicitarios</p>
              <button
                @click="openBannerModal"
                class="mt-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                Crear tu primer banner publicitario
              </button>
            </div>
          </div>
        </div>

<!-- Pestaña: Estadísticas -->
<div v-if="currentTab === 'estadisticas'" class="space-y-6">
  <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
    <BarChartIcon :size="20" class="mr-2 text-blue-500" />
    Estadísticas
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Estadística de Producto Más Vendido (disponible para Básica y Premium) -->
    <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100 relative">
      <div class="p-4 border-b border-gray-100">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-800 flex items-center">
            <span class="bg-blue-100 p-2 rounded-lg mr-2 text-blue-600">
              <BoxIcon :size="16" />
            </span>
            Productos Más Vendidos
          </h3>
          <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">
            Básica
          </span>
        </div>
      </div>

      <!-- Contenido para usuarios Básica/Premium -->
      <div v-if="membresia.id_membresia >= 2" class="p-4 h-64">
        <canvas id="productosChart" ref="productosChart"></canvas>
      </div>

      <!-- Overlay para membresía insuficiente -->
      <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
        <LockIcon :size="32" class="text-gray-400 mb-2" />
        <p class="text-sm font-medium text-gray-600">Requiere membresía Básica</p>
        <button @click="openUpgradeModal" class="mt-3 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
          Mejorar Plan
        </button>
      </div>
    </div>

    <!-- Estadística de Ingresos por Día (solo Premium) -->
    <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100 relative">
      <div class="p-4 border-b border-gray-100">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-800 flex items-center">
            <span class="bg-green-100 p-2 rounded-lg mr-2 text-green-600">
              <LineChartIcon :size="16" />
            </span>
            Ingresos por Día
          </h3>
          <span class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-lg">
            Premium
          </span>
        </div>
      </div>

      <!-- Contenido para usuarios Premium -->
      <div v-if="membresia.id_membresia >= 3" class="p-4 h-64">
        <canvas id="ventasChart" ref="ventasChart"></canvas>
      </div>

      <!-- Overlay para membresía insuficiente -->
      <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
        <LockIcon :size="32" class="text-gray-400 mb-2" />
        <p class="text-sm font-medium text-gray-600">Requiere membresía Premium</p>
        <button @click="openUpgradeModal" class="mt-3 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
          Mejorar Plan
        </button>
      </div>
    </div>

    <!-- Cliente más frecuente (solo Premium) - modificado a top 3 sin fotos -->
    <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100 relative">
      <div class="p-4 border-b border-gray-100">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-800 flex items-center">
            <span class="bg-orange-100 p-2 rounded-lg mr-2 text-orange-600">
              <UserIcon :size="16" />
            </span>
            Top 3 Clientes Más Frecuentes
          </h3>
          <span class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-lg">
            Premium
          </span>
        </div>
      </div>

      <!-- Contenido para usuarios Premium -->
      <div v-if="membresia.id_membresia >= 3 && clientesFrecuentes && clientesFrecuentes.length > 0" class="p-4">
        <p class="text-sm text-gray-600 mb-3">Periodo: Últimos 7 días</p>

        <div class="space-y-3">
          <div v-for="(cliente, index) in clientesFrecuentes" :key="cliente.id_cliente"
              class="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-3">
                <span class="font-bold">#{{ index + 1 }}</span>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">{{ cliente.nombre }}</h4>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Pedidos: <span class="font-bold text-gray-800">{{ cliente.num_pedidos }}</span></p>
              <p class="text-sm text-gray-600">Total: <span class="font-bold text-gray-800">L. {{ cliente.total_gastado }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlay para membresía insuficiente -->
      <div v-if="membresia.id_membresia < 3" class="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
        <LockIcon :size="32" class="text-gray-400 mb-2" />
        <p class="text-sm font-medium text-gray-600">Requiere membresía Premium</p>
        <button @click="openUpgradeModal" class="mt-3 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
          Mejorar Plan
        </button>
      </div>
    </div>

    <!-- Ranking en ventas por categoría (solo Premium) - modificado para ocultar información sensible -->
    <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100 relative">
      <div class="p-4 border-b border-gray-100">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-800 flex items-center">
            <span class="bg-purple-100 p-2 rounded-lg mr-2 text-purple-600">
              <TrophyIcon :size="16" />
            </span>
            Ranking en Categoría
          </h3>
          <span class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-lg">
            Premium
          </span>
        </div>
      </div>

      <!-- Contenido para usuarios Premium -->
      <div v-if="membresia.id_membresia >= 3" class="p-4">
        <div class="bg-gray-50 p-3 rounded-lg mb-4 flex items-center">
          <div class="bg-purple-500 text-white font-bold text-2xl w-14 h-14 flex items-center justify-center rounded-full">
            #{{ rankingCategoria.posicion }}
          </div>
          <div class="ml-4">
            <p class="text-gray-600 text-sm">Tu ranking en la categoría</p>
            <h4 class="font-bold text-gray-800 text-lg">{{ rankingCategoria.categoria }}</h4>
          </div>
        </div>

        <div class="space-y-3">
          <p class="text-sm text-gray-600">Top 5 establecimientos en tu categoría:</p>
          <div v-for="(competidor, index) in rankingCategoria.top5" :key="index"
               class="flex items-center justify-between p-2 rounded-lg"
               :class="competidor.nombre === local.nombre_local ? 'bg-purple-50' : 'bg-gray-50 blur-sm'">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                <span v-if="index < 3" class="font-bold" :class="index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-500' : 'text-amber-700'">
                  #{{ index + 1 }}
                </span>
                <span v-else class="text-gray-700 font-bold">#{{ index + 1 }}</span>
              </div>
              <span class="font-medium text-gray-800" :class="competidor.nombre === local.nombre_local ? 'font-bold' : ''">
                {{ competidor.nombre }}
              </span>
            </div>
            <span class="text-gray-700" v-if="competidor.nombre === local.nombre_local">L. {{ competidor.ventas_total }}</span>
          </div>
        </div>
      </div>

      <!-- Overlay para membresía insuficiente -->
      <div v-if="membresia.id_membresia < 3" class="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
        <LockIcon :size="32" class="text-gray-400 mb-2" />
        <p class="text-sm font-medium text-gray-600">Requiere membresía Premium</p>
        <button @click="openUpgradeModal" class="mt-3 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
          Mejorar Plan
        </button>
      </div>
    </div>
  </div>
</div>

        <!-- Pestaña: Notificaciones -->
        <div v-if="currentTab === 'notificaciones'" class="space-y-6">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <BellIcon :size="20" class="mr-2 text-amber-500" />
                Notificaciones Personalizadas
              </h2>
              <div v-if="membresia.id_membresia < 3" class="ml-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                Premium
              </div>
            </div>
            <button
              @click="openNotificacionModal"
              class="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              :class="{'opacity-50 cursor-not-allowed': membresia.id_membresia < 3}"
              :disabled="membresia.id_membresia < 3"
            >
              <BellIcon :size="16" class="mr-1" />
              Nueva Notificación
            </button>
          </div>

          <!-- Mensaje Premium -->
          <div v-if="membresia.id_membresia < 3" class="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <CrownIcon :size="20" class="text-amber-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <p class="font-medium text-amber-800">Función disponible solo en plan Premium</p>
                <p class="text-amber-700 text-sm mt-1">Las notificaciones personalizadas te permiten comunicarte directamente con tus clientes para informarles sobre promociones especiales y novedades.</p>
                <button
                  @click="openMembresiaComprobanteModal(3)"
                  class="mt-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Mejorar a Premium
                </button>
              </div>
            </div>
          </div>

          <!-- Histórico de notificaciones -->
          <div
            class="bg-white rounded-xl shadow overflow-hidden border border-gray-100"
            :class="{'opacity-50 pointer-events-none': membresia.id_membresia < 3}"
          >
            <div class="p-4 border-b border-gray-100">
              <h3 class="font-medium text-gray-800">Historial de notificaciones enviadas</h3>
            </div>
            <div v-if="notificaciones.length > 0">
              <div v-for="(notif, index) in notificaciones" :key="index" class="p-4 border-b border-gray-100 last:border-b-0">
                <div class="flex justify-between">
                  <h4 class="font-medium text-gray-800">{{ notif.titulo }}</h4>
                  <span class="text-xs text-gray-500">{{ notif.fecha }}</span>
                </div>
                <p class="text-gray-600 text-sm mt-1">{{ notif.mensaje }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-gray-500">Enviado a: {{ notif.destinatarios }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {{ notif.aperturas }} aperturas
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="p-6 text-center text-gray-500">
              <BellOffIcon :size="32" class="mx-auto text-gray-400 mb-2" />
              <p>No has enviado notificaciones todavía</p>
            </div>
          </div>
        </div>

        <!-- Nueva pestaña: Reportería -->
        <div v-if="currentTab === 'reporteria'" class="space-y-6">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <FileTextIcon :size="20" class="mr-2 text-purple-500" />
                Reportería
              </h2>
              <div v-if="membresia.id_membresia < 3" class="ml-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                Premium
              </div>
            </div>
          </div>

          <!-- Mensaje Premium -->
          <div v-if="membresia.id_membresia < 3" class="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <CrownIcon :size="20" class="text-amber-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <p class="font-medium text-amber-800">Función disponible solo en plan Premium</p>
                <p class="text-amber-700 text-sm mt-1">La sección de reportería te permite generar informes detallados sobre tu negocio y exportarlos en diferentes formatos.</p>
                <button
                  @click="openMembresiaComprobanteModal(3)"
                  class="mt-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Mejorar a Premium
                </button>
              </div>
            </div>
          </div>

          <!-- Contenido de Reportería -->
          <div
            class="bg-white rounded-xl shadow overflow-hidden border border-gray-100"
            :class="{'opacity-50 pointer-events-none': membresia.id_membresia < 3}"
          >
            <div class="p-4 border-b border-gray-100">
              <h3 class="font-medium text-gray-800">Generar reportes</h3>
            </div>

            <div class="p-6">
              <!-- Filtros de reportes -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de reporte</label>
                  <select
                    v-model="reporteActual.tipo"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white-800"
                  >
                    <option value="ventas">Reporte de ventas</option>
                    <option value="productos">Productos más vendidos</option>
                    <option value="financiero">Reporte financiero</option>
                    <option value="pedidos">Reporte de pedidos</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha inicial</label>
                  <input
                    type="date"
                    v-model="reporteActual.fechaInicio"
                    class="w-full px-3 py-2 border border-white-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white-800"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha final</label>
                  <input
                    type="date"
                    v-model="reporteActual.fechaFin"
                    class="w-full px-3 py-2 border border-white-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white-800"
                  >
                </div>
              </div>

              <div class="flex justify-between mb-6">
                <button
                  @click="generarReporte"
                  class="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <BarChartIcon :size="16" class="mr-2" />
                  Generar reporte
                </button>

                <div class="flex space-x-2">
                  <button
                    @click="exportarReporte('excel')"
                    :disabled="!reporteGenerado"
                    :class="reporteGenerado ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
                    class="py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <FileTextIcon :size="16" class="mr-2" />
                    Exportar Excel
                  </button>

                  <button
                    @click="exportarReporte('pdf')"
                    :disabled="!reporteGenerado"
                    :class="reporteGenerado ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
                    class="py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <FileTextIcon :size="16" class="mr-2" />
                    Exportar PDF
                  </button>
                </div>
              </div>

              <!-- Resultado del reporte -->
              <div v-if="reporteGenerado" class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-800 mb-4">
                  {{ getTituloReporte() }}
                  <span class="text-sm font-normal text-gray-600">
                    ({{ formatearFecha(reporteActual.fechaInicio) }} - {{ formatearFecha(reporteActual.fechaFin) }})
                  </span>
                </h4>

                <!-- Contenido del reporte según el tipo -->
                <div v-if="reporteActual.tipo === 'ventas'" class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-50 text-left border-b border-gray-200">
                        <th class="py-2 px-4 text-gray-600 font-medium">Fecha</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Pedidos</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Total</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Método de pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in reporteData" :key="index" :class="{'bg-gray-50': index % 2 === 0}">
                        <td class="py-2 px-4 text-gray-800">{{ formatearFecha(item.fecha) }}</td>
                        <td class="py-2 px-4 text-gray-800">{{ item.pedidos }}</td>
                        <td class="py-2 px-4 text-gray-800">L. {{ item.total.toFixed(2) }}</td>
                        <td class="py-2 px-4 text-gray-800">{{ item.metodo_pago }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="bg-gray-100 font-medium">
                        <td class="py-2 px-4 text-gray-800">Total</td>
                        <td class="py-2 px-4 text-gray-800">{{ totalPedidosReporte }}</td>
                        <td class="py-2 px-4 text-gray-800">L. {{ totalVentasReporte.toFixed(2) }}</td>
                        <td class="py-2 px-4"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div v-else-if="reporteActual.tipo === 'productos'" class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-50 text-left border-b border-gray-200">
                        <th class="py-2 px-4 text-gray-600 font-medium">Producto</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Cantidad vendida</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Precio unitario</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in reporteData" :key="index" :class="{'bg-gray-50': index % 2 === 0}">
                        <td class="py-2 px-4 text-gray-800">{{ item.nombre }}</td>
                        <td class="py-2 px-4 text-gray-800">{{ item.cantidad }}</td>
                        <td class="py-2 px-4 text-gray-800">L. {{ item.precio.toFixed(2) }}</td>
                        <td class="py-2 px-4 text-gray-800">L. {{ (item.cantidad * item.precio).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Reporte financiero -->
                <div v-else-if="reporteActual.tipo === 'financiero'" class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-50 text-left border-b border-gray-200">
                        <th class="py-2 px-4 text-gray-600 font-medium">Concepto</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Ingresos</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Gastos</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-gray-100">
                        <td class="py-2 px-4 text-gray-800 font-medium">Ventas directas</td>
                        <td class="py-2 px-4 text-gray-800">L. 4,250.00</td>
                        <td class="py-2 px-4 text-gray-800">-</td>
                        <td class="py-2 px-4 text-green-600 font-medium">L. 4,250.00</td>
                      </tr>
                      <tr class="border-b border-gray-100 bg-gray-50">
                        <td class="py-2 px-4 text-gray-800 font-medium">Comisiones de app</td>
                        <td class="py-2 px-4 text-gray-800">-</td>
                        <td class="py-2 px-4 text-gray-800">L. 637.50</td>
                        <td class="py-2 px-4 text-red-600 font-medium">L. -637.50</td>
                      </tr>
                      <tr class="border-b border-gray-100">
                        <td class="py-2 px-4 text-gray-800 font-medium">Pedidos extra</td>
                        <td class="py-2 px-4 text-gray-800">-</td>
                        <td class="py-2 px-4 text-gray-800">L. 75.00</td>
                        <td class="py-2 px-4 text-red-600 font-medium">L. -75.00</td>
                      </tr>
                      <tr class="border-b border-gray-100 bg-gray-50">
                        <td class="py-2 px-4 text-gray-800 font-medium">Costo de membresía</td>
                        <td class="py-2 px-4 text-gray-800">-</td>
                        <td class="py-2 px-4 text-gray-800">L. 150.00</td>
                        <td class="py-2 px-4 text-red-600 font-medium">L. -150.00</td>
                      </tr>
                      <tr class="border-b border-gray-100">
                        <td class="py-2 px-4 text-gray-800 font-medium">Descuentos por cupones</td>
                        <td class="py-2 px-4 text-gray-800">-</td>
                        <td class="py-2 px-4 text-gray-800">L. 320.00</td>
                        <td class="py-2 px-4 text-red-600 font-medium">L. -320.00</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="bg-gray-100 font-medium">
                        <td class="py-2 px-4 text-gray-800">Balance total</td>
                        <td class="py-2 px-4 text-gray-800">L. 4,250.00</td>
                        <td class="py-2 px-4 text-gray-800">L. 1,182.50</td>
                        <td class="py-2 px-4 text-blue-600 font-bold">L. 3,067.50</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- Reporte de pedidos -->
                <div v-else-if="reporteActual.tipo === 'pedidos'" class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-50 text-left border-b border-gray-200">
                        <th class="py-2 px-4 text-gray-600 font-medium">#Pedido</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Cliente</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Fecha</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Total</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Estado</th>
                        <th class="py-2 px-4 text-gray-600 font-medium">Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-gray-100">
                        <td class="py-2 px-4 text-gray-800 font-medium">#123456</td>
                        <td class="py-2 px-4 text-gray-800">Laura Martínez</td>
                        <td class="py-2 px-4 text-gray-800">18/07/2023 - 13:25</td>
                        <td class="py-2 px-4 text-gray-800">L. 175.00</td>
                        <td class="py-2 px-4">
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Entregado</span>
                        </td>
                        <td class="py-2 px-4">
                          <button class="text-blue-600 text-sm hover:underline" @click="mostrarDetallePedido">Ver detalle</button>
                        </td>
                      </tr>
                      <tr class="border-b border-gray-100 bg-gray-50">
                        <td class="py-2 px-4 text-gray-800 font-medium">#123457</td>
                        <td class="py-2 px-4 text-gray-800">Carlos Rodríguez</td>
                        <td class="py-2 px-4 text-gray-800">18/07/2023 - 14:10</td>
                        <td class="py-2 px-4 text-gray-800">L. 230.00</td>
                        <td class="py-2 px-4">
                          <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Entregado</span>
                        </td>
                        <td class="py-2 px-4">
                          <button class="text-blue-600 text-sm hover:underline" @click="mostrarDetallePedido">Ver detalle</button>
                        </td>
                      </tr>
                      <tr class="border-b border-gray-100">
                        <td class="py-2 px-4 text-gray-800 font-medium">#123458</td>
                        <td class="py-2 px-4 text-gray-800">Ana López</td>
                        <td class="py-2 px-4 text-gray-800">18/07/2023 - 15:45</td>
                        <td class="py-2 px-4 text-gray-800">L. 150.00</td>
                        <td class="py-2 px-4">
                          <span class="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">En camino</span>
                        </td>
                        <td class="py-2 px-4">
                          <button class="text-blue-600 text-sm hover:underline" @click="mostrarDetallePedido">Ver detalle</button>
                        </td>
                      </tr>
                      <tr class="border-b border-gray-100 bg-gray-50">
                        <td class="py-2 px-4 text-gray-800 font-medium">#123459</td>
                        <td class="py-2 px-4 text-gray-800">Miguel Torres</td>
                        <td class="py-2 px-4 text-gray-800">18/07/2023 - 16:30</td>
                        <td class="py-2 px-4 text-gray-800">L. 320.00</td>
                        <td class="py-2 px-4">
                          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Preparando</span>
                        </td>
                        <td class="py-2 px-4">
                          <button class="text-blue-600 text-sm hover:underline" @click="mostrarDetallePedido">Ver detalle</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Modal para detalles de pedido (se mostraría al hacer clic en "Ver detalle") -->
                  <div v-if="modalPedidoVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                      <div class="flex justify-between items-center p-4 border-b">
                        <h3 class="text-lg font-bold text-gray-800">
                          <ShoppingBagIcon :size="20" class="text-blue-500 inline mr-2" />
                          Detalle del Pedido #123456
                        </h3>
                        <button @click="modalPedidoVisible = false" class="text-gray-500 hover:text-gray-700">
                          <XIcon :size="20" />
                        </button>
                      </div>

                      <div class="p-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 class="font-medium text-gray-700">Información del cliente</h4>
                            <div class="bg-gray-50 p-3 rounded-lg mt-2">
                              <p class="text-sm text-gray-800">
                                <span class="font-medium">Cliente:</span> Laura Martínez
                              </p>
                              <p class="text-sm text-gray-800">
                                <span class="font-medium">Teléfono:</span> +504 9845-6789
                              </p>
                              <p class="text-sm text-gray-800">
                                <span class="font-medium">Dirección:</span> Col. Kennedy, Calle Principal
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 class="font-medium text-gray-700">Información del pedido</h4>
                            <div class="bg-gray-50 p-3 rounded-lg mt-2">
                              <p class="text-sm text-gray-800">
                                <span class="font-medium">Fecha:</span> 18/07/2023 - 13:25
                              </p>
                              <p class="text-sm text-gray-800">
                                <span class="font-medium">Estado:</span>
                                <span class="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">Entregado</span>
                              </p>
                              <p class="text-sm text-gray-800">
                                <span class="font-medium">Método de pago:</span> Efectivo
                              </p>
                            </div>
                          </div>
                        </div>

                        <h4 class="font-medium text-gray-700 mt-4 mb-2">Artículos del pedido</h4>
                        <div class="border border-gray-200 rounded-lg overflow-hidden">
                          <table class="w-full">
                            <thead>
                              <tr class="bg-gray-50 text-left border-b border-gray-200">
                                <th class="py-2 px-4 text-gray-600 font-medium">Producto</th>
                                <th class="py-2 px-4 text-gray-600 font-medium">Cantidad</th>
                                <th class="py-2 px-4 text-gray-600 font-medium">Precio</th>
                                <th class="py-2 px-4 text-gray-600 font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr class="border-b border-gray-100">
                                <td class="py-2 px-4 text-gray-800">Café Americano</td>
                                <td class="py-2 px-4 text-gray-800">2</td>
                                <td class="py-2 px-4 text-gray-800">L. 45.00</td>
                                <td class="py-2 px-4 text-gray-800">L. 90.00</td>
                              </tr>
                              <tr class="border-b border-gray-100 bg-gray-50">
                                <td class="py-2 px-4 text-gray-800">Croissant</td>
                                <td class="py-2 px-4 text-gray-800">1</td>
                                <td class="py-2 px-4 text-gray-800">L. 30.00</td>
                                <td class="py-2 px-4 text-gray-800">L. 30.00</td>
                              </tr>
                              <tr class="border-b border-gray-100">
                                <td class="py-2 px-4 text-gray-800">Jugo Natural</td>
                                <td class="py-2 px-4 text-gray-800">1</td>
                                <td class="py-2 px-4 text-gray-800">L. 40.00</td>
                                <td class="py-2 px-4 text-gray-800">L. 40.00</td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colspan="2" class="py-2 px-4"></td>
                                <td class="py-2 px-4 text-gray-800 font-bold">Total:</td>
                                <td class="py-2 px-4 text-gray-800 font-bold">L. 175.00</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      <div class="p-4 border-t bg-gray-50 flex justify-end">
                        <button
                          @click="modalPedidoVisible = false"
                          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Otros tipos de reportes -->
                <div v-else class="text-center py-4 text-gray-500">
                  <p>Datos del reporte {{ reporteActual.tipo }} generados correctamente.</p>
                </div>
              </div>

              <!-- Estado inicial -->
              <div v-else class="text-center py-10 text-gray-500">
                <BarChartIcon :size="48" class="mx-auto text-gray-300 mb-2" />
                <p>Selecciona los filtros y genera un reporte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

     <!-- Footer -->
     <FooterLocal />

    <!-- MODALES -->

    <!-- Modal para historial de cobros -->
    <transition name="fade">
      <div v-if="modales.historialCobros" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-bold text-gray-800">
              <ReceiptIcon :size="20" class="text-amber-500 inline mr-2" />
              Historial de Cobros
            </h3>
            <button @click="closeModal('historialCobros')" class="text-gray-500 hover:text-gray-700">
              <XIcon :size="20" />
            </button>
          </div>

          <div class="p-4 border-b bg-gray-50">
            <div class="flex flex-wrap gap-2">
              <div class="relative">
                <select
                  v-model="filtroHistorialCobros.mes"
                  class="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-white-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los meses</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
                <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <CalendarIcon :size="16" />
                </span>
              </div>

              <div class="relative">
                <select
                  v-model="filtroHistorialCobros.anio"
                  class="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-white-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los años</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
                <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <CalendarIcon :size="16" />
                </span>
              </div>

              <div class="relative">
                <select
                  v-model="filtroHistorialCobros.estado"
                  class="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-white-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="vencido">Vencido</option>
                </select>
                <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <TagIcon :size="16" />
                </span>
              </div>

              <button
                @click="filtrarHistorialCobros"
                class="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                <SearchIcon :size="16" class="inline mr-1" />
                Filtrar
              </button>
            </div>
          </div>

          <div class="overflow-auto flex-grow">
            <table class="w-full border-collapse">
              <thead class="sticky top-0 bg-white">
                <tr class="text-left text-gray-600 text-sm border-b border-gray-100 bg-gray-50">
                  <th class="py-3 px-4">#Factura</th>
                  <th class="py-3 px-4">Fecha</th>
                  <th class="py-3 px-4">Período</th>
                  <th class="py-3 px-4">Pedidos</th>
                  <th class="py-3 px-8">Comisión</th>
                  <th class="py-3 px-8">Total</th>
                  <th class="py-3 px-4">Estado</th>
                  <th class="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cobro, index) in historialCobrosFiltrado" :key="index"
                    class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-3 px-4 text-gray-700">{{ cobro.num_factura }}</td>
                  <td class="py-3 px-4 text-gray-700">{{ formatearFecha(cobro.fecha_cobro) }}</td>
                  <td class="py-3 px-4 text-gray-700">{{ cobro.periodo_inicio }} - {{ cobro.periodo_fin }}</td>
                  <td class="py-3 px-4 text-gray-700">{{ cobro.num_pedidos }} <span class="text-sm text-gray-400">({{ cobro.pedidos_extra }} extras)</span></td>
                  <td class="py-3 px-4 text-gray-700">L. {{ cobro.comision.toFixed(2) }}</td>
                  <td class="py-3 px-4 text-gray-700">L. {{ cobro.total.toFixed(2) }}</td>
                  <td class="py-3 px-4">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': cobro.estado === 'pagado',
                        'bg-yellow-100 text-yellow-800': cobro.estado === 'pendiente',
                        'bg-red-100 text-red-800': cobro.estado === 'vencido'
                      }"
                      class="px-2 py-1 rounded-full text-xs"
                    >
                      {{ cobro.estado === 'pagado' ? 'Pagado' : cobro.estado === 'pendiente' ? 'Pendiente' : 'Vencido' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <button @click="verDetalleCobro(cobro)" class="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <EyeIcon :size="18" />
                    </button>
                    <button v-if="cobro.estado !== 'pagado'" @click="pagarCobro(cobro)" class="p-1 ml-1 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                      <DollarSignIcon :size="18" />
                    </button>
                  </td>
                </tr>
                <tr v-if="historialCobrosFiltrado.length === 0">
                  <td colspan="8" class="py-6 text-center text-gray-500">
                    No se encontraron registros de cobros con los filtros aplicados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-4 border-t bg-gray-50 flex justify-between items-center">
            <div class="text-sm text-gray-600">
              Mostrando {{ historialCobrosFiltrado.length }} de {{ historialCobros.length }} registros
            </div>
            <button
              @click="exportarHistorialCobros"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center"
            >
              <DownloadIcon :size="16" class="mr-1" />
              Exportar historial
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para subir comprobante de membresía -->
    <transition name="fade">
  <div v-if="modales.membresiaComprobante" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
      <div class="flex justify-between items-center p-3 border-b">
        <h3 class="text-base font-bold text-gray-800">Comprobante de Pago - {{ getTipoMembresiaNombre(modalData.idMembresiaSeleccionada) }}</h3>
        <button @click="closeModal('membresiaComprobante')" class="text-gray-500 hover:text-gray-700">
          <XIcon :size="20" />
        </button>
      </div>
      <div class="p-4">
        <div class="mb-4 bg-blue-50 p-3 rounded-lg">
          <h4 class="font-medium text-blue-800 mb-2">Detalles del Plan</h4>
          <p class="text-gray-700 text-sm flex justify-between border-b pb-1">
            <span>Plan:</span> <span class="font-medium">{{ getTipoMembresiaNombre(modalData.idMembresiaSeleccionada) }}</span>
          </p>
          <p class="text-gray-700 text-sm flex justify-between border-b pb-1">
            <span>Precio:</span> <span class="font-medium">L. {{ getPrecioMembresia(modalData.idMembresiaSeleccionada) }}</span>
          </p>
          <p class="text-gray-700 text-sm flex justify-between">
            <span>Duración:</span> <span class="font-medium">1 semana</span>
          </p>
        </div>

        <div class="mb-4">
          <h4 class="font-medium text-gray-800 mb-2">Información de Pago</h4>
          <p class="text-xs text-gray-600 mb-3">
            Realiza tu pago a cualquiera de nuestras cuentas y sube el comprobante:
          </p>
          <div class="bg-gray-50 p-2 rounded-lg text-sm">
            <p class="font-medium text-gray-800">Banco Atlántida</p>
            <p class="text-gray-700">Cuenta: 1234-5678-9012-3456</p>
          </div>
          <div class="bg-gray-50 p-2 rounded-lg text-sm mt-2">
            <p class="font-medium text-gray-800">BAC Credomatic</p>
            <p class="text-gray-700">Cuenta: 9876-5432-1098-7654</p>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-700 mb-1">Subir comprobante de pago</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <input type="file" id="comprobante" class="hidden" accept="image/*" @change="previewComprobante">
            <label for="comprobante" class="cursor-pointer">
              <div v-if="!modalData.comprobantePreview" class="space-y-1">
                <UploadIcon :size="28" class="mx-auto text-gray-400" />
                <p class="text-gray-500 text-sm">Haz clic para subir comprobante</p>
              </div>
              <div v-else>
                <img :src="modalData.comprobantePreview" class="max-h-36 mx-auto mb-1 rounded-lg">
                <p class="text-xs text-blue-600">Haz clic para cambiar archivo</p>
              </div>
            </label>
          </div>
        </div>

        <div class="flex items-center mb-4">
          <input type="checkbox" id="terminos" v-model="modalData.aceptaTerminos" class="h-4 w-4 text-blue-600 border-gray-300 rounded">
          <label for="terminos" class="text-xs text-gray-700 ml-2">Acepto los términos y condiciones</label>
        </div>
      </div>

      <div class="p-3 border-t bg-gray-50 flex justify-end space-x-2">
        <button @click="closeModal('membresiaComprobante')" class="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs">
          Cancelar
        </button>
        <button
          @click="enviarComprobante"
          :disabled="!canSubmitComprobante"
          :class="canSubmitComprobante ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
          class="px-3 py-1 rounded-lg text-xs"
        >
          Enviar comprobante
        </button>
      </div>
    </div>
  </div>
</transition>


    <!-- Modal de notificaciones personalizadas (solo Premium) -->
    <transition name="fade">
      <div v-if="modales.notificacionPersonalizada" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-bold text-gray-800">
              <BellIcon :size="20" class="text-amber-500 inline mr-2" />
              Enviar Notificación Personalizada
            </h3>
            <button @click="closeModal('notificacionPersonalizada')" class="text-gray-500 hover:text-gray-700">
              <XIcon :size="20" />
            </button>
          </div>
          <div class="p-6">
            <div v-if="membresia.id_membresia < 3" class="bg-amber-50 text-amber-800 p-4 rounded-lg mb-4">
              <div class="flex items-start">
                <CrownIcon :size="20" class="text-amber-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p class="font-bold">Función Premium</p>
                  <p class="text-sm">Esta función está disponible solo para miembros Premium.</p>
                  <button @click="openUpgradeModal(); closeModal('notificacionPersonalizada')" class="mt-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity">
                    Mejorar Plan
                  </button>
                </div>
              </div>
            </div>

            <div :class="{'opacity-50 pointer-events-none': membresia.id_membresia < 3}">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Título de la notificación</label>
                <input
                  type="text"
                  v-model="modalData.notificacion.titulo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Ej: Nueva promoción disponible"
                >
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea
                  v-model="modalData.notificacion.mensaje"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Ej: ¡Aprovecha nuestro descuento del 25% en todos nuestros productos este fin de semana!"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de destinatario</label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="destinatario" value="todos" v-model="modalData.notificacion.tipo_destinatario" class="mr-2">
                    <div>
                      <p class="font-medium text-gray-800">Todos los clientes</p>
                      <p class="text-xs text-gray-500">Notificación masiva</p>
                    </div>
                  </label>
                  <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="destinatario" value="recurrentes" v-model="modalData.notificacion.tipo_destinatario" class="mr-2">
                    <div>
                      <p class="font-medium text-gray-800">Clientes recurrentes</p>
                      <p class="text-xs text-gray-500">Solo clientes frecuentes</p>
                    </div>
                  </label>
                </div>
              </div>

              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700">Vista previa:</label>
                  <span class="text-xs text-gray-500">Como se verá en dispositivos móviles</span>
                </div>
                <div class="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div class="flex items-start">
                    <div class="bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center">
                      <TruckIcon :size="20" />
                    </div>
                    <div class="ml-3">
                      <p class="font-bold text-gray-800">{{ modalData.notificacion.titulo || 'Título de la notificación' }}</p>
                      <p class="text-sm text-gray-600 line-clamp-2">{{ modalData.notificacion.mensaje || 'Aquí aparecerá el mensaje de la notificación.' }}</p>
                      <p class="text-xs text-gray-500 mt-1">DeliveryPro • {{ formatearFecha(new Date()) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 border-t bg-gray-50 flex justify-end space-x-2">
            <button @click="closeModal('notificacionPersonalizada')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              Cancelar
            </button>
            <button
              @click="enviarNotificacion"
              :disabled="!canEnviarNotificacion || membresia.id_membresia < 3"
              :class="canEnviarNotificacion && membresia.id_membresia >= 3 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              class="px-4 py-2 rounded-lg text-sm"
            >
              Enviar notificación
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para crear/editar cupón -->
    <transition name="fade">
      <div v-if="modales.cupon" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-bold text-gray-800">
              <TicketIcon :size="20" class="text-green-500 inline mr-2" />
              {{ modalData.isEdit ? 'Editar Cupón' : 'Crear Nuevo Cupón' }}
            </h3>
            <button @click="closeModal('cupon')" class="text-gray-500 hover:text-gray-700">
              <XIcon :size="20" />
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Código de cupón</label>
                <input
                  type="text"
                  v-model="modalData.cupon.codigo_cupon"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Ej: VERANO2023"
                  :disabled="modalData.isEdit"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de descuento</label>
                <select
                  v-model="modalData.cupon.tipo_descuento"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="fijo">Monto Fijo (L)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ modalData.cupon.tipo_descuento === 'porcentaje' ? 'Porcentaje de descuento' : 'Monto de descuento' }}
                </label>
                <div class="relative">
                  <input
                    type="number"
                    v-model="modalData.cupon.descuento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    :placeholder="modalData.cupon.tipo_descuento === 'porcentaje' ? '10' : '100'"
                    :min="0"
                    :max="modalData.cupon.tipo_descuento === 'porcentaje' ? 100 : null"
                  >
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span class="text-gray-500">{{ modalData.cupon.tipo_descuento === 'porcentaje' ? '%' : 'L' }}</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Límite de uso</label>
                <input
                  type="number"
                  v-model="modalData.cupon.limite_uso"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="100"
                >
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de vencimiento</label>
              <input
                type="date"
                v-model="modalData.cupon.fecha_vencimiento"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                :min="new Date().toISOString().split('T')[0]"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">URL de imagen (opcional)</label>
              <input
                type="text"
                v-model="modalData.cupon.imagen_url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="https://ejemplo.com/imagen.jpg"
              >
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="modalData.cupon.activo"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700">Cupón activo</span>
              </label>
            </div>
          </div>
          <div class="p-4 border-t bg-gray-50 flex justify-end space-x-2">
            <button @click="closeModal('cupon')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              Cancelar
            </button>
            <button
              @click="guardarCupon"
              :disabled="!isValidCupon"
              :class="isValidCupon ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              class="px-4 py-2 rounded-lg text-sm"
            >
              {{ modalData.isEdit ? 'Actualizar' : 'Crear' }} cupón
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para crear/editar sucursal con mapa Leaflet -->
    <transition name="fade">
      <div v-if="modales.sucursal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-bold text-gray-800">
              <StoreIcon :size="20" class="text-indigo-500 inline mr-2" />
              {{ modalData.isEdit ? 'Editar Sucursal' : 'Agregar Nueva Sucursal' }}
            </h3>
            <button @click="closeModal('sucursal')" class="text-gray-500 hover:text-gray-700">
              <XIcon :size="20" />
            </button>
          </div>

          <div class="p-4 overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la sucursal</label>
                  <input
                    type="text"
                    v-model="modalData.sucursal.nombre"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Ej: Sucursal Central"
                  >
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <select
                      v-model="modalData.sucursal.ciudad"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                      <option value="">Seleccionar ciudad</option>
                      <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Colonia</label>
                    <input
                      type="text"
                      v-model="modalData.sucursal.colonia"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Ej: Kennedy"
                    >
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Dirección precisa</label>
                  <textarea
                    v-model="modalData.sucursal.direccion_precisa"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Ej: Calle principal, frente a farmacia XYZ"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Latitud</label>
                    <input
                      type="text"
                      v-model="modalData.sucursal.lat"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="14.0723"
                      readonly
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Longitud</label>
                    <input
                      type="text"
                      v-model="modalData.sucursal.long"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="-87.1921"
                      readonly
                    >
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Hora de apertura</label>
                    <input
                      type="time"
                      v-model="modalData.sucursal.apertura"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Hora de cierre</label>
                    <input
                      type="time"
                      v-model="modalData.sucursal.cierre"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                  </div>
                </div>

                <div class="mb-4">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="modalData.sucursal.activo"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700">Sucursal activa</span>
                  </label>
                </div>

                <p class="text-xs text-gray-500 mb-2">Selecciona la ubicación exacta en el mapa haciendo clic en el punto deseado</p>
              </div>

              <!-- Mapa Leaflet -->
              <div class="h-96 border border-gray-300 rounded-lg overflow-hidden">
                <div id="mapaSucursal" class="h-full"></div>
              </div>
            </div>
          </div>

          <div class="p-4 border-t bg-gray-50 flex justify-end space-x-2">
            <button @click="closeModal('sucursal')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              Cancelar
            </button>
            <button
              @click="guardarSucursal"
              :disabled="!isValidSucursal"
              :class="isValidSucursal ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              class="px-4 py-2 rounded-lg text-sm"
            >
              {{ modalData.isEdit ? 'Actualizar' : 'Agregar' }} sucursal
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para crear/editar banner -->
    <transition name="fade">
      <div v-if="modales.banner" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-bold text-gray-800">
              <ImageIcon :size="20" class="text-red-500 inline mr-2" />
              {{ modalData.isEdit ? 'Editar Banner' : 'Crear Nuevo Banner' }}
            </h3>
            <button @click="closeModal('banner')" class="text-gray-500 hover:text-gray-700">
              <XIcon :size="20" />
            </button>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input
                type="text"
                v-model="modalData.banner.titulo"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Ej: Oferta de Verano"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                v-model="modalData.banner.descripcion"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Ej: Descuentos especiales durante toda la temporada"
              ></textarea>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">URL destino</label>
              <input
                type="text"
                v-model="modalData.banner.url_destino"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="https://ejemplo.com/promocion"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">URL de imagen</label>
              <input
                type="text"
                v-model="modalData.banner.imagen_url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="https://ejemplo.com/imagen.jpg"
              >
              <p class="text-xs text-gray-500 mt-1">Recomendado: 1200x400 píxeles</p>
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="modalData.banner.activo"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700">Banner activo</span>
              </label>
            </div>

            <!-- Vista previa del banner -->
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 py-2 px-3 border-b border-gray-200">
                <p class="text-xs text-gray-600">Vista previa</p>
              </div>
              <div class="relative h-32">
                <img
                  :src="modalData.banner.imagen_url || 'https://via.placeholder.com/1200x400/f3f4f6/9ca3af?text=Imagen+del+Banner'"
                  alt="Vista previa"
                  class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                  <div class="p-3 text-white w-full">
                    <h3 class="font-bold truncate">{{ modalData.banner.titulo || 'Título del Banner' }}</h3>
                    <p class="text-sm opacity-90 truncate">{{ modalData.banner.descripcion || 'Descripción del banner' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 border-t bg-gray-50 flex justify-end space-x-2">
            <button @click="closeModal('banner')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              Cancelar
            </button>
            <button
              @click="guardarBanner"
              :disabled="!isValidBanner"
              :class="isValidBanner ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              class="px-4 py-2 rounded-lg text-sm"
            >
              {{ modalData.isEdit ? 'Actualizar' : 'Crear' }} banner
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal para ver detalle de cobro -->
    <transition name="fade">
      <div v-if="modales.detalleCobro" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-bold text-gray-800">
              <ReceiptIcon :size="20" class="text-amber-500 inline mr-2" />
              Detalle de Cobro #{{ cobroSeleccionado?.num_factura }}
            </h3>
            <button @click="closeModal('detalleCobro')" class="text-gray-500 hover:text-gray-700">
              <XIcon :size="20" />
            </button>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="font-medium text-gray-800 mb-3">Información del cobro</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="flex justify-between py-2 border-b border-gray-200">
                    <span class="text-gray-600">Número de factura:</span>
                    <span class="font-medium text-gray-800">{{ cobroSeleccionado?.num_factura }}</span>
                  </p>
                  <p class="flex justify-between py-2 border-b border-gray-200">
                    <span class="text-gray-600">Fecha de cobro:</span>
                    <span class="font-medium text-gray-800">{{ formatearFecha(cobroSeleccionado?.fecha_cobro) }}</span>
                  </p>
                  <p class="flex justify-between py-2 border-b border-gray-200">
                    <span class="text-gray-600">Período:</span>
                    <span class="font-medium text-gray-800">{{ cobroSeleccionado?.periodo_inicio }} - {{ cobroSeleccionado?.periodo_fin }}</span>
                  </p>
                  <p class="flex justify-between py-2">
                    <span class="text-gray-600">Estado:</span>
                    <span
                      :class="{
                        'text-green-600': cobroSeleccionado?.estado === 'pagado',
                        'text-yellow-600': cobroSeleccionado?.estado === 'pendiente',
                        'text-red-600': cobroSeleccionado?.estado === 'vencido'
                      }"
                      class="font-medium"
                    >
                      {{ cobroSeleccionado?.estado === 'pagado' ? 'Pagado' : cobroSeleccionado?.estado === 'pendiente' ? 'Pendiente' : 'Vencido' }}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-800 mb-3">Resumen de cobro</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="flex justify-between py-2 border-b border-gray-200">
                    <span class="text-gray-600">Pedidos incluidos:</span>
                    <span class="font-medium text-gray-800">{{ cobroSeleccionado?.num_pedidos }}</span>
                  </p>
                  <p class="flex justify-between py-2 border-b border-gray-200">
                    <span class="text-gray-600">Pedidos extra:</span>
                    <span class="font-medium text-gray-800">{{ cobroSeleccionado?.pedidos_extra }}</span>
                  </p>
                  <p class="flex justify-between py-2 border-b border-gray-200">
                    <span class="text-gray-600">Costo por pedidos extra:</span>
                    <span class="font-medium text-gray-800">L. {{ cobroSeleccionado?.costo_pedidos_extra.toFixed(2) }}</span>
                  </p>
                  <p class="flex justify-between py-2 border-b border-gray-200">
                    <span class="text-gray-600">Comisión app (15%):</span>
                    <span class="font-medium text-gray-800">L. {{ cobroSeleccionado?.comision.toFixed(2) }}</span>
                  </p>
                  <p class="flex justify-between py-2 text-lg">
                    <span class="font-bold text-gray-800">Total:</span>
                    <span class="font-bold text-gray-800">L. {{ cobroSeleccionado?.total.toFixed(2) }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Lista de pedidos incluidos en el cobro -->
            <div>
              <h4 class="font-medium text-gray-800 mb-3">Pedidos incluidos</h4>
              <div class="overflow-x-auto border border-gray-200 rounded-lg">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gray-50 text-left text-gray-600 text-sm border-b border-gray-200">
                      <th class="py-2 px-4">#Pedido</th>
                      <th class="py-2 px-4">Cliente</th>
                      <th class="py-2 px-4">Fecha</th>
                      <th class="py-2 px-4">Total</th>
                      <th class="py-2 px-4">Comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(pedido, index) in cobroSeleccionado?.pedidos" :key="index"
                        :class="{'bg-gray-50': index % 2 === 0}">
                      <td class="py-2 px-4 font-medium text-gray-800">{{ pedido.num_pedido }}</td>
                      <td class="py-2 px-4 text-gray-800">{{ pedido.cliente }}</td>
                      <td class="py-2 px-4 text-gray-800">{{ formatearFecha(pedido.fecha) }}</td>
                      <td class="py-2 px-4 text-gray-800">L. {{ pedido.total.toFixed(2) }}</td>
                      <td class="py-2 px-4 text-gray-800">L. {{ pedido.comision.toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="p-4 border-t bg-gray-50 flex justify-between">
            <button
              @click="imprimirComprobante"
              class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center"
            >
              <PrinterIcon :size="16" class="mr-1" />
              Imprimir comprobante
            </button>

            <button
              v-if="cobroSeleccionado?.estado !== 'pagado'"
              @click="pagarCobro(cobroSeleccionado); closeModal('detalleCobro')"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm flex items-center"
            >
              <DollarSignIcon :size="16" class="mr-1" />
              Realizar pago
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import HeaderLocal from '../components/HeaderLocal.vue';
import LocalInfoHeader from '../components/dashboard-local/LocalInfoHeader.vue';
import StatusCards from '../components/dashboard-local/StatusCards.vue';
import Chart from 'chart.js/auto';
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  BellOff as BellOffIcon,
  User as UserIcon,
  MapPin as MapPinIcon,
  Map as MapIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  Box as BoxIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Image as ImageIcon,
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  Crown as CrownIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Check as CheckIcon,
  X as XIcon,
  Upload as UploadIcon,
  Trophy as TrophyIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  FileText as FileTextIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  Ban as BanIcon,
  Lock as LockIcon,
  Ticket as TicketIcon,
  Eye as EyeIcon,
  Printer as PrinterIcon,
  Calendar as CalendarIcon,
  Tag as TagIcon,
  Search as SearchIcon,
  Download as DownloadIcon
} from 'lucide-vue-next';
// Estado de la aplicación
const currentTab = ref('planes');
const fuenteDatos = ref('mock'); // 'mock' o 'api'
const ventasChart = ref(null);
const productosChart = ref(null);
const selectedProfile = ref('Local');
const fechaProximoCobro = ref(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
let mapaSucursal = null;
let marcadorSucursal = null;
let socketConexion = null;
const modalPedidoVisible = ref(false);

// Lista de pestañas con la nueva pestaña de reportería
const tabs = [
  { id: 'planes', name: 'Planes', icon: CrownIcon },
  { id: 'cupones', name: 'Cupones', icon: TicketIcon },
  { id: 'sucursales', name: 'Sucursales', icon: StoreIcon },
  { id: 'banners', name: 'Banners', icon: ImageIcon },
  { id: 'estadisticas', name: 'Estadísticas', icon: BarChartIcon },
  { id: 'notificaciones', name: 'Notificaciones', icon: BellIcon },
  { id: 'reporteria', name: 'Reportería', icon: FileTextIcon }
];

// Control de modales
const modales = ref({
  notificaciones: false,
  banner: false,
  cupon: false,
  sucursal: false,
  membresiaComprobante: false,
  notificacionPersonalizada: false,
  historialCobros: false,
  detalleCobro: false
});

// Datos para los modales
const modalData = ref({
  isEdit: false,
  banner: {},
  cupon: {},
  sucursal: {},
  idMembresiaSeleccionada: 1,
  comprobantePreview: null,
  aceptaTerminos: false,
  notificacion: {
    titulo: '',
    mensaje: '',
    tipo_destinatario: 'todos'
  }
});

// Mock data para el local
const local = ref({
  id_local: 10,
  id_cliente: 1,
  id_membresia: 1, // 1: Gratuita, 2: Básica, 3: Premium
  nombre_local: "Café del Valle",
  apertura: "06:30:00",
  cierre: "22:00:00",
  rtn: "08019999123456",
  imagen_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  activo: true,
  pedidos_restantes: 3,
  recomendaciones_restantes: 0,
  usuario_empleado: "admin_cafe"
});

// Membresía actual
const membresia = ref({
  id_membresia: 1,
  nombre: "Gratuita",
  precio: 0,
  deliveries_gratuitos: 5,
  precio_delivery_extra: 25
});

// Lista de ciudades para sucursales
const ciudades = ref([
  'Tegucigalpa',
  'San Pedro Sula',
  'La Ceiba',
  'Choloma',
  'El Progreso',
  'Choluteca',
  'Comayagua',
  'Puerto Cortés',
  'Danlí',
  'Juticalpa'
]);

// Datos de ventas de productos esta semana (MODIFICACIÓN: máximo 10 ventas por producto)
const productosVendidosSemana = ref([
  { nombre: 'Café Americano', cantidad: 8, precio: 45.00 },
  { nombre: 'Cappuccino', cantidad: 6, precio: 60.00 },
  { nombre: 'Latte', cantidad: 5, precio: 55.00 },
  { nombre: 'Croissant', cantidad: 10, precio: 30.00 },
  { nombre: 'Sándwich de pollo', cantidad: 4, precio: 85.00 },
  { nombre: 'Jugo natural', cantidad: 7, precio: 40.00 },
  { nombre: 'Pastel de chocolate', cantidad: 3, precio: 50.00 }
]);

// Calcular total de ventas de la semana
const totalVentasSemana = computed(() => {
  return productosVendidosSemana.value.reduce((total, producto) => {
    return total + (producto.cantidad * producto.precio);
  }, 0).toFixed(2);
});

// Cupones
const cupones = ref([
  {
    id_cupon: 1,
    codigo_cupon: 'BIENVENIDA',
    tipo_descuento: 'porcentaje',
    descuento: 15,
    limite_uso: 100,
    usos_actuales: 45,
    fecha_vencimiento: '2023-12-31',
    imagen_url: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49',
    activo: true
  },
  {
    id_cupon: 2,
    codigo_cupon: 'VERANO2023',
    tipo_descuento: 'fijo',
    descuento: 50,
    limite_uso: 200,
    usos_actuales: 78,
    fecha_vencimiento: '2023-09-30',
    imagen_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
    activo: true
  },
  {
    id_cupon: 3,
    codigo_cupon: 'CUMPLEAÑOS',
    tipo_descuento: 'porcentaje',
    descuento: 25,
    limite_uso: 500,
    usos_actuales: 120,
    fecha_vencimiento: '2023-12-31',
    imagen_url: 'https://images.unsplash.com/photo-1513267048331-5611cad62e41',
    activo: false
  }
]);

// Sucursales
const sucursales = ref([
  {
    id_sucursal: 1,
    id_local: 1,
    nombre: "Sucursal Central",
    ciudad: "Tegucigalpa",
    colonia: "Kennedy",
    direccion_precisa: "Calle principal, frente a Centro Comercial",
    lat: "14.0723",
    long: "-87.1921",
    apertura: "07:00:00",
    cierre: "21:00:00",
    activo: true
  },
  {
    id_sucursal: 2,
    id_local: 1,
    nombre: "Sucursal Mall Multiplaza",
    ciudad: "Tegucigalpa",
    colonia: "Los Proceres",
    direccion_precisa: "Mall Multiplaza, Local 105, segundo nivel",
    lat: "14.0810",
    long: "-87.1892",
    apertura: "09:00:00",
    cierre: "22:00:00",
    activo: true
  }
]);

// Banners publicitarios
const banners = ref([
  {
    id_banner: 1,
    id_local: 1,
    titulo: "Café 2x1 los Lunes",
    descripcion: "Promoción exclusiva para los lunes. Llévate 2 cafés por el precio de 1 de 2pm a 5pm.",
    imagen_url: "https://images.unsplash.com/photo-1453614512568-c4024d13c247",
    url_destino: "https://www.example.com/promo/cafe2x1",
    activo: true
  },
  {
    id_banner: 2,
    id_local: 1,
    titulo: "Nuevo Menú de Desayunos",
    descripcion: "Disfruta de nuestro nuevo menú de desayunos completos desde las 6:30am. Variedad de opciones saludables.",
    imagen_url: "https://images.unsplash.com/photo-1496042399014-47506e54c9f7",
    url_destino: "https://www.example.com/menu/desayunos",
    activo: true
  },
  {
    id_banner: 3,
    id_local: 1,
    titulo: "Tarjeta de Cliente Frecuente",
    descripcion: "Obtén nuestra tarjeta de cliente frecuente y acumula puntos por cada compra. ¡Canjea tus puntos por productos gratis!",
    imagen_url: "https://images.unsplash.com/photo-1579208570378-8c970854bc23",
    url_destino: "https://www.example.com/tarjeta-fidelidad",
    activo: false
  }
]);

// Notificaciones enviadas
const notificaciones = ref([
  {
    id: 1,
    titulo: "Nueva promoción de verano",
    mensaje: "¡Este verano disfruta de un 20% de descuento en todas nuestras bebidas frías!",
    fecha: "10/06/2023",
    destinatarios: "Todos los clientes",
    aperturas: 145
  },
  {
    id: 2,
    titulo: "Menú especial de fin de semana",
    mensaje: "Este fin de semana prueba nuestro nuevo menú de brunch disponible de 9am a 1pm.",
    fecha: "25/05/2023",
    destinatarios: "Clientes recurrentes",
    aperturas: 87
  }
]);

// Notificaciones del sistema
const notifications = ref([
  { id: 1, message: "Nuevo pedido recibido #4302", read: false },
  { id: 2, message: "Tu membresía vence en 3 días", read: false },
  { id: 3, message: "Nueva queja recibida", read: true }
]);

// Estadísticas del local
const estadisticas = ref({
  pedidos_semanales: 38,
  ingresos_semanales: 4560.75,
  tendencia_pedidos: 14,
  tendencia_ingresos: 8,
  pedidosHoy: 23,
  pedidosTendencia: 14,
  ingresosHoy: 1560.75,
  ingresosTendencia: 8,
  ventasSemanalesTendencia: 12,
  quejasTendencia: -5,
  datosVentas: [
    { fecha: '2023-06-13', ventas: 3200 }, // Lunes
    { fecha: '2023-06-14', ventas: 4100 }, // Martes
    { fecha: '2023-06-15', ventas: 3800 }, // Miércoles
    { fecha: '2023-06-16', ventas: 4500 }, // Jueves
    { fecha: '2023-06-17', ventas: 5200 }, // Viernes
    { fecha: '2023-06-18', ventas: 4800 }, // Sábado
    { fecha: '2023-06-19', ventas: 3900 },  // Domingo
  ],
  productosMasVendidos: [
    { nombre: 'Café Americano', ventas: 120 },
    { nombre: 'Croissant', ventas: 85 },
    { nombre: 'Latte', ventas: 75 },
    { nombre: 'Sandwich de Pollo', ventas: 60 },
    { nombre: 'Jugo Natural', ventas: 45 }
  ]
});

// Top 3 clientes más frecuentes (periodo semanal)
const clientesFrecuentes = ref([
  {
    id_cliente: 12,
    nombre: "Laura Martínez",
    email: "laura.martinez@gmail.com",
    num_pedidos: 6,
    total_gastado: 450.75,
    cliente_desde: "Ene 2023"
  },
  {
    id_cliente: 8,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@gmail.com",
    num_pedidos: 5,
    total_gastado: 400.50,
    cliente_desde: "Feb 2023"
  },
  {
    id_cliente: 15,
    nombre: "Ana López",
    email: "ana.lopez@gmail.com",
    num_pedidos: 3,
    total_gastado: 350.25,
    cliente_desde: "Mar 2023"
  }
]);

// Cliente individual (referencia antigua, mantener por compatibilidad)
const clienteFrecuente = ref({
  id_cliente: 12,
  nombre: "Laura Martínez",
  email: "laura.martinez@gmail.com",
  foto_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  num_pedidos: 28,
  total_gastado: 3450.75,
  cliente_desde: "Ene 2023"
});

// Ranking en categoría
const rankingCategoria = ref({
  categoria: "Cafeterías",
  posicion: 3,
  total_locales: 15,
  top5: [
    { nombre: "Café Estrella", ventas_total: 6850 },
    { nombre: "Coffee House", ventas_total: 5420 },
    { nombre: "Café del Valle", ventas_total: 4560 },
    { nombre: "El Barista", ventas_total: 3980 },
    { nombre: "Morning Coffee", ventas_total: 3520 }
  ]
});

// Pedidos extra y cobros
const pedidosExtra = ref(8);
const comisionSemanal = ref(684.15);

// Historial de cobros
const historialCobros = ref([
  {
    num_factura: 'FA-2023-0045',
    fecha_cobro: '2023-06-18',
    periodo_inicio: '12/06/2023',
    periodo_fin: '18/06/2023',
    num_pedidos: 8,
    pedidos_extra: 3,
    costo_pedidos_extra: 75.00,
    comision: 920.00,
    total: 995.00,
    estado: 'pendiente',
    pedidos: [
      { num_pedido: 'PD-4298', cliente: 'Juan Pérez', fecha: '2023-06-13', total: 200.00, comision: 30.00 },
      { num_pedido: 'PD-4302', cliente: 'María González', fecha: '2023-06-13', total: 245.75, comision: 36.75 },
      { num_pedido: 'PD-4315', cliente: 'Carlos Rodríguez', fecha: '2023-06-13', total: 13.00, comision: 20.25 }
    ]
  },
  {
    num_factura: 'FA-2023-0039',
    fecha_cobro: '2023-06-11',
    periodo_inicio: '05/06/2023',
    periodo_fin: '11/06/2023',
    num_pedidos: 42,
    pedidos_extra: 12,
    costo_pedidos_extra: 180.00,
    comision: 720.30,
    total: 900.30,
    estado: 'pagado',
    pedidos: [
      { num_pedido: 'PD-4265', cliente: 'Laura Martínez', fecha: '2023-06-05', total: 210.25, comision: 31.54 },
      { num_pedido: 'PD-4270', cliente: 'Roberto Sánchez', fecha: '2023-06-07', total: 185.00, comision: 27.75 },
      { num_pedido: 'PD-4285', cliente: 'Ana López', fecha: '2023-06-10', total: 155.50, comision: 23.33 }
    ]
  },
  {
    num_factura: 'FA-2023-0032',
    fecha_cobro: '2023-06-04',
    periodo_inicio: '29/05/2023',
    periodo_fin: '04/06/2023',
    num_pedidos: 35,
    pedidos_extra: 5,
    costo_pedidos_extra: 75.00,
    comision: 625.20,
    total: 700.20,
    estado: 'pagado',
    pedidos: [
      { num_pedido: 'PD-4230', cliente: 'Pedro García', fecha: '2023-05-30', total: 145.75, comision: 21.86 },
      { num_pedido: 'PD-4238', cliente: 'Sofía Hernández', fecha: '2023-05-31', total: 195.30, comision: 29.30 },
      { num_pedido: 'PD-4250', cliente: 'Miguel Torres', fecha: '2023-06-02', total: 165.00, comision: 24.75 }
    ]
  }
]);

// Filtro para historial de cobros
const filtroHistorialCobros = ref({
  mes: '',
  anio: '',
  estado: ''
});

// Cobro seleccionado para ver detalle
const cobroSeleccionado = ref(null);

// Historial de cobros filtrado
const historialCobrosFiltrado = computed(() => {
  let resultado = [...historialCobros.value];

  if (filtroHistorialCobros.value.mes) {
    resultado = resultado.filter(cobro => {
      const fechaCobro = new Date(cobro.fecha_cobro);
      return (fechaCobro.getMonth() + 1).toString() === filtroHistorialCobros.value.mes;
    });
  }

  if (filtroHistorialCobros.value.anio) {
    resultado = resultado.filter(cobro => {
      const fechaCobro = new Date(cobro.fecha_cobro);
      return fechaCobro.getFullYear().toString() === filtroHistorialCobros.value.anio;
    });
  }

  if (filtroHistorialCobros.value.estado) {
    resultado = resultado.filter(cobro => cobro.estado === filtroHistorialCobros.value.estado);
  }

  return resultado;
});

// Datos para la sección de reportería
const reporteActual = ref({
  tipo: 'ventas',
  fechaInicio: new Date().toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0]
});

const reporteGenerado = ref(false);
const reporteData = ref([]);

// Total de pedidos y ventas para el reporte
const totalPedidosReporte = computed(() => {
  if (reporteActual.value.tipo !== 'ventas' || !reporteData.value.length) return 0;
  return reporteData.value.reduce((total, item) => total + item.pedidos, 0);
});

const totalVentasReporte = computed(() => {
  if (reporteActual.value.tipo !== 'ventas' || !reporteData.value.length) return 0;
  return reporteData.value.reduce((total, item) => total + item.total, 0);
});

// Computed para contar notificaciones no leídas
const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read);
});

// Computed para validar el envío del comprobante
const canSubmitComprobante = computed(() => {
  return modalData.value.comprobantePreview && modalData.value.aceptaTerminos;
});

// Computed para validar formulario de notificación
const canEnviarNotificacion = computed(() => {
  return modalData.value.notificacion.titulo.trim() !== '' &&
         modalData.value.notificacion.mensaje.trim() !== '' &&
         modalData.value.notificacion.tipo_destinatario !== '';
});

// Computed para validar formulario de cupón
const isValidCupon = computed(() => {
  const cupon = modalData.value.cupon;
  return cupon.codigo_cupon &&
         cupon.codigo_cupon.trim() !== '' &&
         cupon.tipo_descuento &&
         cupon.descuento > 0 &&
         cupon.limite_uso > 0 &&
         cupon.fecha_vencimiento;
});

// Computed para validar formulario de sucursal
const isValidSucursal = computed(() => {
  const sucursal = modalData.value.sucursal;
  return sucursal.nombre &&
         sucursal.nombre.trim() !== '' &&
         sucursal.ciudad &&
         sucursal.colonia &&
         sucursal.colonia.trim() !== '' &&
         sucursal.direccion_precisa &&
         sucursal.direccion_precisa.trim() !== '' &&
         sucursal.lat &&
         sucursal.long &&
         sucursal.apertura &&
         sucursal.cierre;
});

// Computed para validar formulario de banner
const isValidBanner = computed(() => {
  const banner = modalData.value.banner;
  return banner.titulo &&
         banner.titulo.trim() !== '' &&
         banner.descripcion &&
         banner.descripcion.trim() !== '' &&
         banner.url_destino &&
         banner.url_destino.trim() !== '' &&
         banner.imagen_url &&
         banner.imagen_url.trim() !== '';
});

// Calcular costo de pedidos extra
const calcularCostoPedidosExtra = () => {
  const costoPorPedido = membresia.value.id_membresia === 1 ? 25 : 15;
  return pedidosExtra.value * costoPorPedido;
};

// Calcular comisión de la app (15%)
const calcularComisionApp = () => {
  return parseFloat(comisionSemanal.value).toFixed(2);
};

// Calcular total a pagar
const calcularTotalPago = () => {
  return (parseFloat(calcularCostoPedidosExtra()) + parseFloat(calcularComisionApp())).toFixed(2);
};

// Redirección entre perfiles
const redirectToProfile = () => {
  console.log(`Redirigiendo a: ${selectedProfile.value}`);
};

// Función para obtener el máximo de pedidos según la membresía
const getPedidosMaximos = () => {
  if (membresia.value.id_membresia === 1) return 5;
  if (membresia.value.id_membresia === 2) return 15;
  return 999; // "ilimitado" para Premium
};

// Verificación de funciones Premium
const isPremiumFeatureAvailable = (requiredMembership) => {
  return membresia.value.id_membresia >= requiredMembership;
};

// Modal de notificaciones
const showNotifications = () => {
  openModal('notificaciones');
};

// Función genérica para abrir modales
const openModal = (modalName, data = null) => {
  // Cerrar cualquier otro modal abierto
  Object.keys(modales.value).forEach(key => {
    modales.value[key] = false;
  });

  // Abrir el modal solicitado
  modales.value[modalName] = true;

  // Inicializar datos según el modal
  modalData.value.isEdit = !!data;

  switch (modalName) {
    case 'banner':
      modalData.value.banner = data ? { ...data } : {
        id_banner: banners.value.length + 1,
        id_local: local.value.id_local,
        titulo: '',
        descripcion: '',
        imagen_url: '',
        url_destino: '',
        activo: true
      };
      break;

    case 'cupon':
      modalData.value.cupon = data ? { ...data } : {
        id_cupon: cupones.value.length + 1,
        codigo_cupon: '',
        tipo_descuento: 'porcentaje',
        descuento: '',
        limite_uso: '',
        usos_actuales: 0,
        fecha_vencimiento: '',
        imagen_url: '',
        activo: true
      };
      break;

    case 'sucursal':
      modalData.value.sucursal = data ? { ...data } : {
        id_sucursal: sucursales.value.length + 1,
        id_local: local.value.id_local,
        nombre: '',
        ciudad: '',
        colonia: '',
        direccion_precisa: '',
        lat: '',
        long: '',
        apertura: '',
        cierre: '',
        activo: true
      };
      // Inicializar el mapa Leaflet después de que el DOM se actualice
      nextTick(() => {
        inicializarMapa();
      });
      break;

    case 'notificacionPersonalizada':
      modalData.value.notificacion = {
        titulo: '',
        mensaje: '',
        tipo_destinatario: 'todos'
      };
      break;

    case 'membresiaComprobante':
      modalData.value.idMembresiaSeleccionada = data || 1;
      modalData.value.comprobantePreview = null;
      modalData.value.aceptaTerminos = false;
      break;

    case 'historialCobros':
      // Reiniciar filtros
      filtroHistorialCobros.value = {
        mes: '',
        anio: '',
        estado: ''
      };
      break;

    case 'detalleCobro':
      cobroSeleccionado.value = data;
      break;
  }
};

const closeModal = (modalName) => {
  modales.value[modalName] = false;

  // Si es el modal de sucursal, destruir el mapa al cerrar
  if (modalName === 'sucursal' && mapaSucursal) {
    mapaSucursal.remove();
    mapaSucursal = null;
  }
};

// Inicializar el mapa Leaflet para sucursales
const inicializarMapa = () => {
  if (!modales.value.sucursal) return;

  // Verificar si la librería Leaflet está cargada
  if (typeof L === 'undefined') {
    cargarLibreriaLeaflet(() => inicializarMapa());
    return;
  }

  // Verificar que el contenedor del mapa existe
  const contenedorMapa = document.getElementById('mapaSucursal');
  if (!contenedorMapa) return;

  // Eliminar mapa anterior si existe
  if (mapaSucursal) {
    mapaSucursal.remove();
    mapaSucursal = null;
  }

  // Coordenadas iniciales (centro de Honduras)
  let lat = 14.0723;
  let lng = -87.1921;

  // Si estamos editando, usar las coordenadas de la sucursal
  if (modalData.value.isEdit && modalData.value.sucursal.lat && modalData.value.sucursal.long) {
    lat = parseFloat(modalData.value.sucursal.lat);
    lng = parseFloat(modalData.value.sucursal.long);
  }

  // Inicializar el mapa
  mapaSucursal = L.map('mapaSucursal').setView([lat, lng], 13);

  // Añadir capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapaSucursal);

  // Añadir marcador si estamos editando
  if (modalData.value.isEdit && modalData.value.sucursal.lat && modalData.value.sucursal.long) {
    marcadorSucursal = L.marker([lat, lng], {
      draggable: true
    }).addTo(mapaSucursal);

    // Actualizar coordenadas cuando se arrastra el marcador
    marcadorSucursal.on('dragend', function(event) {
      const posicion = marcadorSucursal.getLatLng();
      modalData.value.sucursal.lat = posicion.lat.toFixed(6);
      modalData.value.sucursal.long = posicion.lng.toFixed(6);
    });
  }

  // Detectar clics en el mapa para añadir/mover marcador
  mapaSucursal.on('click', function(e) {
    // Si ya hay un marcador, eliminarlo
    if (marcadorSucursal) {
      mapaSucursal.removeLayer(marcadorSucursal);
    }

    // Añadir nuevo marcador
    marcadorSucursal = L.marker(e.latlng, {
      draggable: true
    }).addTo(mapaSucursal);

    // Actualizar coordenadas en el formulario
    modalData.value.sucursal.lat = e.latlng.lat.toFixed(6);
    modalData.value.sucursal.long = e.latlng.lng.toFixed(6);

    // Actualizar coordenadas cuando se arrastra el marcador
    marcadorSucursal.on('dragend', function(event) {
      const posicion = marcadorSucursal.getLatLng();
      modalData.value.sucursal.lat = posicion.lat.toFixed(6);
      modalData.value.sucursal.long = posicion.lng.toFixed(6);
    });
  });

  // Asegurar que el mapa se renderice correctamente
  setTimeout(() => {
    mapaSucursal.invalidateSize();
  }, 100);
};

// Cargar librería Leaflet dinámicamente
const cargarLibreriaLeaflet = (callback) => {
  // Cargar CSS de Leaflet
  const linkLeaflet = document.createElement('link');
  linkLeaflet.rel = 'stylesheet';
  linkLeaflet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(linkLeaflet);

  // Cargar JavaScript de Leaflet
  const scriptLeaflet = document.createElement('script');
  scriptLeaflet.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  scriptLeaflet.onload = callback;
  document.head.appendChild(scriptLeaflet);
};

// Historial de cobros
const openHistorialCobros = () => {
  openModal('historialCobros');
};

const filtrarHistorialCobros = () => {
  // La filtración se realiza automáticamente a través del computed historialCobrosFiltrado
  console.log('Filtros aplicados:', filtroHistorialCobros.value);
};

const verDetalleCobro = (cobro) => {
  openModal('detalleCobro', cobro);
};

const pagarCobro = (cobro) => {
  if (confirm(`¿Estás seguro de marcar como pagado el cobro #${cobro.num_factura}?`)) {
    // Buscar el cobro en el historial y actualizarlo
    const index = historialCobros.value.findIndex(c => c.num_factura === cobro.num_factura);
    if (index !== -1) {
      historialCobros.value[index].estado = 'pagado';
      alert(`Cobro #${cobro.num_factura} marcado como pagado`);
    }
  }
};

const exportarHistorialCobros = () => {
  alert('Exportando historial de cobros...');
  // Aquí se implementaría la exportación real del historial
};

const imprimirComprobante = () => {
  alert('Imprimiendo comprobante...');
  // Aquí se implementaría la impresión real del comprobante
};

// Banner publicitario
const openBannerModal = () => {
  if (!isPremiumFeatureAvailable(3)) {
    openUpgradeModal();
    return;
  }
  openModal('banner');
};

const editBanner = (banner) => {
  openModal('banner', banner);
};

const toggleBannerStatus = (banner) => {
  banner.activo = !banner.activo;
};

const deleteBanner = (banner) => {
  if (confirm(`¿Estás seguro de eliminar el banner "${banner.titulo}"?`)) {
    banners.value = banners.value.filter(b => b.id_banner !== banner.id_banner);
  }
};

const guardarBanner = () => {
  if (!isValidBanner.value) return;

  if (modalData.value.isEdit) {
    // Actualizar banner existente
    const index = banners.value.findIndex(b => b.id_banner === modalData.value.banner.id_banner);
    if (index !== -1) {
      banners.value[index] = { ...modalData.value.banner };
    }
  } else {
    // Crear nuevo banner
    banners.value.push({ ...modalData.value.banner });
  }

  closeModal('banner');
};

// Cupones
const openCuponModal = () => {
  openModal('cupon');
};

const editCupon = (cupon) => {
  openModal('cupon', cupon);
};

const toggleCuponStatus = (cupon) => {
  cupon.activo = !cupon.activo;
};

const deleteCupon = (cupon) => {
  if (confirm(`¿Estás seguro de eliminar el cupón "${cupon.codigo_cupon}"?`)) {
    cupones.value = cupones.value.filter(c => c.id_cupon !== cupon.id_cupon);
  }
};

const guardarCupon = () => {
  if (!isValidCupon.value) return;

  if (modalData.value.isEdit) {
    // Actualizar cupón existente
    const index = cupones.value.findIndex(c => c.id_cupon === modalData.value.cupon.id_cupon);
    if (index !== -1) {
      cupones.value[index] = { ...modalData.value.cupon };
    }
  } else {
    // Crear nuevo cupón
    cupones.value.push({ ...modalData.value.cupon });
  }

  closeModal('cupon');
};

// Sucursales
const openSucursalModal = () => {
  openModal('sucursal');
};

const editSucursal = (sucursal) => {
  openModal('sucursal', sucursal);
};

const toggleSucursalStatus = (sucursal) => {
  sucursal.activo = !sucursal.activo;
};

const deleteSucursal = (sucursal) => {
  if (confirm(`¿Estás seguro de eliminar la sucursal "${sucursal.nombre}"?`)) {
    sucursales.value = sucursales.value.filter(s => s.id_sucursal !== sucursal.id_sucursal);
  }
};

const viewSucursalOnMap = (sucursal) => {
  // Abrir el modal de edición de sucursal para mostrar el mapa
  openModal('sucursal', sucursal);
};

const guardarSucursal = () => {
  if (!isValidSucursal.value) return;

  if (modalData.value.isEdit) {
    // Actualizar sucursal existente
    const index = sucursales.value.findIndex(s => s.id_sucursal === modalData.value.sucursal.id_sucursal);
    if (index !== -1) {
      sucursales.value[index] = { ...modalData.value.sucursal };
    }
  } else {
    // Crear nueva sucursal
    sucursales.value.push({ ...modalData.value.sucursal });
  }

  closeModal('sucursal');
};

// Notificaciones personalizadas
const openNotificacionModal = () => {
  openModal('notificacionPersonalizada');
};

const enviarNotificacion = () => {
  if (!canEnviarNotificacion.value || membresia.value.id_membresia < 3) return;

  if (fuenteDatos.value === 'api' && socketConexion) {
    // Enviar notificación a través de WebSocket si estamos en modo API
    socketConexion.enviarNotificacion(modalData.value.notificacion);
    alert('Notificación enviada a través de WebSocket');
  } else {
    // Simulación de envío de notificación en modo mock
    notificaciones.value.unshift({
      id: notificaciones.value.length + 1,
      titulo: modalData.value.notificacion.titulo,
      mensaje: modalData.value.notificacion.mensaje,
      fecha: new Date().toLocaleDateString('es-ES'),
      destinatarios: modalData.value.notificacion.tipo_destinatario === 'todos' ? 'Todos los clientes' : 'Clientes recurrentes',
      aperturas: 0
    });

    alert(`Notificación "${modalData.value.notificacion.titulo}" enviada a ${modalData.value.notificacion.tipo_destinatario === 'todos' ? 'todos los clientes' : 'clientes recurrentes'}`);
  }

  closeModal('notificacionPersonalizada');
};

// Membresía
const openUpgradeModal = () => {
  openModal('membresia');
};

const openMembresiaComprobanteModal = (idMembresia) => {
  // No permitir "adquirir" la membresía actual
  if (membresia.value.id_membresia === idMembresia) {
    return;
  }

  openModal('membresiaComprobante', idMembresia);
};

const previewComprobante = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      modalData.value.comprobantePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const enviarComprobante = () => {
  if (!canSubmitComprobante.value) return;

  // Para demostración: activar inmediatamente la membresía seleccionada
  membresia.value.id_membresia = modalData.value.idMembresiaSeleccionada;
  membresia.value.nombre = getTipoMembresiaNombre(modalData.value.idMembresiaSeleccionada);

  // Actualizar pedidos restantes según la membresía
  if (modalData.value.idMembresiaSeleccionada === 1) {
    local.value.pedidos_restantes = 5;
  } else if (modalData.value.idMembresiaSeleccionada === 2) {
    local.value.pedidos_restantes = 15;
  } else if (modalData.value.idMembresiaSeleccionada === 3) {
    local.value.pedidos_restantes = 999; // "ilimitado"
  }

  // Mensaje de éxito
  alert(`¡Membresía ${getTipoMembresiaNombre(modalData.value.idMembresiaSeleccionada)} activada con éxito!`);

  closeModal('membresiaComprobante');

  // Reiniciar gráficos después de cambiar membresía
  initCharts();
};

// Mostrar detalle del pedido (nueva función para el reporte de pedidos)
const mostrarDetallePedido = () => {
  modalPedidoVisible.value = true;
};

// Reportería
const generarReporte = () => {
  if (membresia.value.id_membresia < 3) {
    alert('Esta función requiere membresía Premium');
    return;
  }

  // Generar datos de ejemplo según el tipo de reporte
  if (reporteActual.value.tipo === 'ventas') {
    reporteData.value = [
      { fecha: '2023-06-10', pedidos: 15, total: 2450.75, metodo_pago: 'Tarjeta' },
      { fecha: '2023-06-11', pedidos: 12, total: 1980.50, metodo_pago: 'Efectivo' },
      { fecha: '2023-06-12', pedidos: 18, total: 2780.25, metodo_pago: 'Tarjeta' },
      { fecha: '2023-06-13', pedidos: 14, total: 2210.00, metodo_pago: 'Efectivo' },
      { fecha: '2023-06-14', pedidos: 20, total: 3150.30, metodo_pago: 'Tarjeta' }
    ];
  } else if (reporteActual.value.tipo === 'productos') {
    reporteData.value = [
      { nombre: 'Café Americano', cantidad: 120, precio: 45.00 },
      { nombre: 'Cappuccino', cantidad: 85, precio: 60.00 },
      { nombre: 'Latte', cantidad: 75, precio: 55.00 },
      { nombre: 'Croissant', cantidad: 95, precio: 30.00 },
      { nombre: 'Sándwich de pollo', cantidad: 60, precio: 85.00 }
    ];
  } else {
    reporteData.value = [];
  }

  reporteGenerado.value = true;
};

const exportarReporte = (formato) => {
  if (!reporteGenerado.value || membresia.value.id_membresia < 3) return;

  alert(`Exportando reporte en formato ${formato.toUpperCase()}...`);
  // Aquí se implementaría la exportación real del reporte
};

const getTituloReporte = () => {
  switch (reporteActual.value.tipo) {
    case 'ventas': return 'Reporte de Ventas';
    case 'productos': return 'Productos Más Vendidos';
    case 'financiero': return 'Reporte Financiero';
    case 'pedidos': return 'Reporte de Pedidos';
    default: return 'Reporte';
  }
};

const getTipoMembresiaNombre = (id) => {
  switch (id) {
    case 1: return 'Gratuita';
    case 2: return 'Básica';
    case 3: return 'Premium';
    default: return 'Desconocida';
  }
};

const getPrecioMembresia = (id) => {
  switch (id) {
    case 1: return '0';
    case 2: return '150';
    case 3: return '250';
    default: return '0';
  }
};

// Utilidades de formato
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', options);
};

const formatearHora = (hora) => {
  if (!hora) return '';

  // Si la hora ya está en formato HH:MM:SS
  if (typeof hora === 'string' && hora.includes(':')) {
    const [horas, minutos] = hora.split(':');
    const horaNum = parseInt(horas);
    const periodo = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum > 12 ? horaNum - 12 : (horaNum === 0 ? 12 : horaNum);
    return `${hora12}:${minutos} ${periodo}`;
  }

  return 'Formato inválido';
};

// Clase para manejar la conexión WebSocket
class SocketConexion {
  constructor(url) {
    this.socket = null;
    this.url = url;
    this.conectado = false;
    this.intentosReconexion = 0;
    this.maxIntentosReconexion = 5;
  }

  conectar() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket ya está conectado o conectándose');
      return;
    }

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket conectado');
        this.conectado = true;
        this.intentosReconexion = 0;
      };

      this.socket.onmessage = (evento) => {
        this.procesarMensaje(evento.data);
      };

      this.socket.onclose = () => {
        console.log('WebSocket desconectado');
        this.conectado = false;
        this.intentarReconexion();
      };

      this.socket.onerror = (error) => {
        console.error('Error en WebSocket:', error);
      };
    } catch (error) {
      console.error('Error al crear WebSocket:', error);
    }
  }

  intentarReconexion() {
    if (this.intentosReconexion < this.maxIntentosReconexion) {
      this.intentosReconexion++;
      console.log(`Intentando reconexión (${this.intentosReconexion}/${this.maxIntentosReconexion})...`);
      setTimeout(() => this.conectar(), 5000); // Reintento cada 5 segundos
    } else {
      console.log('Máximo número de intentos alcanzado. No se intentará reconectar.');
    }
  }

  desconectar() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.conectado = false;
    }
  }

  enviarMensaje(mensaje) {
    if (this.socket && this.conectado) {
      this.socket.send(JSON.stringify(mensaje));
    } else {
      console.error('No se puede enviar mensaje: WebSocket no conectado');
    }
  }

  enviarNotificacion(notificacion) {
    this.enviarMensaje({
      tipo: 'notificacion',
      datos: notificacion
    });
  }

  procesarMensaje(mensaje) {
    try {
      const datos = JSON.parse(mensaje);
      console.log('Mensaje recibido:', datos);

      // Procesar según el tipo de mensaje
      if (datos.tipo === 'notificacion') {
        // Manejar notificación entrante
        notifications.value.unshift({
          id: Date.now(),
          message: datos.datos.mensaje,
          read: false
        });
      }
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
    }
  }
}

// Inicializar gráficos
const initCharts = async () => {
  // Esperar a que el DOM esté completamente renderizado
  await nextTick();

  console.log("Intentando inicializar gráficos..."); // Debug

  // Gráfico de productos más vendidos
  if (membresia.value.id_membresia >= 2 && productosChart.value) {
    console.log("Inicializando gráfico de productos..."); // Debug

    // Destruir gráfico anterior si existe
    if (productosChart.value._chart) {
      productosChart.value._chart.destroy();
    }

    const ctx = productosChart.value.getContext('2d');

    // Usar los datos reales de estadísticas
    const data = {
      labels: estadisticas.value.productosMasVendidos.map(p => p.nombre),
      datasets: [{
        label: 'Ventas',
        data: estadisticas.value.productosMasVendidos.map(p => p.ventas),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(234, 88, 12, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(217, 119, 6, 0.7)',
          'rgba(124, 58, 237, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(234, 88, 12, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(217, 119, 6, 1)',
          'rgba(124, 58, 237, 1)'
        ],
        borderWidth: 1
      }]
    };

    productosChart.value._chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Gráfico de ventas por día
  if (membresia.value.id_membresia >= 3 && ventasChart.value) {
    console.log("Inicializando gráfico de ventas..."); // Debug

    // Destruir gráfico anterior si existe
    if (ventasChart.value._chart) {
      ventasChart.value._chart.destroy();
    }

    const ctx = ventasChart.value.getContext('2d');

    // Usar los datos reales de estadísticas
    const labels = estadisticas.value.datosVentas.map(d => {
      const fecha = new Date(d.fecha);
      return fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    });

    const data = {
      labels: labels,
      datasets: [{
        label: 'Ingresos Diarios (L.)',
        data: estadisticas.value.datosVentas.map(d => d.ventas),
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointRadius: 4
      }]
    };

    ventasChart.value._chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `L. ${context.raw.toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `L. ${value}`
            }
          }
        }
      }
    });
  }
};

// Observar cambios en la fuente de datos y membresía
watch([fuenteDatos, () => membresia.value.id_membresia], () => {
  cargarDatos();
});

// Observar los cambios en la fuente de datos para manejar WebSocket
watch(fuenteDatos, (nuevoValor, valorAnterior) => {
  if (nuevoValor === 'api' && !socketConexion) {
    // Inicializar WebSocket si estamos en modo API
    socketConexion = new SocketConexion('wss://echo.websocket.org'); // Este es un servicio de ejemplo que hace eco de los mensajes
    socketConexion.conectar();
  } else if (nuevoValor !== 'api' && socketConexion) {
    // Desconectar WebSocket si cambiamos a modo mock
    socketConexion.desconectar();
    socketConexion = null;
  }
});

// Cargar datos
const cargarDatos = async () => {
  if (fuenteDatos.value === 'api') {
    try {
      // Mostrar mensaje de carga
      console.log('Cargando datos desde la API...');

      // Obtener estadísticas del local (incluye información del local y membresía)
      const estadisticasResponse = await fetch(`http://localhost:4000/estadisticaslocal/${local.value.id_local}`);
      if (!estadisticasResponse.ok) throw new Error('Error al obtener estadísticas del local');
      const estadisticasData = await estadisticasResponse.json();

      // Actualizar datos del local
      if (estadisticasData.local_info) {
        local.value = {
          ...local.value,
          ...estadisticasData.local_info
        };
      }

      // Actualizar datos de la membresía
      if (estadisticasData.membresia_info) {
        membresia.value = {
          ...membresia.value,
          id_membresia: estadisticasData.membresia_info.id_membresia,
          nombre: estadisticasData.membresia_info.nombre_membresia,
          limite_recomendaciones: estadisticasData.membresia_info.limite_recomendaciones
        };
      }

      // Actualizar datos de estadísticas
      estadisticas.value = {
        ...estadisticas.value,
        pedidos_semanales: estadisticasData.pedidos_semanales || 0,
        ingresos_semanales: estadisticasData.ingresos_semanales || 0,
        tendencia_pedidos: estadisticasData.tendencia_pedidos || 0,
        tendencia_ingresos: estadisticasData.tendencia_ingresos || 0
      };

      console.log('Datos cargados correctamente desde la API:', estadisticasData);
    } catch (error) {
      console.error('Error al cargar datos desde la API:', error);
      fuenteDatos.value = 'mock';
      alert('Error al conectar con la API. Se usarán datos de ejemplo.');
    }
  }

  // Inicializar gráficos
  nextTick(() => {
    initCharts();
  });
};

// Al montar el componente
onMounted(() => {
  cargarDatos();

  // Inicializar gráficos cuando el componente se monta
  if (currentTab.value === 'estadisticas') {
    initCharts();
  }

  // Simular una notificación nueva
  setTimeout(() => {
    notifications.value.unshift({
      id: notifications.value.length + 1,
      message: "Nuevo pedido recibido #4305",
      read: false
    });
  }, 10000);
});

// Observar cambios en la pestaña actual
watch(currentTab, (newTab) => {
  if (newTab === 'estadisticas') {
    // Esperar a que el DOM se actualice y luego inicializar gráficos
    nextTick(() => {
      initCharts();
    });
  }
});

// Observar cambios en la membresía
watch(() => membresia.value.id_membresia, () => {
  if (currentTab.value === 'estadisticas') {
    initCharts();
  }
});
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animación para fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
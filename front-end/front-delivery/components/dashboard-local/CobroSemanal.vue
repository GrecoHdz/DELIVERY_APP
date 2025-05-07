<template>
  <div class="bg-white rounded-xl shadow mb-8 border-2 border-gray-300">
    <div class="border-b border-gray-100 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between">
        <!-- Ícono y texto -->
        <div class="flex items-center">
          <div class="p-3 bg-amber-100 rounded-full mr-4">
            <ReceiptIcon class="text-amber-600" :size="20" />
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-800">
              Cobro Semanal
              <!-- Indicador de facturas pendientes -->
              <span v-if="facturasPendientes > 0" class="ml-2 text-sm font-medium text-white bg-red-600 px-2 py-1 rounded-full">
                {{ facturasPendientes }} {{ facturasPendientes === 1 ? 'pago pendiente' : 'pagos pendientes' }}
              </span>
            </h2>

            <!-- Mensaje según el balance -->
            <p class="text-gray-600 text-sm sm:text-base">
              {{ facturasPendientes > 0 && Number(balanceFinal) > 0 ? '' : 'Resumen de ventas y comisiones de la semana' }}
            </p>

            <!-- Contador de días restantes para pagar (solo si hay pagos pendientes y el balance es positivo) -->
            <div v-if="facturasPendientes > 0 && Number(balanceFinal) > 0" class="mt-2">
              <div class="flex items-center mb-2">
                <ClockIcon :size="16" :class="facturasPendientes >= 2 ? 'text-red-600 mr-2' : 'text-amber-600 mr-2'" />
                <span v-if="facturasPendientes >= 2" class="text-sm font-medium text-red-700">Cuenta con restricciones por facturas pendientes</span>
                <span v-else class="text-sm font-medium text-gray-700">Tiene {{ diasRestantesPago }} días para realizar el pago</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div
                  class="h-3 rounded-full transition-all duration-500 ease-out"
                  :class="getColorClaseDiasPago"
                  :style="{width: facturasPendientes >= 2 ? '100%' : `${(diasRestantesPago / 7) * 100}%`}"
                ></div>
              </div>   </div>
          </div>
        </div>

        <!-- Botones de exportación -->
        <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button
            @click="exportarExcel"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center justify-center"
            :disabled="exportandoExcel"
          >
            <span v-if="exportandoExcel" class="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Exportar Excel
          </button>
          <button
            @click="exportarPDF"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center justify-center"
            :disabled="exportandoPDF"
          >
            <span v-if="exportandoPDF" class="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Exportar PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Advertencia cuando quedan 3 días o menos para pagar y hay cobros pendientes -->
    <div v-if="mostrarAdvertencia" class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 mx-6 mt-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <AlertTriangleIcon class="h-5 w-5 text-amber-500" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-amber-800">Advertencia de pago pendiente</h3>
          <div class="mt-2 text-sm text-amber-700">
            <p v-if="facturasPendientes === 1">Tiene <strong>1 factura pendiente</strong> de pago. Si no realiza el pago a tiempo, su cuenta podría ser suspendida temporalmente y no podrá recibir nuevos pedidos hasta regularizar su situación.</p>
            <p v-else>Debe realizar un <strong>pago a la app</strong> por el monto indicado en el resumen. Si no realiza el pago a tiempo, su cuenta podría ser suspendida temporalmente.</p>
          </div>
          <div class="mt-3">
            <button
              @click="openPagoComprobanteModal()"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Realizar pago ahora
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Comunicado cuando hay 2 o más facturas pendientes (independientemente del balance) -->
    <div v-if="mostrarComunicado" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 mx-6 mt-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <AlertCircleIcon class="h-5 w-5 text-red-500" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Cuenta con restricciones</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>Su cuenta tiene <strong>{{ facturasPendientes }} facturas pendientes</strong> de pago. Su servicio ha sido restringido y no recibirá nuevos pedidos hasta que cancele todas las facturas pendientes. Si no regulariza su situación pronto, su cuenta podría ser desactivada permanentemente.</p>
          </div>
          <div class="mt-3">
            <button
              @click="openPagoComprobanteModal()"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Pagar todas las facturas pendientes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
      <!-- Productos vendidos esta semana -->
      <div class="lg:col-span-2 p-6 border-r border-gray-100">
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Productos Vendidos en la Semana</h3>
          <div class="flex items-center">
            <label for="filtroSucursal" class="mr-2 text-sm text-gray-600">Sucursal:</label>
            <select
              id="filtroSucursal"
              v-model="sucursalSeleccionada"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las sucursales</option>
              <option v-for="sucursal in sucursales" :key="sucursal.id_sucursal" :value="sucursal.id_sucursal">
                {{ sucursal.colonia }}
              </option>
            </select>
          </div>
        </div>
        <div class="border border-gray-200 rounded-lg">
          <div class="overflow-x-auto">
            <div class="overflow-y-auto" style="max-height: 250px;">
              <table class="w-full border-collapse productos-table">
                <thead class="sticky top-0 bg-white z-10">
                  <tr class="text-left border-b border-gray-200 bg-gray-50">
                    <th class="py-2 px-4 text-gray-600 font-medium">Producto</th>
                    <th class="py-2 px-4 text-gray-600 font-medium">Precio Unitario</th>
                    <th class="py-2 px-4 text-gray-600 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(producto, index) in productosFiltrados" :key="index"
                      :class="{'bg-gray-50': index % 2 === 0}">
                    <td class="py-3 px-4 text-gray-800">
                      <span class="font-medium">(x{{ producto.cantidad }})</span> {{ producto.nombre }}
                    </td>
                    <td class="py-3 px-4 text-gray-800">
                      <span>L. {{ producto.precio }}</span>
                    </td>
                    <td class="py-3 px-4 font-medium text-gray-800 flex items-center">
                      <span class="mr-2">L. {{ (producto.cantidad * producto.precio).toFixed(2) }}</span>
                      <span v-if="producto.metodo_pago === 'tarjeta'" class="text-gray-500" title="Pago con tarjeta">
                        <CreditCardIcon :size="16" />
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <table class="w-full border-collapse productos-table">
              <tfoot class="bg-white border-t border-gray-200">
                <tr>
                  <td class="py-3 px-4"></td>
                  <td class="py-3 px-4">
                    <span class="font-medium text-gray-800">Total Ventas:</span>
                  </td>
                  <td class="py-3 px-4 font-bold text-gray-800">
                    L. {{ totalVentasFiltradas }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Resumen del cobro -->
      <div class="flex items-center justify-center p-4">
        <div class="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 w-full">
          <div class="flex items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Resumen del Cobro</h3>
            <span class="relative ml-2">
              <button @click.stop="toggleInfoTooltip" type="button" class="text-blue-500 focus:outline-none">
                <InfoIcon :size="18" class="cursor-pointer" />
              </button>
              <div v-if="showInfoTooltip" class="info-tooltip absolute bottom-full right-0 md:right-0 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0 mb-2 w-72 bg-white shadow-lg rounded-lg p-4 md:p-3 text-sm text-gray-700 z-20 border border-gray-200">
                <h4 class="font-bold text-blue-600 mb-2">¿Cómo funciona el cobro?</h4>
                <p class="mb-2"><span class="font-semibold">Ejemplo:</span> Un producto con precio base de L. 100</p>
                <ul class="space-y-2 mb-2">
                  <li class="flex items-start">
                    <span class="text-red-500 mr-1">•</span>
                    <span><span class="font-semibold">Venta en efectivo:</span> El cliente paga al local L. 115 (precio producto + 15% ganancia app). El local debe transferir L. 15 a la app.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-1">•</span>
                    <span><span class="font-semibold">Venta con tarjeta:</span> El cliente transfiere L. 115 a la app. La app se queda con L. 15 y transfiere L. 100 al local.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-red-500 mr-1">•</span>
                    <span><span class="font-semibold">Pedidos extra:</span> Costo adicional por cada pedido que excede el límite de su plan.</span>
                  </li>
                </ul>
                <div class="border-t border-gray-200 pt-2 mt-2">
                  <p class="font-semibold mb-1 text-xs">Código de colores:</p>
                  <ul class="space-y-1">
                    <li class="flex items-center text-xs">
                      <span class="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                      <span>Valores en <span class="text-red-600 font-medium">rojo</span>: montos que debe pagar a la app</span>
                    </li>
                    <li class="flex items-center text-xs">
                      <span class="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                      <span>Valores en <span class="text-green-600 font-medium">verde</span>: montos que recibirá de la app</span>
                    </li>
                  </ul>
                </div>
              </div>
            </span>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between py-2 border-b border-white">
              <span class="text-gray-700 flex items-center">
                Pedidos extra ({{ pedidosExtra }})
                <span class="relative ml-1">
                  <button @click.stop="togglePedidosExtraTooltip" type="button" class="text-gray-400 focus:outline-none">
                    <HelpCircleIcon :size="14" class="cursor-pointer" />
                  </button>
                  <span v-if="showPedidosExtraTooltip" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    Pedidos que exceden el límite incluido en su plan de membresía
                  </span>
                </span>
              </span>
              <span class="text-red-600 font-medium">L. {{ calcularCostoPedidosExtra() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white">
              <span class="text-gray-700 flex items-center">
                Comisión app (Pagos Efectivo)
                <span class="relative ml-1">
                  <button @click.stop="toggleComisionTooltip" type="button" class="text-gray-400 focus:outline-none">
                    <HelpCircleIcon :size="14" class="cursor-pointer" />
                  </button>
                  <span v-if="showComisionTooltip" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    Total Ventas en efectivo: L. {{ parseFloat(ventasEfectivoSemana || 0).toFixed(2) }}
                  </span>
                </span>
              </span>
              <span class="text-red-600 font-medium">L. {{ cobroSemanal?.comision_efectivo ? parseFloat(cobroSemanal.comision_efectivo).toFixed(2) : (parseFloat(ventasEfectivoSemana || 0) * 0.15).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white">
              <span class="text-gray-700 flex items-center">
                Pago a recibir (Pagos Tarjeta)
                <span class="relative ml-1">
                  <button @click.stop="toggleTarjetaTooltip" type="button" class="text-gray-400 focus:outline-none">
                    <HelpCircleIcon :size="14" class="cursor-pointer" />
                  </button>
                  <span v-if="showTarjetaTooltip" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    Total Ventas con tarjeta: L. {{ parseFloat(ventasTarjetaSemana || 0).toFixed(2) }}
                  </span>
                </span>
              </span>
              <span class="text-green-600 font-medium">L. {{ (parseFloat(ventasTarjetaSemana || 0) * 0.85).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between py-3 text-lg">
              <span class="font-bold text-gray-800">{{ Number(balanceFinal) >= 0 ? 'Total a Pagar:' : 'Total a Recibir:' }}</span>
              <span class="font-bold" :class="Number(balanceFinal) >= 0 ? 'text-red-600' : 'text-green-600'">
                L. {{ Math.abs(Number(balanceFinal) || 0).toFixed(2) }}
              </span>
            </div>

            <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 mb-4">
              <p class="flex items-center text-sm">
                <InfoIcon :size="16" class="mr-2 text-blue-500 flex-shrink-0" />
                Este resumen corresponde del Lunes {{ formatearFechaCorta(cobroSemanal?.periodo_inicio) }} al Domingo {{ formatearFechaCorta(cobroSemanal?.periodo_fin) }}. Para ver información relacionada, consulte la sección de Estadísticas o sección de Reportes.
              </p>
            </div>

            <div class="flex gap-2">
              <button @click="openHistorialCobros" class="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center">
                <FileTextIcon :size="16" class="mr-2" />
                Ver historial
              </button>

              <!-- Botón de pago solo visible si el local debe pagar a la app y no está pagado -->
              <button
                v-if="Number(balanceFinal) > 0 && !cobroActualPagado"
                @click="openPagoComprobanteModal()"
                class="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <DollarSignIcon :size="16" class="mr-2" />
                Pagar
              </button>

              <!-- Estado cuando el cobro ya está pagado -->
              <div
                v-else-if="Number(balanceFinal) > 0 && cobroActualPagado"
                class="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg flex items-center justify-center"
              >
                <CheckIcon :size="16" class="mr-2" />
                Pago realizado
              </div>

              <!-- Estado de pago cuando la app debe pagar al local -->
              <div
                v-else-if="Number(balanceFinal) < 0"
                class="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center"
              >
                <ClockIcon :size="16" class="mr-2" />
                Pago pendiente de la app
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, watch } from 'vue';
import {
  Receipt as ReceiptIcon,
  Clock as ClockIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  FileText as FileTextIcon,
  DollarSign as DollarSignIcon,
  Check as CheckIcon,
  CreditCard as CreditCardIcon,
  AlertTriangle as AlertTriangleIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Configuración de API
const API_URL = 'http://localhost:4000';

// ID de local temporal para pruebas (reemplazar con el ID real cuando se implemente la autenticación)
const ID_LOCAL_TEMPORAL = 10;

// Props del componente
const props = defineProps({
  dataSource: {
    type: String,
    default: 'mock',
    required: false
  }
});

// Datos del cobro semanal
const cobroSemanal = ref(null);
const productosVendidosSemana = ref([]);
const cargando = ref(true);
const error = ref(null);

// Datos de demostración (mock data)
const mockCobroSemanal = {
  id_cobro: 1001,
  id_local: ID_LOCAL_TEMPORAL,
  num_factura: 'FAC-20230615-10',
  periodo_inicio: new Date(new Date().setDate(new Date().getDate() - 7)),
  periodo_fin: new Date(),
  ventas_efectivo: 3500.00,
  ventas_tarjeta: 2800.00,
  comision_efectivo: 525.00,
  comision_tarjeta: 420.00,
  pedidos_extra: 3,
  costo_pedidos_extra: 30.00,
  total: 135.00,
  estado: 'pendiente',
  Local: {
    nombre_local: 'Café Aroma',
    id_membresia: 2,
    MembresiaLocales: {
      nombre_membresia: 'Estándar',
      precio_delivery_extra: 10,
      limite_recomendaciones: 3
    }
  }
};

const mockProductosVendidos = [
  { id_cobro_producto: 1, id_producto: 101, nombre: 'Café Americano', cantidad: 18, precio: 45.00, total: 810.00, metodo_pago: 'efectivo', id_sucursal: 1 },
  { id_cobro_producto: 2, id_producto: 102, nombre: 'Cappuccino', cantidad: 12, precio: 60.00, total: 720.00, metodo_pago: 'tarjeta', id_sucursal: 1 },
  { id_cobro_producto: 3, id_producto: 103, nombre: 'Latte', cantidad: 15, precio: 55.00, total: 825.00, metodo_pago: 'efectivo', id_sucursal: 2 },
  { id_cobro_producto: 4, id_producto: 104, nombre: 'Croissant', cantidad: 10, precio: 30.00, total: 300.00, metodo_pago: 'tarjeta', id_sucursal: 2 },
  { id_cobro_producto: 5, id_producto: 105, nombre: 'Sándwich de pollo', cantidad: 14, precio: 85.00, total: 1190.00, metodo_pago: 'efectivo', id_sucursal: 1 },
  { id_cobro_producto: 6, id_producto: 106, nombre: 'Jugo natural', cantidad: 8, precio: 40.00, total: 320.00, metodo_pago: 'tarjeta', id_sucursal: 1 },
  { id_cobro_producto: 7, id_producto: 107, nombre: 'Pastel de chocolate', cantidad: 13, precio: 50.00, total: 650.00, metodo_pago: 'efectivo', id_sucursal: 2 },
  { id_cobro_producto: 8, id_producto: 108, nombre: 'Ensalada César', cantidad: 6, precio: 95.00, total: 570.00, metodo_pago: 'tarjeta', id_sucursal: 2 }
];

const mockSucursales = [
  { id_sucursal: 1, colonia: 'Las Colinas', direccion_precisa: 'Calle Principal #123', ciudad: 'Tegucigalpa' },
  { id_sucursal: 2, colonia: 'El Prado', direccion_precisa: 'Avenida Central #456', ciudad: 'San Pedro Sula' }
];

// La fecha límite de pago ahora se calcula directamente en diasRestantesPago

// Datos de ventas
const ventasEfectivoSemana = computed(() => cobroSemanal.value ? cobroSemanal.value.ventas_efectivo : 0);
const ventasTarjetaSemana = computed(() => cobroSemanal.value ? cobroSemanal.value.ventas_tarjeta : 0);

// Datos de pedidos extra
const pedidosExtra = computed(() => cobroSemanal.value ? cobroSemanal.value.pedidos_extra : 0);

// Datos de membresía
const membresia = computed(() => {
  if (!cobroSemanal.value || !cobroSemanal.value.Local) return { id_membresia: 1, precio_delivery_extra: 10 };
  return {
    id_membresia: cobroSemanal.value.Local.id_membresia,
    precio_delivery_extra: cobroSemanal.value.Local.MembresiaLocales?.precio_delivery_extra || 10
  };
});

// Estado de cobro
const cobroActualPagado = computed(() => cobroSemanal.value ? cobroSemanal.value.estado === 'pagado' : false);

// Balance final
const balanceFinal = computed(() => {
  if (!cobroSemanal.value) return 0;

  try {
    // Obtener valores del cobro o calcularlos si no están disponibles
    let comisionEfectivo, costoPedidosExtra, pagoTarjeta, total;

    // Comisión efectivo (15% de ventas en efectivo)
    if (cobroSemanal.value.comision_efectivo !== undefined && cobroSemanal.value.comision_efectivo !== null) {
      comisionEfectivo = parseFloat(cobroSemanal.value.comision_efectivo);
    } else {
      comisionEfectivo = parseFloat(ventasEfectivoSemana.value || 0) * 0.15;
    }

    // Costo de pedidos extra
    if (cobroSemanal.value.costo_pedidos_extra !== undefined && cobroSemanal.value.costo_pedidos_extra !== null) {
      costoPedidosExtra = parseFloat(cobroSemanal.value.costo_pedidos_extra);
    } else {
      costoPedidosExtra = parseFloat(calcularCostoPedidosExtra());
    }

    // Pago por tarjeta (85% de ventas con tarjeta)
    if (cobroSemanal.value.comision_tarjeta !== undefined && cobroSemanal.value.comision_tarjeta !== null) {
      pagoTarjeta = parseFloat(cobroSemanal.value.comision_tarjeta);
    } else {
      pagoTarjeta = parseFloat(ventasTarjetaSemana.value || 0) * 0.85;
    }

    // Si el cobro ya tiene un total calculado, usarlo
    if (cobroSemanal.value.total !== undefined && cobroSemanal.value.total !== null) {
      total = parseFloat(cobroSemanal.value.total);
      console.log('Usando total del cobro:', total);
    } else {
      // La fórmula correcta es:
      // Total = Comisión efectivo (a pagar) + Costo pedidos extra (a pagar) - Pago tarjeta (a recibir)
      total = comisionEfectivo + costoPedidosExtra - pagoTarjeta;
      console.log('Calculando balance final manualmente:');
    }

    console.log('- Comisión efectivo (15% de ventas en efectivo):', comisionEfectivo);
    console.log('- Costo pedidos extra:', costoPedidosExtra);
    console.log('- Pago tarjeta (85% de ventas con tarjeta):', pagoTarjeta);
    console.log('= Total:', total);

    return total;
  } catch (error) {
    console.error('Error al calcular el balance final:', error);

    // En caso de error, intentar usar el total del cobro directamente
    if (cobroSemanal.value.total !== undefined && cobroSemanal.value.total !== null) {
      return parseFloat(cobroSemanal.value.total);
    }

    return 0;
  }
});

// Lista de sucursales
const sucursales = ref([]);

// Sucursal seleccionada para filtrar
const sucursalSeleccionada = ref('todas');

// Productos filtrados por sucursal
const productosFiltrados = computed(() => {
  if (!productosVendidosSemana.value) return [];

  // Filtrar por sucursal seleccionada
  if (sucursalSeleccionada.value === 'todas') {
    return productosVendidosSemana.value;
  } else {
    return productosVendidosSemana.value.filter(producto =>
      producto.id_sucursal === parseInt(sucursalSeleccionada.value)
    );
  }
});

// Total de ventas filtradas
const totalVentasFiltradas = computed(() => {
  return productosFiltrados.value.reduce((total, producto) => {
    return total + (parseFloat(producto.total) || 0);
  }, 0).toFixed(2);
});

// Función para obtener el nombre de la sucursal (comentada porque no se usa actualmente)
// const getNombreSucursal = (idSucursal) => {
//   const sucursal = sucursales.value.find(s => s.id_sucursal === idSucursal);
//   return sucursal ? sucursal.colonia : 'Desconocida';
// };

// Función para cargar las sucursales
const cargarSucursales = async () => {
  try {
    // Si estamos en modo demo, usar datos de demostración
    if (props.dataSource === 'mock') {
      console.log('Usando datos de demostración para sucursales');
      sucursales.value = [...mockSucursales]; // Crear una copia para evitar referencias
      // Resetear la sucursal seleccionada a 'todas' cuando cambiamos a datos demo
      sucursalSeleccionada.value = 'todas';
      console.log('Sucursales cargadas (demo):', JSON.stringify(sucursales.value));
      return;
    }

    // Si estamos en modo API, hacer la solicitud
    console.log('Solicitando datos de sucursales desde la API...');

    // Usar ID_LOCAL_TEMPORAL en lugar de userStore.user.id_local
    const response = await axios.get(`${API_URL}/direccioneslocales/${ID_LOCAL_TEMPORAL}`);

    // Verificar si la respuesta es válida
    console.log('Respuesta del servidor (sucursales) - status:', response.status);
    console.log('Respuesta del servidor (sucursales) - tipo:', typeof response.data);
    console.log('Respuesta del servidor (sucursales) - data:', response.data);

    // Guardar la sucursal seleccionada actual
    const sucursalAnterior = sucursalSeleccionada.value;

    // Limpiar la lista de sucursales antes de actualizarla
    sucursales.value = [];

    // Verificar si la respuesta es un array directamente o está dentro de un objeto con estructura {success, data}
    const sucursalesData = Array.isArray(response.data)
      ? response.data
      : (response.data && response.data.success && Array.isArray(response.data.data))
        ? response.data.data
        : null;

    if (sucursalesData) {
      // Actualizar la lista de sucursales
      const sucursalesAPI = sucursalesData.map(sucursal => {
        console.log('Procesando sucursal:', JSON.stringify(sucursal));
        return {
          id_sucursal: sucursal.id_direccion_local,
          colonia: sucursal.colonia || 'Sin colonia',
          direccion_precisa: sucursal.direccion_precisa || '',
          ciudad: sucursal.ciudad || 'Sin ciudad'
        };
      });

      // Asignar las nuevas sucursales
      sucursales.value = sucursalesAPI;

      console.log('Sucursales procesadas (API):', JSON.stringify(sucursales.value));

      // Verificar si la sucursal seleccionada anteriormente existe en la nueva lista
      if (sucursalAnterior !== 'todas') {
        const existeSucursal = sucursales.value.some(s => s.id_sucursal === parseInt(sucursalAnterior));
        if (!existeSucursal) {
          // Si no existe, resetear a 'todas'
          sucursalSeleccionada.value = 'todas';
        }
      } else {
        // Asegurarse de que la sucursal seleccionada sea 'todas'
        sucursalSeleccionada.value = 'todas';
      }
    } else {
      console.error('La respuesta de la API no tiene el formato esperado:', response.data);
      throw new Error('Formato de respuesta inválido');
    }
  } catch (err) {
    console.error('Error al cargar sucursales:', err);
    console.error('Detalles del error:', err.response ? err.response.data : err.message);
    error.value = 'Error al cargar las sucursales';

    // En caso de error, usar datos de demostración como fallback
    console.log('Usando datos de demostración como fallback para sucursales');
    sucursales.value = [...mockSucursales]; // Crear una copia para evitar referencias
    // Resetear la sucursal seleccionada a 'todas' cuando hay un error
    sucursalSeleccionada.value = 'todas';
  }
};

// Función para cargar el cobro semanal actual
const cargarCobroSemanal = async () => {
  try {
    cargando.value = true;
    error.value = null;

    // Si estamos en modo demo, usar datos de demostración
    if (props.dataSource === 'mock') {
      console.log('Usando datos de demostración para cobro semanal');
      cobroSemanal.value = mockCobroSemanal;
      productosVendidosSemana.value = mockProductosVendidos;
      // Resetear la sucursal seleccionada a 'todas' cuando cambiamos a datos demo
      sucursalSeleccionada.value = 'todas';
      console.log('Datos del cobro semanal cargados (demo):', cobroSemanal.value);
      console.log('Productos procesados (demo):', productosVendidosSemana.value);
      return;
    }

    // Si estamos en modo API, hacer la solicitud
    console.log('Solicitando datos del cobro semanal actual desde la API...');

    try {
      // Usar ID_LOCAL_TEMPORAL en lugar de userStore.user.id_local
      const response = await axios.get(`${API_URL}/cobros-semanales/local/${ID_LOCAL_TEMPORAL}/actual`, {
        // Agregar un timeout para evitar esperas indefinidas
        timeout: 10000,
        // Manejar errores de red y respuestas no válidas
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Solo aceptar respuestas exitosas
        }
      });

      console.log('Respuesta del servidor (cobro semanal) - status:', response.status);
      console.log('Respuesta del servidor (cobro semanal) - tipo:', typeof response.data);

      // Verificar si la respuesta es un objeto válido antes de mostrarla
      try {
        console.log('Respuesta del servidor (cobro semanal) - data:',
          typeof response.data === 'object' ? JSON.stringify(response.data) : response.data);
      } catch (logError) {
        console.log('No se pudo mostrar la respuesta completa');
      }

      // Verificar si la respuesta es un objeto directamente o está dentro de un objeto con estructura {success, data}
      const cobroData = Array.isArray(response.data) && response.data.length > 0
        ? response.data[0] // Si es un array, tomar el primer elemento
        : (response.data && response.data.success && response.data.data)
          ? response.data.data
          : (response.data && !response.data.success)
            ? null
            : response.data; // Si es un objeto directamente

      if (cobroData) {
        cobroSemanal.value = cobroData;
        console.log('Datos del cobro semanal cargados:', cobroSemanal.value);
        console.log('Fecha inicio del cobro:', cobroSemanal.value.periodo_inicio);
        console.log('Fecha fin del cobro:', cobroSemanal.value.periodo_fin);
        console.log('Fechas formateadas:', formatearFechaCorta(cobroSemanal.value.periodo_inicio), formatearFechaCorta(cobroSemanal.value.periodo_fin));

        // Actualizar el contador de facturas pendientes
        await verificarFacturasPendientes();

        // Cargar los productos del cobro
        if (cobroSemanal.value && cobroSemanal.value.productos) {
          console.log('Productos incluidos en la respuesta:', cobroSemanal.value.productos);
          productosVendidosSemana.value = cobroSemanal.value.productos.map(producto => ({
            id_cobro_producto: producto.id_cobro_producto,
            id_producto: producto.id_producto,
            nombre: producto.nombre_producto,
            cantidad: producto.cantidad,
            precio: producto.precio_unitario,
            total: producto.total,
            metodo_pago: producto.metodo_pago,
            id_sucursal: producto.id_direccion_local,
            sucursal: producto.sucursal ? {
              id_direccion_local: producto.sucursal.id_direccion_local,
              colonia: producto.sucursal.colonia,
              ciudad: producto.sucursal.Ciudad ? producto.sucursal.Ciudad.nombre_ciudad : 'Desconocida',
              nombre: producto.sucursal.Local ? producto.sucursal.Local.nombre_local : 'Desconocida'
            } : null
          }));
          console.log('Productos procesados:', productosVendidosSemana.value);

          // Verificar si hay productos para la sucursal seleccionada
          if (sucursalSeleccionada.value !== 'todas') {
            const existenProductosParaSucursal = productosVendidosSemana.value.some(
              p => p.id_sucursal === parseInt(sucursalSeleccionada.value)
            );

            if (!existenProductosParaSucursal) {
              // Si no hay productos para la sucursal seleccionada, resetear a 'todas'
              console.log('No hay productos para la sucursal seleccionada, mostrando todos los productos');
              sucursalSeleccionada.value = 'todas';
            }
          }
        } else {
          console.log('No hay productos incluidos en la respuesta, cargando productos separadamente...');
          await cargarProductosCobro();
        }
      } else {
        console.error('La respuesta de la API no tiene el formato esperado:', response.data);
        throw new Error('Formato de respuesta inválido');
      }
    } catch (apiError) {
      console.error('Error al solicitar datos de la API:', apiError);
      throw apiError; // Re-lanzar el error para que lo maneje el catch externo
    }
  } catch (err) {
    console.error('Error al cargar cobro semanal:', err);
    console.error('Detalles del error:', err.response ? err.response.data : err.message);
    error.value = 'Error al cargar el cobro semanal';

    // En caso de error, usar datos de demostración como fallback
    console.log('Usando datos de demostración como fallback para cobro semanal');
    cobroSemanal.value = mockCobroSemanal;
    productosVendidosSemana.value = mockProductosVendidos;
    // Resetear la sucursal seleccionada a 'todas' cuando hay un error
    sucursalSeleccionada.value = 'todas';
  } finally {
    cargando.value = false;
  }
};

// Función para cargar los productos del cobro
const cargarProductosCobro = async () => {
  if (!cobroSemanal.value) return;

  // Si estamos en modo demo, usar datos de demostración
  if (props.dataSource === 'mock') {
    console.log('Usando datos de demostración para productos del cobro');
    productosVendidosSemana.value = mockProductosVendidos;
    // Resetear la sucursal seleccionada a 'todas' cuando cambiamos a datos demo
    sucursalSeleccionada.value = 'todas';
    console.log('Productos procesados (demo):', productosVendidosSemana.value);
    return;
  }

  try {
    console.log('Solicitando productos del cobro desde la API...');

    try {
      const response = await axios.get(`${API_URL}/cobros-semanales/${cobroSemanal.value.id_cobro}/productos`, {
        // Agregar un timeout para evitar esperas indefinidas
        timeout: 10000,
        // Manejar errores de red y respuestas no válidas
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Solo aceptar respuestas exitosas
        }
      });

      console.log('Respuesta del servidor (productos) - status:', response.status);
      console.log('Respuesta del servidor (productos) - tipo:', typeof response.data);

      // Verificar si la respuesta es un objeto válido antes de mostrarla
      try {
        console.log('Respuesta del servidor (productos) - data:',
          typeof response.data === 'object' ? JSON.stringify(response.data) : response.data);
      } catch (logError) {
        console.log('No se pudo mostrar la respuesta completa de productos');
      }

      // Verificar si la respuesta es un array directamente o está dentro de un objeto con estructura {success, data}
      const productosData = Array.isArray(response.data)
        ? response.data
        : (response.data && response.data.success && Array.isArray(response.data.data))
          ? response.data.data
          : null;

      if (productosData) {
        productosVendidosSemana.value = productosData.map(producto => ({
          id_cobro_producto: producto.id_cobro_producto,
          id_producto: producto.id_producto,
          nombre: producto.nombre_producto || producto.nombre,
          cantidad: producto.cantidad,
          precio: producto.precio_unitario || producto.precio,
          total: producto.total,
          metodo_pago: producto.metodo_pago,
          id_sucursal: producto.id_direccion_local || producto.id_sucursal,
          sucursal: producto.sucursal ? {
            id_direccion_local: producto.sucursal.id_direccion_local,
            colonia: producto.sucursal.colonia,
            ciudad: producto.sucursal.Ciudad ? producto.sucursal.Ciudad.nombre_ciudad : 'Desconocida',
            nombre: producto.sucursal.Local ? producto.sucursal.Local.nombre_local : 'Desconocida'
          } : null
        }));
        console.log('Productos procesados:', productosVendidosSemana.value);

        // Verificar si hay productos para la sucursal seleccionada
        if (sucursalSeleccionada.value !== 'todas') {
          const existenProductosParaSucursal = productosVendidosSemana.value.some(
            p => p.id_sucursal === parseInt(sucursalSeleccionada.value)
          );

          if (!existenProductosParaSucursal) {
            // Si no hay productos para la sucursal seleccionada, resetear a 'todas'
            console.log('No hay productos para la sucursal seleccionada, mostrando todos los productos');
            sucursalSeleccionada.value = 'todas';
          }
        }
      } else {
        console.error('La respuesta de la API no tiene el formato esperado:', response.data);
        throw new Error('Formato de respuesta inválido');
      }
    } catch (apiError) {
      console.error('Error al solicitar productos del cobro desde la API:', apiError);
      throw apiError; // Re-lanzar el error para que lo maneje el catch externo
    }
  } catch (err) {
    console.error('Error al cargar productos del cobro:', err);
    console.error('Detalles del error:', err.response ? err.response.data : err.message);

    // En caso de error, usar datos de demostración como fallback
    console.log('Usando datos de demostración como fallback para productos del cobro');
    productosVendidosSemana.value = mockProductosVendidos;
    // Resetear la sucursal seleccionada a 'todas' cuando hay un error
    sucursalSeleccionada.value = 'todas';
  }
};

// Emits para eventos que se enviarán al componente padre
const emit = defineEmits([
  'exportToExcel',
  'exportToPDF',
  'openHistorialCobros',
  'openPagoComprobanteModal'
]);

// Variables para los tooltips
const showInfoTooltip = ref(false);
const showPedidosExtraTooltip = ref(false);
const showComisionTooltip = ref(false);
const showTarjetaTooltip = ref(false);

// Variables para las advertencias y comunicados
const facturasPendientes = ref(0); // Inicializar en 0, se actualizará con datos reales
const todasFacturasPagadas = ref(true); // Inicializar como true, se actualizará con datos reales

// Verificar si hay facturas pendientes anteriores
const verificarFacturasPendientes = async () => {
  try {
    // Obtener todas las facturas del local
    const response = await axios.get(`${API_URL}/cobros-semanales/local/${ID_LOCAL_TEMPORAL}`);

    if (response.data.success) {
      // Ordenar las facturas por fecha (más recientes primero)
      const facturas = response.data.data.sort((a, b) =>
        new Date(b.periodo_fin) - new Date(a.periodo_fin)
      );

      // Tomar solo las últimas 2 facturas
      const ultimasFacturas = facturas.slice(0, 2);

      // Filtrar las pendientes entre las últimas 2
      const pendientes = ultimasFacturas.filter(cobro => cobro.estado === 'pendiente');

      // Actualizar el contador de facturas pendientes
      facturasPendientes.value = pendientes.length;
      todasFacturasPagadas.value = pendientes.length === 0;

      console.log(`[Facturas] Se encontraron ${facturasPendientes.value} facturas pendientes entre las últimas 2`);

      // Si hay más de 2 facturas pendientes, se debería desactivar el local
      if (pendientes.length >= 2) {
        console.log('[Facturas] El local debería ser desactivado por tener 2 o más facturas pendientes');
      }
    }
  } catch (error) {
    console.error('Error al verificar facturas pendientes:', error);
  }
};

// Llamar a la función al cargar el componente
onMounted(() => {
  verificarFacturasPendientes();
});

// Mostrar advertencia si hay 1 factura pendiente o si el balance es positivo (pero nunca si el balance es negativo)
const mostrarAdvertencia = computed(() => {
  // Si el balance es negativo (la app debe pagar al local), no mostrar advertencia
  if (Number(balanceFinal.value) < 0) return false;

  // Si hay exactamente 1 factura pendiente o si hay balance positivo sin facturas pendientes
  const condicion = facturasPendientes.value === 1 ||
    (Number(balanceFinal.value) > 0 && facturasPendientes.value === 0);

  console.log('Condición mostrarAdvertencia:', {
    facturasPendientes: facturasPendientes.value,
    balanceFinal: Number(balanceFinal.value),
    resultado: condicion
  });

  return condicion;
});

// Mostrar comunicado si hay 2 o más facturas pendientes (independientemente del balance)
const mostrarComunicado = computed(() => {
  // Si hay 2 o más facturas pendientes, mostrar comunicado siempre
  const condicion = facturasPendientes.value >= 2;

  console.log('Condición mostrarComunicado:', {
    facturasPendientes: facturasPendientes.value,
    balanceFinal: Number(balanceFinal.value),
    resultado: condicion
  });

  return condicion;
});

// Calcular días restantes para pago (hasta el viernes)
const diasRestantesPago = computed(() => {
  try {
    // Usar la fecha actual del sistema
    const hoy = new Date();
    console.log('Fecha actual:', hoy.toISOString());

    // Ajustar para considerar solo año, mes, día
    const hoyAjustado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 5 = viernes, 6 = sábado)
    const diaSemana = hoyAjustado.getDay();
    console.log('Día de la semana actual:', diaSemana);

    // Calcular días hasta el viernes
    let diasHastaViernes;

    if (diaSemana === 1) {
      // Lunes
      diasHastaViernes = 5;
    } else if (diaSemana === 2) {
      // Martes
      diasHastaViernes = 4;
    } else if (diaSemana === 3) {
      // Miércoles
      diasHastaViernes = 3;
    } else if (diaSemana === 4) {
      // Jueves
      diasHastaViernes = 2;
    } else if (diaSemana === 5) {
      // Viernes
      diasHastaViernes = 1;
    } else {
      // Sábado (6) o Domingo (0), ya pasó el plazo
      diasHastaViernes = 0;
    }

    console.log('Días hasta el viernes:', diasHastaViernes);

    // Asegurar que el valor no sea negativo
    return Math.max(0, diasHastaViernes);
  } catch (error) {
    console.error('Error al calcular días restantes:', error);
    return 5; // Valor predeterminado en caso de error: 5 días (lunes)
  }
});

// Color de la barra de progreso según días restantes o facturas pendientes
const getColorClaseDiasPago = computed(() => {
  // Si hay 2 o más facturas pendientes, siempre mostrar en rojo
  if (facturasPendientes.value >= 2) return 'bg-red-600';
  // Si no, usar la lógica basada en días restantes
  if (diasRestantesPago.value <= 2) return 'bg-red-600';
  if (diasRestantesPago.value <= 4) return 'bg-amber-500';
  return 'bg-green-600';
});

// Calcular costo de pedidos extra
const calcularCostoPedidosExtra = () => {
  // Si el cobro ya tiene un costo de pedidos extra calculado, usarlo
  if (cobroSemanal.value && cobroSemanal.value.costo_pedidos_extra !== undefined && cobroSemanal.value.costo_pedidos_extra !== null) {
    const costo = parseFloat(cobroSemanal.value.costo_pedidos_extra);
    console.log('Usando costo de pedidos extra del cobro:', costo);
    return costo.toFixed(2);
  }

  // Calcular manualmente
  if (membresia.value.id_membresia === 3) return '0.00'; // Plan Premium no tiene costo por pedidos extra

  const cantidad = parseInt(pedidosExtra.value || 0);
  const precio = parseFloat(membresia.value.precio_delivery_extra || 0);
  const costo = cantidad * precio;

  console.log('Calculando costo de pedidos extra manualmente:');
  console.log('- Cantidad:', cantidad);
  console.log('- Precio por pedido:', precio);
  console.log('= Costo total:', costo);

  return costo.toFixed(2);
};

// Funciones para mostrar/ocultar los tooltips
const toggleInfoTooltip = () => {
  showInfoTooltip.value = !showInfoTooltip.value;
  // Cerrar otros tooltips
  showPedidosExtraTooltip.value = false;
  showComisionTooltip.value = false;
  showTarjetaTooltip.value = false;
};

const togglePedidosExtraTooltip = () => {
  showPedidosExtraTooltip.value = !showPedidosExtraTooltip.value;
  // Cerrar otros tooltips
  showInfoTooltip.value = false;
  showComisionTooltip.value = false;
  showTarjetaTooltip.value = false;
};

const toggleComisionTooltip = () => {
  showComisionTooltip.value = !showComisionTooltip.value;
  // Cerrar otros tooltips
  showInfoTooltip.value = false;
  showPedidosExtraTooltip.value = false;
  showTarjetaTooltip.value = false;
};

const toggleTarjetaTooltip = () => {
  showTarjetaTooltip.value = !showTarjetaTooltip.value;
  // Cerrar otros tooltips
  showInfoTooltip.value = false;
  showPedidosExtraTooltip.value = false;
  showComisionTooltip.value = false;
};

// Funciones para formatear fechas
const formatearFechaCorta = (fecha) => {
  if (!fecha) return 'N/A';

  // Si la fecha es una cadena en formato ISO (YYYY-MM-DD)
  if (typeof fecha === 'string') {
    // Extraer directamente las partes de la fecha sin convertir a objeto Date
    const partes = fecha.split('T')[0].split('-');
    if (partes.length === 3) {
      // Formatear como DD/MM/YYYY
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
  }

  // Si no es una cadena en formato ISO, devolver la fecha tal como está
  return fecha.toString();
};

// Función para obtener el día de la semana (comentada porque no se usa actualmente)
// const obtenerDiaSemana = (fecha) => {
//   if (!fecha) return '';
//   const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
//   return dias[new Date(fecha).getDay()];
// };

// Funciones para eventos
// Variables para controlar el estado de exportación
const exportandoExcel = ref(false);
const exportandoPDF = ref(false);

// Función para exportar a Excel
const exportarExcel = async () => {
  // Evitar múltiples clics
  if (exportandoExcel.value) return;

  try {
    // Activar indicador de carga
    exportandoExcel.value = true;

    console.log('Iniciando exportación a Excel...');

    // Validar que exista un cobro semanal
    if (!cobroSemanal.value || !cobroSemanal.value.id_cobro) {
      console.error('Error: No hay un cobro semanal válido para exportar');
      alert('No se puede exportar el Excel porque no hay datos de cobro disponibles');
      return;
    }

    // Importar XLSX si aún no está disponible
    if (typeof XLSX === 'undefined') {
      // Si estamos en un entorno de desarrollo, podemos importar dinámicamente
      try {
        const XLSX = await import('xlsx');
        if (!XLSX) {
          throw new Error('No se pudo cargar la librería XLSX');
        }
      } catch (e) {
        console.error('Error al cargar la librería XLSX:', e);
        alert('No se pudo cargar la librería para exportar a Excel. Por favor, inténtelo de nuevo más tarde.');
        return;
      }
    }

    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // HOJA 1: RESUMEN DEL COBRO
    // Preparar datos para la hoja de resumen
    const resumenData = [
      ['DETALLE DE COBRO SEMANAL'],
      [],
      ['Información del Local'],
      ['Nombre:', cobroSemanal.value.Local?.nombre_local || 'Local'],
      ['RTN:', cobroSemanal.value.Local?.rtn || 'RTN no disponible'],
      ['Período:', `${formatearFechaCorta(cobroSemanal.value.periodo_inicio)} al ${formatearFechaCorta(cobroSemanal.value.periodo_fin)}`],
      ['Sucursal:', sucursalSeleccionada.value === 'todas' ? 'Todas las sucursales' : sucursales.value.find(s => s.id_sucursal === parseInt(sucursalSeleccionada.value))?.colonia || 'Sucursal'],
      [],
      ['Resumen Financiero'],
      ['Pedidos extra:', `L. ${calcularCostoPedidosExtra()}`],
      ['Comisión app (Pagos Efectivo):', `L. ${cobroSemanal.value?.comision_efectivo ? parseFloat(cobroSemanal.value.comision_efectivo).toFixed(2) : (parseFloat(ventasEfectivoSemana.value || 0) * 0.15).toFixed(2)}`],
      ['Pago a recibir (Pagos Tarjeta):', `L. ${(parseFloat(ventasTarjetaSemana.value || 0) * 0.85).toFixed(2)}`],
      [],
      [Number(balanceFinal.value) >= 0 ? 'Total a Pagar:' : 'Total a Recibir:', `L. ${Math.abs(Number(balanceFinal.value) || 0).toFixed(2)}`],
      [],
      ['Información de Pago'],
      ['Banco Atlántida:', 'Cuenta: 1234-5678-9012-3456'],
      ['BAC Credomatic:', 'Cuenta: 9876-5432-1098-7654'],
      [],
      [`Fecha de generación: ${formatearFechaCorta(new Date())}`],
      [`© ${new Date().getFullYear()} Delivery App - Todos los derechos reservados`]
    ];

    // Crear hoja de resumen
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);

    // Configurar ancho de columnas para la hoja de resumen
    const wscols1 = [
      { wch: 30 }, // Columna A
      { wch: 40 }  // Columna B
    ];
    wsResumen['!cols'] = wscols1;

    // Agregar estilos a la hoja de resumen (títulos en negrita)
    // Nota: XLSX no soporta estilos directamente, pero podemos usar algunas propiedades básicas
    wsResumen['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } } // Fusionar celdas A1:B1 para el título
    ];

    // HOJA 2: PRODUCTOS VENDIDOS
    // Preparar datos para la hoja de productos
    const productosHeaders = ['Producto', 'Cantidad', 'Precio Unitario', 'Total', 'Método de Pago'];

    // Convertir los productos a filas para la tabla
    const productosRows = productosFiltrados.value.map(producto => [
      producto.nombre,
      producto.cantidad,
      parseFloat(producto.precio).toFixed(2),
      (producto.cantidad * producto.precio).toFixed(2),
      producto.metodo_pago === 'tarjeta' ? 'Tarjeta' : 'Efectivo'
    ]);

    // Agregar fila de totales
    productosRows.push([
      'TOTAL',
      productosFiltrados.value.reduce((total, producto) => total + producto.cantidad, 0),
      '',
      totalVentasFiltradas.value,
      ''
    ]);

    // Crear hoja de productos
    const wsProductos = XLSX.utils.aoa_to_sheet([productosHeaders, ...productosRows]);

    // Configurar ancho de columnas para la hoja de productos
    const wscols2 = [
      { wch: 40 }, // Producto
      { wch: 10 }, // Cantidad
      { wch: 15 }, // Precio Unitario
      { wch: 15 }, // Total
      { wch: 15 }  // Método de Pago
    ];
    wsProductos['!cols'] = wscols2;

    // Agregar las hojas al libro
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen del Cobro');
    XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos Vendidos');

    // Generar nombre de archivo
    const nombreArchivo = `Cobro_Semanal_${formatearFechaCorta(cobroSemanal.value.periodo_inicio)}_${formatearFechaCorta(cobroSemanal.value.periodo_fin)}`;

    // Exportar a archivo
    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);

    console.log('Archivo Excel generado correctamente');
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    alert(`Error al generar el Excel: ${error.message}`);
  } finally {
    // Desactivar indicador de carga
    exportandoExcel.value = false;
  }
};

// Función para exportar a PDF
const exportarPDF = async () => {
  // Evitar múltiples clics
  if (exportandoPDF.value) return;

  try {
    // Activar indicador de carga
    exportandoPDF.value = true;

    console.log('Iniciando exportación a PDF...');

    // Validar que exista un cobro semanal
    if (!cobroSemanal.value || !cobroSemanal.value.id_cobro) {
      console.error('Error: No hay un cobro semanal válido para exportar');
      alert('No se puede exportar el PDF porque no hay datos de cobro disponibles');
      return;
    }

    // Preparar datos para la vista previa del PDF
    const tituloSucursal = sucursalSeleccionada.value === 'todas'
      ? 'Todas las sucursales'
      : sucursales.value.find(s => s.id_sucursal === parseInt(sucursalSeleccionada.value))?.colonia || 'Sucursal';

    // Preparar los datos para la vista previa
    const pdfPreviewData = {
      titulo: 'Detalle de Cobro',
      subtitulo: cobroSemanal.value.num_factura || `FAC-${formatearFechaCorta(cobroSemanal.value.periodo_inicio)}-${cobroSemanal.value.id_local}`,
      periodo: `${formatearFechaCorta(cobroSemanal.value.periodo_inicio)} al ${formatearFechaCorta(cobroSemanal.value.periodo_fin)}`,
      local: {
        nombre_local: cobroSemanal.value.Local?.nombre_local || 'Local',
        rtn: cobroSemanal.value.Local?.rtn || 'RTN no disponible',
        sucursal: tituloSucursal,
        membresia: cobroSemanal.value.Local?.MembresiaLocales?.nombre_membresia || 'Básica'
      },
      tablaTitle: 'Productos Vendidos',
      headers: ['Producto', 'Cantidad', 'Precio', 'Total'],
      rows: productosFiltrados.value.map(producto => [
        producto.nombre,
        producto.cantidad.toString(),
        `L. ${parseFloat(producto.precio).toFixed(2)}`,
        `L. ${(producto.cantidad * producto.precio).toFixed(2)}`
      ]),
      footers: ['', '', 'Total Ventas:', `L. ${totalVentasFiltradas.value}`],
      resumen: [
        {
          label: 'Pedidos extra',
          value: `L. ${calcularCostoPedidosExtra()}`,
          color: 'text-red-600',
          cantidad: pedidosExtra.value
        },
        {
          label: 'Comisión app (Pagos Efectivo)',
          value: `L. ${cobroSemanal.value?.comision_efectivo ? parseFloat(cobroSemanal.value.comision_efectivo).toFixed(2) : (parseFloat(ventasEfectivoSemana.value || 0) * 0.15).toFixed(2)}`,
          color: 'text-red-600'
        },
        {
          label: 'Pago a recibir (Pagos Tarjeta)',
          value: `L. ${(parseFloat(ventasTarjetaSemana.value || 0) * 0.85).toFixed(2)}`,
          color: 'text-green-600'
        },
        {
          label: Number(balanceFinal.value) >= 0 ? 'Total a Pagar' : 'Total a Recibir',
          value: `L. ${Math.abs(Number(balanceFinal.value) || 0).toFixed(2)}`,
          color: Number(balanceFinal.value) >= 0 ? 'text-red-600' : 'text-green-600'
        }
      ],
      mostrarGrafico: false,
      esComprobante: false,
      estado: cobroSemanal.value.estado || 'pendiente'
    };



    // Asegurarse de que el RTN se pase correctamente
    if (cobroSemanal.value && cobroSemanal.value.Local && cobroSemanal.value.Local.rtn) {
      pdfPreviewData.local.rtn = cobroSemanal.value.Local.rtn;
    }

    // Emitir evento para mostrar la vista previa
    emit('exportToPDF', pdfPreviewData);
  } catch (error) {
    console.error('Error al generar la vista previa del PDF:', error);
    alert(`Error al generar la vista previa del PDF: ${error.message}`);
  } finally {
    // Desactivar indicador de carga
    exportandoPDF.value = false;
  }
};

const openHistorialCobros = () => {
  // Emitir evento para que el componente padre abra el modal
  emit('openHistorialCobros');
};

const openPagoComprobanteModal = () => {
  emit('openPagoComprobanteModal', cobroSemanal.value);

  // Agregar un evento para actualizar el contador después de procesar el pago
  const checkPagoStatus = setInterval(async () => {
    // Verificar si el modal de pago sigue abierto
    const modal = document.querySelector('.modal-pago-comprobante');
    if (!modal) {
      // Si el modal ya no está visible, actualizar el contador y detener el intervalo
      clearInterval(checkPagoStatus);
      await verificarFacturasPendientes();
    }
  }, 1000); // Verificar cada segundo
};

// Función para marcar un cobro como pagado (comentada porque no se usa actualmente)
// const marcarComoPagado = async (formData) => {
//   try {
//     const response = await axios.put(`${API_URL}/cobros-semanales/${cobroSemanal.value.id_cobro}/pagar`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//
//     if (response.data.success) {
//       console.log('Pago registrado correctamente');
//       await cargarCobroSemanal(); // Recargar los datos
//     }
//   } catch (err) {
//     console.error('Error al marcar como pagado:', err);
//     console.error('Error al registrar el pago');
//   }
// };

// Observar cambios en la fuente de datos
watch(() => props.dataSource, async (newValue) => {
  console.log(`Fuente de datos cambiada a: ${newValue}`);

  try {
    // Resetear la sucursal seleccionada a 'todas' cuando cambia la fuente de datos
    sucursalSeleccionada.value = 'todas';

    // Limpiar completamente todos los datos actuales
    sucursales.value = [];
    cobroSemanal.value = null;
    productosVendidosSemana.value = [];

    console.log(`Cambiando a datos de ${newValue}, datos limpiados`);

    // Esperar un momento para asegurar que la UI se actualice
    await new Promise(resolve => setTimeout(resolve, 200));

    // Primero cargar las sucursales para que estén disponibles cuando se carguen los productos
    await cargarSucursales();

    // Esperar otro momento para asegurar que las sucursales se han cargado correctamente
    await new Promise(resolve => setTimeout(resolve, 200));

    // Luego cargar el cobro semanal y sus productos
    await cargarCobroSemanal();

    console.log(`Datos cargados con fuente: ${newValue}, sucursal seleccionada: ${sucursalSeleccionada.value}`);
    console.log(`Sucursales disponibles después de cargar: ${JSON.stringify(sucursales.value)}`);
  } catch (err) {
    console.error('Error al cambiar la fuente de datos:', err);

    // En caso de error, asegurarse de que al menos se muestren los datos de demostración
    if (newValue === 'api') {
      console.log('Error al cargar datos de API, cambiando a datos de demostración');
      sucursales.value = [...mockSucursales];
      cobroSemanal.value = mockCobroSemanal;
      productosVendidosSemana.value = mockProductosVendidos;
      sucursalSeleccionada.value = 'todas';
    }
  }
}, { immediate: true });

// Al montar el componente
onMounted(() => {
  // Agregar event listener para cerrar los tooltips cuando se hace clic fuera de ellos
  document.addEventListener('click', () => {
    showInfoTooltip.value = false;
    showPedidosExtraTooltip.value = false;
    showComisionTooltip.value = false;
    showTarjetaTooltip.value = false;
  });

  console.log('Componente CobroSemanal montado');
  console.log('Usando ID de local temporal para pruebas:', ID_LOCAL_TEMPORAL);
  console.log('Fuente de datos inicial:', props.dataSource);

  // No es necesario cargar datos aquí, ya que el watcher con immediate: true se encargará de eso
});
</script>

<style scoped>
.productos-table th, .productos-table td {
  text-align: left;
  padding: 0.75rem 1rem;
}

.info-tooltip {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
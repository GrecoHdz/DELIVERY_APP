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
            <h2 class="text-lg sm:text-xl font-bold text-gray-800">Cobro Semanal</h2>

            <!-- Mensaje según el balance -->
            <p class="text-gray-600 text-sm sm:text-base">
              {{ balanceFinal >= 0 ? '' : 'Resumen de ventas y comisiones de la semana' }}
            </p>

            <!-- Contador de días restantes para pagar -->
            <div class="mt-2">
              <div class="flex items-center mb-2">
                <ClockIcon :size="16" class="text-amber-600 mr-2" />
                <span class="text-sm font-medium text-gray-700">Tiene {{ diasRestantesPago }} días para realizar el pago</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div
                  class="h-3 rounded-full transition-all duration-500 ease-out"
                  :class="getColorClaseDiasPago"
                  :style="{width: `${(diasRestantesPago / 7) * 100}%`}"
                ></div>
              </div>
            </div>
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
                {{ sucursal.nombre }}
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
                    Total Ventas en efectivo: L. {{ ventasEfectivoSemana }}
                  </span>
                </span>
              </span>
              <span class="text-red-600 font-medium">L. {{ (ventasEfectivoSemana * 0.15).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white">
              <span class="text-gray-700 flex items-center">
                Comisión app (Pagos Tarjeta)
                <span class="relative ml-1">
                  <button @click.stop="toggleTarjetaTooltip" type="button" class="text-gray-400 focus:outline-none">
                    <HelpCircleIcon :size="14" class="cursor-pointer" />
                  </button>
                  <span v-if="showTarjetaTooltip" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    Total Ventas con tarjeta: L. {{ ventasTarjetaSemana }}
                  </span>
                </span>
              </span>
              <span class="text-green-600 font-medium">L. {{ (ventasTarjetaSemana * 0.85).toFixed(2) }}</span>
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
                Este resumen corresponde a la semana del {{ obtenerDiaSemana(fechaInicioSemana) }} {{ formatearFechaCorta(fechaInicioSemana) }} hasta el {{ obtenerDiaSemana(fechaFinSemana) }} {{ formatearFechaCorta(fechaFinSemana) }}. Para ver información más detallada, consulte la sección de Estadísticas o sección de Reportes.
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
import { ref, computed, onMounted } from 'vue';
import {
  Receipt as ReceiptIcon,
  Clock as ClockIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  FileText as FileTextIcon,
  DollarSign as DollarSignIcon,
  Check as CheckIcon,
  CreditCard as CreditCardIcon
} from 'lucide-vue-next';

// Props para recibir datos del componente padre
const props = defineProps({
  // Datos de fechas
  fechaInicioSemana: {
    type: Date,
    required: true
  },
  fechaFinSemana: {
    type: Date,
    required: true
  },
  fechaLimitePago: {
    type: Date,
    required: true
  },
  // Datos de productos y ventas
  productosVendidosSemana: {
    type: Array,
    required: true
  },
  ventasEfectivoSemana: {
    type: [String, Number],
    required: true
  },
  ventasTarjetaSemana: {
    type: [String, Number],
    required: true
  },
  totalVentasSemana: {
    type: [String, Number],
    required: true
  },
  // Datos de membresía y pedidos
  pedidosExtra: {
    type: Number,
    required: true
  },
  membresia: {
    type: Object,
    required: true
  },
  // Estado de cobro
  cobroActualPagado: {
    type: Boolean,
    required: true
  },
  // Balance final
  balanceFinal: {
    type: Number,
    required: true
  }
});

// Lista de sucursales (simulada)
const sucursales = ref([
  {
    id_sucursal: 1,
    nombre: "Sucursal Central",
    ciudad: "Tegucigalpa",
    colonia: "Kennedy"
  },
  {
    id_sucursal: 2,
    nombre: "Sucursal Mall Multiplaza",
    ciudad: "Tegucigalpa",
    colonia: "Los Proceres"
  },
  {
    id_sucursal: 3,
    nombre: "Sucursal City Mall",
    ciudad: "San Pedro Sula",
    colonia: "Centro"
  }
]);

// Sucursal seleccionada para filtrar
const sucursalSeleccionada = ref('todas');

// Productos filtrados por sucursal
const productosFiltrados = computed(() => {
  // Asignar una sucursal a cada producto (simulado)
  const productosConSucursal = props.productosVendidosSemana.map((producto, index) => {
    // Asignar sucursales de manera alternada para simular datos
    const idSucursal = (index % sucursales.value.length) + 1;
    return {
      ...producto,
      id_sucursal: idSucursal
    };
  });

  // Filtrar por sucursal seleccionada
  if (sucursalSeleccionada.value === 'todas') {
    return productosConSucursal;
  } else {
    return productosConSucursal.filter(producto =>
      producto.id_sucursal === parseInt(sucursalSeleccionada.value)
    );
  }
});

// Total de ventas filtradas
const totalVentasFiltradas = computed(() => {
  return productosFiltrados.value.reduce((total, producto) => {
    return total + (producto.cantidad * producto.precio);
  }, 0).toFixed(2);
});

// Función para obtener el nombre de la sucursal
const getNombreSucursal = (idSucursal) => {
  const sucursal = sucursales.value.find(s => s.id_sucursal === idSucursal);
  return sucursal ? sucursal.nombre : 'Desconocida';
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

// Calcular días restantes para pago
const diasRestantesPago = computed(() => {
  const hoy = new Date();
  const limite = new Date(props.fechaLimitePago);
  const diferencia = limite.getTime() - hoy.getTime();
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  return Math.max(0, dias);
});

// Color de la barra de progreso según días restantes
const getColorClaseDiasPago = computed(() => {
  if (diasRestantesPago.value <= 2) return 'bg-red-600';
  if (diasRestantesPago.value <= 4) return 'bg-amber-500';
  return 'bg-green-600';
});

// Calcular costo de pedidos extra
const calcularCostoPedidosExtra = () => {
  if (props.membresia.id_membresia === 3) return 0; // Plan Premium no tiene costo por pedidos extra
  return (props.pedidosExtra * props.membresia.precio_delivery_extra).toFixed(2);
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
  const f = new Date(fecha);
  return `${f.getDate().toString().padStart(2, '0')}/${(f.getMonth() + 1).toString().padStart(2, '0')}/${f.getFullYear()}`;
};

const obtenerDiaSemana = (fecha) => {
  if (!fecha) return '';
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date(fecha).getDay()];
};

// Funciones para eventos
const exportToExcel = () => {
  emit('exportToExcel');
};

const exportToPDF = () => {
  emit('exportToPDF', sucursalSeleccionada.value);
};

const openHistorialCobros = () => {
  emit('openHistorialCobros');
};

const openPagoComprobanteModal = () => {
  emit('openPagoComprobanteModal');
};

// Al montar el componente
onMounted(() => {
  // Agregar event listener para cerrar los tooltips cuando se hace clic fuera de ellos
  document.addEventListener('click', () => {
    showInfoTooltip.value = false;
    showPedidosExtraTooltip.value = false;
    showComisionTooltip.value = false;
    showTarjetaTooltip.value = false;
  });
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
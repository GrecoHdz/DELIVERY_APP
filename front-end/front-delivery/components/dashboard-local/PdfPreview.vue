<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Cabecera del modal -->
      <div class="flex items-center justify-between p-4 border-b bg-blue-50">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Vista previa del {{ esComprobante ? 'comprobante' : 'reporte' }}</h3>
          <p class="text-sm text-gray-600">Revise el documento antes de descargarlo</p>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido del modal -->
      <div class="flex-1 overflow-auto p-4">
        <!-- Mensaje informativo -->
        <div class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm text-blue-800 font-medium">Esta es una vista previa del {{ esComprobante ? 'comprobante' : 'reporte' }}</p>
            <p class="text-xs text-blue-600">Puede revisar el contenido antes de descargarlo como PDF. Si todo está correcto, haga clic en "Descargar PDF".</p>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mx-auto" style="width: 595px; min-height: 842px;">
          <!-- Encabezado del reporte -->
          <div class="flex justify-between items-start mb-8">
            <div class="flex items-center">
              <div class="bg-blue-600 text-white p-3 rounded-lg">
                <span class="font-bold">DELIVERY</span>
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-bold text-gray-800">{{ titulo }}</h2>
                <p class="text-sm text-gray-600">{{ subtitulo }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Fecha: {{ formatearFecha(new Date()) }}</p>
              <p class="text-sm text-gray-600">Período: {{ periodo }}</p>
            </div>
          </div>

          <!-- Sección de información del local y resumen financiero en la misma fila -->
          <div class="mb-8 grid grid-cols-2 gap-4">
            <!-- Información del local -->
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Información del Local</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">Nombre:</p>
                  <p class="font-medium text-gray-800">{{ local.nombre_local }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">RTN:</p>
                  <p class="font-medium text-gray-800">{{ local.rtn }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Período:</p>
                  <p class="font-medium text-gray-800">{{ periodo }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Sucursal:</p>
                  <p class="font-medium text-gray-800">{{ local.sucursal || 'Todas las sucursales' }}</p>
                </div>
              </div>
            </div>

            <!-- Resumen financiero -->
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Resumen Financiero</h3>
              <div class="space-y-3">
                <!-- Primeros 4 items -->
                <div v-for="(item, index) in resumen.slice(0, 4)" :key="index" class="flex justify-between">
                  <span class="text-sm text-gray-600">{{ item.label }}:</span>
                  <span :class="item.color || 'text-gray-800'" class="font-medium whitespace-nowrap">{{ item.value }}</span>
                </div>

                <!-- Total a Pagar/Recibir (último item) -->
                <div class="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <span class="text-sm font-medium text-gray-700">{{ resumen[resumen.length - 1].label }}:</span>
                  <span :class="resumen[resumen.length - 1].color || 'text-gray-800'" class="font-medium whitespace-nowrap">
                    {{ resumen[resumen.length - 1].value }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla de datos -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              {{ tablaTitle }}
              <span class="text-sm font-normal text-gray-500 ml-2">({{ local.sucursal }})</span>
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr class="bg-blue-600 text-white">
                    <th v-for="(header, index) in headers" :key="index"
                        class="py-2 px-4 text-center"
                        :class="{
                          'w-[25%]': index === 0,
                          'w-[10%]': index === 1,
                          'w-[15%]': index === 2,
                          'w-[20%]': index === 3, /* Columna Total más ancha */
                          'w-[30%]': index === 4
                        }">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in rows" :key="rowIndex" :class="rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                        class="py-2 px-4 border-t border-gray-200 text-gray-800 text-center">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="footers && footers.length">
                  <tr class="bg-gray-100 font-medium">
                    <td v-for="(footer, index) in footers" :key="index"
                        class="py-2 px-4 border-t border-gray-200 text-gray-800"
                        :class="{
                          'text-center': index < footers.length - 2,
                          'text-right': index >= footers.length - 2
                        }">
                      {{ footer }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>



          <!-- Información de Pago o Estado del Cobro -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              {{ esComprobante ? 'Estado del Cobro' : 'Información de Pago' }}
            </h3>

            <!-- Para reportes normales: Información de pago -->
            <div v-if="!esComprobante" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-sm text-gray-600 mb-3">Realiza tu pago a cualquiera de nuestras cuentas:</p>

              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-white rounded border border-gray-200">
                  <p class="font-medium text-gray-800">Banco Atlántida</p>
                  <p class="text-gray-700">Cuenta: 1234-5678-9012-3456</p>
                </div>

                <div class="p-3 bg-white rounded border border-gray-200">
                  <p class="font-medium text-gray-800">BAC Credomatic</p>
                  <p class="text-gray-700">Cuenta: 9876-5432-1098-7654</p>
                </div>
              </div>
            </div>

            <!-- Para comprobantes: Estado del cobro -->
            <div v-else class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex justify-center items-center">
                <div
                  class="text-center py-3 px-6 rounded-lg font-bold text-lg"
                  :class="{
                    'bg-green-100 text-green-700': estado === 'pagado',
                    'bg-red-100 text-red-700': estado === 'vencido',
                    'bg-gray-100 text-gray-700': estado !== 'pagado' && estado !== 'vencido'
                  }"
                >
                  {{ estado === 'pagado' ? 'PAGADO' :
                     estado === 'vencido' ? 'VENCIDO' : 'PENDIENTE' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Pie de página -->
          <div class="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
            <p>Este documento es un comprobante generado automáticamente por el sistema.</p>
            <p>© {{ new Date().getFullYear() }} Delivery App - Todos los derechos reservados</p>
          </div>
        </div>
      </div>

      <!-- Pie del modal con botones -->
      <div class="flex justify-between items-center p-4 border-t">
        <!-- Selector de sucursal (solo visible para reportes, no para comprobantes) -->
        <div v-if="!esComprobante" class="flex items-center">
          <label for="filtroSucursalPdf" class="mr-2 text-sm text-gray-600">Sucursal:</label>
          <select
            id="filtroSucursalPdf"
            v-model="sucursalSeleccionada"
            class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="cambiarSucursal"
          >
            <option value="todas">Todas las sucursales</option>
            <option v-for="sucursal in sucursales" :key="sucursal.id_sucursal" :value="sucursal.id_sucursal">
              {{ sucursal.nombre }}
            </option>
          </select>
        </div>

        <!-- Espacio vacío para mantener la alineación cuando no hay selector -->
        <div v-else></div>

        <!-- Botones de acción -->
        <div>
          <button @click="$emit('close')" class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg mr-2 hover:bg-gray-200">
            Cancelar
          </button>
          <button @click="$emit('download')" class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';

// Definir props
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  subtitulo: {
    type: String,
    default: ''
  },
  periodo: {
    type: String,
    required: true
  },
  local: {
    type: Object,
    required: true
  },
  tablaTitle: {
    type: String,
    default: 'Datos'
  },
  headers: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  footers: {
    type: Array,
    default: () => []
  },
  resumen: {
    type: Array,
    required: true
  },
  mostrarGrafico: {
    type: Boolean,
    default: true
  },
  esComprobante: {
    type: Boolean,
    default: false
  },
  estado: {
    type: String,
    default: 'pendiente'
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

// Definir emits
const emit = defineEmits(['close', 'download', 'cambiarSucursal']);

// Función para cambiar la sucursal
const cambiarSucursal = () => {
  emit('cambiarSucursal', sucursalSeleccionada.value);
};

// Función para formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const f = new Date(fecha);
  return `${f.getDate().toString().padStart(2, '0')}/${(f.getMonth() + 1).toString().padStart(2, '0')}/${f.getFullYear()}`;
};

// Al montar el componente, inicializar la sucursal seleccionada
onMounted(() => {
  // Si el local tiene una sucursal específica, seleccionarla
  if (props.local && props.local.sucursalId) {
    sucursalSeleccionada.value = props.local.sucursalId;
  }
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

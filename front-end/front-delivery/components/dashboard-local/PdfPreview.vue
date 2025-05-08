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
                  <p class="font-medium text-gray-800">{{ local.rtn || 'Sin RTN' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Período:</p>
                  <p class="font-medium text-gray-800">{{ periodo }}</p>
                </div>
              </div>
            </div>

            <!-- Resumen financiero -->
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Resumen Financiero</h3>
              <div class="space-y-3">
                <!-- Primeros items (todos excepto el último) -->
                <div v-for="(item, index) in resumen.slice(0, resumen.length - 1)" :key="index" class="mb-3">
                  <div class="text-sm text-gray-600">
                    {{ item.label }}:
                  </div>
                  <div :class="item.color || 'text-gray-800'" class="font-medium">
                    {{ item.label.includes('Pedidos Extra (') ? '' : item.value }}
                  </div>
                </div>

                <!-- Total a Pagar/Recibir (último item) -->
                <div class="flex justify-between mt-3">
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
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ tablaTitle }}
              </h3>
              <p class="text-sm text-gray-600">{{ local.sucursal || 'Todas las sucursales' }}</p>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr class="bg-blue-600 text-white">
                    <th v-for="(header, index) in headers" :key="index"
                        class="py-2 px-4 text-center text-base"
                        :class="{
                          'w-[25%]': index === 0,
                          'w-[10%]': index === 1,
                          'w-[15%]': index === 2,
                          'w-[20%]': index === 3,
                          'w-[30%]': index === 4
                        }">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in rows" :key="rowIndex" :class="rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                        class="py-2 px-4 border-t border-gray-200 text-gray-800 text-center text-sm"
                        :class="{
                          'text-left': cellIndex === 0,
                          'text-center': cellIndex === 1,
                          'text-center': cellIndex === 2,
                          'text-center': cellIndex === 3
                        }">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="footers && footers.length">
                  <tr class="bg-gray-100 font-medium">
                    <td v-for="(footer, index) in footers" :key="index"
                        class="py-2 px-4 border-t border-gray-200 text-gray-800 text-sm"
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

            <!-- Estado del cobro (solo para comprobantes) -->
            <div v-if="esComprobante" class="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div
                class="inline-block px-6 py-3 rounded-lg font-bold text-lg"
                :class="{
                  'bg-green-100 text-green-800': estado === 'pagado',
                  'bg-red-100 text-red-800': estado === 'vencido',
                  'bg-gray-100 text-gray-800': estado !== 'pagado' && estado !== 'vencido'
                }"
              >
                {{ estado === 'pagado' ? 'PAGADO' : (estado === 'vencido' ? 'VENCIDO' : 'PENDIENTE') }}
              </div>
            </div>

            <!-- Información de pago (para reportes) -->
            <div v-else class="p-4 bg-gray-50 rounded-lg border border-gray-200">
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
        <!-- Espacio vacío a la izquierda para mantener la alineación -->
        <div></div>

        <!-- Botones de acción -->
        <div class="flex items-center space-x-2">
          <button @click="$emit('close')" class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
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
import { defineProps, defineEmits, onMounted } from 'vue';

// Definir props
const props = defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  periodo: { type: String, required: true },
  local: { type: Object, required: true },
  tablaTitle: { type: String, default: 'Datos' },
  headers: { type: Array, required: true },
  rows: { type: Array, required: true },
  footers: { type: Array, default: () => [] },
  resumen: { type: Array, required: true },
  mostrarGrafico: { type: Boolean, default: true },
  esComprobante: { type: Boolean, default: false },
  estado: { type: String, default: 'pendiente' }
});

// Definir emits
const emit = defineEmits(['close', 'download']);

// Función para formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const f = new Date(fecha);
  return `${f.getDate().toString().padStart(2, '0')}/${(f.getMonth() + 1).toString().padStart(2, '0')}/${f.getFullYear()}`;
};

// Función para formatear moneda
const formatearMoneda = (valor) => {
  if (!valor) return 'L. 0.00';
  return `L. ${parseFloat(valor).toFixed(2)}`;
};

// Al montar el componente
onMounted(() => {
  // Inicialización si es necesaria
});


</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

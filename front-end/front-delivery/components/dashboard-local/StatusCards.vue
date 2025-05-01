<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Tarjeta de Pedidos Semanales -->
    <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="text-gray-600 text-sm">Pedidos Semanales</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ estadisticas.pedidos_semanales || 0 }}</h3>
        </div>
        <div class="p-3 bg-blue-100 rounded-full">
          <BoxIcon class="text-blue-600" :size="20" />
        </div>
      </div>
      <div class="flex items-center text-sm">
        <span :class="estadisticas.tendencia_pedidos >= 0 ? 'text-green-500' : 'text-red-500'" class="flex items-center">
          <component :is="estadisticas.tendencia_pedidos >= 0 ? ArrowUpIcon : ArrowDownIcon" :size="16" class="mr-1" />
          {{ Math.abs(estadisticas.tendencia_pedidos || 0) }}%
        </span>
        <span class="text-gray-600 ml-1">vs. semana pasada</span>
      </div>
    </div>

    <!-- Tarjeta de Ingresos Semanales -->
    <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="text-gray-600 text-sm">Ingresos Semanales</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">L. {{ formatearNumero(estadisticas.ingresos_semanales || 0) }}</h3>
        </div>
        <div class="p-3 bg-green-100 rounded-full">
          <DollarSignIcon class="text-green-600" :size="20" />
        </div>
      </div>
      <div class="flex items-center text-sm">
        <span :class="estadisticas.tendencia_ingresos >= 0 ? 'text-green-500' : 'text-red-500'" class="flex items-center">
          <component :is="estadisticas.tendencia_ingresos >= 0 ? ArrowUpIcon : ArrowDownIcon" :size="16" class="mr-1" />
          {{ Math.abs(estadisticas.tendencia_ingresos || 0) }}%
        </span>
        <span class="text-gray-600 ml-1">vs. semana pasada</span>
      </div>
    </div>

    <!-- Tarjeta de Pedidos Restantes -->
    <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
      <div class="flex justify-between items-start mb-3">
        <div>
          <p class="text-gray-600 text-sm">Pedidos Restantes</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">
            {{ localInfo.pedidos_restantes }}/{{ getPedidosMaximos() }}
          </h3>
        </div>
        <div class="p-3 bg-amber-100 rounded-full">
          <ShoppingBagIcon class="text-amber-600" :size="20" />
        </div>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
          :style="{width: `${(localInfo.pedidos_restantes / getPedidosMaximos()) * 100}%`}"
        ></div>
      </div>
      <p class="text-xs text-gray-600 mt-2">
        {{ membresia.id_membresia === 3 ? 'Pedidos ilimitados' : `Costo por pedido extra: L. ${membresia.id_membresia === 1 ? '25' : '15'}` }}
      </p>
    </div>

    <!-- Tarjeta de Membresía -->
    <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="text-gray-600 text-sm">Membresía Actual</p>
          <h3 class="text-2xl font-bold mt-1" :class="{
            'text-gray-800': membresia.id_membresia === 1,
            'text-blue-700': membresia.id_membresia === 2,
            'text-purple-700': membresia.id_membresia === 3
          }">{{ getTipoMembresiaNombre(membresia.id_membresia) }}</h3>
        </div>
        <div class="p-3 rounded-full" :class="{
          'bg-gray-100': membresia.id_membresia === 1,
          'bg-blue-100': membresia.id_membresia === 2,
          'bg-purple-100': membresia.id_membresia === 3
        }">
          <CrownIcon :class="{
            'text-gray-600': membresia.id_membresia === 1,
            'text-blue-600': membresia.id_membresia === 2,
            'text-purple-600': membresia.id_membresia === 3
          }" :size="20" />
        </div>
      </div>
      <p class="text-amber-600 text-sm flex items-center">
        <ClockIcon :size="16" class="mr-1" />
        Vence: Domingo 11:59 PM
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { 
  Box as BoxIcon,
  DollarSign as DollarSignIcon,
  ShoppingBag as ShoppingBagIcon,
  Crown as CrownIcon,
  Clock as ClockIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon
} from 'lucide-vue-next';

const props = defineProps({
  localInfo: {
    type: Object,
    required: true
  },
  membresia: {
    type: Object,
    required: true
  },
  estadisticas: {
    type: Object,
    required: true,
    default: () => ({
      pedidos_semanales: 0,
      ingresos_semanales: 0,
      tendencia_pedidos: 0,
      tendencia_ingresos: 0
    })
  }
});

const formatearNumero = (numero) => {
  return Number(numero).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getPedidosMaximos = () => {
  switch (props.membresia.id_membresia) {
    case 1: return 5;
    case 2: return 15;
    case 3: return '∞'; // Infinito para membresía premium
    default: return 5;
  }
};

const getTipoMembresiaNombre = (idMembresia) => {
  switch (idMembresia) {
    case 1: return 'Gratuita';
    case 2: return 'Básica';
    case 3: return 'Premium';
    default: return 'Desconocida';
  }
};
</script>

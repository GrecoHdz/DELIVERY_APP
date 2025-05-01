<template>
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">{{ localInfo.nombre_local }}</h1>
      <p class="text-gray-600">{{ formatearFecha(new Date()) }}</p>
    </div>
    <div class="flex items-center">
      <span class="text-sm text-gray-600 mr-2">Fuente:</span>
      <div class="bg-white shadow border border-gray-200 rounded-lg flex items-center p-1">
        <button 
          @click="toggleDataSource('mock')" 
          class="px-3 py-1 text-sm rounded-md transition-colors"
          :class="dataSource === 'mock' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          Demo
        </button>
        <button 
          @click="toggleDataSource('api')" 
          class="px-3 py-1 text-sm rounded-md transition-colors"
          :class="dataSource === 'api' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          API
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  localInfo: {
    type: Object,
    required: true,
    default: () => ({
      nombre_local: 'Local',
      apertura: '08:00:00',
      cierre: '20:00:00'
    })
  },
  dataSource: {
    type: String,
    required: true,
    default: 'mock'
  }
});

const emit = defineEmits(['update:dataSource']);

const toggleDataSource = (source) => {
  emit('update:dataSource', source);
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', options);
};
</script>

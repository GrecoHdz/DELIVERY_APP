<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay de fondo -->
      <div class="fixed inset-0 transition-opacity" @click="closeModal">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Realizar Pago
              </h3>

              <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex justify-between mb-2">
                  <span class="text-gray-700">Total a Pagar:</span>
                  <span class="font-bold text-red-600">L. {{ formatNumber(Math.abs(cobroData.total)) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Periodo:</span>
                  <span class="text-gray-800">{{ formatDate(cobroData.periodo_inicio) }} - {{ formatDate(cobroData.periodo_fin) }}</span>
                </div>
              </div>

              <form @submit.prevent="submitForm">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-medium mb-2" for="metodoPago">
                    Método de Pago
                  </label>
                  <select
                    id="metodoPago"
                    v-model="formData.metodoPago"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>

                <div v-if="formData.metodoPago === 'transferencia'" class="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                  <h4 class="font-medium text-gray-800 mb-2">Información Bancaria:</h4>
                  <p class="mb-1"><span class="font-medium">Banco:</span> Banco Atlántida</p>
                  <p class="mb-1"><span class="font-medium">Cuenta:</span> 1234-5678-9012-3456</p>
                  <p class="mb-1"><span class="font-medium">Titular:</span> Delivery App, S.A.</p>
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-medium mb-2" for="comprobante">
                    Comprobante de Pago
                  </label>
                  <div class="flex items-center justify-center w-full">
                    <label
                      class="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div class="flex flex-col items-center justify-center pt-5 pb-6" v-if="!previewImage">
                        <svg class="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p class="mb-1 text-sm text-gray-500">
                          <span class="font-semibold">Haga clic para subir</span> o arrastre y suelte
                        </p>
                        <p class="text-xs text-gray-500">PNG, JPG o PDF (Máx. 4MB)</p>
                      </div>
                      <div class="flex flex-col items-center justify-center h-full" v-else>
                        <img v-if="isImage" :src="previewImage" alt="Vista previa" class="h-full object-contain" />
                        <div v-else class="flex items-center justify-center h-full">
                          <svg class="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                          </svg>
                          <span class="ml-2 text-sm text-gray-600">{{ fileName }}</span>
                        </div>
                      </div>
                      <input
                        id="comprobante"
                        type="file"
                        class="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        @change="handleFileChange"
                        required
                      />
                    </label>
                  </div>
                  <p v-if="fileError" class="mt-1 text-sm text-red-600">{{ fileError }}</p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    @click="closeModal"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                    <span v-else>Confirmar Pago</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  cobroData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'payment-success']);

const showModal = computed(() => props.show);
const formData = ref({
  metodoPago: 'transferencia',
  comprobante: null
});
const previewImage = ref(null);
const isImage = ref(true);
const fileName = ref('');
const fileError = ref('');
const loading = ref(false);

// Observar cambios en la propiedad show
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm();
  }
});

// Formatear número con separador de miles y dos decimales
const formatNumber = (num) => {
  return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Formatear fecha en formato dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Manejar cambio de archivo
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tamaño del archivo (4MB máximo)
  if (file.size > 4 * 1024 * 1024) {
    fileError.value = 'El archivo es demasiado grande. El tamaño máximo es 4MB.';
    return;
  }

  fileError.value = '';
  formData.value.comprobante = file;
  fileName.value = file.name;

  // Verificar si es una imagen para mostrar vista previa
  const fileType = file.type;
  isImage.value = fileType.startsWith('image/');

  if (isImage.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.value = 'pdf';
  }
};

// Enviar formulario
const submitForm = async () => {
  if (!formData.value.comprobante) {
    fileError.value = 'Por favor, suba un comprobante de pago.';
    return;
  }

  loading.value = true;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('comprobante', formData.value.comprobante);
    formDataToSend.append('metodo_pago', formData.value.metodoPago);

    const response = await axios.put(`http://localhost:4000/cobros-semanales/${props.cobroData.id_cobro}/pagar`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      console.log('Pago registrado correctamente');
      emit('payment-success');
      closeModal();
    }
  } catch (error) {
    console.error('Error al registrar el pago:', error);
    console.error('Error al registrar el pago. Por favor, inténtelo de nuevo.');
  } finally {
    loading.value = false;
  }
};

// Cerrar modal
const closeModal = () => {
  emit('close');
};

// Resetear formulario
const resetForm = () => {
  formData.value = {
    metodoPago: 'transferencia',
    comprobante: null
  };
  previewImage.value = null;
  isImage.value = true;
  fileName.value = '';
  fileError.value = '';
};
</script>

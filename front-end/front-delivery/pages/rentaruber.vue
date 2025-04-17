<template>
  <div class="h-screen flex flex-col bg-gray-900 text-gray-200">
    <!-- Header -->
    <HeaderComponent />
    
    <!-- Main Content -->
    <main class="flex-grow relative">
      <!-- Map Container -->
      <div class="absolute inset-0">
        <div id="map" ref="mapRef"></div>
      </div>

      <!-- Pin Selection Controls (overlay on map) -->
      <div v-if="isPinDraggableMode" class="absolute top-4 left-0 right-0 z-20 flex justify-center">
        <div class="bg-gray-800 px-4 py-2 rounded-full shadow-lg text-gray-200 flex items-center">
          <span class="mr-2">Selecciona la ubicación exacta en {{ pinDraggableType === 'pickup' ? 'recogida' : 'destino' }}</span>
          <button @click="confirmPinLocation" class="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
            Confirmar
          </button>
        </div>
      </div>

      <!-- Tabs Navigation (Fixed at Bottom) -->
      <div class="absolute bottom-0 inset-x-0 bg-gray-800 border-t border-gray-700 z-10">
        <div class="container mx-auto">
          <nav class="flex justify-between">
            <button @click="activeTab = 'search'" :class="{'text-blue-400 border-b-2 border-blue-400': activeTab === 'search'}" class="flex-1 py-4 px-2 text-center transition-colors hover:bg-gray-700 font-medium text-sm">
              <i class="fas fa-search block mx-auto mb-1 text-lg"></i>
              Buscar
            </button>
            <button @click="activeTab = 'history'" :class="{'text-blue-400 border-b-2 border-blue-400': activeTab === 'history'}" class="flex-1 py-4 px-2 text-center transition-colors hover:bg-gray-700 font-medium text-sm">
              <i class="fas fa-history block mx-auto mb-1 text-lg"></i>
              Historial
            </button>
            <button @click="activeTab = 'active'" :class="{'text-blue-400 border-b-2 border-blue-400': activeTab === 'active'}" class="flex-1 py-4 px-2 text-center transition-colors hover:bg-gray-700 font-medium text-sm relative">
              <i class="fas fa-car-side block mx-auto mb-1 text-lg"></i>
              Activos
              <span v-if="activeRide" class="absolute top-2 right-1/4 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Search Tab Content -->
      <transition name="slide-up">
        <div v-if="activeTab === 'search' && !showDriverOffers && !isPinDraggableMode && !showLocationOptions" class="absolute top-4 left-0 right-0 mx-auto max-w-md px-4 z-20">
          <div class="bg-gray-800 rounded-lg shadow-lg p-4">
            <div class="flex items-center mb-4">
              <div class="flex flex-col items-center mr-4">
                <div class="w-3 h-3 rounded-full bg-blue-600 mb-1"></div>
                <div class="w-0.5 h-10 bg-gray-600"></div>
                <div class="w-3 h-3 rounded-full bg-amber-500"></div>
              </div>
              
              <div class="flex-grow space-y-4">
                <div class="relative">
                  <input v-model="pickupLocation" type="text" placeholder="Colonia de recogida" class="w-full p-2 border border-gray-600 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white">
                </div>

                <div class="relative">
                  <input v-model="destinationLocation" type="text" placeholder="Colonia de destino" class="w-full p-2 border border-gray-600 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white">
                </div>
              </div>

              <button @click="swapLocations" :disabled="!pickupLocation || !destinationLocation" :class="{'opacity-50 cursor-not-allowed': !pickupLocation || !destinationLocation}" class="ml-2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <i class="fas fa-exchange-alt text-gray-300"></i>
              </button>
            </div>

            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center">
                <span class="text-sm font-medium mr-2">Pasajeros:</span>
                <div class="flex items-center">
                  <button @click="decrementPassengers" :disabled="passengers <= 1" class="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600" :class="{'opacity-50 cursor-not-allowed': passengers <= 1}">
                    <i class="fas fa-minus text-xs"></i>
                  </button>
                  <span class="mx-3 w-5 text-center">{{ passengers }}</span>
                  <button @click="incrementPassengers" :disabled="passengers >= 4" class="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600" :class="{'opacity-50 cursor-not-allowed': passengers >= 4}">
                    <i class="fas fa-plus text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Rango de presupuesto -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Presupuesto máximo:</span>
                <span class="text-sm text-gray-400">L. {{ maxBudget }}</span>
              </div>
              <div class="relative pt-1">
                <input 
                  type="range" 
                  v-model="maxBudget" 
                  class="w-full bg-blue-900 appearance-none h-2 rounded-full focus:outline-none"
                  min="50" 
                  max="1000"
                  step="50"
                >
                <div class="flex justify-between text-xs text-gray-400 mt-1">
                  <span>L. 50</span>
                  <span>L. 1000</span>
                </div>
              </div>
            </div>

            <button @click="continueToLocationOptions" :disabled="!areBasicDetailsComplete" :class="{'bg-blue-600 hover:bg-blue-700': areBasicDetailsComplete, 'bg-gray-600 cursor-not-allowed': !areBasicDetailsComplete}" class="w-full px-4 py-2 text-white rounded-md shadow-sm transition-colors">
              <i class="fas fa-arrow-right mr-1"></i> Continuar
            </button>
          </div>
        </div>
      </transition>

      <!-- Location Options Modal -->
      <transition name="fade">
        <div v-if="showLocationOptions" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div class="bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-md">
            <h3 class="font-bold text-lg mb-3">¿Cómo prefieres indicar la ubicación exacta?</h3>
            
            <div class="space-y-3 mb-4">
              <div class="p-3 bg-gray-700 rounded-lg">
                <p class="mb-3 text-sm">Tu viaje será desde <span class="font-medium text-blue-400">{{ pickupLocation }}</span> hasta <span class="font-medium text-amber-400">{{ destinationLocation }}</span>.</p>
                <p class="text-sm text-gray-300">Para ayudar al conductor, puedes elegir una de estas opciones:</p>
              </div>
              
              <button @click="startLocationSelectionProcess" class="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-start border border-transparent hover:border-blue-500 transition-colors">
                <div class="bg-blue-600 text-white p-2 rounded-full mr-3">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="text-left">
                  <div class="font-medium mb-1">Seleccionar en el mapa</div>
                  <p class="text-sm text-gray-400">Marca en el mapa la ubicación exacta donde te encuentras y donde deseas ir.</p>
                </div>
              </button>
              
              <button @click="chooseCallOption" class="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-start border border-transparent hover:border-blue-500 transition-colors">
                <div class="bg-green-600 text-white p-2 rounded-full mr-3">
                  <i class="fas fa-phone-alt"></i>
                </div>
                <div class="text-left">
                  <div class="font-medium mb-1">Prefiero que me llamen</div>
                  <p class="text-sm text-gray-400">El conductor te llamará para confirmar los detalles exactos de la ubicación.</p>
                </div>
              </button>
            </div>
            
            <div class="flex justify-between">
              <button @click="showLocationOptions = false" class="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                <i class="fas fa-arrow-left mr-1"></i> Volver
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Driver Offers Panel (Con Precio de Carrera como primera opción) -->
      <transition name="fade">
        <div v-if="showDriverOffers" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div class="bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-lg">Conductores disponibles</h3>
              <button @click="cancelSearch" class="p-2 text-gray-400 hover:text-gray-200">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="flex items-center justify-between px-1 py-2 mb-3 text-sm">
              <span>Presupuesto máximo: <span class="font-medium">L. {{ maxBudget }}</span></span>
              <span>{{ filteredDriverOffers.length + 1 }} conductores</span>
            </div>

            <div class="space-y-4 max-h-96 overflow-y-auto">
              <!-- Precio de Carrera Option (Fixed as first option) -->
              <div class="bg-gray-700 rounded-lg p-3 transition-all border-2 border-amber-500">
                <div class="bg-amber-500 text-gray-900 p-2 rounded text-sm font-bold text-center mb-3">
                  Conductor oficial de UberApp
                </div>
                

                <div class="mb-3 rounded-lg overflow-hidden">
                  <img src="https://beta.maxipublica.com/pictures/2024/2/559/20879765/ford_escape_2012_23dc41cefc70c_b.jpeg" alt="Car" class="w-full h-36 object-cover">
                </div>

                <div class="text-xs text-gray-400 mb-3">
                  <i class="fas fa-info-circle mr-1"></i> El precio de carrera es lo que te cobraría un taxi ida y vuelta.
                </div>

                <button @click="selectPrecioCarrera" class="w-full mt-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors flex items-center justify-center">
                  <i class="fas fa-check mr-2"></i> Aceptar Precio de Carrera
                </button>
              </div>

              <!-- Other driver offers -->
              <div v-for="(offer, index) in filteredDriverOffers" :key="index" class="bg-gray-700 rounded-lg p-3 transition-all" :class="{'border-2 border-blue-500': offer.highlighted}">
                <div class="flex justify-between mb-3">
                  <div class="flex items-center">
                    <img :src="offer.driver.photo" alt="Driver" class="w-12 h-12 rounded-full object-cover">
                    <div class="ml-3">
                      <div class="font-medium">{{ offer.driver.name }}</div>
                      <div class="text-xs text-gray-400">Conductor independiente</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold" :class="isPriceInBudget(offer.price) ? 'text-green-400' : 'text-amber-400'">
                      L. {{ offer.price.toFixed(2) }}
                    </div>
                  </div>
                </div>

                <div class="mb-3 rounded-lg overflow-hidden">
                  <img :src="offer.car.image" alt="Car" class="w-full h-36 object-cover">
                </div>

                <button @click="selectOfferAndShowPayment(offer)" class="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center">
                  <i class="fas fa-check mr-2"></i> Aceptar
                </button>
              </div>

              <div v-if="filteredDriverOffers.length === 0 && !loadingOffers" class="text-center py-4">
                <i class="fas fa-car-crash text-4xl text-gray-600 mb-2"></i>
                <p class="text-gray-300">No hay conductores independientes disponibles dentro de tu presupuesto</p>
                <p class="text-sm text-gray-400 mt-1">Intenta aumentar tu presupuesto máximo o elige el Precio de Carrera</p>
              </div>

              <div v-if="loadingOffers" class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <p class="mt-2 text-gray-300">Buscando conductores cercanos...</p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Payment Modal -->
      <transition name="fade">
        <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <!-- Encabezado fijo -->
            <div class="p-4 border-b border-gray-700">
              <h3 class="font-bold text-xl">Realizar depósito</h3>
            </div>

            <!-- Contenido desplazable -->
            <div class="p-4 overflow-y-auto flex-grow">
              <div class="border border-gray-700 rounded-lg p-3 mb-3">
                <div class="mb-2">
                  <div class="text-gray-400 text-sm">Desde:</div>
                  <div class="font-medium text-sm">{{ pickupLocation }}</div>
                </div>
                <div class="mb-2">
                  <div class="text-gray-400 text-sm">Hasta:</div>
                  <div class="font-medium text-sm">{{ destinationLocation }}</div>
                </div>
                <div class="mb-2">
                  <div class="text-gray-400 text-sm">Método de ubicación:</div>
                  <div class="font-medium text-sm">{{ locationMethod === 'map' ? 'Selección en mapa' : 'Llamada del conductor' }}</div>
                </div>
                <div class="flex justify-between mb-1 text-sm">
                  <span class="text-gray-400">Conductor:</span>
                  <span class="font-medium">{{ selectedOffer?.driver.name || 'Roberto García' }}</span>
                </div>
                <div class="flex justify-between mb-1 text-sm">
                  <span class="text-gray-400">Pasajeros:</span>
                  <span class="font-medium">{{ passengers }}</span>
                </div>
                <div class="flex justify-between mb-1 text-sm">
                  <span class="text-gray-400">Presupuesto:</span>
                  <span class="font-medium">L. {{ maxBudget }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-700 pt-2 mt-2 text-sm">
                  <span class="font-bold">Total a pagar:</span>
                  <span class="font-bold text-green-400">
                    L. {{ finalPrice.toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Información de transferencia bancaria -->
              <div class="mb-3">
                <h4 class="text-base font-medium mb-2">Información para transferencia</h4>
                <div class="bg-gray-700 p-3 rounded-lg text-sm">
                  <div class="mb-1">
                    <div class="text-xs text-gray-400">Banco:</div>
                    <div class="font-medium">Banco Atlántida</div>
                  </div>
                  <div class="mb-1">
                    <div class="text-xs text-gray-400">Cuenta:</div>
                    <div class="font-medium">1234-5678-9012-3456</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Beneficiario:</div>
                    <div class="font-medium">UberApp S.A.</div>
                  </div>
                </div>
              </div>

              <!-- Subir comprobante -->
              <div>
                <h4 class="text-sm font-medium mb-2">Subir comprobante de transferencia</h4>
                <div class="border-2 border-dashed border-gray-600 rounded-lg p-3 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input type="file" id="transferComprobante" class="hidden" accept="image/*" @change="previewTransferComprobante">
                  <label for="transferComprobante" class="cursor-pointer">
                    <div v-if="!transferComprobantePreview" class="space-y-1">
                      <i class="fas fa-upload text-xl text-gray-400"></i>
                      <p class="text-gray-400 text-xs">Haz clic para subir comprobante</p>
                    </div>
                    <div v-else>
                      <img :src="transferComprobantePreview" class="max-h-32 mx-auto mb-1 rounded-lg">
                      <p class="text-xs text-blue-400">Haz clic para cambiar archivo</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Botones fijos en la parte inferior -->
            <div class="p-4 border-t border-gray-700 flex justify-between">
              <button @click="showPaymentModal = false" class="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button @click="confirmPayment" :disabled="!transferComprobantePreview" :class="transferComprobantePreview ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'" class="px-4 py-2 text-white rounded-md shadow-md transition-colors">
                Confirmar pago
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- History Tab Content -->
      <transition name="slide-up">
        <div v-if="activeTab === 'history'" class="absolute top-4 bottom-20 left-0 right-0 mx-auto max-w-md px-4 z-20 overflow-y-auto">
          <div class="bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 class="font-bold text-xl mb-4">Historial de viajes</h2>
            
            <div v-if="rideHistory.length === 0" class="text-center py-6">
              <i class="fas fa-history text-4xl text-gray-600 mb-3"></i>
              <p class="text-gray-400">No tienes viajes anteriores</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="(ride, index) in rideHistory" :key="index" class="border-b border-gray-700 pb-4 last:border-b-0">
                <div class="flex justify-between mb-2">
                  <span class="font-medium">{{ ride.date }}</span>
                  <span class="text-sm px-2 py-0.5 rounded-full" :class="{
                    'bg-green-900 bg-opacity-50 text-green-400': ride.status === 'completed',
                    'bg-red-900 bg-opacity-50 text-red-400': ride.status === 'canceled'
                  }">
                    {{ ride.status === 'completed' ? 'Completado' : 'Cancelado' }}
                  </span>
                </div>
                
                <div class="flex items-start mb-2">
                  <div class="flex flex-col items-center mr-4">
                    <div class="w-2.5 h-2.5 rounded-full bg-blue-600 mb-1"></div>
                    <div class="w-0.5 h-6 bg-gray-600"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  </div>
                  
                  <div class="flex-grow">
                    <p class="text-sm">{{ ride.pickupLocation }}</p>
                    <p class="text-sm mt-2">{{ ride.destinationLocation }}</p>
                  </div>
                </div>
                
                <div class="flex justify-between text-sm text-gray-400">
                  <div class="flex">
                    <div class="mr-3">
                      <i class="fas fa-user mr-1"></i>
                      <span>{{ ride.passengers }}</span>
                    </div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-200">L. {{ ride.price.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Active Ride Tab Content -->
      <transition name="slide-up">
        <div v-if="activeTab === 'active' && activeRide" class="absolute bottom-16 left-0 right-0 mx-auto max-w-md px-4 z-20">
          <div class="bg-gray-800 rounded-t-lg shadow-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-lg flex items-center">
                <i class="fas fa-circle text-green-500 text-xs mr-2 animate-pulse"></i>
                Viaje en curso
              </h3>
              <div class="text-sm px-2 py-0.5 rounded-full" :class="activeRide.isPrecioCarrera ? 'bg-amber-900 bg-opacity-50 text-amber-400' : 'bg-blue-900 bg-opacity-50 text-blue-400'">
                {{ activeRide.status }}
              </div>
            </div>

            <div class="flex items-center mb-4">
              <img :src="activeRide.driver.photo" alt="Driver" class="w-16 h-16 rounded-full object-cover">
              <div class="ml-4">
                <div class="font-medium">{{ activeRide.driver.name }}</div>
                <div v-if="activeRide.isPrecioCarrera" class="mt-1 text-xs bg-amber-500 text-gray-900 px-2 py-0.5 rounded inline-block font-medium">
                  Conductor Oficial
                </div>
                <div v-else class="mt-1 text-xs text-gray-400">
                  Conductor Independiente
                </div>
              </div>
            </div>
            
            <div class="mb-4 rounded-lg overflow-hidden">
              <img :src="activeRide.car.image" alt="Car" class="w-full h-36 object-cover">
            </div>

            <div class="bg-gray-700 rounded-lg p-3 mb-4">
              <div class="flex items-start mb-2">
                <div class="flex flex-col items-center mr-4">
                  <div class="w-2.5 h-2.5 rounded-full bg-blue-600 mb-1"></div>
                  <div class="w-0.5 h-6 bg-gray-600"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                </div>
                
                <div class="flex-grow">
                  <p class="text-sm">{{ activeRide.pickupLocation }}</p>
                  <p class="text-sm mt-2">{{ activeRide.destinationLocation }}</p>
                </div>
              </div>
              
              <div v-if="activeRide.needsCall" class="mt-2 text-xs text-blue-300">
                <i class="fas fa-info-circle mr-1"></i> El conductor te llamará para confirmar la ubicación exacta.
              </div>
            </div>

            <div class="flex justify-between items-center mb-4">
              <div class="text-lg font-bold">
                <i class="fas fa-clock mr-1 text-blue-400"></i>
                Llegada estimada: 15 min
              </div>
              <div class="text-lg font-bold">
                L. {{ activeRide.price.toFixed(2) }}
              </div>
            </div>

            <div class="flex space-x-4">
              <button class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <i class="fas fa-phone text-green-400 mr-2"></i>
                Llamar
              </button>
              <button class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <i class="fas fa-comment-alt text-blue-400 mr-2"></i>
                Mensaje
              </button>
              <button @click="cancelActiveRide" class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                <i class="fas fa-times mr-2"></i>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- No Active Rides Message -->
      <transition name="slide-up">
        <div v-if="activeTab === 'active' && !activeRide" class="absolute top-1/3 left-0 right-0 mx-auto max-w-md px-4 z-20 text-center">
          <div class="bg-gray-800 rounded-lg shadow-lg p-6">
            <i class="fas fa-car-side text-5xl text-gray-600 mb-3"></i>
            <h3 class="font-bold text-xl mb-2">Sin viajes activos</h3>
            <p class="text-gray-400 mb-4">No tienes ningún viaje en curso en este momento.</p>
            <button @click="activeTab = 'search'" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Buscar viaje
            </button>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'; 

// Meta tags setup
useHead({
  title: 'UberApp - Cliente',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'Aplicación de transporte tipo Uber' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }
  ]
});

// State
const activeTab = ref('search');
const mapRef = ref(null);
const map = ref(null);
const originMarker = ref(null);
const destinationMarker = ref(null);
const driverMarkers = ref([]);
const routeLayer = ref(null);

// Iniciar con campos vacíos
const pickupLocation = ref('');
const destinationLocation = ref('');
const passengers = ref(1);
const maxBudget = ref(500); // Solo usamos presupuesto máximo ahora

// Flujo de selección de ubicación
const showLocationOptions = ref(false);
const locationMethod = ref(null); // 'map' o 'call'
const locationSelectionStep = ref(null); // 'pickup', 'destination' o null

const isPinDraggableMode = ref(false);
const pinDraggableType = ref(null);
const draggableMarker = ref(null);

// Variables para conductores y pago
const showDriverOffers = ref(false);
const loadingOffers = ref(false);
const driverOffers = ref([]);
const selectedOffer = ref(null);
const showPaymentModal = ref(false);
const transferComprobantePreview = ref(null);
const finalPrice = ref(0);
const isUsingPrecioCarrera = ref(false);

const activeRide = ref(null);

// Default coordinates for areas in Tegucigalpa
const defaultCoordinates = {
  'pickup': [14.0723, -87.1921],
  'destination': [14.0608, -87.2170]
};

// Store the map-selected positions
const selectedPositions = {
  'pickup': null,
  'destination': null
};

// Ride history
const rideHistory = ref([
  {
    id: 1,
    date: '15 Jul 2023, 14:30',
    pickupLocation: 'Colonia Kennedy',
    destinationLocation: 'El Prado',
    passengers: 2,
    price: 220.50,
    status: 'completed'
  },
  {
    id: 2,
    date: '12 Jul 2023, 09:15',
    pickupLocation: 'Colonia Miraflores',
    destinationLocation: 'Colonia Suyapa',
    passengers: 1,
    price: 145.75,
    status: 'completed'
  },
  {
    id: 3,
    date: '8 Jul 2023, 18:45',
    pickupLocation: 'Residencial Honduras',
    destinationLocation: 'Colonia Kennedy',
    passengers: 3,
    price: 190.25,
    status: 'canceled'
  }
]);

// Generate mock driver data (sin detalles del auto excepto la imagen)
const generateMockDrivers = () => {
  const drivers = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format',
      car: { 
        image: 'https://img.huffingtonpost.com/asset/6114402628000074c170929b.jpeg?ops=scalefit_500_noupscale'
      },
      coords: [14.080, -87.185],
      price: 220.50
    },
    {
      id: 2,
      name: 'María Fernández',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format',
      car: { 
        image: 'https://kautoscr.com/wp-content/uploads/TOYOTA-COROLLA-2010-PL-BPB774-4-scaled.jpg'
      },
      coords: [14.075, -87.190],
      price: 165.75
    },
    {
      id: 3,
      name: 'Roberto Flores',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format',
      car: { 
        image: 'https://lh4.googleusercontent.com/proxy/R6P-HdSVjOKei12J3YLXURv6Vha1bX0zAQG5jgztJ8N7Uz7toYPVmwuJUMaH2KiCYXLraBBp3ONEeV08zuy-8xirdneVUFjel-nbWOBo5XoeD35dp1k'
      },
      coords: [14.085, -87.195],
      price: 198.25
    },
    {
      id: 4,
      name: 'Ana Martínez',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format',
      car: { 
        image: 'https://preview.redd.it/d4vm2svxtzv11.jpg?width=1080&crop=smart&auto=webp&s=a80512c687f91c8f0aea34f80b389ec95cf93dfe'
      },
      coords: [14.079, -87.182],
      price: 310.50
    },
    {
      id: 5,
      name: 'Luis Gómez',
      photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=150&auto=format',
      car: { 
        image: 'https://i0.statig.com.br/bancodeimagens/4g/qf/ee/4gqfeep4ep4sc4hp3kvh6mo2f.jpg'
      },
      coords: [14.087, -87.198],
      price: 270.00
    },
  ];
  
  // Format driver offers
  return drivers.map(driver => ({
    driver: {
      id: driver.id,
      name: driver.name,
      photo: driver.photo
    },
    car: driver.car,
    coords: driver.coords,
    price: driver.price,
    highlighted: false
  }));
};

// Computed
const areBasicDetailsComplete = computed(() => {
  return pickupLocation.value && destinationLocation.value && passengers.value >= 1;
});

const filteredDriverOffers = computed(() => {
  // Filter drivers by budget
  return driverOffers.value.filter(offer => offer.price <= maxBudget.value);
});

// Methods
const isPriceInBudget = (price) => {
  if (!price) return false;
  return price <= maxBudget.value;
};

// Calcula el precio de carrera (tarifa base + distancia estimada)
const calculateCarreraPrice = () => {
  const basePrice = 100; // Precio base
  const distanceMultiplier = 5; // Multiplicador por distancia
  const passengerMultiplier = 1.2; // Multiplicador por pasajero adicional
  
  // Calcular distancia aproximada
  const distance = 10; // km (simulado, en realidad se calcularía basado en las ubicaciones)
  
  // Calcular precio base con distancia
  let price = basePrice + (distance * distanceMultiplier);
  
  // Ajustar por número de pasajeros
  if (passengers.value > 1) {
    price = price * (1 + ((passengers.value - 1) * 0.2));
  }
  
  return Math.round(price / 5) * 5; // Redondear al múltiplo de 5 más cercano
};

// Seleccionar la opción de Precio de Carrera
const selectPrecioCarrera = () => {
  isUsingPrecioCarrera.value = true;
  finalPrice.value = calculateCarreraPrice();
  
  // Crear un objeto de oferta para el precio de carrera
  const carreraOffer = {
    driver: {
      id: 'carrera-1',
      name: 'Roberto García',
      photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=150&auto=format'
    },
    car: {
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format'
    },
    price: finalPrice.value,
    isPrecioCarrera: true
  };
  
  selectedOffer.value = carreraOffer;
  showPaymentModal.value = true;
  showDriverOffers.value = false;
};

const updateMapStyle = () => {
  if (!map.value) return;
  
  // Siempre usar modo oscuro
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '',
    maxZoom: 19
  }).addTo(map.value);
};

const initMap = () => {
  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    // If not loaded, load it dynamically
    loadLeaflet();
    return;
  }
  
  // Default center at Tegucigalpa
  map.value = L.map('map').setView([14.0723, -87.1921], 13);
  
  // Set tile layer (always dark mode)
  updateMapStyle();
  
  // Listen for map clicks when in pin drag mode
  map.value.on('click', (e) => {
    if (isPinDraggableMode.value) {
      // If we're in pin drag mode, update the draggable marker position
      const newLatLng = e.latlng;
      if (draggableMarker.value) {
        draggableMarker.value.setLatLng(newLatLng);
      }
    }
  });
};

// Dynamically load Leaflet if needed
const loadLeaflet = () => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = () => {
    initMap();
  };
  document.head.appendChild(script);
};

// Updated to only draw markers when explicitly showing map locations
const updateMapMarkers = () => {
  if (!map.value) return;
  
  // Clear existing markers
  if (originMarker.value) map.value.removeLayer(originMarker.value);
  if (destinationMarker.value) map.value.removeLayer(destinationMarker.value);
  if (routeLayer.value) map.value.removeLayer(routeLayer.value);
  
  // If we're not in map selection mode, don't show any markers
  if (locationMethod.value !== 'map') {
    return;
  }
  
  // Create custom markers
  const originIcon = L.divIcon({
    className: 'custom-marker origin-marker',
    html: '<i class="fas fa-map-marker-alt text-blue-600"></i>',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
  
  const destinationIcon = L.divIcon({
    className: 'custom-marker destination-marker',
    html: '<i class="fas fa-flag text-amber-500"></i>',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
  
  // Use selected positions when available, otherwise default
  const originCoords = selectedPositions.pickup || defaultCoordinates.pickup;
  const destinationCoords = selectedPositions.destination || defaultCoordinates.destination;
  
  // Only show the markers that have been confirmed
  if (selectedPositions.pickup) {
    originMarker.value = L.marker(originCoords, { icon: originIcon }).addTo(map.value);
  }
  
  if (selectedPositions.destination) {
    destinationMarker.value = L.marker(destinationCoords, { icon: destinationIcon }).addTo(map.value);
  }
  
  // Only draw route if both positions are available
  if (selectedPositions.pickup && selectedPositions.destination) {
    routeLayer.value = L.polyline([originCoords, destinationCoords], {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map.value);
    
    // Fit map to show both markers
    map.value.fitBounds([originCoords, destinationCoords], { padding: [50, 50] });
  } else if (selectedPositions.pickup) {
    // Just center on pickup
    map.value.setView(originCoords, 15);
  } else if (selectedPositions.destination) {
    // Just center on destination
    map.value.setView(destinationCoords, 15);
  }
};

const swapLocations = () => {
  if (!pickupLocation.value || !destinationLocation.value) return;
  
  const temp = pickupLocation.value;
  pickupLocation.value = destinationLocation.value;
  destinationLocation.value = temp;
};

// Continuar al paso de opciones de ubicación
const continueToLocationOptions = () => {
  if (!areBasicDetailsComplete.value) return;
  showLocationOptions.value = true;
};

// Start the map selection process
const startLocationSelectionProcess = () => {
  locationMethod.value = 'map';
  showLocationOptions.value = false;
  
  // Reset selected positions
  selectedPositions.pickup = null;
  selectedPositions.destination = null;
  
  // Start with pickup selection
  startPinDragMode('pickup');
};

// Elegir opción de llamada
const chooseCallOption = () => {
  locationMethod.value = 'call';
  showLocationOptions.value = false;
  searchRide();
};

// Starts pin dragging mode
const startPinDragMode = (type) => {
  isPinDraggableMode.value = true;
  pinDraggableType.value = type;
  locationSelectionStep.value = type;
  
  if (!map.value) return;
  
  // Clear existing draggable marker
  if (draggableMarker.value) {
    map.value.removeLayer(draggableMarker.value);
  }
  
  // Choose icon based on the type
  const iconType = type === 'pickup' ? 'origin-marker' : 'destination-marker';
  const iconColor = type === 'pickup' ? 'text-blue-600' : 'text-amber-500';
  const iconSymbol = type === 'pickup' ? 'fa-map-marker-alt' : 'fa-flag';
  
  const markerIcon = L.divIcon({
    className: `custom-marker ${iconType}`,
    html: `<i class="fas ${iconSymbol} ${iconColor}"></i>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
  
  // Get initial position
  const initialPosition = type === 'pickup' ? defaultCoordinates.pickup : defaultCoordinates.destination;
  
  // Create draggable marker
  draggableMarker.value = L.marker(initialPosition, {
    icon: markerIcon,
    draggable: true
  }).addTo(map.value);
  
  // Center map on marker
  map.value.setView(initialPosition, 15);
};

// Confirm pin location after dragging
const confirmPinLocation = () => {
  if (!draggableMarker.value) return;
  
  // Store the selected position
  const pos = draggableMarker.value.getLatLng();
  selectedPositions[pinDraggableType.value] = [pos.lat, pos.lng];
  
  // Reset draggable markers
  isPinDraggableMode.value = false;
  
  // Clear draggable marker
  if (map.value && draggableMarker.value) {
    map.value.removeLayer(draggableMarker.value);
    draggableMarker.value = null;
  }
  
  // Update map markers to show confirmed positions
  updateMapMarkers();
  
  // If we're in pickup selection, move to destination selection
  if (pinDraggableType.value === 'pickup') {
    // Move to destination selection
    pinDraggableType.value = null;
    setTimeout(() => {
      startPinDragMode('destination');
    }, 300);
  } else {
    // Both positions have been selected - move to driver search
    pinDraggableType.value = null;
    locationSelectionStep.value = null;
    searchRide();
  }
};

const incrementPassengers = () => {
  if (passengers.value < 4) {
    passengers.value++;
  }
};

const decrementPassengers = () => {
  if (passengers.value > 1) {
    passengers.value--;
  }
};

// Search for ride - más rápido ahora
const searchRide = () => {
  loadingOffers.value = true;
  driverOffers.value = [];
  
  // Simulate loading and fetching drivers more rápidamente (500ms)
  setTimeout(() => {
    loadingOffers.value = false;
    driverOffers.value = generateMockDrivers();
    
    // Show drivers list modal
    showDriverOffers.value = true;
    
    // Add highlight effect for drivers
    highlightDrivers();
  }, 500);
};

const highlightDrivers = () => {
  // Simulate driver offers being highlighted one by one
  filteredDriverOffers.value.forEach((offer, index) => {
    setTimeout(() => {
      // Reset all highlights
      driverOffers.value.forEach(o => o.highlighted = false);
      
      // Highlight current offer
      offer.highlighted = true;
    }, (index + 1) * 1500);
  });
};

const cancelSearch = () => {
  showDriverOffers.value = false;
};

// Function to select offer and show payment modal
const selectOfferAndShowPayment = (offer) => {
  selectedOffer.value = offer;
  isUsingPrecioCarrera.value = false;
  finalPrice.value = offer.price;
  showPaymentModal.value = true;
  showDriverOffers.value = false;
};

// Preview transfer comprobante
const previewTransferComprobante = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      transferComprobantePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const confirmPayment = () => {
  if (!transferComprobantePreview.value) {
    alert('Por favor sube un comprobante de transferencia para continuar.');
    return;
  }
  
  showPaymentModal.value = false;
  
  // Create active ride
  activeRide.value = {
    id: Date.now(),
    driver: selectedOffer.value.driver,
    car: selectedOffer.value.car,
    pickupLocation: pickupLocation.value,
    destinationLocation: destinationLocation.value,
    passengers: passengers.value,
    price: finalPrice.value,
    status: 'En camino',
    needsCall: locationMethod.value === 'call',
    isPrecioCarrera: isUsingPrecioCarrera.value
  };
  
  // Switch to active tab
  activeTab.value = 'active';
  
  // Reset transfer comprobante
  transferComprobantePreview.value = null;
  
  // Add trip to history after 30 seconds
  setTimeout(() => {
    if (!activeRide.value) return; // Check if ride was cancelled
    
    // Add to history
    rideHistory.value.unshift({
      id: activeRide.value.id,
      date: new Date().toLocaleString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      pickupLocation: activeRide.value.pickupLocation,
      destinationLocation: activeRide.value.destinationLocation,
      passengers: activeRide.value.passengers,
      price: activeRide.value.price,
      status: 'completed'
    });
    
    // Clear active ride
    activeRide.value = null;
    
    // Show completion notification
    alert('¡Viaje completado! Gracias por usar UberApp.');
    
    // Switch to history tab
    activeTab.value = 'history';
  }, 30000);
};

const cancelActiveRide = () => {
  if (!activeRide.value) return;
  
  if (confirm('¿Estás seguro de que deseas cancelar el viaje? Podrías incurrir en una tarifa de cancelación.')) {
    // Add to history as cancelled
    rideHistory.value.unshift({
      id: activeRide.value.id,
      date: new Date().toLocaleString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      pickupLocation: activeRide.value.pickupLocation,
      destinationLocation: activeRide.value.destinationLocation,
      passengers: activeRide.value.passengers,
      price: activeRide.value.price * 0.3, // 30% cancelation fee
      status: 'canceled'
    });
    
    // Clear active ride
    activeRide.value = null;
    
    // Switch to history tab
    activeTab.value = 'history';
  }
};

// Initialize on mount
onMounted(() => {
  nextTick(() => {
    // Check if we're in browser environment
    if (process.client) {
      // Initialize map
      initMap();
      
      // Siempre en modo oscuro
      document.documentElement.classList.add('dark');
    }
  });
});
</script>

<style>
/* Map */
#map {
  height: 100%;
  width: 100%;
  z-index: 1;
}

/* Hide attribution */
.leaflet-control-attribution {
  display: none;
}

/* Custom markers */
.custom-marker {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1f2937; /* Dark mode marker */
  border: 2px solid #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.origin-marker {
  border-color: #3b82f6;
}

.destination-marker {
  border-color: #f59e0b;
}

.driver-marker {
  border-color: #10b981;
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Range sliders styling - dark mode only */
input[type="range"] {
  -webkit-appearance: none;
  height: 8px;
  background: #1e3a8a; /* Dark blue for dark mode */
  border-radius: 4px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #60a5fa;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #60a5fa;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}

/* Force dark mode always */
html {
  color-scheme: dark;
}
</style>
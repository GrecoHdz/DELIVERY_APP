<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pb-20">
      <!-- Header actualizado -->
      <header class="bg-white shadow-md px-3 py-3 flex justify-between items-center text-lg sticky top-0 z-50"> 
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
        <!-- Modal de Notificaciones -->
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
      </header>
  
      <!-- Menú móvil -->
      <div v-if="isMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="toggleMenu"></div>
      <div v-if="isMenuOpen" class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-200">
        <div class="p-5">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Menú</h2>
            <button @click="toggleMenu" class="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul class="space-y-4">
            <li>
              <a href="#" class="block py-2 text-gray-700 hover:text-blue-600 transition">Inicio</a>
            </li>
            <li>
              <a href="#" class="block py-2 text-gray-700 hover:text-blue-600 transition">Vehículos</a>
            </li>
            <li>
              <a href="#" class="block py-2 text-gray-700 hover:text-blue-600 transition">Mis Rentas</a>
            </li>
            <li>
              <a href="#" class="block py-2 text-gray-700 hover:text-blue-600 transition">Ayuda</a>
            </li>
            <li>
              <a href="#" class="block py-2 text-gray-700 hover:text-blue-600 transition">Contacto</a>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- Banner principal -->
      <section class="relative bg-gradient-to-r from-blue-500 to-purple-600 py-20 text-white overflow-hidden">
        <div class="container mx-auto px-4 relative z-10">
          <div class="max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Renta el vehículo perfecto para tu viaje</h1>
            <p class="text-xl opacity-90 mb-8">Amplia selección de vehículos, precios competitivos y servicio excepcional.</p>
            <button class="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg">
              Explorar vehículos
            </button>
          </div>
        </div>
        
        <!-- Elementos decorativos flotantes -->
        <div class="absolute right-0 top-0 h-full w-1/2 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="h-full">
            <path fill="white" d="M42.8,-76.4C54.9,-68.3,63.7,-55.2,71.3,-41.4C78.9,-27.6,85.3,-13.8,83.4,-1.1C81.5,11.6,71.3,23.2,62.2,34.6C53.1,46.1,45.2,57.3,34.4,65.9C23.6,74.4,11.8,80.3,-1.2,82.2C-14.2,84.2,-28.3,82.3,-40.5,75.6C-52.7,68.9,-62.9,57.5,-70.4,44.8C-77.9,32.1,-82.7,16,-82.1,0.3C-81.5,-15.4,-75.5,-30.8,-67.1,-44.2C-58.8,-57.5,-48.1,-68.8,-35.4,-76.5C-22.7,-84.3,-7.9,-88.5,4.4,-86.4C16.7,-84.2,30.7,-84.5,42.8,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div class="absolute left-0 bottom-0 h-full w-1/3 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="h-full">
            <path fill="white" d="M37.9,-65.1C50.4,-59.4,62.7,-51.4,72.1,-40.1C81.4,-28.8,87.9,-14.4,87.8,-0.1C87.7,14.3,81,28.5,71.8,40.1C62.6,51.6,50.8,60.4,38.1,67.7C25.4,75,12.7,80.9,-0.4,81.5C-13.4,82.1,-26.8,77.5,-39.9,70.7C-53,64,-65.8,55.2,-71.8,43.1C-77.8,31,-77,15.5,-75.9,0.6C-74.8,-14.3,-73.4,-28.5,-66.9,-40C-60.4,-51.5,-48.7,-60.2,-36.2,-65.9C-23.7,-71.5,-11.9,-74.1,0.6,-75.1C13,-76.1,25.9,-70.8,37.9,-65.1Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>
  
      <!-- Pestañas de navegación -->
      <div class="bg-white shadow-md pt-4 sticky top-16 z-30">
        <div class="container mx-auto px-4">
          <div class="flex overflow-x-auto scrollbar-hide">
            <button 
              @click="activeSection = 'search'" 
              class="px-6 py-2 mr-2 transition-colors whitespace-nowrap"
              :class="activeSection === 'search' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'"
            >
              Buscar Vehículos
            </button>
            <button 
              @click="activeSection = 'history'" 
              class="px-6 py-2 mr-2 transition-colors whitespace-nowrap"
              :class="activeSection === 'history' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'"
            >
              Historial de Rentas
            </button>
          </div>
        </div>
      </div>
  
      <!-- SECCIÓN: BÚSQUEDA DE VEHÍCULOS -->
      <div v-if="activeSection === 'search'">
        <!-- Barra de búsqueda y filtros -->
        <section class="bg-white py-6 shadow-md relative z-20">
          <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row md:items-end gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  <select v-model="filters.location" class="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Todas las ubicaciones</option>
                    <option value="San Pedro Sula">San Pedro Sula</option>
                    <option value="Tegucigalpa">Tegucigalpa</option>
                    <option value="La Ceiba">La Ceiba</option>
                    <option value="Roatán">Roatán</option>
                  </select>
                </div>
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de recogida</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  <input type="date" v-model="filters.startDate" class="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de devolución</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  <input type="date" v-model="filters.endDate" class="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>
              <div class="flex-none">
                <button @click="searchCars" class="w-full md:w-auto bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                  Buscar
                </button>
              </div>
            </div>
            
            <!-- Filtros adicionales -->
            <div class="mt-4 flex flex-wrap gap-4 items-center">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de vehículo</label>
                <select v-model="filters.vehicleType" class="w-full py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos los tipos</option>
                  <option value="Sedán">Sedán</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Compacto">Compacto</option>
                  <option value="Lujo">Lujo</option>
                </select>
              </div>
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio máximo por día</label>
                <div class="flex items-center">
                  <input type="range" v-model="filters.maxPrice" min="0" max="2000" step="50" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                  <span class="ml-2 text-sm font-medium text-gray-700 min-w-[80px]">L. {{ filters.maxPrice }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="filters.withDriver" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <span class="text-sm text-gray-700">Con conductor</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="filters.homeDelivery" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <span class="text-sm text-gray-700">Entrega a domicilio</span>
                </label>
              </div>
            </div>
          </div>
        </section>
  
        <!-- Estado de carga o error -->
        <div v-if="loading" class="container mx-auto px-4 py-10 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Cargando vehículos disponibles...</p>
        </div>
  
        <div v-else-if="error" class="container mx-auto px-4 py-10">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div>
              <h3 class="text-lg font-medium text-red-800">Error al cargar los vehículos</h3>
              <p class="mt-1 text-red-700">{{ error }}</p>
              <button @click="fetchCars" class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Reintentar
              </button>
            </div>
          </div>
        </div>
  
        <!-- Lista de vehículos disponibles -->
        <section v-else class="container mx-auto px-4 py-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a4 4 0 00-4-4h-3V4a1 1 0 00-1-1H3z" />
            </svg>
            Vehículos Disponibles 
            <span class="text-gray-500 ml-2 text-lg">({{ filteredCars.length }})</span>
          </h2>
          
          <div v-if="filteredCars.length === 0" class="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-xl font-medium text-gray-600">No se encontraron vehículos</h3>
            <p class="text-gray-500 mt-2">Prueba con diferentes filtros o fechas</p>
            <button @click="resetFilters" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Restablecer filtros
            </button>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="car in filteredCars" 
              :key="car.id" 
              class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              @click="showCarDetails(car)"
            >
              <div class="relative h-48 overflow-hidden">
                <img :src="car.imagen" :alt="car.marca + ' ' + car.modelo" class="w-full h-full object-cover">
                <div class="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg font-medium">
                  L. {{ car.precio_por_dia }}/día
                </div>
                <div v-if="car.entrega_a_domicilio" class="absolute bottom-0 left-0 bg-green-500 text-white px-3 py-1 rounded-tr-lg text-sm">
                  Entrega a domicilio
                </div>
              </div>
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-bold text-gray-800">{{ car.marca }} {{ car.modelo }}</h3>
                </div>
                <p class="text-gray-600 text-sm mb-3">{{ car.año }} · {{ car.transmision }} · {{ car.tipo }}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                  <div class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {{ car.capacidad }} personas
                  </div>
                  <div class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    {{ car.puertas }} puertas
                  </div>
                  <div class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3.5a1 1 0 01.9.553l.48 1.15H13a4 4 0 014 4v6a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm2.5 1v1h4.667l-.434-1H5.5zm2.375 6.415a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.75 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" />
                    </svg>
                    {{ car.capacidad_maleta }} maletas
                  </div>
                </div>
                
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-500">
                    <span class="font-medium text-gray-800">{{ car.ubicacion }}</span>
                  </div>
                  <button class="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  
      <!-- SECCIÓN: HISTORIAL DE RENTAS -->
      <div v-if="activeSection === 'history'" class="container mx-auto px-4 py-6">
        <!-- Pestañas de historial -->
        <div class="mb-6 border-b border-gray-200">
          <div class="flex space-x-4">
            <button 
              @click="historyTab = 'active'" 
              class="py-2 px-4 font-medium"
              :class="historyTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
            >
              Rentas Activas
            </button>
            <button 
              @click="historyTab = 'past'" 
              class="py-2 px-4 font-medium"
              :class="historyTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
            >
              Rentas Pasadas
            </button>
            <button 
              @click="historyTab = 'pending'" 
              class="py-2 px-4 font-medium"
              :class="historyTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
            >
              Pendientes de Pago
            </button>
          </div>
        </div>
  
        <!-- Spinner de carga -->
        <div v-if="loadingHistory" class="flex justify-center py-10">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
  
        <!-- Mensaje sin rentas -->
        <div v-else-if="!filteredRentalHistory.length" class="text-center py-10">
          <div class="bg-gray-50 p-6 rounded-lg shadow-sm inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm2 3v1a1 1 0 102 0V5h6v1a1 1 0 102 0V5h1v3H2V5h1v1a1 1 0 102 0V5zm-1 9v-3h16v3H6zm0 2h16v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1h4z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-xl font-medium text-gray-700">No tienes rentas {{ historyTabLabel }} </h3>
            <p class="text-gray-500 mt-2 max-w-sm mx-auto">
              {{ 
                historyTab === 'active' ? 'Actualmente no tienes vehículos rentados.' :
                historyTab === 'past' ? 'No has tenido rentas anteriores.' :
                'No hay rentas pendientes de pago.'
              }}
            </p>
            <button 
              v-if="historyTab !== 'active'" 
              @click="activeSection = 'search'" 
              class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Buscar vehículos
            </button>
          </div>
        </div>
  
        <!-- Lista de rentas -->
        <div v-else class="space-y-6">
          <div 
            v-for="rental in filteredRentalHistory" 
            :key="rental.id" 
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="flex flex-col md:flex-row">
              <!-- Imagen del vehículo -->
              <div class="w-full md:w-56 h-48 md:h-auto">
                <img :src="rental.auto.imagen" :alt="rental.auto.marca + ' ' + rental.auto.modelo" class="w-full h-full object-cover">
              </div>
              
              <!-- Detalles de la renta -->
              <div class="flex-grow p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-bold text-gray-800">{{ rental.auto.marca }} {{ rental.auto.modelo }}</h3>
                    <p class="text-gray-600 text-sm">{{ rental.auto.año }} · {{ rental.auto.tipo }}</p>
                  </div>
                  <div :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    rental.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    rental.estado === 'pendiente_pago' ? 'bg-yellow-100 text-yellow-800' :
                    rental.estado === 'completado' ? 'bg-blue-100 text-blue-800' :
                    rental.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ 
                      rental.estado === 'activo' ? 'Activo' :
                      rental.estado === 'pendiente_pago' ? 'Pendiente de Pago' :
                      rental.estado === 'completado' ? 'Completado' :
                      rental.estado === 'cancelado' ? 'Cancelado' :
                      rental.estado 
                    }}
                  </div>
                </div>
                
                <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p class="text-xs text-gray-500">Fecha de recogida</p>
                    <p class="font-medium">{{ formatDate(rental.fecha_inicio) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Fecha de devolución</p>
                    <p class="font-medium">{{ formatDate(rental.fecha_fin) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Duración</p>
                    <p class="font-medium">{{ calculateDuration(rental.fecha_inicio, rental.fecha_fin) }} días</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Precio total</p>
                    <p class="font-medium">L. {{ rental.total }}</p>
                  </div>
                </div>
                
                <!-- Acciones según estado -->
                <div class="mt-4 flex justify-end space-x-3">
                  <button 
                    v-if="rental.estado === 'pendiente_pago'"
                    @click="showPaymentModal(rental)"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Realizar Pago
                  </button>
                  <button 
                    v-if="rental.estado === 'activo'"
                    @click="showRentalDetails(rental)"
                    class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                  >
                    Ver Detalles
                  </button>
                  <button 
                    v-if="rental.estado === 'activo'"
                    @click="extendRental(rental)"
                    class="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                  >
                    Extender Renta
                  </button>
                  <button 
                    v-if="rental.estado === 'pendiente_pago'"
                    @click="cancelRental(rental)"
                    class="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal detalles del vehículo -->
      <div v-if="selectedCar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeCarDetails">
        <div class="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="relative">
            <img :src="selectedCar.imagen" :alt="selectedCar.marca + ' ' + selectedCar.modelo" class="w-full h-64 object-cover rounded-t-xl">
            <button @click="closeCarDetails" class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ selectedCar.marca }} {{ selectedCar.modelo }}</h2>
                <p class="text-gray-600">{{ selectedCar.año }} · {{ selectedCar.transmision }} · {{ selectedCar.tipo }}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-blue-600">L. {{ selectedCar.precio_por_dia }}<span class="text-sm font-normal text-gray-600">/día</span></div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-sm text-gray-500">Capacidad</div>
                <div class="font-medium">{{ selectedCar.capacidad }} personas</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-sm text-gray-500">Puertas</div>
                <div class="font-medium">{{ selectedCar.puertas }}</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-sm text-gray-500">Combustible</div>
                <div class="font-medium">{{ selectedCar.combustible }}</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-sm text-gray-500">Aire acondicionado</div>
                <div class="font-medium">{{ selectedCar.aire_acondicionado ? 'Sí' : 'No' }}</div>
              </div>
            </div>
            
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Descripción</h3>
              <p class="text-gray-600">{{ selectedCar.descripcion }}</p>
            </div>
            
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Ubicación de recogida</h3>
              <!-- Mapa para ubicación de recogida - solo mostrar si NO tiene entrega a domicilio -->
              <div v-if="!selectedCar.entrega_a_domicilio" class="h-64 rounded-lg overflow-hidden mb-2">
                <div id="pickupMap" class="w-full h-full"></div>
              </div>
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <div class="font-medium">{{ selectedCar.ubicacion }}</div>
                  <div class="text-sm text-gray-500">{{ selectedCar.direccion_recogida }}</div>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Reservar este vehículo</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de recogida</label>
                  <input type="date" v-model="rentData.startDate" class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de devolución</label>
                  <input type="date" v-model="rentData.endDate" class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>
              
              <!-- Mapa de selección para entrega a domicilio - SOLO mostrar si tiene entrega a domicilio -->
              <div v-if="selectedCar.entrega_a_domicilio" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Seleccione el lugar de entrega</label>
                <div class="h-64 rounded-lg overflow-hidden mb-2">
                  <div id="deliveryMap" class="w-full h-full"></div>
                </div>
                <p class="text-xs text-gray-500 italic">Haga clic en el mapa para seleccionar el punto de entrega</p>
                <div v-if="rentData.deliveryCoordinates" class="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-800">
                  Punto de entrega seleccionado
                </div>
              </div>
              
              <div class="mb-4">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="rentData.withDriver" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <span class="text-sm text-gray-700">Contratar conductor (+ L. 350/día)</span>
                </label>
              </div>
              
              <div v-if="!rentData.withDriver" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagen de licencia de conducir</label>
                <div class="border-2 border-gray-300 border-dashed rounded-lg p-6 text-center"
                     @click="triggerLicenseUpload" 
                     @dragover.prevent 
                     @drop.prevent="handleLicenseDrop">
                  <input ref="licenseInput" type="file" accept="image/*" class="hidden" @change="handleLicenseChange">
                  
                  <div v-if="!rentData.licenseImage">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mt-1 text-sm text-gray-600">Haga clic aquí o arrastre su imagen de licencia de conducir</p>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  
                  <div v-else class="relative">
                    <img :src="licensePreview" alt="Vista previa de licencia" class="max-h-48 mx-auto">
                    <button @click.stop="removeImage" class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 class="font-medium text-gray-800 mb-2">Resumen de precios</h4>
                <div class="flex justify-between text-sm mb-1 text-gray-700">
                  <span>Precio por día</span>
                  <span>L. {{ selectedCar.precio_por_dia }}</span>
                </div>
                <div class="flex justify-between text-sm mb-1 text-gray-700">
                  <span>Duración del alquiler</span>
                  <span>{{ rentalDays }} días</span>
                </div>
                <div v-if="rentData.withDriver" class="flex justify-between text-sm mb-1 text-gray-700">
                  <span>Cargo por conductor</span>
                  <span>L. {{ driverCost }}</span>
                </div>
                <div class="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>L. {{ totalRentCost }}</span>
                </div>
              </div>
              
              <div class="flex flex-col md:flex-row gap-3">
                <button @click="submitRentRequest" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                  Solicitar renta
                </button>
                <button @click="closeCarDetails" class="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de pago -->
      <div v-if="showPaymentModalFlag" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl w-full max-w-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">Realizar Pago</h3>
            <button @click="closePaymentModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <span class="font-medium">Vehículo:</span>
                <span>{{ selectedRental?.auto?.marca }} {{ selectedRental?.auto?.modelo }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="font-medium">Período:</span>
                <span>{{ formatDate(selectedRental?.fecha_inicio) }} - {{ formatDate(selectedRental?.fecha_fin) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg">
                <span>Total a pagar:</span>
                <span>L. {{ selectedRental?.total }}</span>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <h4 class="font-medium text-gray-800 mb-2">Información bancaria</h4>
              <p class="text-sm text-gray-600 mb-4">Por favor realiza una transferencia bancaria con la siguiente información:</p>
              
              <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-sm">
                    <span class="font-medium">Banco:</span>
                    <p>Banco Nacional</p>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Cuenta:</span>
                    <p>123456789</p>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Titular:</span>
                    <p>CarRent S.A.</p>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Tipo:</span>
                    <p>Cuenta Corriente</p>
                  </div>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Comprobante de pago</label>
                <div class="border-2 border-gray-300 border-dashed rounded-lg p-4 text-center"
                    @click="triggerPaymentUpload" 
                    @dragover.prevent 
                    @drop.prevent="handlePaymentDrop">
                  <input ref="paymentInput" type="file" accept="image/*" class="hidden" @change="handlePaymentChange">
                  
                  <div v-if="!paymentData.receiptImage">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mt-1 text-sm text-gray-600">Sube una imagen del comprobante de transferencia</p>
                  </div>
                  
                  <div v-else class="relative">
                    <img :src="paymentPreview" alt="Comprobante de pago" class="max-h-40 mx-auto">
                    <button @click.stop="removePaymentImage" class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                @click="submitPayment"
                :disabled="!paymentData.receiptImage"
                :class="{'bg-blue-600 hover:bg-blue-700': paymentData.receiptImage, 'bg-gray-300 cursor-not-allowed': !paymentData.receiptImage}"
                class="w-full text-white py-3 rounded-lg font-medium transition"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Confirmación de renta -->
      <div v-if="showRentConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">¡Solicitud enviada!</h3>
          <p class="text-gray-600 mb-2">Su solicitud de renta ha sido recibida.</p>
          <p class="text-gray-600 mb-6">Por favor proceda a realizar el pago para confirmar su reserva.</p>
          <div class="flex flex-col space-y-2">
            <button @click="goToHistory" class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Ir a Pagos Pendientes
            </button>
            <button @click="closeRentConfirmation" class="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
              Continuar Navegando
            </button>
          </div>
        </div>
      </div>
  
      <!-- Confirmación de pago -->
      <div v-if="showPaymentConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">¡Pago recibido!</h3>
          <p class="text-gray-600 mb-6">Su pago está siendo procesado. Recibirá una confirmación cuando sea aprobado.</p>
          <button @click="closePaymentConfirmation" class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Entendido
          </button>
        </div>
      </div>
  
      <!-- Footer actualizado -->
      <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 z-10">
        <div class="flex justify-around items-center">
          <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Dashboard_Cliente')">
            <HomeIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Inicio</span>
          </div>
          <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Favoritos')">
            <HeartIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Favoritos</span>
          </div>
          <div class="flex flex-col items-center relative cursor-pointer" @click="redirectTo('/Carrito')">
            <div class="bg-blue-600 rounded-full p-2">
              <ShoppingCartIcon class="text-white" :size="20" />
            </div>
            <span class="text-xs text-blue-600 mt-1">Carrito</span>
          </div>
          <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Pedidos')">
            <ShoppingBagIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Pedidos</span>
          </div>
          <div class="flex flex-col items-center cursor-pointer" @click="redirectTo('/Perfil')">
            <SettingsIcon class="text-blue-600" :size="20" />
            <span class="text-xs text-blue-600 mt-1">Configuración</span>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { 
    Truck as TruckIcon, 
    Bell as BellIcon,
    Home as HomeIcon, 
    Heart as HeartIcon, 
    ShoppingCart as ShoppingCartIcon, 
    ShoppingBag as ShoppingBagIcon, 
    Settings as SettingsIcon 
  } from 'lucide-vue-next';
  
  // Estado UI general
  const isMenuOpen = ref(false);
  const isModalOpen = ref(false); // Añadido para que funcione el modal de notificaciones
  const loading = ref(false);
  const error = ref(null);
  const useApiData = ref(false);
  const selectedCar = ref(null);
  const showRentConfirmation = ref(false);
  const licensePreview = ref('');
  const activeSection = ref('search'); // 'search' o 'history'
  const pickupMap = ref(null);
  const deliveryMap = ref(null);
  const deliveryMarker = ref(null);
  
  // Notificaciones (del header)
  const notifications = ref([
    { id: 1, message: "Tu pedido ha sido enviado.", read: false },
    { id: 2, message: "Nuevo descuento disponible.", read: false },
    { id: 3, message: "Actualización de la app disponible.", read: true },
  ]);
  
  const unreadNotifications = computed(() => {
    return notifications.value.filter((notification) => !notification.read);
  });
  
  // Información del perfil seleccionado
  const selectedProfile = ref("Cliente");
  
  // Filtros
  const filters = ref({
    location: '',
    startDate: '',
    endDate: '',
    vehicleType: '',
    maxPrice: 1000,
    withDriver: false,
    homeDelivery: false
  });
  
  // Datos de renta
  const rentData = ref({
    startDate: '',
    endDate: '',
    deliveryAddress: '',
    deliveryCoordinates: null,
    withDriver: false,
    licenseImage: null
  });
  
  // Mock data - autos disponibles con imágenes de Unsplash
  const mockCars = ref([
    {
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      año: 2022,
      tipo: 'Sedán',
      imagen: 'https://cdn.autofuturo.com/listings/8615/94e70fc0b8144e6e.webp',
      precio_por_dia: 890,
      ubicacion: 'San Pedro Sula',
      direccion_recogida: 'Calle Principal #123, Col. Las Palmas',
      rating: 4.8,
      reviews: 124,
      capacidad: 5,
      puertas: 4,
      combustible: 'Gasolina',
      transmision: 'Automática',
      aire_acondicionado: true,
      entrega_a_domicilio: true,
      opcion_conductor: true,
      capacidad_maleta: 3,
      coordenadas: { lat: 15.5046, lng: -88.0229 },
      descripcion: 'Toyota Corolla 2022 en excelentes condiciones. Perfecto para viajes de negocios o familiares. Cuenta con bluetooth, cámara de retroceso y sistema de navegación.'
    },
    {
      id: 2,
      marca: 'Honda',
      modelo: 'CR-V',
      año: 2021,
      tipo: 'SUV',
      imagen: 'https://kautoscr.com/wp-content/uploads/HYUNDAI-ACCENT-2014-CH-480158-15.jpg',
      precio_por_dia: 1200,
      ubicacion: 'San Pedro Sula',
      direccion_recogida: 'Mall Galerías, Tercer Nivel, Estacionamiento B',
      rating: 4.9,
      reviews: 87,
      capacidad: 5,
      puertas: 5,
      combustible: 'Gasolina',
      transmision: 'Automática',
      aire_acondicionado: true,
      entrega_a_domicilio: true,
      opcion_conductor: true,
      capacidad_maleta: 5,
      coordenadas: { lat: 15.5066, lng: -88.0259 },
      descripcion: 'Honda CR-V 2021 en perfectas condiciones. Cómodo y espacioso SUV ideal para familias y viajes por carretera. Incluye asientos de cuero, pantalla táctil y sensores de estacionamiento.'
    },
    {
      id: 3,
      marca: 'Nissan',
      modelo: 'Frontier',
      año: 2020,
      tipo: 'Pickup',
      imagen: 'https://autotest.com.ar/wp-content/uploads/2022/02/NISSAN-FRONTIER-2023-FRENTE-768x474.jpg',
      precio_por_dia: 1350,
      ubicacion: 'Tegucigalpa',
      direccion_recogida: 'Centro Comercial Multiplaza, Nivel 1, Estacionamiento C-15',
      rating: 4.7,
      reviews: 56,
      capacidad: 5,
      puertas: 4,
      combustible: 'Diésel',
      transmision: 'Manual',
      aire_acondicionado: true,
      entrega_a_domicilio: false,
      opcion_conductor: true,
      capacidad_maleta: 6,
      coordenadas: { lat: 14.0818, lng: -87.1968 },
      descripcion: 'Nissan Frontier 2020 4x4 en excelente estado. Perfecta para aventuras y trabajo. Motor potente y cómodo interior. Capacidad de carga extraordinaria.'
    },
    {
      id: 4,
      marca: 'Hyundai',
      modelo: 'Accent',
      año: 2021,
      tipo: 'Sedán',
      imagen: 'https://kautoscr.com/wp-content/uploads/HYUNDAI-ACCENT-2014-CH-480158-15.jpg',
      precio_por_dia: 750,
      ubicacion: 'La Ceiba',
      direccion_recogida: 'Av. San Isidro, Frente a Plaza Central',
      rating: 4.6,
      reviews: 42,
      capacidad: 5,
      puertas: 4,
      combustible: 'Gasolina',
      transmision: 'Automática',
      aire_acondicionado: true,
      entrega_a_domicilio: true,
      opcion_conductor: false,
      capacidad_maleta: 2,
      coordenadas: { lat: 15.7796, lng: -86.7912 },
      descripcion: 'Hyundai Accent 2021 económico y eficiente. Perfecto para moverse por la ciudad con estilo y bajo consumo de combustible. Incluye bluetooth y cámara de retroceso.'
    },
    {
      id: 5,
      marca: 'Kia',
      modelo: 'Sportage',
      año: 2022,
      tipo: 'SUV',
      imagen: 'https://autosdeprimera.com/wp-content/uploads/2022/08/kia-sportage-nq5-colombia-2022-a.jpg',
      precio_por_dia: 1150,
      ubicacion: 'San Pedro Sula',
      direccion_recogida: 'City Mall, Entrada Principal, Local A-12',
      rating: 4.9,
      reviews: 31,
      capacidad: 5,
      puertas: 5,
      combustible: 'Gasolina',
      transmision: 'Automática',
      aire_acondicionado: true,
      entrega_a_domicilio: true,
      opcion_conductor: true,
      capacidad_maleta: 4,
      coordenadas: { lat: 15.5120, lng: -88.0260 },
      descripcion: 'Kia Sportage 2022 con diseño moderno y todas las comodidades. SUV espacioso y elegante con excelente rendimiento de combustible. Incluye sistemas de asistencia al conductor.'
    },
    {
      id: 6,
      marca: 'Toyota',
      modelo: 'Hilux',
      año: 2021,
      tipo: 'Pickup',
      imagen: 'https://cdn.motor1.com/images/mgl/kpvbx/s3/lanzamiento-toyota-hilux-2022.webp',
      precio_por_dia: 1500,
      ubicacion: 'Tegucigalpa',
      direccion_recogida: 'Blvd. Morazán, Edificio Torre Morazán, Nivel 2',
      rating: 4.8,
      reviews: 64,
      capacidad: 5,
      puertas: 4,
      combustible: 'Diésel',
      transmision: 'Automática',
      aire_acondicionado: true,
      entrega_a_domicilio: false,
      opcion_conductor: true,
      capacidad_maleta: 6,
      coordenadas: { lat: 14.0918, lng: -87.2068 },
      descripcion: 'Toyota Hilux 2021 4x4 robusta y confiable. La pickup perfecta para trabajo o aventura. Motor diésel potente y gran capacidad de carga.'
    },
    {
      id: 7,
      marca: 'Mazda',
      modelo: 'CX-5',
      año: 2022,
      tipo: 'SUV',
      imagen: 'https://www.carspotpanama.com/wp-content/uploads/2025/01/DC3828-1-1.jpg',
      precio_por_dia: 1280,
      ubicacion: 'San Pedro Sula',
      direccion_recogida: 'Altara Shopping Mall, Entrada Norte',
      rating: 4.9,
      reviews: 37,
      capacidad: 5,
      puertas: 5,
      combustible: 'Gasolina',
      transmision: 'Automática',
      aire_acondicionado: true,
      entrega_a_domicilio: true,
      opcion_conductor: true,
      capacidad_maleta: 4,
      coordenadas: { lat: 15.5091, lng: -88.0259 },
      descripcion: 'Mazda CX-5 2022 premium con acabados de lujo. Elegante SUV con gran manejo, tecnología avanzada y sistema de sonido Bose. Ideal para viajes en familia.'
    },
    {
      id: 8,
      marca: 'Chevrolet',
      modelo: 'Spark',
      año: 2020,
      tipo: 'Compacto',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Chevrolet_Spark_%2814114286768%29.jpg/1599px-Chevrolet_Spark_%2814114286768%29.jpg?20210125103315',
      precio_por_dia: 650,
      ubicacion: 'Roatán',
      direccion_recogida: 'Aeropuerto Internacional Juan Manuel Gálvez, Local 5',
      rating: 4.5,
      reviews: 28,
      capacidad: 4,
      puertas: 5,
      combustible: 'Gasolina',
      transmision: 'Manual',
      aire_acondicionado: true,
      entrega_a_domicilio: true,
      opcion_conductor: false,
      capacidad_maleta: 1,
      coordenadas: { lat: 16.3169, lng: -86.5230 },
      descripcion: 'Chevrolet Spark 2020 compacto y ágil. Perfecto para explorar la isla con bajo consumo. Fácil de conducir y estacionar, ideal para calles estrechas.'
    },
    {
      id: 9,
      marca: 'Mercedes-Benz',
      modelo: 'Clase C',
      año: 2021,
      tipo: 'Lujo',
      imagen: 'https://www.km77.com/images/medium/4/4/9/7/c-300-e-p.344497.jpg',
      precio_por_dia: 1800,
      ubicacion: 'San Pedro Sula',
      direccion_recogida: 'Hotel Intercontinental, Lobby Principal',
      rating: 5.0,
      reviews: 19,
      capacidad: 5,
      puertas: 4,
      combustible: 'Gasolina',
      transmision: 'Automática',
      aire_acondicionado: true,
      entrega_a_domicilio: true,
      opcion_conductor: true,
      capacidad_maleta: 3,
      coordenadas: { lat: 15.5153, lng: -88.0269 },
      descripcion: 'Mercedes-Benz Clase C 2021 de lujo. Elegancia, potencia y tecnología de punta. Interior de cuero, sistema MBUX y asistentes de conducción avanzados. La mejor experiencia premium.'
    }
  ]
  );
  
  
  // Estado de los autos 
  const cars = ref([]);
  
  // Historia de rentas
  const historyTab = ref('active'); // 'active', 'past', 'pending'
  const loadingHistory = ref(false);
  const rentalHistory = ref([]);
  const selectedRental = ref(null);
  const showPaymentModalFlag = ref(false);
  const showPaymentConfirmation = ref(false);
  const paymentData = ref({
    receiptImage: null
  });
  const paymentPreview = ref('');
  
  // Computed properties
  const filteredCars = computed(() => {
    return cars.value.filter(car => {
      // Filtrar por ubicación
      if (filters.value.location && car.ubicacion !== filters.value.location) return false;
      
      // Filtrar por tipo de vehículo
      if (filters.value.vehicleType && car.tipo !== filters.value.vehicleType) return false;
      
      // Filtrar por precio máximo
      if (car.precio_por_dia > filters.value.maxPrice) return false;
      
      // Filtrar por conductor
      if (filters.value.withDriver && !car.opcion_conductor) return false;
      
      // Filtrar por entrega a domicilio
      if (filters.value.homeDelivery && !car.entrega_a_domicilio) return false;
      
      return true;
    });
  });
  
  // Filtrar historial de rentas según la pestaña activa
  const filteredRentalHistory = computed(() => {
    return rentalHistory.value.filter(rental => {
      if (historyTab.value === 'active') return rental.estado === 'activo';
      if (historyTab.value === 'past') return rental.estado === 'completado' || rental.estado === 'cancelado';
      if (historyTab.value === 'pending') return rental.estado === 'pendiente_pago';
      return true;
    });
  });
  
  // Etiqueta para el histórico
  const historyTabLabel = computed(() => {
    if (historyTab.value === 'active') return 'activas';
    if (historyTab.value === 'past') return 'pasadas';
    if (historyTab.value === 'pending') return 'pendientes';
    return '';
  });
  
  // Calcular duración y costo del alquiler
  const rentalDays = computed(() => {
    if (!rentData.value.startDate || !rentData.value.endDate) return 1;
    
    const start = new Date(rentData.value.startDate);
    const end = new Date(rentData.value.endDate);
    
    // Verificar que las fechas sean válidas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    
    // Calcular la diferencia en días
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1;
  });
  
  const driverCost = computed(() => {
    return rentData.value.withDriver ? 350 * rentalDays.value : 0;
  });
  
  const totalRentCost = computed(() => {
    if (!selectedCar.value) return 0;
    
    const baseCost = selectedCar.value.precio_por_dia * rentalDays.value;
    return baseCost + driverCost.value;
  });
  
  // Métodos de UI
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  
  const redirectToProfile = () => {
    switch (selectedProfile.value) {
      case 'Cliente':
        window.location.href = '/Dashboard_Cliente';
        break;
      case 'Local':
        window.location.href = '/Dashboard_Local';
        break;
      case 'Delivery':
        window.location.href = '/Dashboard_Driver';
        break;
      default:
        break;
    }
  };
  
  const showNotifications = () => {
    isModalOpen.value = true;
  };
  
  const closeNotifications = () => {
    isModalOpen.value = false;
    notifications.value.forEach((notification) => {
      notification.read = true;
    });
  };
  
  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  };
  
  const redirectTo = (url) => {
    window.location.replace(url); // Reemplaza la URL y fuerza una recarga
  };
  
  // Métodos para gestión de datos
  const toggleDataSource = () => {
    useApiData.value = !useApiData.value;
    fetchCars();
  };
  
  const fetchCars = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      if (useApiData.value) {
        // Usando API real
        const response = await fetch('http://localhost:4000/autoenrenta');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        cars.value = data;
      } else {
        // Usando datos mock
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 800));
        cars.value = mockCars.value;
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      error.value = useApiData.value 
        ? 'No se pudo conectar con la API. Verifique que el servidor esté funcionando.' 
        : 'Error al cargar los datos de prueba.';
    } finally {
      loading.value = false;
    }
  };
  
  const fetchRentalHistory = async () => {
    loadingHistory.value = true;
    
    try {
      // Simulación de datos
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data para historial
      rentalHistory.value = [
        {
          id: 101,
          auto: mockCars.value[0], // Toyota Corolla
          fecha_inicio: new Date(2023, 10, 1).toISOString(),
          fecha_fin: new Date(2023, 10, 5).toISOString(),
          con_conductor: false,
          direccion_entrega: 'Colonia Kennedy, Calle Principal, Casa #45',
          estado: 'activo',
          total: 3560
        },
        {
          id: 102,
          auto: mockCars.value[4], // Kia Sportage
          fecha_inicio: new Date(2023, 9, 20).toISOString(),
          fecha_fin: new Date(2023, 9, 25).toISOString(),
          con_conductor: true,
          direccion_entrega: null,
          estado: 'completado',
          total: 7450
        },
        {
          id: 103,
          auto: mockCars.value[2], // Nissan Frontier
          fecha_inicio: new Date(2023, 10, 10).toISOString(),
          fecha_fin: new Date(2023, 10, 13).toISOString(),
          con_conductor: false,
          direccion_entrega: null,
          estado: 'pendiente_pago',
          total: 4050
        },
        {
          id: 104,
          auto: mockCars.value[7], // Chevrolet Spark
          fecha_inicio: new Date(2023, 8, 5).toISOString(),
          fecha_fin: new Date(2023, 8, 9).toISOString(),
          con_conductor: false,
          direccion_entrega: 'West Bay, Roatán, cerca del West Bay Beach Club',
          estado: 'cancelado',
          total: 2600
        }
      ];
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    } finally {
      loadingHistory.value = false;
    }
  };
  
  const searchCars = () => {
    // Validar fechas
    if (filters.value.startDate && filters.value.endDate) {
      const start = new Date(filters.value.startDate);
      const end = new Date(filters.value.endDate);
      
      if (end < start) {
        alert('La fecha de devolución debe ser posterior a la fecha de recogida');
        return;
      }
    }
    
    // Actualizar datos de renta con fechas de búsqueda
    if (filters.value.startDate) rentData.value.startDate = filters.value.startDate;
    if (filters.value.endDate) rentData.value.endDate = filters.value.endDate;
    
    // Realizar búsqueda
    fetchCars();
  };
  
  const resetFilters = () => {
    filters.value = {
      location: '',
      startDate: '',
      endDate: '',
      vehicleType: '',
      maxPrice: 1000,
      withDriver: false,
      homeDelivery: false
    };
    
    // Establecer fechas predeterminadas
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    filters.value.startDate = today.toISOString().substr(0, 10);
    filters.value.endDate = tomorrow.toISOString().substr(0, 10);
    
    fetchCars();
  };
  
  // Métodos para detalles del vehículo
  const showCarDetails = (car) => {
    selectedCar.value = car;
    
    // Inicializar los datos de renta
    if (!rentData.value.startDate) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      rentData.value.startDate = today.toISOString().substr(0, 10);
      rentData.value.endDate = tomorrow.toISOString().substr(0, 10);
    }
    
    // Inicializar mapa después de que el DOM esté actualizado
    setTimeout(() => {
      if (!selectedCar.value.entrega_a_domicilio) {
        initPickupMap();
      } else {
        initDeliveryMap();
      }
    }, 100);
  };
  
  const closeCarDetails = () => {
    selectedCar.value = null;
    rentData.value.licenseImage = null;
    rentData.value.deliveryCoordinates = null;
    licensePreview.value = '';
    
    if (pickupMap.value) {
      pickupMap.value.remove();
      pickupMap.value = null;
    }
    
    if (deliveryMap.value) {
      deliveryMap.value.remove();
      deliveryMap.value = null;
    }
  };
  
  // Métodos para imagen de licencia
  const triggerLicenseUpload = () => {
    if (rentData.value.licenseImage) return;
    const input = document.querySelector('input[type="file"]');
    if (input) input.click();
  };
  
  const handleLicenseChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert('Por favor, seleccione una imagen válida');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Tamaño máximo permitido: 10MB');
      return;
    }
    
    rentData.value.licenseImage = file;
    licensePreview.value = URL.createObjectURL(file);
  };
  
  const handleLicenseDrop = (event) => {
    event.preventDefault();
    
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      
      if (!file.type.match('image.*')) {
        alert('Por favor, seleccione una imagen válida');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Tamaño máximo permitido: 10MB');
        return;
      }
      
      rentData.value.licenseImage = file;
      licensePreview.value = URL.createObjectURL(file);
    }
  };
  
  const removeImage = () => {
    rentData.value.licenseImage = null;
    
    if (licensePreview.value) {
      URL.revokeObjectURL(licensePreview.value);
      licensePreview.value = '';
    }
  };
  
  // Métodos para mapa
  const initPickupMap = () => {
    if (!window.L) {
      loadLeaflet().then(() => {
        createPickupMap();
      });
      return;
    }
    
    createPickupMap();
  };
  
  const createPickupMap = () => {
    if (!selectedCar.value) return;
    
    const mapElement = document.getElementById('pickupMap');
    if (!mapElement) return;
    
    // Si ya existe un mapa, eliminarlo
    if (pickupMap.value) {
      pickupMap.value.remove();
    }
    
    const coords = selectedCar.value.coordenadas || { lat: 15.5046, lng: -88.0229 };
    
    // Crear mapa
    pickupMap.value = L.map('pickupMap').setView([coords.lat, coords.lng], 15);
    
    // Añadir capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(pickupMap.value);
    
    // Añadir marcador
    L.marker([coords.lat, coords.lng]).addTo(pickupMap.value)
      .bindPopup(`<b>${selectedCar.value.marca} ${selectedCar.value.modelo}</b><br>${selectedCar.value.direccion_recogida}`);
  };
  
  const initDeliveryMap = () => {
    if (!window.L) {
      loadLeaflet().then(() => {
        createDeliveryMap();
      });
      return;
    }
    
    createDeliveryMap();
  };
  
  const createDeliveryMap = () => {
    const mapElement = document.getElementById('deliveryMap');
    if (!mapElement) return;
    
    // Si ya existe un mapa, eliminarlo
    if (deliveryMap.value) {
      deliveryMap.value.remove();
    }
    
    // Crear mapa
    const defaultCoords = { lat: 15.5046, lng: -88.0229 }; // San Pedro Sula
    deliveryMap.value = L.map('deliveryMap').setView([defaultCoords.lat, defaultCoords.lng], 13);
    
    // Añadir capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(deliveryMap.value);
    
    // Añadir control de búsqueda
    deliveryMap.value.on('click', (e) => {
      setDeliveryLocation(e.latlng);
    });
  };
  
  const setDeliveryLocation = (latlng) => {
    if (deliveryMarker.value) {
      deliveryMap.value.removeLayer(deliveryMarker.value);
    }
    
    deliveryMarker.value = L.marker([latlng.lat, latlng.lng]).addTo(deliveryMap.value)
      .bindPopup('Punto de entrega seleccionado').openPopup();
    
    rentData.value.deliveryCoordinates = { lat: latlng.lat, lng: latlng.lng };
  };
  
  // Cargar leaflet dinámicamente
  const loadLeaflet = () => {
    return new Promise((resolve, reject) => {
      // Si ya está cargado
      if (window.L) {
        resolve();
        return;
      }
  
      // Cargar CSS
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(linkElement);
      
      // Cargar JS
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      scriptElement.onload = () => resolve();
      scriptElement.onerror = () => reject(new Error('No se pudo cargar Leaflet'));
      document.head.appendChild(scriptElement);
    });
  };
  
  // Métodos para renta
  const submitRentRequest = async () => {
    // Validaciones
    if (!rentData.value.startDate || !rentData.value.endDate) {
      alert('Por favor, seleccione las fechas de recogida y devolución');
      return;
    }
    
    const start = new Date(rentData.value.startDate);
    const end = new Date(rentData.value.endDate);
    
    if (end < start) {
      alert('La fecha de devolución debe ser posterior a la fecha de recogida');
      return;
    }
    
    if (!rentData.value.withDriver && !rentData.value.licenseImage) {
      alert('Por favor, suba una imagen de su licencia de conducir o seleccione la opción con conductor');
      return;
    }
    
    // Para autos con entrega a domicilio, verificar si se seleccionó un punto de entrega
    if (selectedCar.value.entrega_a_domicilio && !rentData.value.deliveryCoordinates && !rentData.value.deliveryAddress) {
      alert('Por favor, seleccione un punto de entrega en el mapa o ingrese una dirección');
      return;
    }
    
    // Simular envío de datos
    try {
      loading.value = true;
      
      const rentRequestData = {
        id_auto_en_renta: selectedCar.value.id,
        id_cliente: 1, // Simulado - normalmente vendría del usuario autenticado
        fecha_inicio: rentData.value.startDate,
        fecha_fin: rentData.value.endDate,
        con_conductor: rentData.value.withDriver,
        direccion_entrega: rentData.value.deliveryAddress || JSON.stringify(rentData.value.deliveryCoordinates),
        imagen_licencia: rentData.value.licenseImage ? 'url_to_uploaded_image' : null,
        id_metodo_pago: 1, // Simulado
        total: totalRentCost.value
      };
      
      if (useApiData.value) {
        // Llamar a la API real
        const formData = new FormData();
        
        // Agregar todos los campos al FormData
        Object.keys(rentRequestData).forEach(key => {
          if (key === 'imagen_licencia' && rentData.value.licenseImage) {
            formData.append(key, rentData.value.licenseImage);
          } else if (rentRequestData[key] !== null) {
            formData.append(key, rentRequestData[key]);
          }
        });
        
        const response = await fetch(`http://localhost:4000/rentarauto/${selectedCar.value.id}`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
      } else {
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Agregar a historial
        const newRental = {
          id: 105,
          auto: selectedCar.value,
          fecha_inicio: rentData.value.startDate,
          fecha_fin: rentData.value.endDate,
          con_conductor: rentData.value.withDriver,
          direccion_entrega: rentData.value.deliveryAddress || 'Coordenadas seleccionadas en el mapa',
          estado: 'pendiente_pago',
          total: totalRentCost.value
        };
        
        rentalHistory.value.push(newRental);
      }
      
      // Mostrar confirmación
      showRentConfirmation.value = true;
      closeCarDetails();
      
    } catch (err) {
      console.error('Error submitting rent request:', err);
      alert('Error al enviar la solicitud de renta. Por favor, intente nuevamente.');
    } finally {
      loading.value = false;
    }
  };
  
  const goToHistory = () => {
    activeSection.value = 'history';
    historyTab.value = 'pending';
    closeRentConfirmation();
  };
  
  const closeRentConfirmation = () => {
    showRentConfirmation.value = false;
    
    // Reiniciar datos de renta
    rentData.value = {
      startDate: '',
      endDate: '',
      deliveryAddress: '',
      deliveryCoordinates: null,
      withDriver: false,
      licenseImage: null
    };
    
    // Limpiar imagen de licencia
    if (licensePreview.value) {
      URL.revokeObjectURL(licensePreview.value);
      licensePreview.value = '';
    }
  };
  
  // Métodos para historial
  const showRentalDetails = (rental) => {
    alert(`Detalles del alquiler: ${rental.auto.marca} ${rental.auto.modelo}`);
    // Aquí se implementaría un modal con detalles completos
  };
  
  const extendRental = (rental) => {
    alert(`Extender alquiler: ${rental.auto.marca} ${rental.auto.modelo}`);
    // Aquí se implementaría un modal para extender la renta
  };
  
  const cancelRental = (rental) => {
    if (confirm(`¿Está seguro de cancelar el alquiler del ${rental.auto.marca} ${rental.auto.modelo}?`)) {
      // Simulamos cancelación
      const index = rentalHistory.value.findIndex(r => r.id === rental.id);
      if (index !== -1) {
        rentalHistory.value[index].estado = 'cancelado';
      }
    }
  };
  
  // Formateo de fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };
  
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Métodos para modal de pago
  const showPaymentModal = (rental) => {
    selectedRental.value = rental;
    showPaymentModalFlag.value = true;
    paymentData.value.receiptImage = null;
    paymentPreview.value = '';
  };
  
  const closePaymentModal = () => {
    showPaymentModalFlag.value = false;
    selectedRental.value = null;
    
    if (paymentPreview.value) {
      URL.revokeObjectURL(paymentPreview.value);
      paymentPreview.value = '';
    }
  };
  
  const triggerPaymentUpload = () => {
    const input = document.querySelector('input[ref="paymentInput"]');
    if (input) input.click();
  };
  
  const handlePaymentChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert('Por favor, seleccione una imagen válida');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Tamaño máximo permitido: 10MB');
      return;
    }
    
    paymentData.value.receiptImage = file;
    paymentPreview.value = URL.createObjectURL(file);
  };
  
  const handlePaymentDrop = (event) => {
    event.preventDefault();
    
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      
      if (!file.type.match('image.*')) {
        alert('Por favor, seleccione una imagen válida');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Tamaño máximo permitido: 10MB');
        return;
      }
      
      paymentData.value.receiptImage = file;
      paymentPreview.value = URL.createObjectURL(file);
    }
  };
  
  const removePaymentImage = () => {
    paymentData.value.receiptImage = null;
    
    if (paymentPreview.value) {
      URL.revokeObjectURL(paymentPreview.value);
      paymentPreview.value = '';
    }
  };
  
  const submitPayment = async () => {
    if (!paymentData.value.receiptImage) {
      alert('Por favor, suba una imagen del comprobante de pago');
      return;
    }
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar estado de la renta en el historial
      if (selectedRental.value) {
        const index = rentalHistory.value.findIndex(r => r.id === selectedRental.value.id);
        if (index !== -1) {
          // Cambiar a activo (simulando que el pago fue aprobado instantáneamente)
          rentalHistory.value[index].estado = 'activo';
        }
      }
      
      // Cerrar modal de pago
      closePaymentModal();
      
      // Mostrar confirmación
      showPaymentConfirmation.value = true;
      
    } catch (err) {
      console.error('Error al enviar el pago:', err);
      alert('Error al procesar el pago. Por favor, intente nuevamente.');
    }
  };
  
  const closePaymentConfirmation = () => {
    showPaymentConfirmation.value = false;
  };
  
  // Watchers
  watch(() => filters.value.startDate, (newVal) => {
    if (newVal) rentData.value.startDate = newVal;
  });
  
  watch(() => filters.value.endDate, (newVal) => {
    if (newVal) rentData.value.endDate = newVal;
  });
  
  // Vigilar cambios en el conductor seleccionado
  watch(() => rentData.value.withDriver, (hasDriver) => {
    if (hasDriver && rentData.value.licenseImage) {
      // Si se selecciona conductor, eliminar imagen de licencia
      removeImage();
    }
  });
  
  // Vigilar cambios de sección para cargar datos
  watch(() => activeSection.value, (newSection) => {
    if (newSection === 'history') {
      fetchRentalHistory();
    }
  });
  
  // Inicialización
  onMounted(() => {
    fetchCars();
    
    // Establecer fechas predeterminadas
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    filters.value.startDate = today.toISOString().substr(0, 10);
    filters.value.endDate = tomorrow.toISOString().substr(0, 10);
    
    // Pre-cargar datos del historial
    fetchRentalHistory();
  });
  </script>
  
  <style>
  /* Estilos adicionales */
  .tab-button {
    @apply px-4 py-2 rounded-full font-medium;
  }
  
  /* Animaciones */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Estilizar input de tipo date */
  input[type="date"] {
    @apply appearance-none;
  }
  
  /* Estilizar input de tipo range */
  input[type="range"] {
    -webkit-appearance: none;
    @apply h-2 rounded-lg bg-gray-200;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    @apply w-4 h-4 rounded-full bg-blue-600 cursor-pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    @apply w-4 h-4 rounded-full border-none bg-blue-600 cursor-pointer;
  }
  
  /* Ocultar scrollbar pero mantener funcionalidad */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
  
  /* Asegurar que los mapas tengan altura */
  #pickupMap, #deliveryMap {
    height: 100%;
    min-height: 256px;
  }
  
  /* Footer */
  footer {
    background-color: white; /* Fondo sólido */
    z-index: 10; /* Asegura que esté por encima del contenido */
  }
  
  /* Modo oscuro */
  @media (prefers-color-scheme: dark) {
    .dark {
      /* Estilos para modo oscuro */
    }
  }
  </style>
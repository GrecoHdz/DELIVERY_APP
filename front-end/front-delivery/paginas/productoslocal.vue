<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Header con diseño moderno -->
    <header class="bg-white shadow-lg px-6 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
            <TruckIcon class="text-white" :size="26" />
          </div>
          <span class="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">DeliveryPro</span>
        </div>
        <div class="flex items-center space-x-5">
          <select v-model="selectedProfile" class="p-2 text-center bg-white border-2 border-indigo-500 text-indigo-600 rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all">
            <option value="Cliente">Cliente</option>
            <option value="Local">Local</option>
            <option value="Delivery">Delivery</option>
          </select>
          <div class="relative cursor-pointer" @click="showNotifications">
            <div class="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-all">
              <BellIcon class="text-indigo-600" :size="24" />
            </div>
            <div v-if="unreadNotifications.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ unreadNotifications.length }}
            </div>
          </div>
        </div>
      </div>
    </header>
  
    <!-- Modal de Notificaciones -->
    <transition name="fade">
      <div v-if="isModalOpen" class="absolute top-20 right-6 bg-white shadow-2xl rounded-xl p-4 w-72 z-50 border border-indigo-100">
        <h3 class="font-bold text-lg mb-3 text-indigo-600">Notificaciones</h3>
        <div v-if="notifications.length > 0" class="max-h-80 overflow-y-auto">
          <div
            v-for="(notification, index) in notifications"
            :key="index"
            class="p-3 mb-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-all"
            @click="markAsRead(notification.id)"
            :class="{ 'bg-indigo-50': notification.read }"
          >
            <p class="text-sm text-gray-700">{{ notification.message }}</p>
            <span v-if="!notification.read" class="text-xs text-indigo-500 font-medium mt-1 block">Nueva</span>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 p-3 text-center">
          No tienes notificaciones nuevas.
        </div>
        <button
          @click="closeNotifications"
          class="mt-3 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg py-2 hover:from-blue-600 hover:to-indigo-700 transition-all font-medium"
        >
          Cerrar
        </button>
      </div>
    </transition>
  
    <!-- Contenido Principal -->
    <div class="px-6 py-8 pb-32 max-w-7xl mx-auto">
      <!-- Header de Página con Diseño Mejorado -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Administración de Productos</h1>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <p class="text-indigo-600 text-lg">
            Gestiona tu catálogo <span class="text-indigo-800 font-semibold">de forma eficiente</span>
          </p>
          <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-white p-1 rounded-full shadow-sm">
            <span class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm py-1 px-3 rounded-full shadow-sm">
              {{ appMode === 'production' ? 'Modo Producción' : 'Modo Demo' }}
            </span>
            <button
              @click="toggleAppMode"
              class="text-gray-500 hover:text-indigo-600 p-1"
              title="Cambiar modo"
            >
              <RefreshCwIcon :size="20" />
            </button>
          </div>
        </div>
      </div>
  
      <!-- Panel de control y búsqueda -->
      <div class="mb-8 bg-white rounded-xl shadow-md p-6 border border-indigo-100">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Búsqueda -->
          <div class="lg:col-span-1 order-1">
            <label class="block text-xs font-medium text-indigo-600 mb-1 ml-1">Buscar</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar productos..."
                class="w-full pl-12 pr-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-base"
              >
              <SearchIcon class="absolute left-4 top-3 text-indigo-400" :size="20" />
            </div>
          </div>
  
          <!-- Filtros -->
          <div class="relative">
            <label class="block text-xs font-medium text-indigo-600 mb-1 ml-1">Categoría</label>
            <select
              v-model="filterCategory"
              class="w-full appearance-none bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-700"
            >
              <option value="">Todas las categorías</option>
              <option v-for="subcat in subcategories" :key="subcat.id_subcategoria" :value="subcat.id_subcategoria">
                {{ subcat.nombre_subcategoria }}
              </option>
            </select>
            <ChevronDownIcon class="absolute right-3 bottom-3 text-indigo-400" :size="18" />
          </div>
  
          <div class="relative">
            <label class="block text-xs font-medium text-indigo-600 mb-1 ml-1">Estado</label>
            <select
              v-model="filterStatus"
              class="w-full appearance-none bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-700"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="offer">En oferta</option>
            </select>
            <ChevronDownIcon class="absolute right-3 bottom-3 text-indigo-400" :size="18" />
          </div>
  
          <div class="relative">
            <label class="block text-xs font-medium text-indigo-600 mb-1 ml-1">Sucursal</label>
            <select
              v-model="selectedBranch"
              class="w-full appearance-none bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-700"
            >
              <option value="">Todas las sucursales</option>
              <option v-for="branch in branches" :key="branch.id_direccion_local" :value="branch.id_direccion_local">
                {{ branch.colonia }}
              </option>
            </select>
            <ChevronDownIcon class="absolute right-3 bottom-3 text-indigo-400" :size="18" />
          </div>
        </div>
  
        <!-- Filtros activos y botón de agregar producto -->
        <div class="flex flex-wrap items-center justify-between mt-6">
          <div class="flex flex-wrap gap-2">
            <div
              v-if="searchQuery"
              class="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1.5 text-sm flex items-center"
            >
              Búsqueda: {{ searchQuery }}
              <button @click="searchQuery = ''" class="ml-1.5 text-indigo-500 hover:text-indigo-700">
                <XIcon :size="16" />
              </button>
            </div>
  
            <div
              v-if="filterCategory"
              class="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1.5 text-sm flex items-center"
            >
              Categoría: {{ getCategoryName(filterCategory) }}
              <button @click="filterCategory = ''" class="ml-1.5 text-indigo-500 hover:text-indigo-700">
                <XIcon :size="16" />
              </button>
            </div>
  
            <div
              v-if="filterStatus"
              class="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1.5 text-sm flex items-center"
            >
              Estado: {{ getStatusLabel(filterStatus) }}
              <button @click="filterStatus = ''" class="ml-1.5 text-indigo-500 hover:text-indigo-700">
                <XIcon :size="16" />
              </button>
            </div>
  
            <div
              v-if="selectedBranch"
              class="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1.5 text-sm flex items-center"
            >
              Sucursal: {{ getBranchName(selectedBranch) }}
              <button @click="selectedBranch = ''" class="ml-1.5 text-indigo-500 hover:text-indigo-700">
                <XIcon :size="16" />
              </button>
            </div>
          </div>
  
          <button
            @click="openModal('add')"
            class="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <PlusIcon :size="20" />
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>
  
      <!-- Estado de carga -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="relative w-20 h-20">
          <div class="absolute top-0 left-0 w-full h-full rounded-full border-8 border-indigo-200"></div>
          <div class="absolute top-0 left-0 w-full h-full rounded-full border-8 border-transparent border-t-indigo-600 animate-spin"></div>
        </div>
      </div>
  
      <!-- Mensaje sin resultados -->
      <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="bg-indigo-50 p-6 rounded-full mb-6">
          <PackageXIcon :size="80" class="text-indigo-300" />
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">No se encontraron productos</h3>
        <p class="text-indigo-600 mb-6 max-w-md">
          Intenta con otros filtros o agrega un nuevo producto a tu catálogo
        </p>
        <button
          @click="openModal('add')"
          class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
        >
          <PlusIcon :size="20" />
          <span>Agregar Producto</span>
        </button>
      </div>
  
      <!-- Grid de Productos Mejorado -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in paginatedProducts"
          :key="product.id_producto"
          class="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-indigo-100 relative transform hover:-translate-y-1 flex flex-col"
        >
          <!-- Badges y Estado -->
          <div class="absolute top-0 left-0 right-0 p-3 flex justify-between z-10">
            <div class="flex flex-wrap gap-2">
              <div
                v-if="isRecommended(product)"
                class="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center"
              >
                <StarIcon :size="12" class="mr-1" />
                Recomendado
              </div>
  
              <div
                v-if="product.preciooferta"
                class="bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center"
              >
                <TagIcon :size="12" class="mr-1" />
                Oferta
              </div>
            </div>
  
            <div
              v-if="!product.activo"
              class="bg-gray-800 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
            >
              Inactivo
            </div>
          </div>
  
          <!-- Imagen del producto -->
          <div class="relative h-56 overflow-hidden bg-indigo-50">
            <div
              v-if="!product.activo"
              class="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center"
            >
              <span class="bg-white bg-opacity-80 text-gray-800 font-bold text-lg py-1 px-4 rounded-lg">Deshabilitado</span>
            </div>
  
            <img
              v-if="product.imagen_url"
              :src="product.imagen_url"
              :alt="product.nombre_producto"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="flex items-center justify-center h-full p-6">
              <div class="bg-white p-4 rounded-xl shadow-sm">
                <ImageOffIcon :size="48" class="text-indigo-200" />
              </div>
            </div>
          </div>
  
          <!-- Información del producto -->
          <div class="p-5 pt-4 flex-grow flex flex-col">
            <!-- Categoría del producto -->
            <div class="mb-2 flex items-center">
              <span class="text-xs font-medium text-indigo-600 bg-indigo-50 py-1 px-2 rounded">
                {{ getCategoryName(product.id_subcategoria) || 'Sin categoría' }}
              </span>
            </div>
  
            <!-- Nombre y precio -->
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-lg line-clamp-2 pr-2">
                {{ product.nombre_producto }}
              </h3>
              <div>
                <div v-if="product.preciooferta" class="flex flex-col items-end">
                  <span class="line-through text-gray-500 text-sm">${{ formatPrice(product.precio) }}</span>
                  <span class="font-bold text-red-600 text-lg">${{ formatPrice(product.preciooferta) }}</span>
                </div>
                <div v-else class="font-bold text-indigo-600 text-lg">
                  ${{ formatPrice(product.precio) }}
                </div>
              </div>
            </div>
  
            <!-- Descripción -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ product.descripcion_producto || 'Sin descripción disponible' }}
            </p>
  
            <!-- Extras y atributos -->
            <div v-if="hasExtrasOrAttributes(product)" class="mb-4">
              <div v-if="product.extras && product.extras.length > 0" class="flex flex-wrap gap-1 mb-1">
                <span
                  v-for="(extra, idx) in product.extras"
                  :key="idx"
                  class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded flex items-center"
                >
                  +{{ extra.nombre }}
                  <button
                    @click.stop="removeExtra(product, extra)"
                    class="ml-1 text-blue-400 hover:text-blue-600"
                    title="Eliminar extra"
                  >
                    <XIcon :size="12" />
                  </button>
                </span>
              </div>
              <div v-if="product.atributos && product.atributos.length > 0" class="flex flex-wrap gap-1">
                <span
                  v-for="(attr, idx) in product.atributos"
                  :key="idx"
                  class="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded flex items-center"
                >
                  {{ attr.nombre_atributo }}: {{ attr.valor }}
                  <button
                    @click.stop="removeAttribute(product, attr)"
                    class="ml-1 text-purple-400 hover:text-purple-600"
                    title="Eliminar atributo"
                  >
                    <XIcon :size="12" />
                  </button>
                </span>
              </div>
            </div>
  
            <!-- Disponibilidad en sucursales -->
            <div v-if="product.sucursales && product.sucursales.length > 0" class="mb-4 mt-auto">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(sucursalId, idx) in product.sucursales.slice(0, 2)"
                  :key="idx"
                  class="bg-green-50 text-green-600 text-xs px-2 py-1 rounded flex items-center"
                >
                  <MapPinIcon :size="11" class="mr-1" />
                  {{ getBranchName(sucursalId) }}
                </span>
                <span
                  v-if="product.sucursales.length > 2"
                  class="bg-green-50 text-green-600 text-xs px-2 py-1 rounded"
                >
                  +{{ product.sucursales.length - 2 }} más
                </span>
              </div>
            </div>
  
            <!-- Acciones -->
            <div class="border-t border-indigo-50 pt-3 mt-auto">
              <div class="grid grid-cols-3 gap-2">
                <!-- Primera fila -->
                <button
                  @click="openModal('edit', product)"
                  class="bg-indigo-50 text-indigo-600 rounded-lg p-2 flex flex-col items-center text-xs transition-colors hover:bg-indigo-100"
                >
                  <PencilIcon :size="16" class="mb-1" />
                  Editar
                </button>
                
                <button
                  @click="toggleProductStatus(product)"
                  class="rounded-lg p-2 flex flex-col items-center text-xs transition-colors"
                  :class="product.activo ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
                >
                  <component :is="product.activo ? EyeOffIcon : EyeIcon" :size="16" class="mb-1" />
                  {{ product.activo ? 'Desactivar' : 'Activar' }}
                </button>
                
                <button
                  @click="openModal('offer', product)"
                  class="bg-amber-50 text-amber-600 rounded-lg p-2 flex flex-col items-center text-xs transition-colors hover:bg-amber-100"
                >
                  <TagIcon :size="16" class="mb-1" />
                  {{ product.preciooferta ? 'Editar oferta' : 'Crear oferta' }}
                </button>

                <!-- Segunda fila -->
                <button
                  @click="openModal('recommend', product)"
                  class="bg-purple-50 text-purple-600 rounded-lg p-2 flex flex-col items-center text-xs transition-colors hover:bg-purple-100"
                >
                  <StarIcon :size="16" class="mb-1" />
                  {{ isRecommended(product) ? 'Quitar rec.' : 'Recomendar' }}
                </button>
                
                <button
                  @click="openModal('extra', product)"
                  class="bg-purple-50 text-purple-600 rounded-lg p-2 flex flex-col items-center text-xs transition-colors hover:bg-purple-100"
                ><PlusCircleIcon :size="16" class="mb-1" />
                  Añadir extra
                </button>
                
                <button
                  @click="openModal('attribute', product)"
                  class="bg-purple-50 text-purple-600 rounded-lg p-2 flex flex-col items-center text-xs transition-colors hover:bg-purple-100"
                >
                  <ListPlusIcon :size="16" class="mb-1" />
                  Añadir atr.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Paginación Mejorada -->
      <div v-if="filteredProducts.length > 0" class="mt-10 flex justify-between items-center">
        <p class="text-gray-600 text-sm">
          Mostrando <span class="font-semibold">{{ paginationStart }}</span> a
          <span class="font-semibold">{{ paginationEnd }}</span> de
          <span class="font-semibold">{{ filteredProducts.length }}</span> productos
        </p>
  
        <div class="flex items-center gap-2">
          <button
            @click="currentPage > 1 && currentPage--"
            :disabled="currentPage === 1"
            :class="{'opacity-50 cursor-not-allowed': currentPage === 1, 'hover:bg-indigo-50': currentPage > 1}"
            class="p-2 rounded-lg border border-indigo-200 text-indigo-600 transition-colors"
          >
            <ChevronLeftIcon :size="20" />
          </button>
  
          <div class="flex">
            <template v-for="page in paginationNumbers" :key="page">
              <button
                v-if="page !== '...'"
                @click="currentPage = page"
                :class="currentPage === page ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent' : 'text-gray-700 hover:bg-indigo-50 border-indigo-200'"
                class="px-3.5 py-2 rounded-lg border transition-colors mx-0.5 text-sm font-medium"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="px-3 py-2 text-gray-500 mx-0.5 text-sm font-medium flex items-end"
              >
                ...
              </span>
            </template>
          </div>
  
          <button
            @click="currentPage < totalPages && currentPage++"
            :disabled="currentPage >= totalPages"
            :class="{'opacity-50 cursor-not-allowed': currentPage >= totalPages, 'hover:bg-indigo-50': currentPage < totalPages}"
            class="p-2 rounded-lg border border-indigo-200 text-indigo-600 transition-colors"
          >
            <ChevronRightIcon :size="20" />
          </button>
        </div>
      </div>
    </div>
  
    <!-- Modales -->
    <!-- Modal de Agregar/Editar Producto -->
    <transition name="modal">
      <div v-if="currentModal === 'add' || currentModal === 'edit'" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto z-10 overflow-hidden">
            <!-- Modal Header con gradiente -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white">
                {{ currentModal === 'add' ? '✨ Agregar nuevo producto' : '✏️ Editar producto' }}
              </h2>
              <button @click="closeModal" class="text-white hover:text-indigo-100">
                <XIcon :size="24" />
              </button>
            </div>
  
            <div class="p-6 max-h-[70vh] overflow-y-auto">
              <form @submit.prevent="currentModal === 'add' ? addProduct() : updateProduct()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Columna izquierda -->
                  <div class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del producto*</label>
                      <input
                        v-model="productForm.nombre_producto"
                        type="text"
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: Hamburguesa Especial"
                      >
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
                      <div class="relative">
                        <select
                          v-model="productForm.id_subcategoria"
                          required
                          class="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="" disabled>Selecciona una categoría</option>
                          <option v-for="subcat in subcategories" :key="subcat.id_subcategoria" :value="subcat.id_subcategoria">
                            {{ subcat.nombre_subcategoria }}
                          </option>
                        </select>
                        <ChevronDownIcon class="absolute right-3 top-3.5 text-gray-400" :size="18" />
                      </div>
                    </div>
  
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Precio*</label>
                        <div class="relative">
                          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                          <input
                            v-model="productForm.preciofinal"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                          >
                        </div>
                      </div>
  
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Precio de oferta</label>
                        <div class="relative">
                          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                          <input
                            v-model="productForm.precioofertafinal"
                            type="number"
                            step="0.01"
                            min="0"
                            :max="productForm.preciofinal"
                            class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                          >
                        </div>
                      </div>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        v-model="productForm.descripcion_producto"
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe tu producto de manera atractiva..."
                      ></textarea>
                    </div>
                  </div>
  
                  <!-- Columna derecha -->
                  <div class="space-y-6">
                    <!-- Imagen del producto -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Imagen del producto</label>
                      <div class="border-2 border-dashed border-indigo-300 rounded-lg p-4 bg-indigo-50">
                        <div v-if="productForm.imagen_url" class="mb-3">
                          <div class="relative rounded-lg overflow-hidden h-40">
                            <img
                              :src="productForm.imagen_url"
                              alt="Previsualización"
                              class="w-full h-full object-cover"
                            >
                            <button
                              @click="removeImage"
                              type="button"
                              class="absolute top-2 right-2 bg-white bg-opacity-80 text-red-500 hover:text-red-700 p-1 rounded-full"
                            >
                              <XIcon :size="16" />
                            </button>
                          </div>
                        </div>
  
                        <div v-else class="flex flex-col items-center justify-center">
                          <div class="bg-white p-3 rounded-full mb-3">
                            <UploadCloudIcon :size="32" class="text-indigo-500" />
                          </div>
                          <p class="text-sm text-center text-gray-600 mb-3">
                            Arrastra y suelta tu imagen aquí, o<br>
                            haz clic para seleccionar un archivo
                          </p>
                        </div>
  
                        <div class="flex justify-center">
                          <label class="cursor-pointer bg-white text-indigo-600 px-4 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center gap-1">
                            <UploadIcon :size="16" />
                            <span>{{ productForm.imagen_url ? 'Cambiar imagen' : 'Subir imagen' }}</span>
                            <input type="file" accept="image/*" class="hidden" @change="handleImageUpload">
                          </label>
                        </div>
                      </div>
                    </div>
  
                    <!-- Sucursales disponibles -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Disponibilidad en sucursales*</label>
                      <div class="space-y-1 max-h-52 overflow-y-auto border border-gray-300 rounded-lg p-3">
                        <div
                          v-for="branch in branches"
                          :key="branch.id_direccion_local"
                          class="flex items-center justify-between p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <div class="flex items-center">
                            <input
                              :id="`branch-${branch.id_direccion_local}`"
                              type="checkbox"
                              :value="branch.id_direccion_local"
                              v-model="productForm.sucursales"
                              class="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
                            >
                            <label :for="`branch-${branch.id_direccion_local}`" class="ml-2 text-sm text-gray-700 flex items-center">
                              <MapPinIcon :size="14" class="mr-1 text-indigo-500" />
                              {{ branch.colonia }} <span class="text-xs text-gray-500 ml-1">({{ branch.direccion_precisa }})</span>
                            </label>
                          </div>
                          <div
                            v-if="productForm.sucursales.includes(branch.id_direccion_local)"
                            class="flex items-center gap-1"
                          >
                            <span class="text-xs text-gray-500">Precio:</span>
                            <div class="relative">
                              <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Igual"
                                :value="productForm.sucursalesPrecios[branch.id_direccion_local] || ''"
                                @input="e => updateBranchPrice(branch.id_direccion_local, e.target.value)"
                                class="w-24 pl-6 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
  
<!-- Estado del producto -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Estado del producto</label>
  <div class="flex bg-indigo-50 p-1 rounded-lg">
    <button
      type="button"
      @click="productForm.activo = (productForm.activo === 1 ? 0 : 1)"
      :class="productForm.activo === 1 ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-indigo-600'"
      class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Activo
    </button>
    <button
      type="button"
      @click="productForm.activo = (productForm.activo === 0 ? 1 : 0)"
      :class="productForm.activo === 0 ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-indigo-600'"
      class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Inactivo
    </button>
  </div>
</div>
                  </div>
                </div>
  
                <div class="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors font-medium"
                  >
                    {{ currentModal === 'add' ? 'Agregar producto' : 'Guardar cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Modal de Oferta -->
    <transition name="modal">
      <div v-if="currentModal === 'offer'" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto z-10 overflow-hidden">
            <!-- Modal Header con gradiente -->
            <div class="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white">
                {{ selectedProduct?.preciooferta ? '🏷️ Editar oferta' : '🔥 Crear oferta' }}
              </h2>
              <button @click="closeModal" class="text-white hover:text-red-100">
                <XIcon :size="24" />
              </button>
            </div>
  
            <div class="p-6">
              <form @submit.prevent="createOffer">
                <div class="space-y-6">
                  <div>
                    <div class="flex justify-between items-center mb-1">
                      <label class="block text-sm font-medium text-gray-700">Producto</label>
                      <span class="font-medium text-indigo-600">${{ formatPrice(selectedProduct?.precio) }}</span>
                    </div>
                    <div class="flex gap-3 items-center bg-indigo-50 p-3 rounded-lg">
                      <div class="w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                        <img
                          v-if="selectedProduct?.imagen_url"
                          :src="selectedProduct.imagen_url"
                          :alt="selectedProduct.nombre_producto"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <ImageOffIcon :size="24" class="text-gray-300" />
                        </div>
                      </div>
                      <span class="text-gray-800 font-medium line-clamp-2">{{ selectedProduct?.nombre_producto }}</span>
                    </div>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio de oferta*</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                      <input
                        v-model="offerForm.precio_oferta"
                        type="number"
                        step="0.01"
                        min="0"
                        :max="selectedProduct?.precio"
                        required
                        class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      >
                    </div>
                  </div>
  
                  <div v-if="offerForm.precio_oferta && selectedProduct?.precio" class="bg-green-50 p-3 rounded-lg">
                    <div class="flex items-start gap-2">
                      <div class="bg-green-100 p-1 rounded-full text-green-600 mt-0.5">
                        <TagIcon :size="16" />
                      </div>
                      <div>
                        <div class="text-green-800 font-medium">Descuento calculado</div>
                        <div class="mt-1 text-sm text-green-700">
                          <div class="flex justify-between items-center">
                            <span>Descuento:</span>
                            <span class="font-medium">{{ calculateDiscount(offerForm.precio_oferta, selectedProduct.precio) }}%</span>
                          </div>
                          <div class="flex justify-between items-center mt-1">
                            <span>Ahorro:</span>
                            <span class="font-medium">${{ formatPrice(selectedProduct.precio - offerForm.precio_oferta) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div class="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    @click="removeOffer"
                    v-if="selectedProduct?.preciooferta"
                    class="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    Eliminar oferta
                  </button>
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium"
                    :disabled="!isValidOffer()"
                    :class="{'opacity-50 cursor-not-allowed': !isValidOffer()}"
                  >
                    Guardar oferta
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Modal para Recomendar -->
    <transition name="modal">
      <div v-if="currentModal === 'recommend'" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto z-10 overflow-hidden">
            <!-- Modal Header con gradiente -->
            <div class="bg-gradient-to-r from-amber-400 to-amber-600 p-6 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white">
                {{ isRecommended(selectedProduct) ? '⭐ Cancelar recomendación' : '⭐ Recomendar producto' }}
              </h2>
              <button @click="closeModal" class="text-white hover:text-amber-100">
                <XIcon :size="24" />
              </button>
            </div>
  
            <div class="p-6">
              <div class="flex gap-3 items-center mb-6 bg-indigo-50 p-3 rounded-lg">
                <div class="w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                  <img
                    v-if="selectedProduct?.imagen_url"
                    :src="selectedProduct.imagen_url"
                    :alt="selectedProduct.nombre_producto"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <ImageOffIcon :size="24" class="text-gray-300" />
                  </div>
                </div>
                <span class="text-gray-800 font-medium line-clamp-2">{{ selectedProduct?.nombre_producto }}</span>
              </div>
  
              <div v-if="isRecommended(selectedProduct)">
                <div class="bg-amber-50 p-4 rounded-lg mb-6">
                  <div class="flex items-start gap-3">
                    <div class="text-amber-500 mt-0.5">
                      <StarIcon :size="24" />
                    </div>
                    <div>
                      <p class="font-medium text-amber-800">
                        Este producto está recomendado actualmente
                      </p>
                      <p class="text-sm text-amber-700 mt-1">
                        Al quitar la recomendación, el producto dejará de aparecer destacado en el catálogo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="bg-indigo-50 p-4 rounded-lg mb-6">
                  <div class="flex items-start gap-3">
                    <div class="text-indigo-500 mt-0.5">
                      <InfoIcon :size="24" />
                    </div>
                    <div>
                      <p class="font-medium text-indigo-800">
                        Información de recomendaciones
                      </p>
                      <p class="text-sm text-indigo-700 mt-1">
                        Tu plan <span class="font-semibold">{{ currentPlan }}</span> permite
                        <span class="font-semibold">{{ recommendationLimits[currentPlan] }} recomendaciones</span>.
                        Tienes <span class="font-semibold">{{ remainingRecommendations }}</span> disponibles.
                      </p>
                    </div>
                  </div>
                </div>
  
                <div v-if="remainingRecommendations <= 0" class="bg-red-50 p-4 rounded-lg mb-6">
                  <div class="flex items-start gap-3">
                    <div class="text-red-500 mt-0.5">
                      <AlertTriangleIcon :size="24" />
                    </div>
                    <div>
                      <p class="font-medium text-red-800">
                        Límite alcanzado
                      </p>
                      <p class="text-sm text-red-700 mt-1">
                        Has alcanzado el límite de recomendaciones para tu plan actual. Debes quitar alguna recomendación antes de agregar otra.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  @click="toggleRecommendation"
                  class="px-4 py-2.5 text-white rounded-lg transition-colors font-medium"
                  :class="isRecommended(selectedProduct)
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700'"
                  :disabled="!isRecommended(selectedProduct) && remainingRecommendations <= 0"
                >
                  {{ isRecommended(selectedProduct) ? 'Confirmar cancelación' : 'Confirmar recomendación' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Modal para Agregar Extra -->
    <transition name="modal">
      <div v-if="currentModal === 'extra'" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto z-10 overflow-hidden">
            <!-- Modal Header con gradiente -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white">
                🍟 Agregar extra
              </h2>
              <button @click="closeModal" class="text-white hover:text-blue-100">
                <XIcon :size="24" />
              </button>
            </div>
  
            <div class="p-6">
              <form @submit.prevent="addExtra">
                <div class="flex gap-3 items-center mb-6 bg-indigo-50 p-3 rounded-lg">
                  <div class="w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                    <img
                      v-if="selectedProduct?.imagen_url"
                      :src="selectedProduct.imagen_url"
                      :alt="selectedProduct.nombre_producto"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <ImageOffIcon :size="24" class="text-gray-300" />
                    </div>
                  </div>
                  <span class="text-gray-800 font-medium line-clamp-2">{{ selectedProduct?.nombre_producto }}</span>
                </div>
  
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del extra*</label>
                    <input
                      v-model="extraForm.nombre"
                      type="text"
                      required
                      placeholder="Ej: Queso extra, Bacon, Guacamole"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio adicional*</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                      <input
                        v-model="extraForm.precio"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                </div>
  
                <div class="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium"
                  >
                    Agregar extra
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Modal para Agregar Atributo -->
    <transition name="modal">
      <div v-if="currentModal === 'attribute'" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto z-10 overflow-hidden">
            <!-- Modal Header con gradiente -->
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white">
                📋 Agregar atributo
              </h2>
              <button @click="closeModal" class="text-white hover:text-purple-100">
                <XIcon :size="24" />
              </button>
            </div>
  
            <div class="p-6">
              <form @submit.prevent="addAttribute">
                <div class="flex gap-3 items-center mb-6 bg-indigo-50 p-3 rounded-lg">
                  <div class="w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                    <img
                      v-if="selectedProduct?.imagen_url"
                      :src="selectedProduct.imagen_url"
                      :alt="selectedProduct.nombre_producto"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <ImageOffIcon :size="24" class="text-gray-300" />
                    </div>
                  </div>
                  <span class="text-gray-800 font-medium line-clamp-2">{{ selectedProduct?.nombre_producto }}</span>
                </div>
  
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del atributo*</label>
                    <input
                      v-model="attributeForm.nombre_atributo"
                      type="text"
                      required
                      placeholder="Ej: Tamaño, Color, Término"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Valor*</label>
                    <input
                      v-model="attributeForm.valor"
                      type="text"
                      required
                      placeholder="Ej: Grande, Rojo, Medio"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio adicional</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                      <input
                        v-model="attributeForm.precio_adicional"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                </div>
  
                <div class="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors font-medium"
                  >
                    Agregar atributo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Toast de notificación mejorado -->
    <transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-8 right-8 p-4 rounded-xl shadow-xl z-50 max-w-sm flex items-center gap-3"
        :class="toastClasses"
      >
        <div class="p-2 bg-white bg-opacity-25 rounded-full">
          <component :is="toastIcon" :size="20" class="text-white" />
        </div>
        <p class="text-white font-medium">{{ toast.message }}</p>
        <button @click="toast.show = false" class="ml-auto text-white hover:text-gray-200">
          <XIcon :size="16" />
        </button>
      </div>
    </transition>
  
    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-indigo-100 p-3 z-20">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-around items-center">
          <div class="flex flex-col items-center">
            <div class="p-2 bg-indigo-50 rounded-full">
              <HomeIcon class="text-indigo-600" :size="20" />
            </div>
            <span class="text-xs text-indigo-600 mt-1">Inicio</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="p-2 bg-indigo-50 rounded-full">
              <HeartIcon class="text-indigo-600" :size="20" />
            </div>
            <span class="text-xs text-indigo-600 mt-1">Favoritos</span>
          </div>
          <div class="flex flex-col items-center relative">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
              <ShoppingCartIcon class="text-white" :size="20" />
            </div>
            <span class="text-xs text-indigo-600 mt-1">Carrito</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="p-2 bg-indigo-50 rounded-full">
              <ShoppingBagIcon class="text-indigo-600" :size="20" />
            </div>
            <span class="text-xs text-indigo-600 mt-1">Pedidos</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="p-2 bg-indigo-50 rounded-full cursor-pointer">
              <SettingsIcon class="text-indigo-600" :size="20" />
            </div>
            <span class="text-xs text-indigo-600 mt-1">Configuración</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import axios from 'axios';
  
  // Importación de iconos
  import {
  Truck as TruckIcon,
  Bell as BellIcon,
  Home as HomeIcon,
  Heart as HeartIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  ChevronDown as ChevronDownIcon,
  PackageX as PackageXIcon,
  Star as StarIcon,
  MoreVertical as MoreVerticalIcon,
  Pencil as PencilIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Tag as TagIcon,
  PlusCircle as PlusCircleIcon,
  ListPlus as ListPlusIcon,
  X as XIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  UploadCloud as UploadCloudIcon,
  Upload as UploadIcon,
  ImageOff as ImageOffIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  RefreshCw as RefreshCwIcon,
  Copy as CopyIcon,
  MapPin as MapPinIcon
  } from 'lucide-vue-next';
  
  // Configuración de API
  const API_URL = 'http://localhost:4000';
  
  // Estados generales
  const loading = ref(false);
  const selectedProfile = ref('Local');
  const appMode = ref('production'); // demo o production
  const currentPage = ref(1);
  const pageSize = ref(9);
  const searchQuery = ref('');
  const filterCategory = ref('');
  const filterStatus = ref('');
  const selectedBranch = ref('');
  const openDropdownId = ref(null);
  const currentModal = ref(null);
  const selectedProduct = ref(null);
  const localId = ref(null);
  
  // Notificaciones
  const isModalOpen = ref(false);
  const notifications = ref([
  { id: 1, message: 'Tu pedido #123 ha sido enviado', read: false },
  { id: 2, message: 'Descuento especial este fin de semana', read: false },
  { id: 3, message: 'Nueva versión de la app disponible', read: true }
  ]);
  
  const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read);
  });
  
  // Toast notifications
  const toast = ref({
  show: false,
  type: 'success', // success, error, info, warning
  message: ''
  });
  
  const toastClasses = computed(() => {
  switch (toast.value.type) {
  case 'success': return 'bg-gradient-to-r from-emerald-500 to-green-500';
  case 'error': return 'bg-gradient-to-r from-rose-500 to-red-500';
  case 'warning': return 'bg-gradient-to-r from-amber-500 to-yellow-500';
  case 'info': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
  default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
  });
  
  const toastIcon = computed(() => {
  switch (toast.value.type) {
  case 'success': return CheckCircleIcon;
  case 'error': return AlertCircleIcon;
  case 'warning': return AlertTriangleIcon;
  case 'info': return InfoIcon;
  default: return InfoIcon;
  }
  });
  
  // Datos para formularios
  const productForm = ref({
  nombre_producto: '',
  descripcion_producto: '',
  precio: '',
  preciooferta: '',
  id_subcategoria: '',
  imagen_url: null,
  sucursales: [],
  sucursalesPrecios: {},
  activo: true
  });
  
  const offerForm = ref({
  precio_oferta: ''
  });
  
  const extraForm = ref({
  nombre: '',
  precio: ''
  });
  
  const attributeForm = ref({
  nombre_atributo: '',
  valor: '',
  precio_adicional: ''
  });
  
  // Datos
  const products = ref([]);
  const subcategories = ref([]);
  const branches = ref([]);
  const recommendations = ref([]);
  const currentPlan = ref('premium'); // 'básico', 'estándar', 'premium'
  const recommendationLimits = {
  'básico': 1,
  'estándar': 3,
  'premium': 5
  };
  
  // Computed properties
  const filteredProducts = computed(() => {
  let result = [...products.value];
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
  const query = searchQuery.value.toLowerCase();
  result = result.filter(p =>
  p.nombre_producto.toLowerCase().includes(query) ||
  p.descripcion_producto?.toLowerCase().includes(query)
  );
  }
  
  // Filtrar por categoría
  if (filterCategory.value) {
  result = result.filter(p => p.id_subcategoria == filterCategory.value);
  }
  
  // Filtrar por estado
  if (filterStatus.value) {
  switch (filterStatus.value) {
  case 'active':
  result = result.filter(p => p.activo);
  break;
  case 'inactive':
  result = result.filter(p => !p.activo);
  break;
  case 'offer':
  result = result.filter(p => p.preciooferta);
  break;
  }
  }
  
  // Filtrar por sucursal
  if (selectedBranch.value) {
  result = result.filter(p => {
  return p.sucursales && p.sucursales.some(s => s == selectedBranch.value);
  });
  }
  
  return result;
  });
  
  const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProducts.value.slice(start, end);
  });
  
  const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value);
  });
  
  const paginationStart = computed(() => {
  return filteredProducts.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1;
  });
  
  const paginationEnd = computed(() => {
  const end = currentPage.value * pageSize.value;
  return end > filteredProducts.value.length ? filteredProducts.value.length : end;
  });
  
  const paginationNumbers = computed(() => {
  if (totalPages.value <= 5) {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  if (currentPage.value <= 3) {
  return [1, 2, 3, 4, '...', totalPages.value];
  }
  
  if (currentPage.value >= totalPages.value - 2) {
  return [1, '...', totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value];
  }
  
  return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value];
  });
  
  const remainingRecommendations = computed(() => {
  const activeRecommendations = recommendations.value.filter(r => r.activo).length;
  return recommendationLimits[currentPlan.value] - activeRecommendations;
  });
  
  // Métodos para notificaciones
  const showNotifications = () => {
  isModalOpen.value = true;
  };
  
  const closeNotifications = () => {
  isModalOpen.value = false;
  };
  
  const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
  notification.read = true;
  }
  };
  
  // Métodos de utilidad
  const formatPrice = (price) => {
  if (!price) return '0.00';
  return parseFloat(price).toFixed(2);
  };
  
  const hasExtrasOrAttributes = (product) => {
  return (product.extras && product.extras.length > 0) || (product.atributos && product.atributos.length > 0);
  };
  
  const isRecommended = (product) => {
  if (!product) return false;
  return recommendations.value.some(r => r.id_producto === product.id_producto && r.activo);
  };
  
  const getCategoryName = (id) => {
  if (!id) return 'Sin categoría';
  const category = subcategories.value.find(c => c.id_subcategoria == id);
  return category ? category.nombre_subcategoria : 'Sin categoría';
  };
  
  const getBranchName = (id) => {
  if (!id) return 'Sin sucursal';
  const branch = branches.value.find(b => b.id_direccion_local == id);
  return branch ? branch.colonia : 'Sin sucursal';
  };
  
  const getStatusLabel = (status) => {
  switch (status) {
  case 'active': return 'Activos';
  case 'inactive': return 'Inactivos';
  case 'offer': return 'En oferta';
  default: return 'Todos';
  }
  };
  
  const calculateDiscount = (offerPrice, originalPrice) => {
  if (!offerPrice || !originalPrice) return 0;
  return Math.round((1 - (offerPrice / originalPrice)) * 100);
  };
  
  const isValidOffer = () => {
  const offerPrice = parseFloat(offerForm.value.precio_oferta);
  const originalPrice = parseFloat(selectedProduct.value?.precio);
  
  return offerPrice > 0 && offerPrice < originalPrice;
  };
  
  const toggleAppMode = () => {
  appMode.value = appMode.value === 'production' ? 'demo' : 'production';
  loadProducts();
  };
  
  // Métodos para modales
  const openModal = (type, product = null) => {
  currentModal.value = type;
  
  if (product) {
  selectedProduct.value = { ...product };
  
  // Preparar formulario según tipo de modal
  if (type === 'edit') {
  // Clonar el producto para evitar mutaciones directas
  productForm.value = {
  ...JSON.parse(JSON.stringify(product)),
  sucursales: Array.isArray(product.sucursales) ? [...product.sucursales] : [],
  sucursalesPrecios: product.sucursalesPrecios ? {...product.sucursalesPrecios} : {}
  };
  } else if (type === 'offer') {
  offerForm.value.precio_oferta = product.preciooferta || '';
  }
  } else {
  // Resetear formularios
  if (type === 'add') {
  productForm.value = {
  nombre_producto: '',
  descripcion_producto: '',
  precio: '',
  preciooferta: '',
  id_subcategoria: '',
  imagen_url: null,
  sucursales: [],
  sucursalesPrecios: {},
  activo: 1
  };
  }
  }
  
  // Cerrar cualquier dropdown abierto
  openDropdownId.value = null;
  };
  
  const closeModal = () => {
  currentModal.value = null;
  selectedProduct.value = null;
  };
  
  const toggleDropdown = (id) => {
  if (openDropdownId.value === id) {
  openDropdownId.value = null;
  } else {
  openDropdownId.value = id;
  }
  };
  
  // Métodos para manejo de imágenes
  const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validar el tamaño del archivo (máximo 2MB)
  if (file.size > 2 * 1024 * 1024) {
  showToast('La imagen no debe superar los 2MB', 'error');
  return;
  }
  
  // Validar el tipo de archivo
  if (!file.type.match('image.*')) {
  showToast('El archivo debe ser una imagen', 'error');
  return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
  productForm.value.imagen_url = e.target.result;
  };
  reader.readAsDataURL(file);
  
  // En producción, aquí se cargaría la imagen a un servidor o servicio de almacenamiento
  // y se obtendría su URL para guardarla en productForm.value.imagen_url
  };
  
  const removeImage = () => {
  productForm.value.imagen_url = null;
  
  // En producción, si estamos editando un producto existente, eliminaríamos la imagen del servidor
  if (currentModal.value === 'edit' && selectedProduct.value?.imagen_public_id) {
  // Eliminar la imagen del servicio de almacenamiento sería una tarea que depende del servicio utilizado
  // Por ejemplo, para Cloudinary sería algo como:
  /*
  axios.delete(`${API_URL}/uploads/images/${selectedProduct.value.imagen_public_id}`)
  .then(() => {
  console.log('Imagen eliminada del servidor correctamente');
  })
  .catch(error => {
  console.error('Error al eliminar la imagen:', error);
  });
  */
  }
  };
  
  // Actualizar precio de sucursales
  const updateBranchPrice = (branchId, price) => {
  if (!productForm.value.sucursalesPrecios) {
  productForm.value.sucursalesPrecios = {};
  }
  
  if (price) {
  productForm.value.sucursalesPrecios[branchId] = parseFloat(price);
  } else {
  delete productForm.value.sucursalesPrecios[branchId];
  }
  };
  
  // Mostrar toast
  const showToast = (message, type = 'success') => {
  toast.value = {
  show: true,
  type,
  message
  };
  
  setTimeout(() => {
  toast.value.show = false;
  }, 3000);
  };
  
  // Eliminar extra y atributo
  const removeExtra = async (product, extra) => {
  try {
  loading.value = true;
  
  if (appMode.value === 'production') {
  // Implementación real de eliminación de extra
  await axios.delete(`${API_URL}/extra/${extra.id}`);
  
  // Recargar datos del producto para actualizar la UI
  const productData = await axios.get(`${API_URL}/productos/${product.id_producto}`);
  
  // Actualizar el producto en la lista
  const index = products.value.findIndex(p => p.id_producto === product.id_producto);
  if (index !== -1) {
  products.value[index] = productData.data;
  }
  
  } else {
  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular eliminación del extra
  const productIndex = products.value.findIndex(p => p.id_producto === product.id_producto);
  if (productIndex !== -1 && products.value[productIndex].extras) {
  const extraIndex = products.value[productIndex].extras.findIndex(e => e.nombre === extra.nombre);
  if (extraIndex !== -1) {
  products.value[productIndex].extras.splice(extraIndex, 1);
  }
  }
  }
  
  showToast('Extra eliminado correctamente', 'success');
  } catch (error) {
  console.error('Error al eliminar extra:', error);
  showToast('Error al eliminar el extra', 'error');
  } finally {
  loading.value = false;
  }
  };
  
  const removeAttribute = async (product, attribute) => {
  try {
  loading.value = true;
  
  if (appMode.value === 'production') {
  // Implementación real de eliminación de atributo
  await axios.delete(`${API_URL}/atributos/${attribute.id_atributo}`);
  
  // Recargar datos del producto para actualizar la UI
  const productData = await axios.get(`${API_URL}/productos/${product.id_producto}`);
  
  // Actualizar el producto en la lista
  const index = products.value.findIndex(p => p.id_producto === product.id_producto);
  if (index !== -1) {
  products.value[index] = productData.data;
  }
  
  } else {
  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular eliminación del atributo
  const productIndex = products.value.findIndex(p => p.id_producto === product.id_producto);
  if (productIndex !== -1 && products.value[productIndex].atributos) {
  const attrIndex = products.value[productIndex].atributos.findIndex(a =>
  a.nombre_atributo === attribute.nombre_atributo && a.valor === attribute.valor
  );
  if (attrIndex !== -1) {
  products.value[productIndex].atributos.splice(attrIndex, 1);
  }
  }
  }
  
  showToast('Atributo eliminado correctamente', 'success');
  } catch (error) {
  console.error('Error al eliminar atributo:', error);
  showToast('Error al eliminar el atributo', 'error');
  } finally {
  loading.value = false;
  }
  };
  
  // Métodos para la gestión de productos
  const loadProducts = async () => {
  loading.value = true;
  try {
  // Obtener el ID del local (lo haríamos desde una respuesta de API o estado global)
  // En un entorno real, este ID vendría de la autenticación del usuario o de un parámetro en la URL
  localId.value = 10; // Por ahora usamos un valor fijo
  
  // Cargar subcategorías
  const subcatResponse = await axios.get(`${API_URL}/subcategorias`);
  subcategories.value = subcatResponse.data;
  
  // Cargar sucursales
  const branchesResponse = await axios.get(`${API_URL}/direccioneslocales/${localId.value}`);
  branches.value = branchesResponse.data;
  
  if (appMode.value === 'production') {
  try {
  // Cargar productos
  const productsResponse = await axios.get(`${API_URL}/productos`);
  products.value = productsResponse.data;
  
  // Cargar datos adicionales para cada producto
  await Promise.all(products.value.map(async (product) => {
  try {
  // Cargar extras
  const extrasResponse = await axios.get(`${API_URL}/extra/${product.id_producto}`);
  product.extras = extrasResponse.data;
  } catch (error) {
  console.error(`Error al cargar extras para producto ${product.id_producto}:`, error);
  product.extras = [];
  }
  
  try {
  // Cargar atributos
  const attributesResponse = await axios.get(`${API_URL}/atributos/${product.id_producto}`);
  product.atributos = attributesResponse.data;
  } catch (error) {
  console.error(`Error al cargar atributos para producto ${product.id_producto}:`, error);
  product.atributos = [];
  }
  
  try {
  // Cargar sucursales
  const sucursalesResponse = await axios.get(`${API_URL}/productoSucursal/${product.id_producto}`);
  product.sucursales = sucursalesResponse.data.map(s => s.id_direccion_local);
  } catch (error) {
  console.error(`Error al cargar sucursales para producto ${product.id_producto}:`, error);
  product.sucursales = [];
  }
  }));
  
  // Cargar recomendaciones
  const recsResponse = await axios.get(`${API_URL}/recomendados`);
  recommendations.value = recsResponse.data;
  
  } catch (error) {
  console.error('Error al cargar datos de producción:', error);
  showToast('Error al cargar datos. Usando datos de demostración.', 'warning');
  
  // Cargar datos de demostración en caso de error
  loadDemoData();
  }
  } else {
  // Modo demo - cargar datos de ejemplo
  loadDemoData();
  }
  } catch (error) {
  console.error('Error al cargar datos:', error);
  showToast('Error al cargar los datos. Usando datos de demostración.', 'error');
  
  // Cargar datos de prueba en caso de error
  loadDemoData();
  } finally {
  loading.value = false;
  }
  };
  
  // Función para cargar datos de demostración
  const loadDemoData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  products.value = [
  {
  id_producto: 1,
  nombre_producto: 'Hamburguesa Clásica Gourmet',
  descripcion_producto: 'Deliciosa hamburguesa con carne premium, lechuga fresca, tomate, cebolla caramelizada y nuestra salsa especial',
  precio: 129.99,
  id_subcategoria: 1,
  imagen_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  activo: true,
  sucursales: [1, 2],
  extras: [
  { id: 101, nombre: 'Queso cheddar', precio: 15.00 },
  { id: 102, nombre: 'Tocino crujiente', precio: 20.00 }
  ],
  atributos: [
  { id_atributo: 201, nombre_atributo: 'Término', valor: 'Medio', precio_adicional: 0 }
  ]
  },
  {
  id_producto: 2,
  nombre_producto: 'Pizza Pepperoni Suprema',
  descripcion_producto: 'Pizza artesanal con pepperoni premium, queso mozzarella y nuestra salsa especial de tomate casera',
  precio: 199.99,
  preciooferta: 169.99,
  id_subcategoria: 2,
  imagen_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  activo: true,
  sucursales: [1, 3]
  },
  {
  id_producto: 3,
  nombre_producto: 'Refresco Cola Premium',
  descripcion_producto: 'Refresco de cola refrescante, 355ml',
  precio: 35.00,
  id_subcategoria: 3,
  imagen_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  activo: true,
  sucursales: [1, 2, 3, 4]
  },
  {
  id_producto: 4,
  nombre_producto: 'Pastel de Chocolate Belga',
  descripcion_producto: 'Exquisito pastel de chocolate belga con ganache cremoso y frutos rojos frescos',
  precio: 85.00,
  id_subcategoria: 4,
  imagen_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  activo: false,
  sucursales: [1]
  },
  {
  id_producto: 5,
  nombre_producto: 'Ensalada César Deluxe',
  descripcion_producto: 'Ensalada fresca con lechuga romana crujiente, crutones caseros, pollo a la parrilla y aderezo César premium',
  precio: 110.00,
  id_subcategoria: 5,
  imagen_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  activo: true,
  sucursales: [2, 3]
  },
  {
  id_producto: 6,
  nombre_producto: 'Café Americano',
  descripcion_producto: 'Café americano preparado con granos seleccionados',
  precio: 45.00,
  id_subcategoria: 3,
  imagen_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  activo: true,
  sucursales: [1, 2, 3, 4]
  }
  ];
  
  recommendations.value = [
  { id_recomendacion: 1, id_producto: 1, id_local: localId.value, activo: true },
  { id_recomendacion: 2, id_producto: 2, id_local: localId.value, activo: true }
  ];
  
  // Crear subcategorías de prueba si no hay datos reales
  if (subcategories.value.length === 0) {
  subcategories.value = [
  { id_subcategoria: 1, nombre_subcategoria: 'Hamburguesas' },
  { id_subcategoria: 2, nombre_subcategoria: 'Pizzas' },
  { id_subcategoria: 3, nombre_subcategoria: 'Bebidas' },
  { id_subcategoria: 4, nombre_subcategoria: 'Postres' },
  { id_subcategoria: 5, nombre_subcategoria: 'Ensaladas' }
  ];
  }
  
  // Crear sucursales de prueba si no hay datos reales
  if (branches.value.length === 0) {
  branches.value = [
  { id_direccion_local: 1, colonia: 'Centro', direccion_precisa: 'Av. Principal #123' },
  { id_direccion_local: 2, colonia: 'Norte', direccion_precisa: 'Calle Roble #456' },
  { id_direccion_local: 3, colonia: 'Sur', direccion_precisa: 'Blvd. del Sol #789' },
  { id_direccion_local: 4, colonia: 'Este', direccion_precisa: 'Calle Luna #321' }
  ];
  }
  };
  
  // Operaciones CRUD
  const addProduct = async () => {
  try {
  if (!productForm.value.id_subcategoria) {
  showToast('Debe seleccionar una categoría', 'warning');
  return;
  }
  
  loading.value = true;
  
  const formData = {
  id_local: localId.value,
  nombre_producto: productForm.value.nombre_producto,
  descripcion_producto: productForm.value.descripcion_producto,
  precio: parseFloat(productForm.value.precio),
  preciooferta: productForm.value.preciooferta ? parseFloat(productForm.value.preciooferta) : null,
  id_subcategoria: productForm.value.id_subcategoria,
  activo: productForm.value.activo
  };
  
  if (appMode.value === 'production') {
  // En un ambiente real, enviamos los datos al servidor
  const response = await axios.post(`${API_URL}/productos/${localId.value}`, formData);
  
  // Crear relaciones con sucursales si hay seleccionadas
  if (productForm.value.sucursales.length > 0) {
  for (const sucursalId of productForm.value.sucursales) {
  const sucursalData = {
  id_direccion_local: sucursalId,
  precio: productForm.value.sucursalesPrecios[sucursalId] || formData.precio
  };
  
  await axios.post(`${API_URL}/productoSucursal/${response.data.producto.id_producto}`, sucursalData);
  }
  }
  
  // Recargar productos
  await loadProducts();
  } else {
  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simular creación de producto
  const newProduct = {
  id_producto: Math.max(...products.value.map(p => p.id_producto), 0) + 1,
  ...formData,
  imagen_url: productForm.value.imagen_url,
  sucursales: [...productForm.value.sucursales],
  extras: [],
  atributos: []
  };
  
  products.value.push(newProduct);
  }
  
  showToast('Producto agregado correctamente', 'success');
  closeModal();
  } catch (error) {
  console.error('Error al agregar producto:', error);
  showToast('Error al agregar el producto', 'error');
  } finally {
  loading.value = false;
  }
  };
 
  
  const removeOffer = async () => {
  try {
  loading.value = true;
  
  if (appMode.value === 'production') {
  await axios.put(`${API_URL}/productos/${selectedProduct.value.id_producto}`, {
  preciooferta: null
  });
  
  // Recargar productos
  await loadProducts();
  } else {
  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular eliminación de oferta
  const index = products.value.findIndex(p => p.id_producto === selectedProduct.value.id_producto);
  
  if (index !== -1) {
  products.value[index].preciooferta = null;
  }
  }
  
  showToast('Oferta eliminada correctamente', 'success');
  closeModal();
  } catch (error) {
  console.error('Error al eliminar oferta:', error);
  showToast('Error al eliminar la oferta', 'error');
  } finally {
  loading.value = false;
  }
  };
  
  const toggleRecommendation = async () => {
  try {
  loading.value = true;
  
  if (isRecommended(selectedProduct.value)) {
  // Quitar recomendación
  if (appMode.value === 'production') {
  const rec = recommendations.value.find(r => r.id_producto === selectedProduct.value.id_producto);
  if (rec) {
  await axios.put(`${API_URL}/recomendados/${rec.id_recomendacion}`, {
  activo: false
  });
  }
  
  // Recargar recomendaciones
  const recsResponse = await axios.get(`${API_URL}/recomendados`);
  recommendations.value = recsResponse.data;
  } else {
  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular eliminación de recomendación
  const index = recommendations.value.findIndex(r => r.id_producto === selectedProduct.value.id_producto);
  
  if (index !== -1) {
  recommendations.value[index].activo = false;
  }
  }
  
  showToast('Recomendación eliminada correctamente', 'success');
  } else {
  // Agregar recomendación
  if (remainingRecommendations.value <= 0) {
  throw new Error('Has alcanzado el límite de recomendaciones para tu plan');
  }
  
  if (appMode.value === 'production') {
  // Comprobar si ya existe pero está inactiva
  const existingRec = recommendations.value.find(r => r.id_producto === selectedProduct.value.id_producto);
  
  if (existingRec) {
  await axios.put(`${API_URL}/recomendados/${existingRec.id_recomendacion}`, {
  activo: true
  });
  } else {
  await axios.post(`${API_URL}/recomendados/${localId.value}`, {
  id_producto: selectedProduct.value.id_producto,
  id_local: localId.value
  });
  }
  
  // Recargar recomendaciones
  const recsResponse = await axios.get(`${API_URL}/recomendados`);
  recommendations.value = recsResponse.data;
  } else {
  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Comprobar si ya existe pero está inactiva
  const existingIndex = recommendations.value.findIndex(r => r.id_producto === selectedProduct.value.id_producto);
  
  if (existingIndex !== -1) {
  recommendations.value[existingIndex].activo = true;
  } else {
  recommendations.value.push({
  id_recomendacion: Math.max(...recommendations.value.map(r => r.id_recomendacion), 0) + 1,
  id_producto: selectedProduct.value.id_producto,
  id_local: localId.value,
  activo: true
  });
  }
  }
  
  showToast('Producto recomendado correctamente', 'success');
  }
  
  closeModal();
  } catch (error) {
  console.error('Error al gestionar recomendación:', error);
  showToast(error.message || 'Error al gestionar recomendación', 'error');
  } finally {
  loading.value = false;
  }
  };
   
  const addAttribute = async () => {
  try {
  loading.value = true;
  
  const attrData = {
  nombre_atributo: attributeForm.value.nombre_atributo,
  valor: attributeForm.value.valor,
  precio_adicional: parseFloat(attributeForm.value.precio_adicional) || 0
  };
  
  if (!attrData.nombre_atributo || !attrData.valor) {
  throw new Error('El nombre y valor del atributo son obligatorios');
  }
  
  if (appMode.value === 'production') {
  await axios.post(`${API_URL}/atributos/${selectedProduct.value.id_producto}`, attrData);
  
  // Recargar productos
  await loadProducts();
  } else {
  // Modo demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular agregar atributo
  const index = products.value.findIndex(p => p.id_producto === selectedProduct.value.id_producto);
  
  if (index !== -1) {
  if (!products.value[index].atributos) {
  products.value[index].atributos = [];
  }
  
  // Generar un ID único para el nuevo atributo en el modo demo
  const newId = Math.max(...(products.value[index].atributos.map(a => a.id_atributo || 0)), 0) + 1;
  
  products.value[index].atributos.push({
  id_atributo: newId,
  ...attrData
  });
  }
  }
  
  showToast('Atributo agregado correctamente', 'success');
  closeModal();
  } catch (error) {
  console.error('Error al agregar atributo:', error);
  showToast(error.message || 'Error al agregar el atributo', 'error');
  } finally {
  loading.value = false;
  }
  };
  
  const updateProduct = async () => {
  try {
    if (!productForm.value.id_subcategoria) {
      showToast('Debe seleccionar una categoría', 'warning');
      return;
    }

    loading.value = true;

    const formData = {
      nombre_producto: productForm.value.nombre_producto,
      descripcion_producto: productForm.value.descripcion_producto,
      precio: parseFloat(productForm.value.precio),
      preciooferta: productForm.value.preciooferta ? parseFloat(productForm.value.preciooferta) : null,
      id_subcategoria: productForm.value.id_subcategoria,
      activo: productForm.value.activo
    };

    console.log('Actualizando producto con datos:', formData); // <- Añadir esto

    if (appMode.value === 'production') {
      await axios.put(`${API_URL}/productos/${selectedProduct.value.id_producto}`, formData);
      await loadProducts();
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = products.value.findIndex(p => p.id_producto === selectedProduct.value.id_producto);
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...formData };
      }
    }

    showToast('Producto actualizado correctamente', 'success');
    closeModal();
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    showToast('Error al actualizar el producto', 'error');
  } finally {
    loading.value = false;
  }
};

const toggleProductStatus = async (product) => {
  try {
    loading.value = true;
    const newStatus = !product.activo;

    console.log('Cambiando estado del prducto:', product.id_producto, 'Nuevo estado:', newStatus); // <- Añadir esto

    if (appMode.value === 'production') {
      await axios.put(`${API_URL}/productos/${product.id_producto}`, { activo: newStatus });
      await loadProducts();
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = products.value.findIndex(p => p.id_producto === product.id_producto);
      if (index !== -1) {
        products.value[index].activo = newStatus;
      }
    }

    showToast(`Producto ${newStatus ? 'habilitado' : 'deshabilitado'} correctamente`, 'success');
  } catch (error) {
    console.error('Error al cambiar estado del producto:', error);
    showToast('Error al cambiar el estado del producto', 'error');
  } finally {
    loading.value = false;
  }
};

const createOffer = async () => {
  try {
    loading.value = true;
    const offerPrice = parseFloat(offerForm.value.precio_oferta);

    console.log('Creando oferta para el producto:', selectedProduct.value.id_producto, 'Con precio:', offerPrice); // <- Añadir esto

    if (!offerPrice || offerPrice <= 0) {
      throw new Error('El precio de oferta debe ser mayor que cero');
    }

    if (offerPrice >= selectedProduct.value.precio) {
      throw new Error('El precio de oferta debe ser menor al precio original');
    }

    if (appMode.value === 'production') {
      await axios.put(`${API_URL}/productos/${selectedProduct.value.id_producto}`, { preciooferta: offerPrice });
      await loadProducts();
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = products.value.findIndex(p => p.id_producto === selectedProduct.value.id_producto);
      if (index !== -1) {
        products.value[index].preciooferta = offerPrice;
      }
    }

    showToast('Oferta creada correctamente', 'success');
    closeModal();
  } catch (error) {
    console.error('Error al crear oferta:', error);
    showToast(error.message || 'Error al crear la oferta', 'error');
  } finally {
    loading.value = false;
  }
};

const addExtra = async () => {
  try {
    loading.value = true;

    // Preparar datos del extra
    const extraData = {
      nombre: extraForm.value.nombre,
      precio: parseFloat(extraForm.value.precio),
    };

    console.log('Agregando extra al producto:', selectedProduct.value.id_producto, 'Datos del extra:', extraData);

    // Validaciones locales
    if (!extraData.nombre) {
      throw new Error('El nombre del extra es obligatorio');
    }

    if (isNaN(extraData.precio) || extraData.precio < 0) {
      throw new Error('El precio debe ser un número válido mayor o igual a cero');
    }

    // Modo producción: enviar datos al servidor
    if (appMode.value === 'production') {
      const response = await axios.post(`${API_URL}/extra/${selectedProduct.value.id_producto}`, extraData);
      console.log('Respuesta del servidor:', response.data); // <- Ver la respuesta del servidor
      await loadProducts();
    } else {
      // Modo desarrollo: simular la adición del extra
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = products.value.findIndex((p) => p.id_producto === selectedProduct.value.id_producto);
      if (index !== -1) {
        if (!products.value[index].extras) {
          products.value[index].extras = [];
        }
        const newId = Math.max(...(products.value[index].extras.map((e) => e.id || 0)), 0) + 1;
        products.value[index].extras.push({ id: newId, ...extraData });
      }
    }

    showToast('Extra agregado correctamente', 'success');
    closeModal();
  } catch (error) {
    console.error('Error al agregar extra:', error.response?.data || error.message);
    showToast(error.response?.data?.message || error.message || 'Error al agregar el extra', 'error');
  } finally {
    loading.value = false;
  }
};
  // Efectos
  watch([searchQuery, filterCategory, filterStatus, selectedBranch], () => {
  currentPage.value = 1; // Resetear paginación al cambiar filtros
});

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
});

// Inicialización
onMounted(() => {
  loadProducts();
  loadBranches();
  loadSubcategories();
});

// Funciones para cargar datos
const loadBranches = async () => {
  try {
    const response = await axios.get(`${API_URL}/direccioneslocales/${localId.value}`);
    branches.value = response.data;
  } catch (error) {
    console.error('Error al cargar sucursales:', error);
    showToast('Error al cargar las sucursales', 'error');
  }
};

const loadSubcategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/subcategorias`);
    subcategories.value = response.data;
  } catch (error) {
    console.error('Error al cargar subcategorías:', error);
    showToast('Error al cargar las subcategorías', 'error');
  }
};
</script>

<style>
/* Estilos personalizados para el nuevo diseño */
body {
  font-family: 'Arial', sans-serif;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-trigger:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-to, .modal-leave-from {
  opacity: 1;
}
</style>
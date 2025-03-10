<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    <!-- Header -->
    <header class="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <TruckIcon class="text-blue-600" :size="24" />
        <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
      </div>
      <div class="flex items-center space-x-4">
        <select
          v-model="selectedProfile"
          class="p-1 text-center bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-bold focus:outline-none"
        >
          <option value="Cliente">Cliente</option>
          <option value="Local">Local</option>
          <option value="Delivery">Delivery</option>
        </select>
        <div class="relative cursor-pointer" @click="showNotifications">
          <BellIcon class="text-blue-600" :size="24" />
          <div
            v-if="unreadNotifications.length > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1"
          >
            {{ unreadNotifications.length }}
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <div class="products-page p-4">
      <h1 class="text-2xl font-bold text-blue-600 mb-4">Gestión de Productos</h1>

      <!-- Buscador -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar producto..."
          class="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      <!-- Botón de Opciones -->
      <div class="mb-4">
        <button
          @click="toggleOptionsMenu"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200"
        >
          Opciones
        </button>
        <div v-if="optionsMenuOpen" class="mt-2 space-y-2">
          <div class="flex space-x-2">
            <button
              @click="openAddProductModal"
              class="w-48 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
            >
              Agregar Producto
            </button>
            <button
              @click="openCouponModal"
              class="w-48 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-200"
            >
              Crear Cupón
            </button>
          </div>
          <div class="flex space-x-2">
            <button
              @click="openBannerModal"
              class="w-48 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition duration-200"
            >
              Subir Banner
            </button>
            <button
              @click="openNotificationModal"
              class="w-48 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
            >
              Enviar Notificación
            </button>
          </div>
        </div>
      </div>

<!-- Sección de Productos Recomendados -->
<div v-if="recommendedProducts.length > 0" class="mb-6">
  <h2 class="text-xl font-bold text-blue-600 mb-4">Productos Recomendados</h2>
  <div class="products-list space-y-4">
    <div
      v-for="product in recommendedProducts"
      :key="product.id"
    class="product-card bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
            :class="{ 'opacity-50': !product.active }">
      <div class="flex items-center space-x-4">
        <img :src="product.image" :alt="product.name" class="w-16 h-16 object-cover rounded-lg" />
        <div>
          <h3 class="text-lg font-semibold text-blue-600">{{ product.name }}</h3>
          <p class="text-sm text-gray-600">{{ product.description }}</p>
          <div class="flex items-center space-x-2">
            <p v-if="product.oldPrice" class="text-sm text-gray-500 line-through">
              ${{ product.oldPrice.toFixed(2) }}
            </p>
            <p class="text-lg font-bold text-blue-600">
              ${{ product.price.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
      <!-- Botones de acciones -->
      <div class="flex space-x-2">
        <button @click="openEditProductModal(product)">
          <EditIcon class="text-blue-600" :size="20" />
        </button>
        <button @click="toggleProductStatus(product.id)">
          <ToggleIcon class="text-red-600" :size="20" />
        </button>
        <button @click="toggleActionMenu(product.id)">
  <MoreVerticalIcon class="text-gray-600" :size="20" />
</button>
<div v-if="actionMenuOpen === product.id" class="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg z-50">
  <!-- Botón de oferta -->
  <button
    v-if="!product.hasOffer"
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="openOfferModal(product); closeActionMenu()"
  >
    Crear Oferta
  </button>
  <button
    v-else
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="removeOffer(product); closeActionMenu()"
  >
    Quitar Oferta
  </button>
  <!-- Otros botones del menú -->
  <button
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="toggleRecommendation(product.id); closeActionMenu()"
  >
    {{ product.recommended ? "No Recomendar" : "Recomendar" }}
  </button>
  <button
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="openAttributesModal(product); closeActionMenu()"
  >
    Atributos
  </button>
  <button
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="openExtrasModal(product); closeActionMenu()"
  >
    Extras
  </button>
</div>
      </div>
    </div>
  </div>
</div>

      <!-- Sección de Todos los Productos -->
      <div v-if="filteredProducts.length > 0" class="mb-6">
        <h2 class="text-xl font-bold text-blue-600 mb-4">Todos los Productos</h2>
        <div class="products-list space-y-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
            :class="{ 'opacity-50': !product.active }"
          >
            <div class="flex items-center space-x-4">
              <img :src="product.image" :alt="product.name" class="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h3 class="text-lg font-semibold text-blue-600">{{ product.name }}</h3>
                <p class="text-sm text-gray-600">{{ product.description }}</p>
                <div class="flex items-center space-x-2">
               <!-- Precio anterior tachado -->
            <p v-if="product.oldPrice" class="text-sm text-gray-500 line-through">
              ${{ product.oldPrice.toFixed(2) }}
            </p>
            <!-- Nuevo precio -->
            <p class="text-lg font-bold text-blue-600">
              ${{ product.price.toFixed(2) }}
            </p>
                </div>
              </div>
            </div>

            <div class="flex space-x-2">
              <button @click="openEditProductModal(product)">
                <EditIcon class="text-blue-600" :size="20" />
              </button>
              <button @click="toggleProductStatus(product.id)">
                <ToggleIcon class="text-red-600" :size="20" />
              </button>
              <button @click="toggleActionMenu(product.id)">
                <MoreVerticalIcon class="text-gray-600" :size="20" />
              </button>
            </div>

            <div v-if="actionMenuOpen === product.id" class="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg z-50">
  <!-- Botón de oferta -->
  <button
    v-if="!product.hasOffer"
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="openOfferModal(product); closeActionMenu()"
  >
    Crear Oferta
  </button>
  <button
    v-else
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="removeOffer(product); closeActionMenu()"
  >
    Quitar Oferta
  </button>
  <!-- Otros botones del menú -->
  <button
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="toggleRecommendation(product.id); closeActionMenu()"
  >
    {{ product.recommended ? "No Recomendar" : "Recomendar" }}
  </button>
  <button
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="openAttributesModal(product); closeActionMenu()"
  >
    Atributos
  </button>
  <button
    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    @click="openExtrasModal(product); closeActionMenu()"
  >
    Extras
  </button>
</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <!-- Modal para Agregar Producto -->
    <transition name="fade">
      <div v-if="addProductModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-lg font-bold text-blue-600 mb-4">
            {{ isEditing ? "Editar Producto" : "Agregar Producto" }}
          </h3>
          <form @submit.prevent="saveProduct">
            <input
              v-model="productForm.name"
              type="text"
              placeholder="Ej: Hamburguesa Clásica"
              class="w-full p-2 border rounded-lg mb-2"
              required
            />
            <textarea
              v-model="productForm.description"
              placeholder="Ej: Deliciosa hamburguesa con queso."
              class="w-full p-2 border rounded-lg mb-2"
            ></textarea>
            <input
              v-model="productForm.price"
              type="number"
              placeholder="Ej: 5.99"
              class="w-full p-2 border rounded-lg mb-2"
              required
            />
            <input
              v-model="productForm.image"
              type="url"
              placeholder="Ej: https://example.com/image.jpg"
              class="w-full p-2 border rounded-lg mb-2"
            />
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
              Guardar
            </button>
          </form>
          <button
            @click="closeAddProductModal"
            class="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </transition>

    <!-- Modal para Cupón -->
    <transition name="fade">
      <div v-if="couponModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-lg font-bold text-blue-600 mb-4">Crear Cupón</h3>
          <input
            v-model="couponForm.code"
            type="text"
            placeholder="Ej: DESCUENTO10"
            class="w-full p-2 border rounded-lg mb-2"
          />
          <select
            v-model="couponForm.discountType"
            class="w-full p-2 border rounded-lg mb-2"
          >
            <option value="percentage">Porcentaje</option>
            <option value="fixed">Fijo</option>
          </select>
          <input
            v-model="couponForm.discount"
            type="number"
            placeholder="Ej: 10"
            class="w-full p-2 border rounded-lg mb-2"
          />
          <button @click="saveCoupon" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500">
            Crear Cupón
          </button>
          <button @click="closeCouponModal" class="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </transition>

    <!-- Modal para Subir Banner -->
    <transition name="fade">
      <div v-if="bannerModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-lg font-bold text-blue-600 mb-4">Subir Banner</h3>
          <input
            v-model="bannerForm.imageUrl"
            type="url"
            placeholder="Ej: https://example.com/banner.jpg"
            class="w-full p-2 border rounded-lg mb-2"
          />
          <input
            v-model="bannerForm.text"
            type="text"
            placeholder="Ej: ¡Gran oferta!"
            class="w-full p-2 border rounded-lg mb-2"
          />
          <textarea
            v-model="bannerForm.description"
            placeholder="Ej: Descuentos por tiempo limitado."
            class="w-full p-2 border rounded-lg mb-2"
          ></textarea>
          <button @click="saveBanner" class="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-500">
            Subir
          </button>
          <button @click="closeBannerModal" class="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </transition>

    <!-- Modal para Enviar Notificación -->
    <transition name="fade">
      <div v-if="notificationModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-lg font-bold text-blue-600 mb-4">Enviar Notificación</h3>
          <input
            v-model="notificationForm.title"
            type="text"
            placeholder="Ej: Nuevo producto disponible"
            class="w-full p-2 border rounded-lg mb-2"
          />
          <textarea
            v-model="notificationForm.message"
            placeholder="Ej: ¡No te lo pierdas!"
            class="w-full p-2 border rounded-lg mb-2"
          ></textarea>
          <button @click="sendNotification" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500">
            Enviar
          </button>
          <button @click="closeNotificationModal" class="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </transition>

<!-- Modal para Crear Oferta -->
<transition name="fade">
  <div v-if="offerModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="text-lg font-bold text-blue-600 mb-4">Crear Oferta</h3>
      <input
        v-model="offerForm.newPrice"
        type="number"
        placeholder="Nuevo precio"
        class="w-full p-2 border rounded-lg mb-2"
      />
      <button @click="saveOffer" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500">
        Guardar Oferta
      </button>
      <button @click="closeOfferModal" class="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400">
        Cancelar
      </button>
    </div>
  </div>
</transition>

<!-- Modal para Atributos -->
<transition name="fade">
  <div v-if="attributesModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="text-lg font-bold text-blue-600 mb-4">Atributos</h3>
      <input
        v-model="attributeForm.name"
        type="text"
        placeholder="Tamaño"
        class="w-full p-2 border rounded-lg mb-2"
      />
      <input
        v-model="attributeForm.value"
        type="text"
        placeholder="Pequeño"
        class="w-full p-2 border rounded-lg mb-2"
      />
      <input
        v-model="attributeForm.extraPrice"
        type="number"
        placeholder="Precio extra"
        class="w-full p-2 border rounded-lg mb-2"
      />
      <button @click="saveAttribute" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
        Guardar Atributo
      </button>
      <button @click="closeAttributesModal" class="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400">
        Cancelar
      </button>
    </div>
  </div>
</transition>

<!-- Modal para Extras -->
<transition name="fade">
  <div v-if="extrasModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="text-lg font-bold text-blue-600 mb-4">Extras</h3>
      <input
        v-model="extraForm.name"
        type="text"
        placeholder="Nombre del extra"
        class="w-full p-2 border rounded-lg mb-2"
      />
      <input
        v-model="extraForm.extraPrice"
        type="number"
        placeholder="Precio extra"
        class="w-full p-2 border rounded-lg mb-2"
      />
      <button @click="saveExtra" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500">
        Guardar Extra
      </button>
      <button @click="closeExtrasModal" class="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400">
        Cancelar
      </button>
    </div>
  </div>
</transition>
    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center">
          <HomeIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Inicio</span>
        </div>
        <div class="flex flex-col items-center">
          <HeartIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Favoritos</span>
        </div>
        <div class="flex flex-col items-center relative">
          <div class="bg-blue-600 rounded-full p-2">
            <ShoppingCartIcon class="text-white" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Carrito</span>
        </div>
        <div class="flex flex-col items-center">
          <ShoppingBagIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Pedidos</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="cursor-pointer">
            <SettingsIcon class="text-blue-600" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Configuración</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Edit as EditIcon,
  X as ToggleIcon,
  MoreVertical as MoreVerticalIcon,
} from "lucide-vue-next";

// Selector de perfil
const selectedProfile = ref("Local");

// Datos de ejemplo para productos
const products = ref([
  {
    id: 1,
    name: "Hamburguesa Clásica",
    description: "Deliciosa hamburguesa con queso y vegetales.",
    price: 5.99,
    discountedPrice: null,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    active: true,
    recommended: false,
  },
  {
    id: 2,
    name: "Pizza Pepperoni",
    description: "Pizza con extra queso y pepperoni.",
    price: 8.99,
    discountedPrice: null,
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94",
    active: true,
    recommended: true,
  },
]);

// Buscador
const searchQuery = ref(""); 

// Productos Recomendados
const recommendedProducts = computed(() => {
  return products.value.filter((product) => product.recommended);
})
// Todos los Productos (excluyendo los recomendados)
const filteredProducts = computed(() => {
  return products.value.filter(
    (product) =>
      !product.recommended && // Excluir productos recomendados
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // Filtrar por búsqueda
  );
});
// Menú de Opciones
const optionsMenuOpen = ref(false);
const toggleOptionsMenu = () => {
  optionsMenuOpen.value = !optionsMenuOpen.value;
};

// Menú de Acciones
const actionMenuOpen = ref(null);
// Función para abrir/cerrar el menú de acciones
const toggleActionMenu = (id) => {
  console.log("Toggle Action Menu:", id); // Depuración
  if (actionMenuOpen.value === id) {
    // Si el menú ya está abierto para este producto, ciérralo
    actionMenuOpen.value = null;
  } else {
    // Abre el menú para este producto
    actionMenuOpen.value = id;
  }
};

// Modales
const addProductModalOpen = ref(false);
const couponModalOpen = ref(false);
const bannerModalOpen = ref(false);
const notificationModalOpen = ref(false);
const offerModalOpen = ref(false);
const attributesModalOpen = ref(false);
const extrasModalOpen = ref(false);
const isEditing = ref(false);

// Formularios
const productForm = ref({ name: "", description: "", price: 0, image: "" });
const couponForm = ref({ code: "", discountType: "percentage", discount: 0 });
const bannerForm = ref({ imageUrl: "", text: "", description: "" });
const notificationForm = ref({ title: "", message: "" });
const attributeForm = ref({ name: "", value: "", extraPrice: 0 });
const extraForm = ref({ name: "", extraPrice: 0 });
const offerForm = ref({ newPrice: 0 }); // Nuevo precio de la oferta 
// Funciones para guardar datos
const saveOffer = () => {
  if (selectedProduct.value) {
    // Guarda el precio anterior antes de actualizarlo
    selectedProduct.value.oldPrice = selectedProduct.value.price;
    // Actualiza el precio con el nuevo valor
    selectedProduct.value.price = offerForm.value.newPrice;
    // Marca que tiene una oferta activa
    selectedProduct.value.hasOffer = true;
    alert(`Oferta guardada: Nuevo precio $${offerForm.value.newPrice}`);
    closeOfferModal();
  }
};
const removeOffer = (product) => {
  if (product.oldPrice) {
    // Restaura el precio anterior
    product.price = product.oldPrice;
    product.oldPrice = null;
    // Marca que no tiene una oferta activa
    product.hasOffer = false;
    alert("Oferta quitada");
  }
};

const saveAttribute = () => {
  alert(`Atributo guardado: ${attributeForm.value.name}, Valor: ${attributeForm.value.value}, Precio Extra: $${attributeForm.value.extraPrice}`);
  closeAttributesModal();
};

const saveExtra = () => {
  alert(`Extra guardado: ${extraForm.value.name}, Precio Extra: $${extraForm.value.extraPrice}`);
  closeExtrasModal();
};
// Producto seleccionado para editar o crear oferta
const selectedProduct = ref(null);

// Funciones para abrir/cerrar modales
const openAddProductModal = () => {
  isEditing.value = false;
  productForm.value = { name: "", description: "", price: 0, image: "" };
  addProductModalOpen.value = true;
};

const closeAddProductModal = () => {
  addProductModalOpen.value = false;
};

const openCouponModal = () => {
  couponForm.value = { code: "", discountType: "percentage", discount: 0 };
  couponModalOpen.value = true;
};

const closeCouponModal = () => {
  couponModalOpen.value = false;
};

const openBannerModal = () => {
  bannerForm.value = { imageUrl: "", text: "", description: "" };
  bannerModalOpen.value = true;
};

const closeBannerModal = () => {
  bannerModalOpen.value = false;
};

const openNotificationModal = () => {
  notificationForm.value = { title: "", message: "" };
  notificationModalOpen.value = true;
};

const closeNotificationModal = () => {
  notificationModalOpen.value = false;
};

const openEditProductModal = (product) => {
  isEditing.value = true;
  selectedProduct.value = product;
  productForm.value = { ...product };
  addProductModalOpen.value = true;
};

// Funciones para guardar datos
const saveProduct = () => {
  if (isEditing.value) {
    const index = products.value.findIndex((p) => p.id === selectedProduct.value.id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...productForm.value };
    }
  } else {
    products.value.push({
      ...productForm.value,
      id: products.value.length + 1,
      active: true,
      recommended: false,
      discountedPrice: null,
    });
  }
  closeAddProductModal();
};

const saveCoupon = () => {
  alert(`Cupón creado: ${couponForm.value.code} con ${couponForm.value.discount}% de descuento`);
  closeCouponModal();
};

const saveBanner = () => {
  alert("Banner subido correctamente");
  closeBannerModal();
};

const sendNotification = () => {
  alert(`Notificación enviada: ${notificationForm.value.title} - ${notificationForm.value.message}`);
  closeNotificationModal();
};
 // Funciones para abrir/cerrar modales de Oferta, Atributos y Extras
const openOfferModal = (product) => {
  selectedProduct.value = product;
  offerModalOpen.value = true;
};

const closeOfferModal = () => {
  offerModalOpen.value = false;
};

const openAttributesModal = (product) => {
  selectedProduct.value = product;
  attributesModalOpen.value = true;
};

const closeAttributesModal = () => {
  attributesModalOpen.value = false;
};

const openExtrasModal = (product) => {
  selectedProduct.value = product;
  extrasModalOpen.value = true;
};

const closeExtrasModal = () => {
  extrasModalOpen.value = false;
};

// Cerrar el menú de acciones
const closeActionMenu = () => {
  actionMenuOpen.value = null;
};
// Función para desactivar/reactivar un producto
const toggleProductStatus = (id) => {
  console.log("Toggle Product Status:", id); // Depuración
  const product = products.value.find((p) => p.id === id);
  if (product) {
    product.active = !product.active;
    console.log("Nuevo estado activo:", product.active); // Depuración
    alert(`Producto ${product.active ? "activado" : "desactivado"}`);
  }
};
// Función para recomendar/no recomendar un producto
const toggleRecommendation = (id) => {
  console.log("Toggle Recommendation:", id); // Depuración
  const product = products.value.find((p) => p.id === id);
  if (product) {
    if (product.recommended || recommendedProducts.value.length < 5) {
      product.recommended = !product.recommended;
      console.log("Nuevo estado recomendado:", product.recommended); // Depuración
      alert(`Producto ${product.recommended ? "recomendado" : "no recomendado"}`);
    } else {
      alert("Solo puedes recomendar hasta 5 productos.");
    }
  }
};

// Notificaciones
const notifications = ref([
  { id: 1, message: "Nuevo pedido recibido.", read: false },
  { id: 2, message: "Pedido #1 aceptado.", read: true },
]);
const isModalOpen = ref(false);
const unreadNotifications = computed(() => notifications.value.filter((n) => !n.read));

const showNotifications = () => (isModalOpen.value = true);
const closeNotifications = () => (isModalOpen.value = false);
const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) notification.read = true;
};
</script>

<style scoped>
.products-page {
  padding-bottom: 100px; /* Espacio para el footer */
}

.products-list .product-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.products-list .product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.relative .absolute {
  z-index: 50;
}
</style>
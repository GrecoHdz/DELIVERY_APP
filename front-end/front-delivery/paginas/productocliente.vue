<template>
 <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100"> 
  <header class="bg-white shadow-md px-4 py-3 flex justify-between items-center">
    <div class="flex items-center space-x-2">
      <TruckIcon class="text-blue-600" :size="24" />
      <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
    </div>
    <div class="flex items-center space-x-4">
      <select v-model="selectedProfile" class="p-1 text-center bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-bold focus:outline-none">
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
  </header> 
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

<div class="local-page">
    <!-- Barra Superior -->
    <div class="top-bar">
      <h1 class="local-name">{{ localName }}</h1>
      <div class="search-and-branch">
        <select v-model="selectedBranch" class="branch-selector">
          <option v-for="branch in branches" :key="branch.id" :value="branch.id">
            {{ branch.name }}
          </option>
        </select>
        <input type="text" v-model="searchQuery" placeholder="Buscar 🔍" class="search-input" />
        </div>
    </div>

    <!-- Lista de Productos -->
    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <!-- Imagen del Producto -->
        <img :src="product.image" :alt="product.name" class="product-image" />

        <!-- Información del Producto -->
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
        </div>

        <!-- Precio y Botón de Carrito -->
        <div class="price-and-quantity">
          <div class="price-container">
              <span v-if="product.discountedPrice" class="original-price">${{ product.price.toFixed(2) }}</span>
              <span class="final-price">${{ (product.discountedPrice || product.price).toFixed(2) }}</span>
            </div>
             <button class="cart-button" @click="openModal(product)">
            <ShoppingCartIcon :size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <div v-if="selectedProduct" class="modal-overlay">
      <div class="modal-content">
        <!-- Cerrar Modal -->
        <button class="close-modal-button" @click="closeModal">×</button>

        <!-- Imagen del Producto -->
        <img :src="selectedProduct.image" :alt="selectedProduct.name" class="modal-image" />

        <!-- Información del Producto -->
        <h3 class="modal-product-name">{{ selectedProduct.name }}</h3>
        <p class="modal-product-description">{{ selectedProduct.description }}</p>

        <!-- Precio y Cantidad -->
        <div class="modal-price-and-quantity">
          <div class="price-container">
              <span v-if="selectedProduct.discountedPrice" class="original-price">${{ selectedProduct.price.toFixed(2) }}</span>
              <span class="final-price">${{ (selectedProduct.discountedPrice || selectedProduct.price).toFixed(2) }}</span>
            </div>
            <div class="quantity-controls">
            <button @click="decrementQuantity">-</button>
            <span class="quantity">{{ quantity }}</span>
            <button @click="incrementQuantity">+</button>
          </div>
        </div>

        <!-- Atributos (Sabor, Tamaño) -->
        <div v-if="selectedProduct.attributes" class="attributes-section">
          <h4>Atributos</h4>
          <div class="attributes-grid">
            <div v-for="attribute in selectedProduct.attributes" :key="attribute.id" 
                 :class="['attribute-option', { selected: selectedAttribute === attribute.id }]" 
                 @click="selectedAttribute = attribute.id">
              <label>{{ attribute.name }} {{ attribute.price ? `(+$${attribute.price.toFixed(2)})` : '' }}</label>
            </div>
          </div>
        </div>

        <!-- Extras -->
        <div v-if="selectedProduct.extras" class="extras-section">
          <h4>Extras</h4>
          <div class="extras-grid">
            <div v-for="extra in selectedProduct.extras" :key="extra.id" 
                 :class="['extra-option', { selected: extra.selected }]" 
                 @click="extra.selected = !extra.selected">
              <label>{{ extra.name }} (+${{ extra.price.toFixed(2) }})</label>
            </div>
          </div>
        </div> 

        <!-- Botón de Agregar al Carrito -->
        <button class="modal-add-to-cart-button" @click="addToCart(selectedProduct)">
          Agregar al Carrito - ${{ totalPrice.toFixed(2) }}
        </button>
      </div> 
    </div> 

  </div>
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
import { ref, computed } from 'vue';
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
} from 'lucide-vue-next';

// Selector de perfil
const selectedProfile = ref("Cliente"); 

// Datos de ejemplo
const branches = [
  { id: 1, name: "Sucursal Centro" },
  { id: 2, name: "Sucursal Norte" },
];
const localName = "Mini Super Diprocon";
const products = ref([
  {
    id: 1,
    name: "American BBQ Single",
    description: "A flame-grilled whopper patty, topped with American cheese, fresh slices of tomato and crisp lettuce, and finished with a zesty BBQ sauce and golden crispy onions.",
    price: 3.80,
    discountedPrice: 3.80,
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    attributes: [
      { id: 1, name: "Regular", price: 0 },
      { id: 2, name: "Large", price: 1.00 },
    ],
    extras: [
      { id: 1, name: "Tomato", price: 1.00, selected: false },
      { id: 2, name: "Lettuce", price: 0.50, selected: false },
      { id: 3, name: "Onion", price: 0.50, selected: false },
    ],
  },
  {
    id: 2,
    name: "Fried Cheese Wonton",
    description: "Crispy fried cream cheese wontons are filled with cream cheese, lemon and green onions.",
    price: 2.00,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    name: "Chicken Dumplings",
    description: "With a side of fried rice or supreme soy noodles, and steamed chinese greens.",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 4,
    name: "Whopper",
    description: "A flame-grilled beef patty, topped with tomatoes, fresh cut lettuce, mayo, ketchup, pickles, and onions.",
    price: 2.00,
    image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 5,
    name: "Cheeseburger",
    description: "Juicy beef patty with melted cheese, pickles, onions, and ketchup.",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a9ec03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 6,
    name: "Veggie Wrap",
    description: "Fresh vegetables wrapped in a soft tortilla with hummus and avocado.",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 7,
    name: "Spicy Chicken Sandwich",
    description: "Crispy chicken fillet with spicy mayo, lettuce, and pickles.",
    price: 5.00,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a9ec03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 8,
    name: "French Fries",
    description: "Golden crispy fries served with ketchup or mayo.",
    price: 1.50,
    image: "https://images.unsplash.com/photo-1526234362653-3b75a0ad0746?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 9,
    name: "Chocolate Milkshake",
    description: "Creamy chocolate milkshake topped with whipped cream.",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
  },
  {
    id: 10,
    name: "Apple Pie",
    description: "Warm apple pie with a flaky crust and cinnamon sugar topping.",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1348&q=80",
  },
]);

const searchQuery = ref("");
const selectedBranch = ref(1);
const selectedProduct = ref(null);
const quantity = ref(1);
const selectedAttribute = ref(null);

// Filtrar productos por búsqueda
const filteredProducts = computed(() => {
  return products.value.filter(product => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Abrir modal con detalles del producto
const openModal = (product) => {
  selectedProduct.value = product;
  selectedAttribute.value = product.attributes ? product.attributes[0].id : null;
  quantity.value = 1;
};

// Cerrar modal
const closeModal = () => {
  selectedProduct.value = null;
};
// Datos de notificaciones en formato JSON (simulando una base de datos)
const notifications = ref([
  {
    id: 1,
    message: "Tu pedido ha sido enviado.",
    read: false,
  },
  {
    id: 2,
    message: "Nuevo descuento disponible.",
    read: false,
  },
  {
    id: 3,
    message: "Actualización de la app disponible.",
    read: true,
  },
]);

// Computed para obtener las notificaciones no leídas
const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read);
});

// Función para abrir el modal de notificaciones
const showNotifications = () => {
  isModalOpen.value = true;
};

// Función para cerrar el modal y marcar todas las notificaciones como leídas
const closeNotifications = () => {
  isModalOpen.value = false;
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

// Función para marcar una notificación como leída
const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
};
// Estado del modal de notificaciones
const isModalOpen = ref(false);
// Incrementar cantidad
const incrementQuantity = () => {
  quantity.value++;
};

// Decrementar cantidad
const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// Calcular precio total
const totalPrice = computed(() => {
  if (!selectedProduct.value) return 0;
  const attribute = selectedProduct.value.attributes?.find(attr => attr.id === selectedAttribute.value);
  const attributePrice = attribute ? attribute.price : 0;
  const extrasPrice = selectedProduct.value.extras?.filter(extra => extra.selected).reduce((sum, extra) => sum + extra.price, 0) || 0;
  return (selectedProduct.value.price + attributePrice + extrasPrice) * quantity.value;
});

// Agregar al carrito (simulación)
const addToCart = (product) => {
  alert(`Añadido al carrito: ${product.name}\nCantidad: ${quantity.value}\nTotal: $${totalPrice.value.toFixed(2)}`);
  closeModal();
};
</script> 

<style scoped>
.local-page {
  width: 97%;    
  margin: 0 auto;  
 padding-top: 10px;  
  padding-bottom: 95px; 
}

/* Barra Superior */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 20px;
  background: #0072fa; /* Fondo azul oscuro */
  border-radius: 12px; /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}


.local-name {
  font-size: 1.6rem;
  font-weight: 750;
  margin: 0;
  color: white; /* Texto blanco */ 
}

.search-and-branch {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 16px; 
  border-radius: 20px;
  width: 97px; /* Ancho del campo de búsqueda */
  background: #f9f9f9; /* Fondo gris claro */
  font-size: 0.9rem;
  color: #333;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #0072fa; /* Borde azul al enfocar */
}

.branch-selector {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #f9f9f9; /* Fondo gris claro */
  font-size: 0.9rem;
  color: #333;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s;
}

.branch-selector:hover {
  border-color: #0072fa; /* Borde azul al pasar el mouse */
}

/* Lista de Productos */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}
.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  height: 320px;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.product-info {
  padding: 10px;
  flex: 1;
}
.product-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 5px;
  color: #333;
}
.product-description {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limita a 3 líneas */
  -webkit-box-orient: vertical;
}
.price-and-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}
.price-container {
  flex-direction: column;
  align-items: flex-start; 
}
.original-price {
  font-size: 0.9rem;
  font-weight: bold;
  color: #999;
  text-decoration: line-through;
  margin: 0;
  align-items: left;
}
.final-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #0072fa;
}
.cart-button {
  background-color: #0072fa;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}
.cart-button:hover {
  background-color: #005bb5;
}

/* Modal de Producto */
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
  position: relative;
}
.close-modal-button {
  position: absolute;
  top: -8px;
  right: 3px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #666;
}
.modal-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}
.modal-product-name {
  font-size: 1.2rem;
  margin: 10px 0;
  color: #333;
}
.modal-product-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 10px;
}
.modal-price-and-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}
.modal-product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0072fa;
  margin: 0;
}
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.quantity-controls button {
  background-color: #0072fa;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.quantity-controls button:hover {
  background-color: #005bb5;
}
.quantity {
  font-size: 1.2rem;
  color: #0072fa;
}
.attributes-section, .extras-section {
  margin: 10px 0;
  color: #4e4e4e;
}
.attributes-grid, .extras-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.attribute-option, .extra-option {
  background: #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}
.attribute-option.selected, .extra-option.selected {
  background-color: #0072fa;
  color: white;
}
.modal-add-to-cart-button {
  width: 100%;
  padding: 10px;
  background-color: #0072fa;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}
.modal-add-to-cart-button:hover {
  background-color: #005bb5;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

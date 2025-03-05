<template>
  <div class="delivery-app">
    <!-- Header -->
    <header class="header">
      <div class="menu-icon" @click="toggleSidebar">
        <span>☰</span>
      </div>
      <div class="app-name">
        DeliveryApp
      </div>
      <div class="notification-icon">
        <span>🔔</span>
      </div>
    </header>

    <!-- Sección de Bienvenida -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1 class="client-name">Hola! María López</h1>
          <p class="welcome-phrase">¿De qué tienes ganas hoy?</p>
        </div>
        <div class="location-content">
          <span class="location-icon">📍</span>
          <select class="location-select">
            <option value="1">Av. Principal 123</option>
            <option value="2">Calle Secundaria 456</option>
            <option value="3">Plaza Central 789</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Barra de Búsqueda -->
<div class="search-bar">
  <button>🔍</button>
  <input type="text" placeholder="Buscar restaurantes, productos..." />
</div>

       <!-- Categories Section -->
       <section class="categories-section">
        <h2>Categorías</h2>
        <div class="categories-grid">
          <div v-for="category in categories" :key="category.id" class="category-item">
            <div class="category-icon">{{ category.icon }}</div>
            <div class="category-name">{{ category.name }}</div>
          </div>
        </div>
      </section>
    
    <!-- Carrusel de Promociones -->
    <section class="promotions-section">
      <h2 class="section-title">Promociones</h2>
      <Swiper
        :modules="[Autoplay, Pagination]"
        :slides-per-view="1"
        :space-between="10"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :loop="true"
        :pagination="{ clickable: true }"
        class="promotions-swiper"
      >
        <SwiperSlide v-for="promo in promotions" :key="promo.id" class="promotion-slide">
          <img :src="promo.image" :alt="promo.title" class="promotion-image">
          <div class="promotion-text">
            <h3>{{ promo.title }}</h3>
            <p>{{ promo.description }}</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>

    <!-- Productos Recomendados -->
    <section class="recommended-section">
    <div class="section-header">
    <h2 class="section-title">Recomendados para ti</h2>
    <button class="view-all-button">Ver Todos</button>
    </div>
    <div class="products-scroll">
      <div v-for="product in recommendedProducts" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.name" class="product-image">
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-price">{{ product.price }}</p>
          <button class="cart-button">Agregar a Carrito</button>
        </div>
      </div>
    </div>
  </section>


    <!-- Sección de Locales Populares -->
    <section class="stores-section">
      <div class="section-header">
        <h2 class="section-title">Locales Populares</h2>
        <button class="view-all-button">Ver Todos</button>
      </div>
      <div class="stores-grid">
        <div v-for="store in stores" :key="store.id" class="store-card">
          <img :src="store.image" :alt="store.name" class="store-image">
          <div class="store-info">
            <h3>{{ store.name }}</h3>
            <p class="store-rating">⭐ {{ store.rating }} ({{ store.reviews }} reseñas)</p>
            <p class="store-category">{{ store.category }}</p>
            <button class="view-store-button">Ver Local</button>
          </div>
        </div>
      </div>
    </section>
 
<!-- Sección de Transporte -->
<section class="transport-section">
  <h2 class="section-title">Transporte</h2>
  <div class="transport-options">
    <div class="option-card">
      <img src="https://d2litd7gwlcc1t.cloudfront.net/flow-images/679790001137f9a96da6797e/6797f53b1137f9a96da69828-1738011963244?Expires=1740981286&Key-Pair-Id=K31YYQF5M7E8MP&Signature=mDZYqrsQJCNafWXXODKhGgdP~r19NxSh-N9ypNUCaGxGMx3Pr-EGI6uCNxZbYQIrGsmzCH04oSvsPokhBzpajpqzMZUvQDLSe77YPPecKfP~pk5Azzc3EqXQNiuGo4OHBxU8GWosQtoorMtfgUzKK2LxC9YqgL04Yf9FgYUyNy6ie2EHKkDcHSEGGXfCZfuVR3zWUeuUmBEjK0TH~-LCGy4kKLVEpSYYHM2ISyDHG0SsR2m3PYgLtHMEktNAaTeEngoAFXLufV7HPGTzLNCFfaaFSG3TyWO7AcCN2nia~DFR~TvsIH1i9aCIwwZhiWPgeAJiNKQI2RiFn2IRLn-69w__" alt="Uber" class="option-image">
      <h3>Uber</h3>
      <p>Solicita un viaje con solo un clic.</p>
      <button>Solicitar Uber</button>
    </div>
    <div class="option-card">
      <img src="https://mundoejecutivo.com.mx/wp-content/uploads/2024/09/donde-esta-permitido-pedir-uber-y-didi-en-el-aicm.jpg" alt="Rentar Auto" class="option-image">
      <h3>Rentar Auto</h3>
      <p>Encuentra el auto perfecto para tu viaje.</p>
      <button>Rentar Auto</button>
    </div>
    <div class="option-card">
      <img src="https://d2litd7gwlcc1t.cloudfront.net/flow-images/679790001137f9a96da6797e/6797f8501137f9a96da698bb-1738012752776?Expires=1740981286&Key-Pair-Id=K31YYQF5M7E8MP&Signature=UVjKB-DRdhyjuP9QsMJK~0ZIPi1TyCg2Ys991C6j~C9L9MsHSUGjNQBT6q6oRRm16YdHOeeuOhrviNr50cKUmfjNbRr1ZG6EzqAqcV6TWxLLwls4sp~G3I7jyo~nVGNj2wYMxbHbveiA1LjQOCJKcuwVThY9JuMoTNrZjUnoo6hbjBegPyWSBkZMRngwrcjoKKiB6fdXAjGr2t4Pu3qvF8l5ihYlqQVvDJyVj~PhpEgfSw7MdYEzsb0dq~O3tfXgoOH0FfifLWBkkZ7bFkGu9TpsLHIqQsX1ExhOwj~z2lwTYpvJTWoYsfizKyGTrwUZKAsq8L5NA037yotXHWn~MQ__" alt="Flete" class="option-image">
      <h3>Flete</h3>
      <p>Servicios de transporte para carga pesada.</p>
      <button>Solicitar Flete</button>
    </div>
  </div>
</section>

<!-- Sección de Mandadito -->
<section class="mandadito-section">
  <h2 class="section-title">Mandadito</h2>
  <div class="mandadito-options">
    <div class="option-card">
      <img src="https://via.placeholder.com/150" alt="Enviar Paquete" class="option-image">
      <h3>Enviar Paquete</h3>
      <p>Envía paquetes de manera rápida y segura.</p>
      <button>Enviar Paquete</button>
    </div>
    <div class="option-card">
      <img src="https://via.placeholder.com/150" alt="Recoger Paquete" class="option-image">
      <h3>Recoger Paquete</h3>
      <p>Solicita la recogida de tu paquete.</p>
      <button>Recoger Paquete</button>
    </div>
  </div>
</section>
   <!-- Sección de Mensaje -->
 <section class="affiliate-section">
  <div class="affiliate-content">
    <h2>🚀 ¡Únete a Nuestra Plataforma! 🚀</h2>
    <p>Forma parte de nuestra comunidad y empieza a crecer con nosotros.  
       **Afíliate como local** y aumenta tus ventas o **únete como delivery** y gana dinero con cada entrega. 💼</p>
    
    <div class="affiliate-buttons">
      <button class="affiliate-btn local-btn">📍 Afiliarse como Local</button>
      <button class="affiliate-btn delivery-btn">🚴 Afiliarse como Delivery</button>
    </div>
  </div>
</section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Datos de ejemplo
const promotions = ref([
  { id: 1, image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', title: '50% de descuento', description: 'En tu primer pedido' },
  { id: 2, image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', title: 'Envío gratis', description: 'Pedidos mayores a $20' },
  { id: 3, image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', title: '2x1 en postres', description: 'Solo hoy' },
]);

const recommendedProducts = ref([
  { id: 1, name: 'Hamburguesa Clásica', price: '$8.99', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754' },
  { id: 2, name: 'Pizza Pepperoni', price: '$12.99', image: 'https://mundoejecutivo.com.mx/wp-content/uploads/2024/09/donde-esta-permitido-pedir-uber-y-didi-en-el-aicm.jpg' },
  { id: 3, name: 'Tacos al Pastor', price: '$6.50', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212' },
  { id: 4, name: 'Sushi Roll', price: '$15.99', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828' },
  { id: 5, name: 'Ensalada César', price: '$7.99', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1' },
  { id: 6, name: 'Pollo Frito', price: '$10.99', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: 7, name: 'Burrito Gigante', price: '$9.99', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: 8, name: 'Helado de Vainilla', price: '$4.99', image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
]);

const stores = ref([
  { id: 1, name: 'Burger King', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', rating: 4.5, reviews: 1200, category: 'Comida Rápida' },
  { id: 2, name: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', rating: 4.2, reviews: 950, category: 'Pizzería' },
  { id: 3, name: 'Starbucks', image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', rating: 4.7, reviews: 1500, category: 'Cafetería' },
]);

const categories = ref([
  { id: 1, name: 'Comida Rápida', icon: '🍔' },
  { id: 2, name: 'Pizzería', icon: '🍕' },
  { id: 3, name: 'Cafetería', icon: '☕' },
  { id: 4, name: 'Postres', icon: '🍰' },
  { id: 5, name: 'Saludable', icon: '🥗' },
  { id: 6, name: 'Bebidas', icon: '🥤' },
]);
</script>

<style scoped>
/* Estilos generales */
.delivery-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-icon, .notification-icon {
  font-size: 1.5rem;
  cursor: pointer;
}

.app-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #0072ff;
}

/* Sección de Bienvenida */
.welcome-section {
  background: linear-gradient(135deg, #0072ff 0%, #0066cc 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 255, 150, 0.2), transparent 70%);
  animation: neon-glow 6s linear infinite;
}

@keyframes neon-glow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.welcome-text {
  flex: 1;
}

.client-name {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
}

.welcome-phrase {
  font-size: 1.2rem;
  margin-top: 5px;
  color: #e0e0e0;
}

.location-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.location-icon {
  font-size: 3rem;
  color: #fff;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.location-select {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
}
/* Barra de Búsqueda */
.search-bar {
  display: flex;
  width: 94%;
  margin-left: 25px;
  align-items: center;
  background: #f5f5f5; /* Fondo claro y elegante */
  border-radius: 30px;
  padding: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4); /* Sombra ligera */
}

.search-bar input {
  width: 94%;
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  background: transparent;
  color: #333; /* Color de texto más oscuro */
}

.search-bar button:hover {
  background: linear-gradient(45deg, #0056d2, #00a4e4); /* Efecto hover más oscuro */
  border-color: #0056d2; 
}

.search-bar button {
  background: linear-gradient(45deg, #0072ff, #00c6ff); /* Gradiente atractivo */
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 18px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-size: 1rem;
  font-weight: bold;
}

/* Categories section */
.categories-section {
  margin-bottom: 25px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.category-item:hover {
  transform: translateY(-5px);
}
.category-item:active {
  transform: translateY(2px); /* Efecto de hundimiento */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.category-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.category-name {
  font-size: 0.9rem;
  text-align: center;
}


/* Carrusel de Promociones */
.promotions-section {
  margin: 20px;
}

.promotions-swiper {
  border-radius: 20px;
  overflow: hidden;
}

.promotion-slide {
  position: relative;
}

.promotion-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.promotion-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 15px;
}
/* Estilos para la sección de Productos Recomendados */
.recommended-section {
  margin: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.products-scroll {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 10px;
  scrollbar-width: none; /* Ocultar scrollbar en Firefox */
  -ms-overflow-style: none; /* Ocultar scrollbar en IE/Edge */
}

.products-scroll::-webkit-scrollbar {
  display: none; /* Ocultar scrollbar en Chrome/Safari */
}

.product-card {
  flex: 0 0 auto;
  width: 200px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.product-card:hover {
  transform: translateY(-3px);
}
.product-card:active {
  transform: translateY(2px); /* Efecto de hundimiento */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 15px 15px 0 0;
}

.product-info {
  padding: 10px; /* Menor padding */
  text-align: center;
}

.product-name {
  font-size: 1.1rem;
  font-weight: bold; /* Negrita */
  color: #333;
  margin: 5px 0; /* Espaciado reducido */
}

.product-price {
  font-size: 1rem;
  font-weight: 700;
  color: #0072ff;
  margin: 5px 0; /* Espaciado reducido */
}

.cart-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s ease, transform 0.1s ease;
}
 
/* Sección de Locales Populares */
.stores-section {
  margin: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.view-all-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view-all-button:hover {
  background: #005bb5;
}

.stores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.store-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.store-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.store-info {
  padding: 10px;
}

.store-rating {
  color: #ffc107;
  font-weight: bold;
}

.store-category {
  color: #666;
  font-size: 0.9rem;
}

.view-store-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  transition: background 0.3s ease;
}

.view-store-button:hover {
  background: #005bb5;
}

/* Sección de Categorías */
.categories-section {
  margin: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.category-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 10px;
}

.category-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.category-card h3 {
  font-size: 1rem;
  margin: 10px 0 0;
  color: #333;
}
/* Sección de Afiliación */
.affiliate-section {
  width: 98%;  
  padding: 10px;
  margin: 40px auto;
  background: linear-gradient(135deg, #4facfe, #8300fe); /* Azul degradado */
  color: white;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.affiliate-content h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 15px;
  font-family: 'Lora', serif;
}

.affiliate-content p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
} 
/* Botones de Afiliación */
.affiliate-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.affiliate-btn {
  padding: 12px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.local-btn {
  background: #ff7e5f;
  color: white;
}

.local-btn:hover {
  background: white;
  color: #ff7e5f;
}

.delivery-btn {
  background: #34c759;
  color: white;
}

.delivery-btn:hover {
  background: white;
  color: #34c759;
} 
/* Estilos generales */
.delivery-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

/* Sección de Transporte */
.transport-section {
  margin-bottom: 30px;
}

.transport-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.transport-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.transport-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.transport-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.transport-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.transport-card p {
  font-size: 0.9rem;
  color: #666;
}

/* Sección de Mandadito */
.errand-section {
  margin-bottom: 30px;
}

.errand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.errand-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.errand-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.errand-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.errand-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.errand-card p {
  font-size: 0.9rem;
  color: #666;
}
/* Estilo General de las Secciones */
.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 20px 0;
  text-align: center; /* Centrar el título */
}

.transport-options, .mandadito-options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px; /* Espacio entre tarjetas */
}

.option-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 200px; /* Ancho fijo para las tarjetas */
  text-align: center;
  transition: transform 0.3s ease;
}

.option-card:hover {
  transform: translateY(-5px);
}

.option-image {
  width: 100%;
  height: auto;
  border-radius: 10px; /* Bordes redondeados para la imagen */
  margin-bottom: 10px; /* Espacio debajo de la imagen */
}

.option-card h3 {
  font-size: 1.2rem;
  color: #0072ff;
  margin: 10px 0;
}

.option-card p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 15px;
}

.option-card button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.option-card button:hover {
  background: #005bb5;
}
</style> 
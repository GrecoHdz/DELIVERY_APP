<template>
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-purple-400 to-pink-300 font-bold text-white">
      <!-- Header -->
      <header class="p-4 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-400 shadow-md">
        <!-- Selector de Ubicación -->
        <select v-model="ubicacion" class="bg-white text-gray-900 p-1 rounded-md shadow-sm">
          <option value="roatan">Casa</option>
          <option value="utila">Utila</option>
          <option value="guanaja">Guanaja</option>
        </select>
  
        <!-- Nombre de la App Centrado -->
        <h1 class="text-xl font-extrabold absolute left-1/2 transform -translate-x-1/2">RoaAPP🌴</h1>
  
        <!-- Notificaciones y Perfil -->
        <div class="flex space-x-4 items-center">
          <!-- Notificaciones -->
          <button @click="mostrarNotificaciones = !mostrarNotificaciones">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
  
          <!-- Perfil -->
          <button @click="mostrarMenuPerfil = !mostrarMenuPerfil">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" alt="Perfil" class="w-8 h-8 rounded-full shadow-md cursor-pointer">
          </button>
  
          <!-- Menú Emergente de Perfil -->
          <div v-if="mostrarMenuPerfil" class="absolute top-20 right-4 bg-white text-gray-900 p-4 rounded-lg shadow-md z-50">
            <p class="cursor-pointer mb-2" @click="tipoUsuario = 'cliente'">Cliente</p>
            <p class="cursor-pointer mb-2" @click="tipoUsuario = 'driver'">Driver</p>
            <p class="cursor-pointer" @click="tipoUsuario = 'local'">Local</p>
          </div>
        </div>
      </header>
  
      <!-- Notificaciones -->
      <div v-if="mostrarNotificaciones" class="absolute top-20 right-4 bg-white text-gray-900 p-4 rounded-lg shadow-md z-50">
        <p>No tienes notificaciones nuevas.</p>
      </div>
  
      <!-- Buscador -->
      <div class="p-4">
        <input 
          v-model="busqueda" 
          type="text" 
          placeholder="🔍 Buscar locales..." 
          class="w-full p-2 rounded-lg shadow-md text-gray-900"
        />
      </div>
  
      <!-- Carrusel de Promociones -->
      <div class="relative w-full overflow-hidden p-4">
        <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${indicePromo * 100}%)` }">
          <div v-for="(promo, index) in promociones" :key="index" class="min-w-full flex-shrink-0">
            <img :src="promo.image" :alt="promo.title" class="w-full h-40 object-cover rounded-lg shadow-lg">
            <p class="text-center text-white font-bold mt-2">{{ promo.title }}</p>
          </div>
        </div>
      </div>
  
      <!-- Categorías -->
      <div class="p-4 grid grid-cols-4 gap-3">
        <div v-for="categoria in categorias" :key="categoria.id" class="bg-white p-2 rounded-lg shadow-md flex flex-col items-center">
          <img :src="categoria.image" alt="categoria.name" class="w-12 h-12 object-contain">
          <p class="text-xs font-semibold text-center text-gray-900">{{ categoria.name }}</p>
        </div>
      </div>
  
      <!-- Contenido principal -->
      <main class="flex-1 p-4 space-y-6 overflow-y-auto">
        <!-- Sección 1: Locales Premium -->
        <section>
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-extrabold">Recomendados</h2>
            <p class="text-blue-600 underline cursor-pointer text-sm" @click="verTodos('locales')">Ver Todos</p>
          </div>
          <div class="overflow-x-auto whitespace-nowrap py-2">
            <div class="inline-flex space-x-4">
              <div v-for="local in localesFiltrados" :key="local.id" class="w-60 bg-white text-gray-900 rounded-xl overflow-hidden shadow-md relative">
                <img :src="local.image" alt="local.name" class="w-full h-32 object-cover">
                <button @click="agregarFavorito(local)" class="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md">
                  <svg v-if="!esFavorito(local)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </button>
                <div class="p-2">
                  <h3 class="text-sm font-semibold">{{ local.name }}</h3>
                  <p class="text-xs text-gray-600">{{ local.description }}</p>
                  <button @click="agregarAlCarrito(local)" class="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md">Agregar al Carrito</button>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- Sección 2: Transporte -->
        <section>
          <h2 class="text-lg font-bold mb-2">🚖 Transporte</h2>
          <div class="overflow-x-auto whitespace-nowrap py-2">
            <div class="inline-flex space-x-4">
              <div v-for="item in transporte" :key="item.id" class="w-30 bg-white text-gray-900 rounded-xl overflow-hidden shadow-md">
                <img :src="item.image" alt="item.name" class="w-full h-32 object-cover">
                <div class="p-2">
                  <h3 class="text-sm font-semibold">{{ item.name }}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- Sección 3: Mandaditos -->
        <section>
          <h2 class="text-lg font-bold mb-2">📦 Mandaditos</h2>
          <div class="overflow-x-auto whitespace-nowrap py-2">
            <div class="inline-flex space-x-4">
              <div v-for="item in mandaditos" :key="item.id" class="w-40 bg-white text-gray-900 rounded-xl overflow-hidden shadow-md">
                <img :src="item.image" alt="item.name" class="w-full h-32 object-cover">
                <div class="p-2">
                  <h3 class="text-sm font-semibold">{{ item.name }}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  
      <!-- Footer Estático -->
      <footer class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-400 shadow-md flex justify-around items-center p-2">
        <!-- Botones Transparentes -->
        <button @click="mostrarHome = true" class="bg-transparent text-white rounded-full p-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0l-2-2m2 2l2-2" />
          </svg>
        </button>
        <button @click="mostrarFavoritos = !mostrarFavoritos" class="bg-transparent text-white rounded-full p-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z" />
          </svg>
        </button>
        <!-- Botón de Carrito Resaltado -->
        <button @click="mostrarCarrito = !mostrarCarrito" class="bg-purple-600 text-white rounded-full p-3 shadow-md relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0h2v2H9v-2m2 0h6v-2H9v2" />
          </svg>
          <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ carrito.length }}</span>
        </button>
        <button @click="mostrarHistorial = !mostrarHistorial" class="bg-transparent text-white rounded-full p-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
        <!-- Botón Sidebar -->
        <button @click="mostrarSidebar = !mostrarSidebar" class="bg-transparent text-white rounded-full p-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </footer>
  
      <!-- Sidebar -->
      <div v-if="mostrarSidebar" class="fixed bottom-0 right-0 h-full w-64 bg-white text-gray-900 shadow-lg z-50">
        <div class="p-4">
          <h2 class="text-lg font-bold mb-4">Opciones</h2>
          <div class="mb-4">
            <h3 class="font-semibold mb-2">Idioma</h3>
            <button @click="idioma = 'es'" class="flex items-center space-x-2 mb-2">
              <img src="https://flagcdn.com/es.svg" alt="Español" class="w-6 h-4 inline-block">
              <span>Español</span>
            </button>
            <button @click="idioma = 'en'" class="flex items-center space-x-2">
              <img src="https://flagcdn.com/us.svg" alt="English" class="w-6 h-4 inline-block">
              <span>English</span>
            </button>
          </div>
          <button @click="mostrarSidebar = false" class="bg-purple-500 text-white px-4 py-2 rounded-md">Cerrar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  
  const busqueda = ref("");
  const idioma = ref("es");
  const ubicacion = ref("roatan");
  const mostrarNotificaciones = ref(false);
  const mostrarCarrito = ref(false);
  const mostrarHistorial = ref(false);
  const mostrarFavoritos = ref(false);
  const mostrarMenuPerfil = ref(false);
  const tipoUsuario = ref("cliente");
  const mostrarSidebar = ref(false);
  const carrito = ref([]);
  const favoritos = ref([]);
  
  const categorias = ref([
    { id: 1, name: "Restaurantes", image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png" },
    { id: 2, name: "Tiendas", image: "https://cdn-icons-png.flaticon.com/512/3081/3081648.png" },
    { id: 3, name: "Supermercados", image: "https://cdn-icons-png.flaticon.com/512/3514/3514491.png" },
    { id: 4, name: "Farmacias", image: "https://cdn-icons-png.flaticon.com/512/609/609803.png" },
    { id: 5, name: "Transporte", image: "https://cdn-icons-png.flaticon.com/512/3039/3039436.png" },
    { id: 6, name: "Mandaditos", image: "https://cdn-icons-png.flaticon.com/512/1995/1995470.png" }
  ]);
  
  const promociones = ref([
    { title: "2x1 en Sushi 🍣", image: "https://images.unsplash.com/photo-1553621042-f6e147245754" },
    { title: "Descuento en Rentas 🚗", image: "https://mundoejecutivo.com.mx/wp-content/uploads/2024/09/donde-esta-permitido-pedir-uber-y-didi-en-el-aicm.jpg" },
    { title: "Pizza + Bebida Gratis 🍕🥤", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212" }
  ]);
  
  const indicePromo = ref(0);
  
  onMounted(() => {
    setInterval(() => {
      indicePromo.value = (indicePromo.value + 1) % promociones.value.length;
    }, 3000);
  });
  
  const transporte = ref([
    { id: 1, name: "Pedir UBER", image: "https://pedirtaxi24h.app/wp-content/uploads/pedir-taxi-en-peligros-460x301.png" },
    { id: 2, name: "Rentar Auto", image: "https://mundoejecutivo.com.mx/wp-content/uploads/2024/09/donde-esta-permitido-pedir-uber-y-didi-en-el-aicm.jpg" },
    { id: 3, name: "Pedir Camión", image: "https://rlc.es/wp-content/uploads/2023/01/indemnizacion-descarga-camiones.jpg" }
  ]);
  
  const mandaditos = ref([
    { id: 1, name: "Traer Paquete", image: "https://tiendasbingo.com/wp-content/uploads/2023/02/DELIVERY.webp" },
    { id: 2, name: "Enviar Paquete", image: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://website.myrider.app/wp-content/uploads/2024/06/mandaditos_rider.webp" }
  ]);
  
  const localesPremium = ref([
    { id: 1, name: "Restaurante Mar Azul", description: "Especialidad en mariscos", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828" },
    { id: 2, name: "Sunset Grill", description: "Comida gourmet con vista al mar", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1" }
  ]);
  
  const localesFiltrados = computed(() => {
    return localesPremium.value.filter(local =>
      local.name.toLowerCase().includes(busqueda.value.toLowerCase())
    );
  });
  
  const agregarAlCarrito = (local) => {
    carrito.value.push(local);
  };
  
  const agregarFavorito = (local) => {
    if (!esFavorito(local)) {
      favoritos.value.push(local);
    } else {
      favoritos.value = favoritos.value.filter(fav => fav.id !== local.id);
    }
  };
  
  const esFavorito = (local) => {
    return favoritos.value.some(fav => fav.id === local.id);
  };
  
  const verTodos = (tipo) => {
    alert(`Mostrando todos los ${tipo}`);
  };
  </script>
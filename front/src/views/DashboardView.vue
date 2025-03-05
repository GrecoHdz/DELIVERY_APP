<template>
  <v-app>
    <v-container fluid class="bg-gradient-to-b from-blue-50 to-blue-100">
      <!-- Header -->
      <v-app-bar app>
        <v-toolbar-title>
          <v-icon @click="toggleSidebar" class="mr-2">mdi-menu</v-icon>
          <v-icon class="text-blue-600">mdi-truck</v-icon>
          <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="text-blue-600">
          mdi-bell
          <v-badge color="red" content="3" overlap>
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-icon>
      </v-app-bar>

      <!-- Sidebar -->
      <v-navigation-drawer v-model="isSidebarOpen" app>
        <v-list>
          <v-list-item-group>
            <v-list-item v-for="(item, index) in sidebarItems" :key="index">
              <v-list-item-title>
                <v-btn text>{{ item }}</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
        <v-container>
          <!-- Welcome Section -->
          <v-card class="mb-6">
            <v-card-title>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">Bienvenido, María</h1>
                <p class="text-gray-600">¿Qué vas a pedir hoy?</p>
                <v-row>
                  <v-col>
                    <v-icon class="text-blue-600">mdi-map-pin</v-icon>
                    <span class="text-sm text-gray-600">Av. Principal 123, Ciudad</span>
                  </v-col>
                </v-row>
              </div>
              <v-spacer></v-spacer>
              <v-icon class="bg-blue-100 p-3 rounded-lg">mdi-map-pin</v-icon>
            </v-card-title>
          </v-card>

          <!-- Search Bar -->
          <v-text-field
            prepend-icon="mdi-magnify"
            label="Buscar restaurantes o platillos..."
            class="mb-6"
          ></v-text-field>

          <!-- Categories Section -->
          <v-row class="mb-6">
            <v-col v-for="(category, index) in categories" :key="index" cols="3">
              <v-card>
                <v-card-title>
                  <v-icon class="text-red-500">mdi-pizza</v-icon>
                  <span class="text-xs text-gray-700 text-center">{{ category }}</span>
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>

          <!-- Promotions Carousel -->
          <v-carousel class="mb-6">
            <v-carousel-item
              v-for="(slide, index) in slides"
              :key="index"
              :src="slide.image"
            >
              <v-container>
                <v-row>
                  <v-col>
                    <h3 class="text-white text-xl font-bold">{{ slide.title }}</h3>
                    <p class="text-white">{{ slide.description }}</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-carousel-item>
          </v-carousel>

          <!-- Recommended Section -->
          <v-row class="mb-6">
            <v-col>
              <h2 class="text-xl font-semibold text-gray-800">Recomendados</h2>
              <v-btn text>Ver todos</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="(restaurant, index) in recommendedRestaurants" :key="index" cols="3">
              <v-card>
                <v-card-title>
                  <v-icon class="text-blue-600">mdi-clock</v-icon>
                  <span>25-35 min</span>
                  <v-spacer></v-spacer>
                  <v-icon class="text-gray-400">mdi-heart</v-icon>
                </v-card-title>
                <v-card-text>
                  <h3 class="font-semibold text-gray-800">{{ restaurant.name }}</h3>
                  <div class="flex items-center text-xs text-gray-500 mt-1">
                    <v-icon class="text-yellow-400">mdi-star</v-icon>
                    <span class="ml-1">{{ restaurant.rating }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ restaurant.price }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ restaurant.type }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Transport Section -->
          <v-row class="mb-6">
            <v-col>
              <h2 class="text-lg font-bold mb-2">🚖 Transporte</h2>
              <v-carousel>
                <v-carousel-item
                  v-for="(item, index) in transporte"
                  :key="index"
                >
                  <v-img :src="item.image" height="200px">
                    <v-container>
                      <v-row>
                        <v-col>
                          <h3 class="text-sm font-semibold">{{ item.name }}</h3>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-img>
                </v-carousel-item>
              </v-carousel>
            </v-col>
          </v-row>

          <!-- Mandaditos Section -->
          <v-row class="mb-6">
            <v-col>
              <h2 class="text-lg font-bold mb-2">📦 Mandaditos</h2>
              <v-carousel>
                <v-carousel-item
                  v-for="(item, index) in mandaditos"
                  :key="index"
                >
                  <v-img :src="item.image" height="200px">
                    <v-container>
                      <v-row>
                        <v-col>
                          <h3 class="text-sm font-semibold">{{ item.name }}</h3>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-img>
                </v-carousel-item>
              </v-carousel>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Footer -->
      <v-footer app>
        <v-row justify="space-around">
          <v-col class="text-center">
            <v-icon class="text-blue-600">mdi-home</v-icon>
            <span class="text-xs text-blue-600">Inicio</span>
          </v-col>
          <v-col class="text-center">
            <v-icon class="text-blue-600">mdi-heart</v-icon>
            <span class="text-xs text-blue-600">Favoritos</span>
          </v-col>
          <v-col class="text-center">
            <v-icon class="text-white" @click="toggleCart">mdi-cart</v-icon>
            <span class="text-xs text-blue-600">Carrito</span>
          </v-col>
          <v-col class="text-center">
            <v-icon class="text-blue-600">mdi-bag</v-icon>
            <span class="text-xs text-blue-600">Pedidos</span>
          </v-col>
          <v-col class="text-center">
            <v-icon @click="toggleProfileMenu" class="text-blue-600">mdi-account</v-icon>
            <span class="text-xs text-blue-600">Perfil</span>
            <v-menu v-model="isProfileMenuOpen" offset-y>
              <v-list>
                <v-list-item @click="selectProfile('Cliente')">Cliente</v-list-item>
                <v-list-item @click="selectProfile('Driver')">Driver</v-list-item>
                <v-list-item @click="selectProfile('Local')">Local</v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-footer>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VApp, VContainer, VAppBar, VIcon, VNavigationDrawer, VList, VListItem, VListItemTitle, VMain, VCard, VCardTitle, VCardText, VTextField, VRow, VCol, VCarousel, VCarouselItem, VImg, VFooter, VMenu, VBadge } from 'vuetify/components';

// Sample data
const sidebarItems = ["Idioma", "Cerrar sesión", "Ver mi local", "Ser driver", "Perfil", "Configuración", "Soporte"];
const categories = ["Pizza", "Cafetería", "Saludable", "Más"];
const recommendedRestaurants = [
  { name: "Cafetería Central", rating: 4.8, price: "$$$", type: "Cafetería" },
  { name: "Pizzería Italiana", rating: 4.5, price: "$$", type: "Pizzería" },
  { name: "Sushi Express", rating: 4.7, price: "$$$", type: "Sushi" },
  { name: "Burger King", rating: 4.2, price: "$$", type: "Hamburguesas" },
];
const transporte = [
  { id: 1, name: "Uber", image: "https://pedirtaxi24h.app/wp-content/uploads/pedir-taxi-en-peligros-460x301.png"},
  { id: 2, name: "Rentar Auto", image: "https://mundoejecutivo.com.mx/wp-content/uploads/2024/09/donde-esta-permitido-pedir-uber-y-didi-en-el-aicm.jpg" },
  { id: 3, name: "Pedir Camión", image: "https://rlc.es/wp-content/uploads/2023/01/indemnizacion-descarga-camiones.jpg" },
];
const mandaditos = [
  { id: 1, name: "Enviar Paquete", image: "https://tiendasbingo.com/wp-content/uploads/2023/02/DELIVERY.webp" },
  { id: 2, name: "Traer Paquete", image: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://website.myrider.app/wp-content/uploads/2024/06/mandaditos_rider.webp" },
];

// Carousel slides
const slides = [
  { image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", title: "50% DESCUENTO", description: "En tu primer pedido" },
  { image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", title: "ENVÍO GRATIS", description: "Pedidos +$20" },
  { image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", title: "2x1 EN POSTRES", description: "Válido hoy" },
];

const currentSlide = ref(0);
const isSidebarOpen = ref(false);
const isProfileMenuOpen = ref(false);
const selectedProfile = ref("Cliente");

onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 5000);
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const selectProfile = (profile) => {
  selectedProfile.value = profile;
  isProfileMenuOpen.value = false;
};
</script>

<style>
.bg-gradient-to-b {
  background: linear-gradient(to bottom, #e0f7fa, #b2ebf2);
}
</style>

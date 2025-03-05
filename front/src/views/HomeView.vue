<template>
  <v-container>
    <!-- Sección de Bienvenida -->
    <v-row class="welcome-section">
      <v-col cols="12">
        <h1 class="text-center font-weight-bold white--text">Bienvenido a la App</h1>
      </v-col>
    </v-row>

    <!-- Barra de Búsqueda -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Buscar"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
          class="search-bar"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Sección de Categorías -->
    <v-row>
      <v-col cols="12">
        <h2>Categorías</h2>
        <v-row>
          <v-col v-for="(category, i) in categories" :key="i" cols="12" sm="6" md="4">
            <v-card class="category-card">
              <v-card-title>{{ category.name }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Carrusel de Promociones -->
    <v-row>
      <v-col cols="12">
        <h2>Promociones</h2>
        <v-carousel cycle height="400" hide-delimiters>
          <v-carousel-item v-for="(promotion, i) in promotions" :key="i">
            <v-img :src="promotion.image" height="400" class="carousel-image"></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <!-- Sección de Locales -->
    <v-row>
      <v-col cols="12">
        <h2>Locales</h2>
        <v-row>
          <v-col v-for="(store, i) in stores" :key="i" cols="12" sm="6" md="4">
            <v-card class="store-card" hover>
              <v-img src="https://via.placeholder.com/400x200" height="150"></v-img>
              <v-card-title>{{ store.name }}</v-card-title>
              <v-card-subtitle>{{ store.location }}</v-card-subtitle>
              <v-card-text>{{ store.description }}</v-card-text>
              <v-card-actions>
                <v-btn color="primary" text>Ver más</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { name: 'Categoría 1' },
        { name: 'Categoría 2' },
        { name: 'Categoría 3' },
      ],
      promotions: [
        { image: 'https://via.placeholder.com/800x400' },
        { image: 'https://via.placeholder.com/800x400' },
        { image: 'https://via.placeholder.com/800x400' },
      ],
      stores: [
        { name: 'Local 1', location: 'Ubicación 1', description: 'Descripción del local 1' },
        { name: 'Local 2', location: 'Ubicación 2', description: 'Descripción del local 2' },
        { name: 'Local 3', location: 'Ubicación 3', description: 'Descripción del local 3' },
      ],
    };
  },
};
</script>

<style scoped>
.welcome-section {
  background: linear-gradient(45deg, #6B5B95, #88B04B);
  padding: 100px 0;
  border-radius: 15px;
  margin-top: 20px;
}

.search-bar {
  border-radius: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.carousel-image {
  border-radius: 15px;
  overflow: hidden;
}

.store-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.store-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
<template>
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" class="sidebar-item">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: 'Inicio', icon: 'mdi-home', to: '/' },
        { title: 'Categorías', icon: 'mdi-view-list', to: '/categories' },
        { title: 'Promociones', icon: 'mdi-tag', to: '/promotions' },
        { title: 'Locales', icon: 'mdi-store', to: '/stores' },
      ],
    };
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  background: linear-gradient(45deg, #4ECDC4, #556270);
}

.sidebar-item {
  transition: transform 0.3s ease;
}

.sidebar-item:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.1);
}
</style>
<template>
  <v-app-bar color="primary" dark app elevation="4">
    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>
    <v-toolbar-title class="text-center font-weight-bold">Nombre de la App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-badge color="red" content="3">
        <v-icon>mdi-bell</v-icon>
      </v-badge>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
  },
};
</script>

<style scoped>
.v-app-bar {
  background: linear-gradient(45deg, #FF6F61, #FFD166);
}
</style>
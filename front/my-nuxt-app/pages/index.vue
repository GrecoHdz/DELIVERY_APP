<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Bienvenido a la aplicación</h1>
    <p class="mb-4">Has iniciado sesión correctamente.</p>
    <button 
      @click="logout"
      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Cerrar sesión
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>

<template>
    <v-card>
      <v-card-title>{{ product.name }}</v-card-title>
      <v-card-subtitle>{{ product.price }}</v-card-subtitle>
      <v-card-actions>
        <v-btn @click="addToCart">Agregar al carrito</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      product: Object,
    },
    methods: {
      addToCart() {
        // Lógica para agregar al carrito
        console.log(`${this.product.name} agregado al carrito.`);
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    margin: 10px;
  }
  </style>

<template>
  <div>
    <HeaderComponent />
    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Adminisración de Productos</h1>
      
      <button @click="openModal('addProduct')" class="btn-primary">Agregar Producto</button>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="producto in productos" :key="producto.id_producto" class="relative border p-4 rounded-lg shadow-md">
          <img :src="producto.imagen_url" class="w-full h-40 object-cover rounded-md" />
          <div v-if="producto.recomendado" class="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs rounded-bl-lg">Recomendado</div>
          <h2 class="text-lg font-semibold">{{ producto.nombre_producto }}</h2>
          <p>{{ producto.descripcion_producto }}</p>
          <p v-if="producto.precio_oferta"> <s>{{ producto.precio }}</s> <span class="text-red-500">{{ producto.precio_oferta }}</span></p>
          <p v-else>{{ producto.precio }}</p>
          <div class="mt-2 flex space-x-2">
            <button @click="editProduct(producto)" class="btn-secondary">Editar</button>
            <button @click="disableProduct(producto.id_producto)" class="btn-warning">Deshabilitar</button>
            <button @click="toggleRecommend(producto)" class="btn-info">{{ producto.recomendado ? 'Quitar Recomendado' : 'Recomendar' }}</button>
          </div>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios'; 

export default {
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      productos: [],
      API_URL: 'http://localhost:4000',
      LOCAL_ID: 10,
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`${this.API_URL}/productos/${this.LOCAL_ID}`);
        this.productos = response.data;
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    },
    openModal(type) {
      console.log('Abrir modal:', type);
    },
    editProduct(producto) {
      console.log('Editar producto:', producto);
    },
    async disableProduct(id) {
      try {
        await axios.put(`${this.API_URL}/productos/${id}/disable`);
        this.fetchProducts();
      } catch (error) {
        console.error('Error al deshabilitar producto:', error);
      }
    },
    async toggleRecommend(producto) {
      try {
        if (producto.recomendado) {
          await axios.delete(`${this.API_URL}/recomendados/${producto.id_producto}`);
        } else {
          await axios.post(`${this.API_URL}/recomendados`, { id_producto: producto.id_producto, id_local: this.LOCAL_ID });
        }
        this.fetchProducts();
      } catch (error) {
        console.error('Error al cambiar recomendación:', error);
      }
    },
    loadMockData() {
      this.productos = [
        {
          id_producto: 1,
          nombre_producto: 'Hamburguesa Doble',
          descripcion_producto: 'Deliciosa hamburguesa con doble carne',
          precio: 5.99,
          precio_oferta: 4.99,
          imagen_url: 'https://res.cloudinary.com/demo/image/upload/v1614163404/sample.jpg',
          recomendado: true,
        },
        {
          id_producto: 2,
          nombre_producto: 'Pizza Peperoni',
          descripcion_producto: 'Pizza con queso y peperoni',
          precio: 8.99,
          imagen_url: 'https://res.cloudinary.com/demo/image/upload/v1614163404/sample.jpg',
          recomendado: false,
        }
      ];
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style>
.btn-primary { background: #4CAF50; color: white; padding: 10px; border-radius: 5px; }
.btn-secondary { background: #008CBA; color: white; padding: 5px; border-radius: 5px; }
.btn-warning { background: #FF9800; color: white; padding: 5px; border-radius: 5px; }
.btn-info { background: #2196F3; color: white; padding: 5px; border-radius: 5px; }
</style>

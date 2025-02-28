<script setup>
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");

if (!token) {
  router.push("/login"); // Si no hay token, redirigir al login
}

const logout = () => {
  Cookies.remove("token"); // Eliminar token
  router.push("/login");
};
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
      <h1 class="text-3xl font-bold mb-4">Bienvenido al Dashboard</h1>
      <p class="text-gray-600">Tu sesión está activa.</p>

      <button @click="logout" class="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

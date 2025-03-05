<template> 
    <form @submit.prevent="handleLogin">
      <input v-model="usuario" placeholder="Usuario" />
      <input v-model="clave" type="password" placeholder="Contraseña" />
      <button type="submit">Iniciar Sesión</button>
    </form>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { login as authServiceLogin } from "../services/authService";
  
  export default {
    setup() {
      const usuario = ref("");
      const clave = ref("");
      const router = useRouter();
      const store = useStore();
  
      const handleLogin = async () => {
        try {
          // Envía las credenciales al backend
          const credentials = { usuario: usuario.value, clave: clave.value };
          const { accessToken } = await authServiceLogin(credentials);
  
          // Despacha la acción Vuex para actualizar el estado
          await store.dispatch("login", { user: usuario.value, token: accessToken });
  
          // Redirige al usuario al dashboard
          router.push("/dashboard");
        } catch (error) {
          console.error("Error en el inicio de sesión:", error.message);
        }
      };
  
      return { usuario, clave, handleLogin };
    },
  };
  </script>
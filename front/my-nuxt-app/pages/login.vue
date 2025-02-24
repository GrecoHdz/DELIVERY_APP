<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Iniciar sesión</h2>
      <form @submit.prevent="loginUser">
        <div class="input-group">
          <label for="usuario">Usuario</label>
          <input
            v-model="usuario"
            type="text"
            id="usuario"
            placeholder="Introduce tu usuario"
            required
          />
        </div>

        <div class="input-group">
          <label for="clave">Contraseña</label>
          <input
            v-model="clave"
            type="password"
            id="clave"
            placeholder="Introduce tu contraseña"
            required
          />
        </div>

        <button type="submit" class="btn-login">Iniciar sesión</button>

        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuario: "",
      clave: "",
      error: null,
    };
  },
  methods: {
    async loginUser() {
      try {
        // Enviar la solicitud POST al backend
        const response = await this.$axios.post("/login", {
          usuario: this.usuario,
          clave: this.clave,
        });

        // Al recibir el token, lo guardamos en el localStorage (o sessionStorage)
        localStorage.setItem("token", response.data.token);

        // Redirigir al usuario al dashboard o página principal
        this.$router.push("/dashboard");
      } catch (err) {
        // Si ocurre un error, mostrarlo en la pantalla
        this.error = err.response.data.message || "Error al iniciar sesión";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-box {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
</style>

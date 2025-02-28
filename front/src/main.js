import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Si tienes Vue Router 
import store from "./store"; 

// Crea la instancia de la app
const app = createApp(App);

// Usa el router y el store (si los tienes)
app.use(router);
app.use(store);

// Monta la app en el div con id="app"
app.mount("#app");

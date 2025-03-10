<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100"> 
  <header class="bg-white shadow-md px-4 py-3 flex justify-between items-center">
    <div class="flex items-center space-x-2">
      <TruckIcon class="text-blue-600" :size="24" />
      <span class="font-bold text-xl text-blue-600">DeliveryPro</span>
    </div>
    <div class="flex items-center space-x-4">
      <select v-model="selectedProfile" class="p-1 text-center bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-bold focus:outline-none">
        <option value="Cliente">Cliente</option>
        <option value="Local">Local</option>
        <option value="Delivery">Delivery</option>
      </select>
      <div class="relative cursor-pointer" @click="showNotifications">
        <BellIcon class="text-blue-600" :size="24" />
        <div v-if="unreadNotifications.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
          {{ unreadNotifications.length }}
        </div>
      </div>
    </div>
  </header> 
      <!-- Modal de Notificaciones -->
      <transition name="fade">
        <div v-if="isModalOpen" class="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
          <h3 class="font-bold text-lg mb-2 text-blue-600">Notificaciones</h3>
          <div v-if="notifications.length > 0">
            <div
              v-for="(notification, index) in notifications"
              :key="index"
              class="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              @click="markAsRead(notification.id)"
              :class="{ 'bg-gray-100': notification.read }"
            >
              <p class="text-sm text-gray-700">{{ notification.message }}</p>
              <span v-if="!notification.read" class="text-xs text-blue-500">Nueva</span>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">
            No tienes notificaciones nuevas.
          </div>
          <button
            @click="closeNotifications"
            class="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-500 transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </transition> 

    <!-- Contenido Principal -->
    <div class="p-4 w-full">
<!-- Sección de Perfil -->
<section class="profile-info-section">
  <div class="profile-header">
    <!-- Mitad izquierda: Foto, nombre y correo -->
    <div class="profile-left">
      <img :src="user.imagen_perfil" alt="Imagen de perfil" class="profile-pic">
      <div class="profile-details">
        <h2 class="profile-name">{{ user.nombre }}</h2>
        <p class="profile-email">{{ user.email }}</p>
        <button class="edit-profile-button" @click="openProfileModal">✏️ Editar Perfil</button>
      </div>
    </div>

    <!-- Mitad derecha: Estadísticas -->
    <div class="profile-stats">
      <h3 class="stats-title">Estadísticas</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Pedidos solicitados</span>
          <span class="stat-value">{{ stats.totalPedidos }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Ubers tomados </span>
          <span class="stat-value">{{ stats.ubersTomados }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Mandaditos solicitados </span>
          <span class="stat-value">{{ stats.mandaditosSolicitados }}</span>
        </div> 
        <div class="stat-item">
          <span class="stat-label">Tiempo de inicio </span>
          <span class="stat-value">{{ stats.fechaInicio }}</span>
        </div>
      </div>
    </div>
  </div>
</section>

    <!-- Grid de 3 filas y 2 columnas -->
    <div class="grid-container">
<!-- Estadísticas -->
<div class="grid-item">
  <div class="card"> 
      <h3 class="card-title">👤 Datos Personales</h3>  
    <div class="card-content">
      <p><strong>Nombre:</strong> {{ user.nombre }}</p>
      <p><strong>Identidad:</strong> {{ user.identidad }}</p>
      <p><strong>Teléfono:</strong> {{ user.telefono }}</p> 
      <p><strong>Usuario:</strong> {{ user.usuario }}</p>
      <p><strong>Clave:</strong> ********</p>
      <p><strong>Email:</strong> {{ user.email }}</p> 
      <p><strong>Fecha de Nacimiento:</strong> {{ user.fecha_nacimiento }}</p>
      <p><strong>Ciudad:</strong> {{ user.ciudad }}</p> 
     </div>
  </div>
</div>

<!-- Direcciones -->
<div class="grid-item"> 
  <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
    <h3 class="card-title">📍 Mis Direcciones</h3>
    <button class="add-address-button" @click="openAddressModal">➕ Agregar Dirección</button>
  </div>
  <div class="card-content">
    <div v-for="address in user.addresses" :key="address.id" class="address-item">
      <div class="address-info">
        <p>
          <strong>{{ address.name }}</strong> - {{ address.address }}
          <span v-if="address.isPrimary" class="primary-icon">⭐</span> <!-- Ícono de dirección principal -->
        </p>
        <div class="address-actions"> 
          <!-- Ícono de editar -->
          <button class="edit-button" @click="editAddress(address)">
            <Pencil :size="20" color="#666" />
          </button>
          <!-- Ícono de borrar -->
          <button class="delete-button" @click="deleteAddress(address.id)">
            <Trash2 :size="20" color="#666" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      <!-- Soporte -->
      <div class="grid-item">
        <div class="card">
          <h3 class="card-title">🛠️ Soporte</h3>
          <div class="card-content">
            <button class="support-button" @click="openSupportModal">
              <span class="support-icon">📞</span>
              <p>Contactar Soporte</p>
            </button>
            <button class="support-button" @click="openFaqModal">
              <span class="support-icon">❓</span>
              <p>Preguntas Frecuentes</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Información Legal -->
      <div class="grid-item">
        <div class="card">
          <h3 class="card-title">⚖️ Información Legal</h3>
          <div class="card-content">
            <button class="legal-button" @click="openTermsModal">
              <span class="legal-icon">📜</span>
              <p>Términos y Condiciones</p>
            </button>
            <button class="legal-button" @click="openPrivacyModal">
              <span class="legal-icon">🔒</span>
              <p>Política de Privacidad</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Idioma -->
      <div class="grid-item">
        <div class="card">
          <h3 class="card-title">🌐 Idioma</h3>
          <div class="card-content">
            <select v-model="selectedLanguage" class="language-select">
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Cerrar Sesión -->
      <div class="grid-item">
        <div class="card">
          <h3 class="card-title">🚪 Cerrar Sesión</h3>
          <div class="card-content">
            <button class="logout-button" @click="logout">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </div>

<!-- Modal para Editar Perfil -->
<div v-if="isProfileModalOpen" class="modal-overlay">
  <div class="modal-content">
    <h2>Editar Perfil</h2>
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="user.nombre" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" required>
      </div>
      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" v-model="user.telefono" required>
      </div>
      <div class="form-group">
        <label for="imagen_perfil">Imagen de Perfil (URL):</label>
        <input type="url" id="imagen_perfil" v-model="user.imagen_perfil" required>
      </div>
      <div class="form-group">
        <label for="ciudad">Ciudad:</label>
        <select id="ciudad" v-model="user.ciudad" required>
          <option value="" disabled>Selecciona una ciudad</option>
          <option v-for="ciudad in ciudades" :key="ciudad.id" :value="ciudad.nombre">
            {{ ciudad.nombre }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-button" @click="closeProfileModal">Cancelar</button>
        <button type="submit" class="save-button">Guardar Cambios</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal para Agregar/Editar Dirección -->
<div v-if="isAddressModalOpen" class="modal-overlay">
  <div class="modal-content">
    <h2>{{ isEditingAddress ? 'Editar Dirección' : 'Agregar Dirección' }}</h2>
    <form @submit.prevent="saveAddress">
      <div class="form-group">
        <label for="address-name">Nombre:</label>
        <input type="text" id="address-name" v-model="currentAddress.name" required>
      </div>
      <div class="form-group">
        <label for="address-details">Dirección:</label>
        <textarea id="address-details" v-model="currentAddress.address" required></textarea>
      </div>
        <label>
          <input type="checkbox" v-model="currentAddress.isPrimary"> Marcar como dirección principal
        </label>
      <div class="form-actions">
        <button type="button" class="cancel-button" @click="closeAddressModal">Cancelar</button>
        <button type="submit" class="save-button">Guardar</button>
      </div>
    </form>
  </div>
</div></div>

    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center">
          <HomeIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Inicio</span>
        </div>
        <div class="flex flex-col items-center">
          <HeartIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Favoritos</span>
        </div>
        <div class="flex flex-col items-center relative">
          <div class="bg-blue-600 rounded-full p-2">
            <ShoppingCartIcon class="text-white" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Carrito</span>
        </div>
        <div class="flex flex-col items-center">
          <ShoppingBagIcon class="text-blue-600" :size="20" />
          <span class="text-xs text-blue-600 mt-1">Pedidos</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="cursor-pointer">
            <SettingsIcon class="text-blue-600" :size="20" />
          </div>
          <span class="text-xs text-blue-600 mt-1">Configuración</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Star, 
  Pencil,
  Trash2 
} from 'lucide-vue-next';

// Estado del modal de notificaciones
const isModalOpen = ref(false);

// Datos de notificaciones en formato JSON (simulando una base de datos)
const notifications = ref([
  {
    id: 1,
    message: "Tu pedido ha sido enviado.",
    read: false,
  },
  {
    id: 2,
    message: "Nuevo descuento disponible.",
    read: false,
  },
  {
    id: 3,
    message: "Actualización de la app disponible.",
    read: true,
  },
]);

// Computed para obtener las notificaciones no leídas
const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read);
});

// Función para abrir el modal de notificaciones
const showNotifications = () => {
  isModalOpen.value = true;
};

// Función para cerrar el modal y marcar todas las notificaciones como leídas
const closeNotifications = () => {
  isModalOpen.value = false;
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

// Función para marcar una notificación como leída
const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

// Selector de perfil
const selectedProfile = ref("Cliente");
const user = ref({
  nombre: 'María López',
  email: 'maria.lopez@example.com',
  ciudad: 'Ciudad de México',
  telefono: '+52 55 1234 5678',
  imagen_perfil: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  addresses: [
    { id: 1, name: 'Casa', address: 'Av. Principal 123', isPrimary: true },
    { id: 2, name: 'Trabajo', address: 'Calle Secundaria 456', isPrimary: false },
  ],
});

// Estadísticas
const stats = ref({
  fechaInicio: '01/01/2023',
  totalPedidos: 25,
  ubersTomados: 4,
  mandaditosSolicitados: 2
  
});

// Idioma seleccionado
const selectedLanguage = ref('es');

// Estado del modal de perfil
const isProfileModalOpen = ref(false);

// Estado del modal de dirección
const isAddressModalOpen = ref(false);
const isEditingAddress = ref(false);
const currentAddress = ref({ id: null, name: '', address: '' });

// Métodos
const openProfileModal = () => {
  isProfileModalOpen.value = true;
};

const closeProfileModal = () => {
  isProfileModalOpen.value = false;
};

const saveProfile = () => {
  alert('Perfil actualizado correctamente');
  closeProfileModal();
};

const openAddressModal = (address = null) => {
  if (address) {
    currentAddress.value = { ...address };
    isEditingAddress.value = true;
  } else {
    currentAddress.value = { id: null, name: '', address: '' };
    isEditingAddress.value = false;
  }
  isAddressModalOpen.value = true;
};

const closeAddressModal = () => {
  isAddressModalOpen.value = false;
};

const saveAddress = () => {
  if (isEditingAddress.value) {
    const index = user.value.addresses.findIndex(a => a.id === currentAddress.value.id);
    user.value.addresses[index] = { ...currentAddress.value };
  } else {
    currentAddress.value.id = user.value.addresses.length + 1;
    user.value.addresses.push({ ...currentAddress.value });
  }
  closeAddressModal();
};


const editAddress = (address) => {
  currentAddress.value = { ...address };
  isEditingAddress.value = true;
  isAddressModalOpen.value = true;
};

const deleteAddress = (id) => {
  user.value.addresses = user.value.addresses.filter((a) => a.id !== id);
};

const openSupportModal = () => {
  alert('Abrir modal de soporte');
};

const openFaqModal = () => {
  alert('Abrir modal de preguntas frecuentes');
};

const openTermsModal = () => {
  alert('Abrir modal de términos y condiciones');
};

const openPrivacyModal = () => {
  alert('Abrir modal de política de privacidad');
};

const logout = () => {
  alert('Sesión cerrada');
};
</script>

<style scoped>
/* Estilos base */
.p-4 {
  padding: 1rem; /* Ajusta el padding según sea necesario */
  width: 100%; /* Ocupa el 100% del ancho */
}
.profile-info-section { 
  margin: 0 auto; 
}

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center; /* Center items horizontally */
}

/* Mitad izquierda: Foto, nombre y correo */
.profile-left {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items vertically */
  text-align: center;
}

.profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.profile-details {
  text-align: center;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.profile-email {
  font-size: 1rem;
  color: #666;
  margin-bottom: 15px;
}

.edit-profile-button {
  background-color: #6a11cb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.edit-profile-button:hover {
  background-color: #2575fc;
}

/* Mitad derecha: Estadísticas */
.profile-stats {
  width: 100%;
  text-align: center;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.stats-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  backdrop-filter: blur(5px);
}

.stat-label {
  font-size: 0.9rem;
  color: #fff;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

/* Estilos Responsivos */
@media (min-width: 768px) {
  .profile-header {
    flex-direction: row;
    align-items: flex-start;
    gap: 40px;
  }

  .profile-left {
    flex: 1;
    align-items: center;
    text-align: center;
  }

  .profile-stats {
    flex: 1;
    margin-top: 0;
  }

  .profile-pic {
    width: 150px;
    height: 150px;
  }

  .profile-name {
    font-size: 2rem;
  }

  .profile-email {
    font-size: 1.1rem;
  }

  .edit-profile-button {
    font-size: 1.1rem;
  }
}
/* Sección de Perfil */
.profile-info-section { 
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  align-items: center; /* Centra verticalmente */
  justify-content: center; /* Centra horizontalmente */
  gap: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
}

.profile-pic {
  width: 100px;
  height: 100px; 
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0072ff;
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.profile-email {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

.edit-profile-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-profile-button:hover {
  background: #005bb5;
}

/* Grid de 3 filas y 2 columnas */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-item {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}
.stat-label,
.stat-value {
  display: block; /* Cada span ocupará una línea completa */
}
.card-content {
  font-size: 0.9rem;
  color: #666;
}

/* Estilos específicos para cada sección */
.address-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.delete-button {
  background: #ff4d4d;
}

.edit-button:hover {
  background: #005bb5;
}

.delete-button:hover {
  background: #cc0000;
}


.support-button,
.legal-button {
  background: #fff;
  border: 1px solid #0072ff;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
  margin-bottom: 10px;
}

.support-button:hover,
.legal-button:hover {
  background: #f0f8ff;
}

.language-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
}

.logout-button {
  background: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s ease;
}

.logout-button:hover {
  background: #cc0000;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  background: #ccc;
  color: #333;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cancel-button:hover {
  background: #bbb;
}

.save-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-button:hover {
  background: #005bb5;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.profile-pic-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0072ff;
  margin-top: 5px;
}
.edit-info-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s ease;
}

.edit-info-button:hover {
  background: #005bb5;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #0072ff;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0; /* Ajuste del padding */
}

.edit-info-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-info-button:hover {
  background: #005bb5;
}
.add-address-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-address-button:hover {
  background: #005bb5;
}

.address-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.edit-button,
.delete-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.delete-button {
  background: #ff4d4d;
}

.edit-button:hover {
  background: #005bb5;
}

.delete-button:hover {
  background: #cc0000;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #0072ff;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.primary-label {
  font-size: 0.9rem;
  color: #28a745;
  margin-top: 5px;
}
/* Footer */
header {
  position: fixed;  
  top: 0;  
  left: 0;  
  right: 0;  
  background-color: white;  
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
  z-index: 1000;  
}

footer {
  position: fixed;  
  bottom: 0;  
  left: 0;  
  right: 0;  
  background-color: white;  
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);  
  z-index: 1000;  
}
.min-h-screen {
  width: 100%;    
  margin: 0 auto;  
 padding-top: 60px;  
  padding-bottom: 95px; 
}
/* Estilos para los botones de íconos */
.icon-button,
.edit-button,
.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.icon-button:hover,
.edit-button:hover,
.delete-button:hover {
  opacity: 0.8;
}

/* Estilos para el ícono de dirección principal */
.primary-icon {
  color: gold;
  margin-left: 5px;
}

/* Estilos para el botón de agregar dirección */
.add-address-button {
  background: #0072ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-address-button:hover {
  background: #005bb5;
}
.form-group select {
  width: 100%; /* Igualar el ancho a 100% para que coincida con los inputs */
  padding: 10px; /* Añadir padding para un mejor aspecto */
  border: 1px solid #ccc; /* Estilo del borde */
  border-radius: 4px; /* Bordes redondeados */
  font-size: 1rem; /* Tamaño de fuente */
}
/* Estilo para los inputs y el selector */
.form-group input,
.form-group select {
  width: 100%; /* Igualar el ancho a 100% */
  padding: 10px; /* Añadir padding para un mejor aspecto */
  border: 1px solid #007BFF; /* Borde azul */
  border-radius: 4px; /* Bordes redondeados */
  font-size: 1rem; /* Tamaño de fuente */
  color: #333; /* Color del texto */
}

/* Color de fondo de los inputs */
.form-group input:focus,
.form-group select:focus {
  border-color: #0056b3; /* Color de borde al enfocar (darker blue) */
  outline: none; /* Sin outline por defecto */
}

/* Color de fondo */
.form-group input,
.form-group select {
  background-color: #e7f0ff; /* Fondo azul claro */
}
</style>

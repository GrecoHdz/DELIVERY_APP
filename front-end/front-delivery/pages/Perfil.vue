
<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
     <!-- Header -->
     <HeaderComponent />

    <!-- Modal de Notificaciones (mantenido igual) -->
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

    <!-- Nuevo selector Data Source (Mock/API) -->
    <div class="data-source-selector">
      <div class="toggle-container">
        <span class="source-label" :class="{ active: !useApiData }">Datos Mock</span>
        <div class="toggle-switch">
          <input type="checkbox" id="dataSourceToggle" v-model="useApiData">
          <label for="dataSourceToggle" class="toggle-slider"></label>
        </div>
        <span class="source-label" :class="{ active: useApiData }">API</span>
      </div>
      <div class="api-status" v-if="useApiData">
        <span :class="{ 'text-green-500': apiConnected, 'text-red-500': !apiConnected }">
          {{ apiConnected ? 'Conectado' : 'Desconectado' }}
        </span>
      </div>
    </div>

    <!-- Contenido Principal (Rediseñado) -->
    <div class="p-4 w-full">
      <!-- Perfil Usuario -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <img :src="user.imagen_perfil" alt="Imagen de perfil" class="avatar-img">
            <button class="edit-avatar-btn" @click="openProfileModal">
              <EditIcon size="18" />
            </button>
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ user.nombre }}</h2>
            <p class="profile-email">{{ user.email }}</p>
            <p class="profile-location">
              <MapPinIcon size="16" class="location-icon" />
              {{ user.ciudad }}
            </p>
          </div>
          <div class="profile-actions">
            <button class="edit-profile-btn" @click="openProfileModal">
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard de Estadísticas -->
      <div class="stats-dashboard">
        <h3 class="dashboard-title">
          <ActivityIcon size="20" />
          Resumen de Actividad
          <div v-if="dataLoading" class="loading-indicator">
            <LoaderIcon size="18" class="animate-spin" />
          </div>
        </h3>
        
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon">
              <ShoppingCartIcon size="24" />
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ statistics.pedidos }}</p>
              <p class="stat-label">Pedidos</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <CarIcon size="24" />
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ statistics.ubers }}</p>
              <p class="stat-label">Ubers</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <PackageIcon size="24" />
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ statistics.mandaditos }}</p>
              <p class="stat-label">Mandaditos</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <CalendarIcon size="24" />
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ formatDate(user.fecha_registro) }}</p>
              <p class="stat-label">Desde</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs-header">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'personal' }"
            @click="activeTab = 'personal'"
          >
            <UserIcon size="18" />
            Datos Personales
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'direcciones' }"
            @click="activeTab = 'direcciones'"
          >
            <MapPinIcon size="18" />
            Direcciones
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'preferencias' }"
            @click="activeTab = 'preferencias'"
          >
            <SettingsIcon size="18" />
            Preferencias
          </button>
        </div>

        <!-- Contenido de las tabs -->
        <div class="tab-content">
          <!-- Tab: Datos Personales -->
          <div v-if="activeTab === 'personal'" class="personal-info-tab">
            <div class="info-grid">
              <div class="info-item">
                <p class="info-label">Nombre</p>
                <p class="info-value">{{ user.nombre }}</p>
              </div>
              <div class="info-item">
                <p class="info-label">Identidad</p>
                <p class="info-value">{{ user.identidad }}</p>
              </div>
              <div class="info-item">
                <p class="info-label">Teléfono</p>
                <p class="info-value">{{ user.telefono }}</p>
              </div>
              <div class="info-item">
                <p class="info-label">Usuario</p>
                <p class="info-value">{{ user.usuario }}</p>
              </div>
              <div class="info-item">
                <p class="info-label">Clave</p>
                <p class="info-value">********</p>
              </div>
              <div class="info-item">
                <p class="info-label">Email</p>
                <p class="info-value">{{ user.email }}</p>
              </div>
              <div class="info-item">
                <p class="info-label">Fecha de Nacimiento</p>
                <p class="info-value">{{ user.fecha_nacimiento }}</p>
              </div>
              <div class="info-item">
                <p class="info-label">Ciudad</p>
                <p class="info-value">{{ user.ciudad }}</p>
              </div>
            </div>
          </div>

          <!-- Tab: Direcciones -->
          <div v-if="activeTab === 'direcciones'" class="direcciones-tab">
            <div class="direcciones-header">
              <h3>Mis direcciones guardadas</h3>
              <button class="add-direccion-btn" @click="openAddressModal()">
                <PlusIcon size="18" />
                Añadir
              </button>
            </div>
            
            <div class="direcciones-list">
              <div v-for="address in user.addresses" :key="address.id" class="direccion-card">
                <div class="direccion-info">
                  <div class="direccion-header">
                    <h4>{{ address.name }}</h4>
                    <span v-if="address.isPrimary" class="primary-badge">Principal</span>
                  </div>
                  <p class="direccion-text">{{ address.address }}</p>
                </div>
                <div class="direccion-actions">
                  <button class="action-btn edit" @click="editAddress(address)" title="Editar">
                    <PencilIcon size="18" />
                  </button>
                  <button class="action-btn delete" @click="deleteAddress(address.id)" title="Eliminar">
                    <TrashIcon size="18" />
                  </button>
                </div>
              </div>
              
              <div v-if="user.addresses.length === 0" class="empty-state">
                <MapPinIcon size="32" />
                <p>No tienes direcciones guardadas</p>
              </div>
            </div>
          </div>

          <!-- Tab: Preferencias -->
          <div v-if="activeTab === 'preferencias'" class="preferencias-tab">
            <div class="preferencias-section">
              <h3>Preferencias generales</h3>
              
              <div class="preferencia-item">
                <div class="preferencia-info">
                  <GlobeIcon size="20" />
                  <span>Idioma</span>
                </div>
                <select v-model="selectedLanguage" class="preferencia-select">
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="fr">Francés</option>
                </select>
              </div>
              
              <div class="preferencia-item">
                <div class="preferencia-info">
                  <BellIcon size="20" />
                  <span>Notificaciones</span>
                </div>
                <div class="toggle-switch small">
                  <input type="checkbox" id="notificationsToggle" v-model="notificationsEnabled">
                  <label for="notificationsToggle" class="toggle-slider"></label>
                </div>
              </div>
              
              <div class="preferencia-item">
                <div class="preferencia-info">
                  <LockIcon size="20" />
                  <span>Privacidad</span>
                </div>
                <button class="preferencia-btn" @click="openPrivacyModal">Ver política</button>
              </div>
              
              <div class="preferencia-item">
                <div class="preferencia-info">
                  <FileTextIcon size="20" />
                  <span>Términos</span>
                </div>
                <button class="preferencia-btn" @click="openTermsModal">Ver términos</button>
              </div>
              
              <div class="preferencia-item">
                <div class="preferencia-info">
                  <HelpCircleIcon size="20" />
                  <span>Ayuda</span>
                </div>
                <button class="preferencia-btn" @click="openSupportModal">Contactar</button>
              </div>
              
              <div class="preferencia-item logout">
                <button class="logout-btn" @click="logout">
                  <LogOutIcon size="18" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <!-- Modal para Editar Perfil -->
    <div v-if="isProfileModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar Perfil</h2>
          <button class="modal-close" @click="closeProfileModal">×</button>
        </div>
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
          <div class="form-group">
            <label for="clave">Clave:</label>
            <input type="password" id="clave" v-model="user.clave" required>
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
        <div class="modal-header">
          <h2>{{ isEditingAddress ? 'Editar Dirección' : 'Agregar Dirección' }}</h2>
          <button class="modal-close" @click="closeAddressModal">×</button>
        </div>
        <form @submit.prevent="saveAddress">
          <div class="form-group">
            <label for="address-name">Nombre:</label>
            <input type="text" id="address-name" v-model="currentAddress.name" required>
          </div>
          <div class="form-group">
            <label for="address-details">Dirección:</label>
            <textarea id="address-details" v-model="currentAddress.address" required></textarea>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="primary-address" v-model="currentAddress.isPrimary">
            <label for="primary-address">Marcar como dirección principal</label>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="closeAddressModal">Cancelar</button>
            <button type="submit" class="save-button">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  MapPin as MapPinIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Plus as PlusIcon,
  Activity as ActivityIcon,
  Package as PackageIcon,
  Calendar as CalendarIcon,
  Car as CarIcon,
  Globe as GlobeIcon,
  Lock as LockIcon,
  FileText as FileTextIcon,
  HelpCircle as HelpCircleIcon,
  LogOut as LogOutIcon,
  Loader as LoaderIcon, 
} from 'lucide-vue-next';

// Estado para seleccionar fuente de datos (Mock/API)
const useApiData = ref(false);
const apiConnected = ref(false);
const dataLoading = ref(false);

// Estado de la aplicación
const activeTab = ref('personal');
const isModalOpen = ref(false); 
const selectedLanguage = ref('es');
const notificationsEnabled = ref(true);

// Dirección actualmente editando
const isAddressModalOpen = ref(false);
const isEditingAddress = ref(false);
const currentAddress = ref({ id: null, name: '', address: '', isPrimary: false });

// Estado del modal de perfil
const isProfileModalOpen = ref(false);
const id_cliente = ref(18);

// Mock de ciudades
const ciudades = ref([
  { id: 1, nombre: 'Ciudad de México' },
  { id: 2, nombre: 'Guadalajara' },
  { id: 3, nombre: 'Monterrey' },
  { id: 4, nombre: 'Puebla' },
  { id: 5, nombre: 'Tijuana' }
]);
 
 
// Datos mock del usuario
const user = ref({
  nombre: 'María López',
  email: 'maria.lopez@example.com',
  ciudad: 'Ciudad de México',
  telefono: '+52 55 1234 5678',
  imagen_perfil: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  identidad: 'ABC123456789',
  usuario: 'marialopez',
  fecha_nacimiento: '15/05/1990',
  fecha_registro: '01/01/2025',
  addresses: [
    { id: 1, name: 'Casa', address: 'Av. Principal 123', isPrimary: true },
    { id: 2, name: 'Trabajo', address: 'Calle Secundaria 456', isPrimary: false },
  ],
});

// Mock data para estadísticas
const mockStatistics = {
  pedidos: 25,
  ubers: 4,
  mandaditos: 2
};

// Datos de estadísticas que pueden venir de API o mock
const statistics = ref({...mockStatistics});
const stats = ref({ 
  totalPedidos: 25,
  ubersTomados: 4,
  mandaditosSolicitados: 2
});

// Lógica para cargar datos desde API
const fetchDataFromApi = async () => {
  if (!useApiData.value) return;

  dataLoading.value = true;

  try {
    const response = await fetch(`http://localhost:4000/estadisticas/${id_cliente.value}`);
    
    if (!response.ok) {
      throw new Error('Error al conectar con la API');
    }
    
    const data = await response.json();
    console.log('Datos recibidos del backend:', data);
    
    // Si es un objeto (no un array)
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Asigna los datos directamente
      statistics.value = data;
      console.log('Estadísticas actualizadas:', statistics.value);
      
      // Actualiza también stats
      stats.value.totalPedidos = data.pedidos;
      stats.value.ubersTomados = data.ubers;
      stats.value.mandaditosSolicitados = data.mandaditos;
    } 
    // Si es un array
    else if (Array.isArray(data) && data.length > 0) {
      statistics.value = data[0]; 
      
      // Actualiza stats desde el primer elemento del array
      stats.value.totalPedidos = data[0].pedidos;
      stats.value.ubersTomados = data[0].ubers;
      stats.value.mandaditosSolicitados = data[0].mandaditos;
    } else {
      console.warn('Formato de datos no reconocido o datos vacíos:', data);
      statistics.value = { ...mockStatistics };
    }

    apiConnected.value = true;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    apiConnected.value = false;

    // En caso de error, volver a datos mock
    statistics.value = { ...mockStatistics };
  } finally {
    dataLoading.value = false;
  }
};
// Función para obtener datos del cliente desde la API
const fetchUserData = async () => {
  if (!useApiData.value) return;
  
  try {
    const response = await fetch(`http://localhost:4000/clientes/${id_cliente.value}`);
    
    if (!response.ok) {
      throw new Error('Error al conectar con la API de clientes');
    }
    
    const clienteData = await response.json();
    console.log('Datos del cliente recibidos:', clienteData);
    
    // Actualizar el objeto user con los datos recibidos
    if (clienteData) {
      // Mantener la estructura existente pero actualizar con datos de la API
      user.value = {
        ...user.value,
        nombre: clienteData.nombre,
        identidad: clienteData.identidad,
        telefono: clienteData.telefono,
        // Suponiendo que estos campos provienen de la tabla usuarios asociada
        email: clienteData.Usuario?.email || user.value.email,
        usuario: clienteData.Usuario?.nombre_usuario || user.value.usuario,
        fecha_nacimiento: formatDate(clienteData.fecha_nacimiento) || user.value.fecha_nacimiento,
        ciudad: clienteData.Ciudad?.nombre || user.value.ciudad,
        // Mantener campos que no cambiarán
        imagen_perfil: user.value.imagen_perfil,
        fecha_registro: clienteData.fecha_registro
      };
    }
    
    apiConnected.value = true;
  } catch (error) {
    console.error('Error al obtener datos del cliente:', error);
    apiConnected.value = false;
  }
};

// Función para obtener direcciones del cliente desde la API
const fetchUserAddresses = async () => {
  if (!useApiData.value) return;
  
  try {
    const response = await fetch(`http://localhost:4000/direccionesclientes/${id_cliente.value}`);
    
    if (!response.ok) {
      throw new Error('Error al conectar con la API de direcciones');
    }
    
    const direccionesData = await response.json();
    console.log('Direcciones recibidas:', direccionesData);
    
    if (Array.isArray(direccionesData) && direccionesData.length > 0) {
      // Transformar el formato de las direcciones para que coincida con el formato actual
      const transformedAddresses = direccionesData.map(dir => ({
        id: dir.id_direccion_cliente,
        name: dir.alias_direccion,
        address: `${dir.colonia}, ${dir.direccion_precisa}`,
        isPrimary: dir.principal === 1 // Asumiendo que tienes una columna "principal" que es 1 o 0
      }));
      
      user.value.addresses = transformedAddresses;
    } else {
      // Si no hay direcciones, mostrar un array vacío
      user.value.addresses = [];
    }
    
  } catch (error) {
    console.error('Error al obtener direcciones del cliente:', error);
  }
};

// Función auxiliar para formatear fechas (YYYY-MM-DD a DD/MM/YYYY)
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Si no es una fecha válida, devolver el string original
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};
// Observar cambios en la fuente de datos
watch(useApiData, (newValue) => {
  if (newValue) {
    fetchDataFromApi();
    fetchUserData();
    fetchUserAddresses();
  } else {
    // Volver a datos mock
    statistics.value = {...mockStatistics};
    apiConnected.value = false;
  }
});

// Al montar el componente
onMounted(() => {
  // Si por defecto se usa API, cargar los datos
  if (useApiData.value) {
    fetchDataFromApi();
    fetchUserData();
    fetchUserAddresses();
  }
}); 
// Funciones para edición de perfil
const openProfileModal = () => {
  isProfileModalOpen.value = true;
};

const closeProfileModal = () => {
  isProfileModalOpen.value = false;
};

const saveProfile = async () => {
  if (useApiData.value) {
    try {
      // Preparar los datos a enviar
      const profileData = {
        nombre: user.value.nombre,
        telefono: user.value.telefono,
        // Otros campos según tu API
      };
      
      // Realizar la petición PUT/PATCH para actualizar
      const response = await fetch(`http://localhost:4000/clientes/${id_cliente.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar perfil');
      }
      
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      alert('Hubo un error al actualizar el perfil');
    }
  } else {
    // En modo mock, simplemente mostrar confirmación
    alert('Perfil actualizado correctamente (Mock)');
  }
  
  closeProfileModal();
};

const saveAddress = async () => {
  if (useApiData.value) {
    try {
      // Preparar datos de dirección
      const addressData = {
        id_cliente: id_cliente.value,
        alias_direccion: currentAddress.value.name,
        // Extraer colonia y dirección_precisa del campo address
        colonia: currentAddress.value.address.split(',')[0],
        direccion_precisa: currentAddress.value.address.split(',')[1] || '',
        principal: currentAddress.value.isPrimary ? 1 : 0,
        // Otros campos según tu modelo
        id_ciudad: 1, // Valor por defecto o extraído de alguna parte
      };
      
      let response;
      
      if (isEditingAddress.value) {
        // Si estamos editando, hacer PATCH/PUT
        response = await fetch(`http://localhost:4000/direccionesclientes/${currentAddress.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData),
        });
      } else {
        // Si es nueva dirección, hacer POST
        response = await fetch(`http://localhost:4000/direccionesclientes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData),
        });
      }
      
      if (!response.ok) {
        throw new Error('Error al guardar dirección');
      }
      
      // Recargar direcciones
      await fetchUserAddresses();
      
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      alert('Hubo un error al guardar la dirección');
    }
  } else {
    // Comportamiento mock (tu código actual)
    if (isEditingAddress.value) {
      const index = user.value.addresses.findIndex(a => a.id === currentAddress.value.id);
      
      if (currentAddress.value.isPrimary) {
        user.value.addresses.forEach(a => {
          a.isPrimary = false;
        });
      }
      
      user.value.addresses[index] = { ...currentAddress.value };
    } else {
      currentAddress.value.id = user.value.addresses.length + 1;
      
      if (currentAddress.value.isPrimary) {
        user.value.addresses.forEach(a => {
          a.isPrimary = false;
        });
      }
      
      user.value.addresses.push({ ...currentAddress.value });
    }
  }
  
  closeAddressModal();
};

// Funciones para manejo de direcciones
const openAddressModal = (address = null) => {
  if (address) {
    currentAddress.value = { ...address };
    isEditingAddress.value = true;
  } else {
    currentAddress.value = { id: null, name: '', address: '', isPrimary: false };
    isEditingAddress.value = false;
  }
  isAddressModalOpen.value = true;
};

const closeAddressModal = () => {
  isAddressModalOpen.value = false;
};


const editAddress = (address) => {
  currentAddress.value = { ...address };
  isEditingAddress.value = true;
  isAddressModalOpen.value = true;
};

const deleteAddress = async (id) => {
  if (useApiData.value) {
    try {
      const response = await fetch(`http://localhost:4000/direccionesclientes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar dirección');
      }
      
      // Recargar direcciones
      await fetchUserAddresses();
      
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      alert('Hubo un error al eliminar la dirección');
    }
  } else {
    // Comportamiento mock
    user.value.addresses = user.value.addresses.filter((a) => a.id !== id);
  }
};

// Funciones para modales de soporte, términos, etc.
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
const router = useRouter();
const cookie = useCookie('token');
const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
/* ESTILOS BASE Y RESPONSIVE */
/* Para mantener header y footer fijos */ 
 .min-h-screen {
  width: 100%;
  margin: 0 auto; 
  padding-bottom: 95px;
}

/* NUEVO SELECTOR DE FUENTE DE DATOS */
.data-source-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  margin: 10px auto 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 300px;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.source-label {
  font-size: 0.9rem;
  color: #666;
  transition: color 0.3s ease;
}

.source-label.active {
  color: #0072ff;
  font-weight: bold;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #0072ff;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-switch.small {
  width: 40px;
  height: 20px;
}

.toggle-switch.small .toggle-slider:before {
  height: 14px;
  width: 14px;
}

.toggle-switch.small input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.api-status {
  margin-left: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* PERFIL DE USUARIO */
.profile-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.profile-avatar {
  position: relative;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0072ff;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #0072ff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.profile-info {
  text-align: center;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.profile-email {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 5px;
}

.profile-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #777;
}

.location-icon {
  color: #0072ff;
}

.profile-actions {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.edit-profile-btn {
  background: #0072ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-profile-btn:hover {
  background: #005bb5;
}

/* DASHBOARD DE ESTADÍSTICAS */
.stats-dashboard {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  justify-content: space-between;
}

.loading-indicator {
  color: #0072ff;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, #f5f7fa, #e4e8f0);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  background: #0072ff;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* TABS */
.tabs-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #eee;
  background: #f8fafc;
}

.tab-button {
  flex: 1;
  padding: 15px;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #0072ff;
  font-weight: 600;
  border-bottom: 3px solid #0072ff;
}

.tab-button:hover:not(.active) {
  background: #f0f4f8;
}

.tab-content {
  padding: 20px;
}

/* Tab: Información Personal */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #0072ff;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 5px 0;
}

.info-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  margin: 0;
}

/* Tab: Direcciones */
.direcciones-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.direcciones-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.add-direccion-btn {
  background: #0072ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-direccion-btn:hover {
  background: #005bb5;
}

.direcciones-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.direccion-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  transition: border-color 0.3s ease;
}

.direccion-card:hover {
  border-color: #0072ff;
}

.direccion-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.direccion-header h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.primary-badge {
  background: #0072ff;
  color: white;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 12px;
}

.direccion-text {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.direccion-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.3s ease;
}

.action-btn.edit:hover {
  background: #e6f0ff;
  color: #0072ff;
}

.action-btn.delete:hover {
  background: #ffe6e6;
  color: #ff4d4d;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #aaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

/* Tab: Preferencias */
.preferencias-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preferencias-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.preferencia-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8fafc;
  border-radius: 10px;
}

.preferencia-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: #2c3e50;
}

.preferencia-select {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #2c3e50;
}

.preferencia-btn {
  background: #f0f4f8;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preferencia-btn:hover {
  background: #e6f0ff;
  color: #0072ff;
  border-color: #0072ff;
}

.preferencia-item.logout {
  margin-top: 10px;
  padding: 0;
  background: transparent;
}

.logout-btn {
  width: 100%;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background: #cc0000;
}

/* MODALES */
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
  border-radius: 15px;
  padding: 0;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  background: #f8fafc;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #2c3e50;
  background: #f8fafc;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #0072ff;
  outline: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.checkbox-group label {
  font-size: 0.95rem;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button {
  background: #f0f4f8;
  color: #2c3e50;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #e6e9ed;
}

.save-button {
  background: #0072ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-button:hover {
  background: #005bb5;
}

/* TRANSICIONES */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (min-width: 768px) {
  .profile-header {
    flex-direction: row;
    justify-content: flex-start;
    gap: 30px;
  }
  
  .profile-info {
    text-align: left;
  }
  
  .profile-location {
    justify-content: flex-start;
  }
  
  .profile-actions {
    justify-content: flex-end;
    margin-top: 0;
    margin-left: auto;
  }
  
  .stats-container {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-header {
    flex-direction: row;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .tab-button {
    white-space: nowrap;
    flex: none;
    padding: 15px 12px;
  }
}
</style>
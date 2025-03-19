<template>
    <div class="container">
      <!-- Contador de pedidos gratis -->
      <div class="order-counter">
        <p>Pedidos gratis restantes esta semana: {{ freeOrdersRemaining }}/5</p>
        <p v-if="freeOrdersRemaining === 0">Costo por pedido extra: $5.00</p>
      </div>
  
      <!-- Sección de membresías -->
      <div class="membership-section">
        <h2>Membresías</h2>
        <div class="membership-cards">
          <div v-for="membership in memberships" :key="membership.name" class="card">
            <h3>{{ membership.name }}</h3>
            <p>{{ membership.description }}</p>
            <p>Precio: {{ membership.price }}</p>
            <button @click="openModal(membership)">Adquirir</button>
          </div>
        </div>
      </div>
  
      <!-- Modal para subir comprobante -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>Subir comprobante de pago</h3>
          <input type="file" @change="handleFileUpload" />
          <button @click="submitPayment">Enviar</button>
        </div>
      </div>
  
      <!-- Sección de estadísticas -->
      <div class="stats-section">
        <h2>Estadísticas</h2>
        <div class="stats">
          <div :class="{ 'opaque': !hasPremiumMembership }">
            <h3>Ventas</h3>
            <p v-if="!hasPremiumMembership">Actualiza tu membresía para acceder a estas estadísticas.</p>
            <div v-else>
              <!-- Gráfico de ventas -->
            </div>
          </div>
          <div :class="{ 'opaque': !hasPremiumMembership }">
            <h3>Productos más vendidos</h3>
            <p v-if="!hasPremiumMembership">Actualiza tu membresía para acceder a estas estadísticas.</p>
            <div v-else>
              <canvas ref="bestSellingChart"></canvas>
            </div>
          </div>
          <div :class="{ 'opaque': !hasPremiumMembership }">
            <h3>Clientes frecuentes</h3>
            <p v-if="!hasPremiumMembership">Actualiza tu membresía para acceder a estas estadísticas.</p>
            <div v-else>
              <!-- Lista de clientes frecuentes -->
            </div>
          </div>
        </div>
      </div>
  
      <!-- Indicación de vencimiento de membresía -->
      <div class="expiration-notice">
        <p>Tu membresía vence el próximo domingo a las 11:59 PM. Renueva ahora para seguir disfrutando de los beneficios.</p>
      </div>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto'; 
  export default {
    data() {
      return {
        freeOrdersRemaining: 3, // Ejemplo: 3 pedidos gratis restantes
        memberships: [
          { name: 'Básica', description: '5 pedidos gratis por semana', price: '$10/mes' },
          { name: 'Premium', description: '10 pedidos gratis por semana + descuentos', price: '$20/mes' },
          { name: 'VIP', description: 'Pedidos ilimitados + estadísticas avanzadas', price: '$30/mes' },
        ],
        showModal: false,
        selectedMembership: null,
        hasPremiumMembership: false, // Cambiar según la membresía del usuario
        bestSellingProducts: [
          { product: 'Producto A', sales: 120 },
          { product: 'Producto B', sales: 90 },
          { product: 'Producto C', sales: 75 },
        ],
      };
    },
    mounted() {
      this.$nextTick(() => {
    this.renderBestSellingChart();
  });
    },
    methods: {
      openModal(membership) {
        this.selectedMembership = membership;
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        console.log('Archivo subido:', file);
      },
      submitPayment() {
        alert('Comprobante enviado. Gracias por adquirir la membresía.');
        this.closeModal();
      },
      renderBestSellingChart() {
        const ctx = this.$refs.bestSellingChart.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.bestSellingProducts.map((p) => p.product),
            datasets: [
              {
                label: 'Ventas',
                data: this.bestSellingProducts.map((p) => p.sales),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .order-counter {
    background: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  
  .membership-section h2,
  .stats-section h2 {
    margin-bottom: 20px;
  }
  
  .membership-cards {
    display: flex;
    gap: 20px;
  }
  
  .card {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex: 1;
  }
  
  button {
    background: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
  }
  
  .close {
    float: right;
    cursor: pointer;
  }
  
  .stats {
    display: flex;
    gap: 20px;
  }
  
  .opaque {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .expiration-notice {
    background: #fff3cd;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
    text-align: center;
  }
  </style>
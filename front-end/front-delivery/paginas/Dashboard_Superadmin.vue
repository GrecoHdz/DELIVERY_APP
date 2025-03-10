<template>
  <div class="app-container" :class="isDarkMode ? 'dark' : ''">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <ShieldIcon :size="24" />
          <span>DeliveryPro Admin</span>
        </div>
        <div class="header-controls">
          <select
            v-model="selectedProfile"
            class="profile-selector"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
          <div class="notification-icon">
            <BellIcon :size="20" />
            <div
              v-if="unreadNotifications.length > 0"
              class="notification-badge"
            >
              {{ unreadNotifications.length }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content with Sidebar and Content Area -->
    <div class="main-layout">
      <!-- Sidebar -->
      <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="sidebar-header">
          <div class="user-info">
            <div class="user-avatar">
              <UserIcon :size="24" />
            </div>
            <div class="user-details">
              <div class="user-name">{{ userData.nombre || 'Administrador' }}</div>
              <div class="user-role">{{ selectedProfile }}</div>
            </div>
          </div>
          <button class="mobile-close-btn" @click="sidebarOpen = false">
            <XIcon :size="20" />
          </button>
        </div>
        
        <div class="sidebar-menu">
          <button 
            @click="activeSection = 'dashboard'" 
            :class="['sidebar-item', activeSection === 'dashboard' ? 'active' : '']"
          >
            <LayoutDashboardIcon :size="20" />
            <span>Dashboard</span>
          </button>
          <button 
            @click="activeSection = 'memberships'" 
            :class="['sidebar-item', activeSection === 'memberships' ? 'active' : '']"
          >
            <BadgeCheckIcon :size="20" />
            <span>Membresías</span>
            <div class="item-badge" v-if="pendingMemberships > 0">{{ pendingMemberships }}</div>
          </button>
          <button 
            @click="activeSection = 'tickets'" 
            :class="['sidebar-item', activeSection === 'tickets' ? 'active' : '']"
          >
            <HeadphonesIcon :size="20" />
            <span>Tickets</span>
            <div class="item-badge" v-if="pendingTickets > 0">{{ pendingTickets }}</div>
          </button>
          <button 
            @click="activeSection = 'complaints'" 
            :class="['sidebar-item', activeSection === 'complaints' ? 'active' : '']"
          >
            <AlertTriangleIcon :size="20" />
            <span>Quejas</span>
            <div class="item-badge" v-if="pendingComplaints > 0">{{ pendingComplaints }}</div>
          </button>
          <button 
            @click="activeSection = 'statistics'" 
            :class="['sidebar-item', activeSection === 'statistics' ? 'active' : '']"
          >
            <BarChartIcon :size="20" />
            <span>Estadísticas</span>
          </button>
          <button 
            @click="activeSection = 'notifications'" 
            :class="['sidebar-item', activeSection === 'notifications' ? 'active' : '']"
          >
            <BellRingIcon :size="20" />
            <span>Notificaciones</span>
          </button>
          <button 
            @click="activeSection = 'users'" 
            :class="['sidebar-item', activeSection === 'users' ? 'active' : '']"
          >
            <UsersIcon :size="20" />
            <span>Usuarios</span>
          </button>
          <button 
            @click="activeSection = 'clients'" 
            :class="['sidebar-item', activeSection === 'clients' ? 'active' : '']"
          >
            <UserIcon :size="20" />
            <span>Clientes</span>
          </button>
          <button 
            @click="activeSection = 'stores'" 
            :class="['sidebar-item', activeSection === 'stores' ? 'active' : '']"
          >
            <StoreIcon :size="20" />
            <span>Locales</span>
          </button>
          <button 
            @click="activeSection = 'drivers'" 
            :class="['sidebar-item', activeSection === 'drivers' ? 'active' : '']"
          >
            <TruckIcon :size="20" />
            <span>Repartidores</span>
          </button>
          <button 
            @click="activeSection = 'orders'" 
            :class="['sidebar-item', activeSection === 'orders' ? 'active' : '']"
          >
            <ShoppingBagIcon :size="20" />
            <span>Pedidos</span>
          </button>
          <button 
            @click="activeSection = 'trips'" 
            :class="['sidebar-item', activeSection === 'trips' ? 'active' : '']"
          >
            <CarIcon :size="20" />
            <span>Viajes</span>
          </button>
          <button 
            @click="activeSection = 'errands'" 
            :class="['sidebar-item', activeSection === 'errands' ? 'active' : '']"
          >
            <PackageIcon :size="20" />
            <span>Mandaditos</span>
          </button>
          <button 
            @click="activeSection = 'payments'" 
            :class="['sidebar-item', activeSection === 'payments' ? 'active' : '']"
          >
            <DollarSignIcon :size="20" />
            <span>Pagos</span>
          </button>
          <button 
            @click="activeSection = 'settings'" 
            :class="['sidebar-item', activeSection === 'settings' ? 'active' : '']"
          >
            <SettingsIcon :size="20" />
            <span>Configuración</span>
          </button>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="content-area">
        <!-- Mobile Header -->
        <div class="mobile-header">
          <button class="mobile-menu-btn" @click="sidebarOpen = true">
            <MenuIcon :size="24" />
          </button>
          <div class="mobile-title">{{ getSectionTitle() }}</div>
          <div class="mobile-actions">
            <button class="mobile-action-btn">
              <BellIcon :size="20" />
              <div class="mobile-badge" v-if="unreadNotifications.length > 0"></div>
            </button>
          </div>
        </div>

        <!-- Dashboard -->
        <div v-if="activeSection === 'dashboard'" class="dashboard-content">
          <div class="section-header">
            <h1 class="section-title">Dashboard</h1>
            <div class="header-actions">
              <div class="date-selector">
                <CalendarIcon :size="16" />
                <span>{{ getCurrentDate() }}</span>
              </div>
              <button class="refresh-btn">
                <RefreshCwIcon :size="16" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
          
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-icon delivery">
                <ShoppingBagIcon :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-title">Pedidos Hoy</div>
                <div class="stat-value">{{ stats.pedidosHoy }}</div>
                <div class="stat-change positive">
                  <TrendingUpIcon :size="16" />
                  <span>+12.5%</span>
                </div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon users">
                <UsersIcon :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-title">Usuarios Nuevos</div>
                <div class="stat-value">{{ stats.usuariosNuevos }}</div>
                <div class="stat-change positive">
                  <TrendingUpIcon :size="16" />
                  <span>+18.3%</span>
                </div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon revenue">
                <DollarSignIcon :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-title">Ingresos</div>
                <div class="stat-value">L {{ stats.ingresos }}</div>
                <div class="stat-change positive">
                  <TrendingUpIcon :size="16" />
                  <span>+5.2%</span>
                </div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon tickets">
                <HeadphonesIcon :size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-title">Tickets Abiertos</div>
                <div class="stat-value">{{ stats.ticketsAbiertos }}</div>
                <div class="stat-change negative">
                  <TrendingDownIcon :size="16" />
                  <span>-2.5%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="dashboard-rows">
            <div class="dashboard-row">
              <div class="chart-container">
                <div class="chart-header">
                  <h2 class="chart-title">Actividad de Pedidos</h2>
                  <div class="chart-controls">
                    <select class="time-range-select" v-model="orderTimeRange">
                      <option value="today">Hoy</option>
                      <option value="week">Esta Semana</option>
                      <option value="month">Este Mes</option>
                    </select>
                  </div>
                </div>
                <div class="chart-content order-activity-chart">
                  <!-- Gráfico de Actividad (simplificado) -->
                  <div class="activity-chart-placeholder">
                    <div class="chart-bars">
                      <div v-for="hour in 12" :key="hour" class="chart-bar-container">
                        <div class="chart-bar" :style="{ height: getRandomHeight() }"></div>
                        <div class="chart-bar-label">{{ hour * 2 }}:00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="quick-actions">
                <h2 class="quick-actions-title">Acciones Rápidas</h2>
                <div class="action-buttons">
                  <button class="action-button" @click="activeSection = 'memberships'">
                    <BadgeCheckIcon :size="18" />
                    <span>Aprobar Membresías</span>
                  </button>
                  <button class="action-button" @click="activeSection = 'tickets'">
                    <HeadphonesIcon :size="18" />
                    <span>Ver Tickets</span>
                  </button>
                  <button class="action-button" @click="activeSection = 'notifications'">
                    <BellRingIcon :size="18" />
                    <span>Enviar Notificación</span>
                  </button>
                  <button class="action-button" @click="activeSection = 'users'">
                    <UsersIcon :size="18" />
                    <span>Gestionar Usuarios</span>
                  </button>
                  <button class="action-button" @click="activeSection = 'statistics'">
                    <BarChartIcon :size="18" />
                    <span>Ver Estadísticas</span>
                  </button>
                  <button class="action-button" @click="activeSection = 'orders'">
                    <ShoppingBagIcon :size="18" />
                    <span>Pedidos Activos</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="dashboard-row">
              <div class="recent-table-container">
                <div class="table-header">
                  <h2 class="table-title">Pedidos Recientes</h2>
                  <button class="view-all-btn" @click="activeSection = 'orders'">
                    <span>Ver Todo</span>
                    <ArrowRightIcon :size="16" />
                  </button>
                </div>
                <div class="table-content">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Repartidor</th>
                        <th>Local</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in recentOrders" :key="order.id_pedido">
                        <td>#{{ order.id_pedido }}</td>
                        <td>{{ order.cliente }}</td>
                        <td>{{ order.driver || 'Sin asignar' }}</td>
                        <td>{{ order.local }}</td>
                        <td>
                          <span :class="['status-badge', getStatusClass(order.estado_pedido)]">
                            {{ formatEstadoPedido(order.estado_pedido) }}
                          </span>
                        </td>
                        <td>{{ formatDate(order.fecha_pedido) }}</td>
                        <td>
                          <div class="row-actions">
                            <button class="row-action view">
                              <EyeIcon :size="16" />
                            </button>
                            <button class="row-action edit">
                              <EditIcon :size="16" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Memberships Section -->
        <div v-if="activeSection === 'memberships'" class="memberships-content">
          <div class="section-header">
            <h1 class="section-title">Aprobación de Membresías</h1>
            <div class="header-actions">
              <select class="filter-select" v-model="membershipType">
                <option value="all">Todos los tipos</option>
                <option value="drivers">Repartidores</option>
                <option value="stores">Locales</option>
              </select>
              <button class="refresh-btn">
                <RefreshCwIcon :size="16" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
          
          <div class="tabs-container">
            <div class="tabs">
              <button 
                @click="activeTab = 'pending'" 
                :class="['tab-button', activeTab === 'pending' ? 'active' : '']"
              >
                Pendientes
                <div class="tab-badge" v-if="pendingMemberships > 0">{{ pendingMemberships }}</div>
              </button>
              <button 
                @click="activeTab = 'approved'" 
                :class="['tab-button', activeTab === 'approved' ? 'active' : '']"
              >
                Aprobadas
              </button>
              <button 
                @click="activeTab = 'rejected'" 
                :class="['tab-button', activeTab === 'rejected' ? 'active' : '']"
              >
                Rechazadas
              </button>
            </div>
          </div>
          
          <!-- Tabla de membresías de locales -->
          <div v-if="membershipType === 'stores' || membershipType === 'all'" class="table-container">
            <h3 class="table-title">Membresías de Locales {{ activeTab === 'pending' ? 'Pendientes' : (activeTab === 'approved' ? 'Aprobadas' : 'Rechazadas') }}</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Local</th>
                  <th>Cliente</th>
                  <th>Membresía</th>
                  <th>Monto</th>
                  <th>Fecha de Solicitud</th>
                  <th>Comprobante</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="membership in filteredStoresMemberships" :key="membership.id_pago">
                  <td>#{{ membership.id_pago }}</td>
                  <td>{{ membership.nombre_local }}</td>
                  <td>{{ membership.nombre_cliente }}</td>
                  <td>{{ membership.nombre_membresia }}</td>
                  <td>L {{ membership.monto }}</td>
                  <td>{{ formatDate(membership.fecha_pago) }}</td>
                  <td>
                    <button class="view-document-btn" @click="viewDocument(membership.deposito_url)">
                      <FileTextIcon :size="16" />
                      <span>Ver</span>
                    </button>
                  </td>
                  <td>
                    <div class="row-actions" v-if="activeTab === 'pending'">
                      <button class="row-action approve" @click="approveMembership(membership.id_pago, 'local')">
                        <CheckIcon :size="16" />
                      </button>
                      <button class="row-action reject" @click="rejectMembership(membership.id_pago, 'local')">
                        <XIcon :size="16" />
                      </button>
                    </div>
                    <div v-else>
                      <span :class="['status-badge', activeTab === 'approved' ? 'success' : 'danger']">
                        {{ activeTab === 'approved' ? 'Aprobada' : 'Rechazada' }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Tabla de membresías de drivers -->
          <div v-if="membershipType === 'drivers' || membershipType === 'all'" class="table-container">
            <h3 class="table-title">Membresías de Repartidores {{ activeTab === 'pending' ? 'Pendientes' : (activeTab === 'approved' ? 'Aprobadas' : 'Rechazadas') }}</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Repartidor</th>
                  <th>Membresía</th>
                  <th>Monto</th>
                  <th>Fecha de Solicitud</th>
                  <th>Comprobante</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="membership in filteredDriversMemberships" :key="membership.id_pago">
                  <td>#{{ membership.id_pago }}</td>
                  <td>{{ membership.nombre_driver }}</td>
                  <td>{{ membership.saldo_solicitado ? `Saldo L ${membership.saldo_solicitado}` : 'Membresía Estándar' }}</td>
                  <td>L {{ membership.monto }}</td>
                  <td>{{ formatDate(membership.fecha_pago) }}</td>
                  <td>
                    <button class="view-document-btn" @click="viewDocument(membership.deposito_url)">
                      <FileTextIcon :size="16" />
                      <span>Ver</span>
                    </button>
                  </td>
                  <td>
                    <div class="row-actions" v-if="activeTab === 'pending'">
                      <button class="row-action approve" @click="approveMembership(membership.id_pago, 'driver')">
                        <CheckIcon :size="16" />
                      </button>
                      <button class="row-action reject" @click="rejectMembership(membership.id_pago, 'driver')">
                        <XIcon :size="16" />
                      </button>
                    </div>
                    <div v-else>
                      <span :class="['status-badge', activeTab === 'approved' ? 'success' : 'danger']">
                        {{ activeTab === 'approved' ? 'Aprobada' : 'Rechazada' }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="(membershipType === 'stores' && filteredStoresMemberships.length === 0) || 
                      (membershipType === 'drivers' && filteredDriversMemberships.length === 0) ||
                      (membershipType === 'all' && filteredStoresMemberships.length === 0 && filteredDriversMemberships.length === 0)" 
               class="empty-state">
            <CheckCircleIcon :size="64" />
            <p>¡No hay solicitudes {{ activeTab === 'pending' ? 'pendientes' : (activeTab === 'approved' ? 'aprobadas' : 'rechazadas') }}!</p>
            <p class="empty-subtitle">{{ activeTab === 'pending' ? 'Todas las solicitudes han sido procesadas' : (activeTab === 'approved' ? 'No hay solicitudes aprobadas' : 'No hay solicitudes rechazadas') }}</p>
          </div>
        </div>

        <!-- Tickets Section -->
        <div v-if="activeSection === 'tickets'" class="tickets-content">
          <div class="section-header">
            <h1 class="section-title">Gestión de Tickets</h1>
            <div class="header-actions">
              <select class="filter-select" v-model="ticketStatus">
                <option value="all">Todos los estados</option>
                <option value="Abierto">Abiertos</option>
                <option value="Procesando">En proceso</option>
                <option value="Cerrado">Cerrados</option>
              </select>
              <button class="refresh-btn">
                <RefreshCwIcon :size="16" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
          
          <div class="tickets-list">
            <div v-for="ticket in filteredTickets" :key="ticket.id_ticket" class="ticket-card">
              <div class="ticket-header">
                <div class="ticket-id">#{{ ticket.id_ticket }}</div>
                <div :class="['ticket-status', getTicketStatusClass(ticket.estado)]">{{ ticket.estado }}</div>
              </div>
              
              <div class="ticket-title">{{ ticket.asunto }}</div>
              
              <div class="ticket-info">
                <div class="info-col">
                  <div class="info-label">Cliente:</div>
                  <div class="user-info">
                    <div class="user-avatar small">
                      <UserIcon :size="16" />
                    </div>
                    <span>{{ ticket.nombre_cliente }}</span>
                  </div>
                </div>
                <div class="info-col">
                  <div class="info-label">Creado:</div>
                  <div class="ticket-date">{{ formatDate(ticket.fecha_creacion) }}</div>
                </div>
                <div class="info-col" v-if="ticket.fecha_cierre">
                  <div class="info-label">Cerrado:</div>
                  <div class="ticket-date">{{ formatDate(ticket.fecha_cierre) }}</div>
                </div>
              </div>
              
              <div class="ticket-message">
                {{ ticket.descripcion }}
              </div>
              
              <div class="ticket-actions">
                <button class="ticket-action view-ticket" @click="viewTicketDetails(ticket.id_ticket)">
                  <MessageSquareIcon :size="16" />
                  <span>Ver detalles</span>
                </button>
                <button 
                  v-if="ticket.estado === 'Abierto'" 
                  class="ticket-action process-ticket"
                  @click="updateTicketStatus(ticket.id_ticket, 'Procesando')"
                >
                  <ClockIcon :size="16" />
                  <span>Marcar como en proceso</span>
                </button>
                <button 
                  v-if="ticket.estado === 'Procesando'" 
                  class="ticket-action solve-ticket"
                  @click="updateTicketStatus(ticket.id_ticket, 'Cerrado')"
                >
                  <CheckCircleIcon :size="16" />
                  <span>Marcar como cerrado</span>
                </button>
                <button 
                  v-if="ticket.imagen_url" 
                  class="ticket-action view-image"
                  @click="viewDocument(ticket.imagen_url)"
                >
                  <ImageIcon :size="16" />
                  <span>Ver imagen</span>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredTickets.length === 0" class="empty-state">
            <CheckCircleIcon :size="64" />
            <p>¡No hay tickets {{ ticketStatus !== 'all' ? 'en estado ' + ticketStatus.toLowerCase() : '' }}!</p>
            <p class="empty-subtitle">Todos los tickets han sido procesados</p>
          </div>
        </div>

        <!-- Complaints Section -->
        <div v-if="activeSection === 'complaints'" class="complaints-content">
          <div class="section-header">
            <h1 class="section-title">Gestión de Quejas</h1>
            <div class="header-actions">
              <select class="filter-select" v-model="complaintType">
                <option value="all">Todos los tipos</option>
                <option value="driver">Quejas de repartidores</option>
                <option value="local">Quejas de locales</option>
                <option value="uber">Quejas de viajes</option>
                <option value="client">Quejas de clientes</option>
              </select>
              <button class="refresh-btn">
                <RefreshCwIcon :size="16" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
          
          <div class="tabs-container">
            <div class="tabs">
              <button 
                @click="complaintType = 'driver'" 
                :class="['tab-button', complaintType === 'driver' ? 'active' : '']"
              >
                Repartidores
                <div class="tab-badge" v-if="driverComplaints.length > 0">{{ driverComplaints.length }}</div>
              </button>
              <button 
                @click="complaintType = 'local'" 
                :class="['tab-button', complaintType === 'local' ? 'active' : '']"
              >
                Locales
                <div class="tab-badge" v-if="storeComplaints.length > 0">{{ storeComplaints.length }}</div>
              </button>
              <button 
                @click="complaintType = 'uber'" 
                :class="['tab-button', complaintType === 'uber' ? 'active' : '']"
              >
                Viajes
                <div class="tab-badge" v-if="uberComplaints.length > 0">{{ uberComplaints.length }}</div>
              </button>
              <button 
                @click="complaintType = 'client'" 
                :class="['tab-button', complaintType === 'client' ? 'active' : '']"
              >
                Clientes
                <div class="tab-badge" v-if="clientComplaints.length > 0">{{ clientComplaints.length }}</div>
              </button>
            </div>
          </div>
          
          <!-- Quejas contra repartidores -->
          <div v-if="complaintType === 'driver' || complaintType === 'all'" class="complaints-container">
            <h3 class="section-subtitle">Quejas contra Repartidores</h3>
            <div class="complaints-list">
              <div v-for="complaint in driverComplaints" :key="`driver-${complaint.id_queja}`" class="complaint-card">
                <div class="complaint-header">
                  <div class="complaint-id">#{{ complaint.id_queja }}</div>
                  <div class="complaint-date">{{ formatDate(complaint.fecha) }}</div>
                </div>
                
                <div class="complaint-parties">
                  <div class="complaint-by">
                    <span class="label">Cliente:</span>
                    <div class="user-info">
                      <div class="user-avatar small">
                        <UserIcon :size="16" />
                      </div>
                      <span>{{ complaint.nombre_cliente }}</span>
                    </div>
                  </div>
                  
                  <div class="complaint-against">
                    <span class="label">Repartidor:</span>
                    <div class="user-info">
                      <div class="user-avatar small driver">
                        <TruckIcon :size="16" />
                      </div>
                      <span>{{ complaint.nombre_driver }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="complaint-info">
                  <div class="info-row" v-if="complaint.id_pedido">
                    <div class="info-label">Pedido:</div>
                    <div class="info-value">#{{ complaint.id_pedido }}</div>
                  </div>
                </div>
                
                <div class="complaint-message">
                  {{ complaint.comentario }}
                </div>
                
                <div class="complaint-actions">
                  <button v-if="complaint.imagen_url" class="action-button" @click="viewDocument(complaint.imagen_url)">
                    <ImageIcon :size="16" />
                    <span>Ver evidencia</span>
                  </button>
                  <button class="action-button contact-client" @click="contactUser(complaint.id_cliente)">
                    <PhoneIcon :size="16" />
                    <span>Contactar cliente</span>
                  </button>
                  <button class="action-button contact-driver" @click="contactDriver(complaint.id_driver)">
                    <PhoneIcon :size="16" />
                    <span>Contactar repartidor</span>
                  </button>
                  <button class="action-button warn-driver" @click="warnDriver(complaint.id_driver)">
                    <AlertTriangleIcon :size="16" />
                    <span>Advertir repartidor</span>
                  </button>
                </div>
              </div>
              
              <div v-if="driverComplaints.length === 0" class="empty-state">
                <CheckCircleIcon :size="64" />
                <p>No hay quejas contra repartidores</p>
              </div>
            </div>
          </div>
          
          <!-- Quejas contra locales -->
          <div v-if="complaintType === 'local' || complaintType === 'all'" class="complaints-container">
            <h3 class="section-subtitle">Quejas contra Locales</h3>
            <div class="complaints-list">
              <div v-for="complaint in storeComplaints" :key="`local-${complaint.id_queja}`" class="complaint-card">
                <div class="complaint-header">
                  <div class="complaint-id">#{{ complaint.id_queja }}</div>
                  <div class="complaint-date">{{ formatDate(complaint.fecha) }}</div>
                </div>
                
                <div class="complaint-parties">
                  <div class="complaint-by">
                    <span class="label">Cliente:</span>
                    <div class="user-info">
                      <div class="user-avatar small">
                        <UserIcon :size="16" />
                      </div>
                      <span>{{ complaint.nombre_cliente }}</span>
                    </div>
                  </div>
                  
                  <div class="complaint-against">
                    <span class="label">Local:</span>
                    <div class="user-info">
                      <div class="user-avatar small store">
                        <StoreIcon :size="16" />
                      </div>
                      <span>{{ complaint.nombre_local }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="complaint-info">
                  <div class="info-row">
                    <div class="info-label">Pedido:</div>
                    <div class="info-value">#{{ complaint.id_pedido }}</div>
                  </div>
                </div>
                
                <div class="complaint-message">
                  {{ complaint.comentario }}
                </div>
                
                <div class="complaint-actions">
                  <button v-if="complaint.imagen_url" class="action-button" @click="viewDocument(complaint.imagen_url)">
                    <ImageIcon :size="16" />
                    <span>Ver evidencia</span>
                  </button>
                  <button class="action-button contact-client" @click="contactUser(complaint.id_cliente)">
                    <PhoneIcon :size="16" />
                    <span>Contactar cliente</span>
                  </button>
                  <button class="action-button contact-store" @click="contactStore(complaint.id_local)">
                    <PhoneIcon :size="16" />
                    <span>Contactar local</span>
                  </button>
                  <button class="action-button warn-store" @click="warnStore(complaint.id_local)">
                    <AlertTriangleIcon :size="16" />
                    <span>Advertir local</span>
                  </button>
                </div>
              </div>
              
              <div v-if="storeComplaints.length === 0" class="empty-state">
                <CheckCircleIcon :size="64" />
                <p>No hay quejas contra locales</p>
              </div>
            </div>
          </div>
          
          <!-- Aquí se añadirían las otras secciones para Quejas de Viajes y Quejas de Clientes -->
          
          <div v-if="complaintType === 'all' && driverComplaints.length === 0 && storeComplaints.length === 0 && uberComplaints.length === 0 && clientComplaints.length === 0" class="empty-state">
            <CheckCircleIcon :size="64" />
            <p>¡No hay quejas pendientes!</p>
            <p class="empty-subtitle">Todas las quejas han sido procesadas</p>
          </div>
        </div>

        <!-- Statistics Section -->
        <div v-if="activeSection === 'statistics'" class="statistics-content">
          <div class="section-header">
            <h1 class="section-title">Estadísticas</h1>
            <div class="header-actions">
              <div class="date-range-picker">
                <CalendarIcon :size="16" />
                <span>{{ dateRange.start }} - {{ dateRange.end }}</span>
                <ChevronDownIcon :size="16" />
              </div>
              <button class="export-btn">
                <DownloadIcon :size="16" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
          
          <div class="stats-tabs">
            <button 
              @click="activeStatsTab = 'orders'" 
              :class="['stats-tab', activeStatsTab === 'orders' ? 'active' : '']"
            >
              <ShoppingBagIcon :size="16" />
              <span>Pedidos</span>
            </button>
            <button 
              @click="activeStatsTab = 'users'" 
              :class="['stats-tab', activeStatsTab === 'users' ? 'active' : '']"
            >
              <UsersIcon :size="16" />
              <span>Usuarios</span>
            </button>
            <button 
              @click="activeStatsTab = 'revenue'" 
              :class="['stats-tab', activeStatsTab === 'revenue' ? 'active' : '']"
            >
              <DollarSignIcon :size="16" />
              <span>Ingresos</span>
            </button>
            <button 
              @click="activeStatsTab = 'stores'" 
              :class="['stats-tab', activeStatsTab === 'stores' ? 'active' : '']"
            >
              <StoreIcon :size="16" />
              <span>Locales</span>
            </button>
            <button 
              @click="activeStatsTab = 'drivers'" 
              :class="['stats-tab', activeStatsTab === 'drivers' ? 'active' : '']"
            >
              <TruckIcon :size="16" />
              <span>Repartidores</span>
            </button>
          </div>
          
          <!-- Orders Stats -->
          <div v-if="activeStatsTab === 'orders'" class="stats-panel">
            <div class="stats-highlights">
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.totalPedidos }}</div>
                <div class="highlight-label">Pedidos Totales</div>
                <div class="highlight-change positive">
                  <TrendingUpIcon :size="14" />
                  <span>+15.2% vs mes anterior</span>
                </div>
              </div>
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.tasaCompletados }}%</div>
                <div class="highlight-label">Tasa de Completados</div>
                <div class="highlight-change positive">
                  <TrendingUpIcon :size="14" />
                  <span>+2.8% vs mes anterior</span>
                </div>
              </div>
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.tiempoPromedio }} min</div>
                <div class="highlight-label">Tiempo Promedio de Entrega</div>
                <div class="highlight-change negative">
                  <TrendingDownIcon :size="14" />
                  <span>-4.2% vs mes anterior</span>
                </div>
              </div>
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.pedidosDiarios }}</div>
                <div class="highlight-label">Pedidos Diarios (Promedio)</div>
                <div class="highlight-change positive">
                  <TrendingUpIcon :size="14" />
                  <span>+12.7% vs mes anterior</span>
                </div>
              </div>
            </div>
            
            <div class="stats-charts">
              <div class="stats-chart">
                <div class="chart-header">
                  <h3 class="chart-title">Volumen de Pedidos</h3>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: #5D5CDE;"></div>
                      <span>Pedidos</span>
                    </div>
                  </div>
                </div>
                <div class="chart-content volume-chart">
                  <div class="simplified-chart">
                    <div v-for="i in 12" :key="i" class="chart-column">
                      <div class="chart-bar" :style="{ height: (50 + Math.random() * 70) + '%' }"></div>
                      <div class="chart-label">{{ getMonthName(i) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="stats-chart">
                <div class="chart-header">
                  <h3 class="chart-title">Estado de Pedidos</h3>
                </div>
                <div class="chart-content donut-chart">
                  <div class="donut-placeholder">
                    <div class="donut-segments">
                      <div class="donut-segment completed"></div>
                      <div class="donut-segment in-progress"></div>
                      <div class="donut-segment cancelled"></div>
                    </div>
                    <div class="donut-center">{{ stats.tasaCompletados }}%</div>
                  </div>
                  <div class="donut-legend">
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: #10b981;"></div>
                      <span>Completados</span>
                      <span class="legend-value">{{ stats.tasaCompletados }}%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: #f59e0b;"></div>
                      <span>En Proceso</span>
                      <span class="legend-value">{{ stats.tasaEnProceso }}%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: #ef4444;"></div>
                      <span>Cancelados</span>
                      <span class="legend-value">{{ stats.tasaCancelados }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stats-table-container">
              <div class="table-header">
                <h3 class="table-title">Top 5 Locales por Volumen</h3>
              </div>
              <div class="table-content">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Local</th>
                      <th>Pedidos</th>
                      <th>% del Total</th>
                      <th>Crecimiento</th>
                      <th>Promedio por Pedido</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(store, index) in topStores" :key="index">
                      <td class="store-cell">
                        <div class="user-info">
                          <div class="user-avatar small store">
                            <StoreIcon :size="16" />
                          </div>
                          <span>{{ store.nombre }}</span>
                        </div>
                      </td>
                      <td>{{ store.pedidos }}</td>
                      <td>{{ store.porcentaje }}%</td>
                      <td :class="['growth-cell', store.crecimiento > 0 ? 'positive' : 'negative']">
                        <component :is="store.crecimiento > 0 ? TrendingUpIcon : TrendingDownIcon" :size="14" />
                        <span>{{ store.crecimiento > 0 ? '+' : '' }}{{ store.crecimiento }}%</span>
                      </td>
                      <td>L {{ store.promedio }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Users Stats -->
          <div v-if="activeStatsTab === 'users'" class="stats-panel">
            <div class="stats-highlights">
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.totalUsuarios }}</div>
                <div class="highlight-label">Usuarios Totales</div>
                <div class="highlight-change positive">
                  <TrendingUpIcon :size="14" />
                  <span>+8.4% vs mes anterior</span>
                </div>
              </div>
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.usuariosActivos }}</div>
                <div class="highlight-label">Usuarios Activos</div>
                <div class="highlight-change positive">
                  <TrendingUpIcon :size="14" />
                  <span>+5.2% vs mes anterior</span>
                </div>
              </div>
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.nuevosUsuariosMes }}</div>
                <div class="highlight-label">Nuevos este mes</div>
                <div class="highlight-change positive">
                  <TrendingUpIcon :size="14" />
                  <span>+12.3% vs mes anterior</span>
                </div>
              </div>
              <div class="highlight-card">
                <div class="highlight-value">{{ stats.tasaRetencion }}%</div>
                <div class="highlight-label">Tasa de Retención</div>
                <div class="highlight-change positive">
                  <TrendingUpIcon :size="14" />
                  <span>+1.8% vs mes anterior</span>
                </div>
              </div>
            </div>
            
            <div class="stats-charts">
              <div class="stats-chart">
                <div class="chart-header">
                  <h3 class="chart-title">Crecimiento de Usuarios</h3>
                </div>
                <div class="chart-content volume-chart">
                  <div class="simplified-chart">
                    <div v-for="i in 12" :key="i" class="chart-column">
                      <div class="chart-bar" :style="{ height: (30 + Math.random() * 60) + '%' }"></div>
                      <div class="chart-label">{{ getMonthName(i) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="stats-chart">
                <div class="chart-header">
                  <h3 class="chart-title">Distribución de Usuarios</h3>
                </div>
                <div class="chart-content donut-chart">
                  <div class="donut-placeholder">
                    <div class="donut-segments user-segments">
                      <div class="donut-segment clients"></div>
                      <div class="donut-segment drivers"></div>
                      <div class="donut-segment stores"></div>
                    </div>
                    <div class="donut-center">{{ stats.totalUsuarios }}</div>
                  </div>
                  <div class="donut-legend">
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: #3b82f6;"></div>
                      <span>Clientes</span>
                      <span class="legend-value">{{ stats.porcentajeClientes }}%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: #f59e0b;"></div>
                      <span>Repartidores</span>
                      <span class="legend-value">{{ stats.porcentajeDrivers }}%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: #10b981;"></div>
                      <span>Locales</span>
                      <span class="legend-value">{{ stats.porcentajeLocales }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Stats Tabs (simplified) -->
          <div v-if="activeStatsTab !== 'orders' && activeStatsTab !== 'users'" class="stats-panel">
            <div class="empty-state">
              <BarChartIcon :size="64" />
              <p>Estadísticas de {{ getStatsTabName() }}</p>
              <p class="empty-subtitle">Selecciona diferentes vistas y períodos para análisis detallados</p>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div v-if="activeSection === 'notifications'" class="notifications-content">
          <div class="section-header">
            <h1 class="section-title">Enviar Notificaciones</h1>
          </div>
          
          <div class="notifications-form">
            <div class="form-section">
              <div class="form-header">
                <h3 class="form-title">Nueva Notificación</h3>
              </div>
              
              <div class="form-row">
                <label class="form-label">Destinatarios:</label>
                <div class="recipients-options">
                  <div class="recipient-option">
                    <input type="radio" id="all-users" name="recipient" value="all" v-model="notificationRecipient">
                    <label for="all-users">Todos los usuarios</label>
                  </div>
                  <div class="recipient-option">
                    <input type="radio" id="customers" name="recipient" value="customers" v-model="notificationRecipient">
                    <label for="customers">Clientes</label>
                  </div>
                  <div class="recipient-option">
                    <input type="radio" id="drivers" name="recipient" value="drivers" v-model="notificationRecipient">
                    <label for="drivers">Repartidores</label>
                  </div>
                  <div class="recipient-option">
                    <input type="radio" id="stores" name="recipient" value="stores" v-model="notificationRecipient">
                    <label for="stores">Locales</label>
                  </div>
                </div>
              </div>
              
              <div class="form-row">
                <label class="form-label" for="notification-title">Título:</label>
                <input type="text" id="notification-title" v-model="notificationTitle" placeholder="Ingrese el título de la notificación" class="form-input">
              </div>
              
              <div class="form-row">
                <label class="form-label" for="notification-message">Mensaje:</label>
                <textarea id="notification-message" v-model="notificationMessage" placeholder="Ingrese el mensaje de la notificación" class="form-textarea"></textarea>
              </div>
              
              <div class="form-row">
                <label class="form-label">Tipo:</label>
                <div class="notification-types">
                  <div class="notification-type" 
                       :class="{ active: notificationType === 'predeterminada' }"
                       @click="notificationType = 'predeterminada'">
                    <InfoIcon :size="20" />
                    <span>Información</span>
                  </div>
                  <div class="notification-type" 
                       :class="{ active: notificationType === 'personalizada' }"
                       @click="notificationType = 'personalizada'">
                    <EditIcon :size="20" />
                    <span>Personalizada</span>
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button class="cancel-btn">
                  <XIcon :size="16" />
                  <span>Cancelar</span>
                </button>
                <button class="submit-btn" @click="sendNotification">
                  <SendIcon :size="16" />
                  <span>Enviar Ahora</span>
                </button>
              </div>
            </div>
            
            <div class="form-section">
              <div class="form-header">
                <h3 class="form-title">Vista previa</h3>
              </div>
              
              <div class="notification-preview">
                <div class="preview-container">
                  <div class="phone-frame">
                    <div class="phone-header">
                      <div class="phone-time">9:41</div>
                    </div>
                    <div class="notification-panel">
                      <div class="app-icon">
                        <TruckIcon :size="14" />
                      </div>
                      <div class="notification-content">
                        <div class="notification-app">DeliveryPro</div>
                        <div class="notification-title">{{ notificationTitle || 'Título de la notificación' }}</div>
                        <div class="notification-text">{{ notificationMessage || 'Mensaje de la notificación...' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="preview-info">
                  <p>Vista previa de cómo aparecerá la notificación en dispositivos móviles. Asegúrate de que el título sea conciso y el mensaje claro.</p>
                  <div class="recipient-count">
                    <UsersIcon :size="16" />
                    <span>Llegará a {{ getRecipientCount() }} usuarios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section-header">
            <h2 class="section-title">Historial de Notificaciones</h2>
          </div>
          
          <div class="notifications-history">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Mensaje</th>
                  <th>Tipo</th>
                  <th>Creada por</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="notif in notificationsHistory" :key="notif.id_notificacion">
                  <td>#{{ notif.id_notificacion }}</td>
                  <td class="title-cell">{{ notif.titulo }}</td>
                  <td class="message-cell">{{ notif.mensaje }}</td>
                  <td>
                    <span :class="['type-badge', notif.tipo === 'predeterminada' ? 'info' : 'custom']">
                      {{ notif.tipo === 'predeterminada' ? 'Predeterminada' : 'Personalizada' }}
                    </span>
                  </td>
                  <td>{{ notif.creado_por ? notif.creado_por : 'Administración' }}</td>
                  <td>
                    <div class="row-actions">
                      <button class="row-action view">
                        <EyeIcon :size="16" />
                      </button>
                      <button class="row-action duplicate" @click="duplicateNotification(notif)">
                        <CopyIcon :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Users Section -->
        <div v-if="activeSection === 'users'" class="users-content">
          <div class="section-header">
            <h1 class="section-title">Gestión de Usuarios</h1>
            <div class="header-actions">
              <div class="search-container">
                <SearchIcon :size="16" />
                <input type="text" v-model="userSearchQuery" placeholder="Buscar usuarios..." class="search-input">
              </div>
              <select class="filter-select" v-model="userRoleFilter">
                <option value="all">Todos los roles</option>
                <option value="cliente">Clientes</option>
                <option value="admin">Administradores</option>
                <option value="superadmin">Superadministradores</option>
              </select>
              <button class="add-btn">
                <UserPlusIcon :size="16" />
                <span>Añadir</span>
              </button>
            </div>
          </div>
          
          <div class="users-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último Login</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id_usuario">
                  <td>#{{ user.id_usuario }}</td>
                  <td class="user-cell">
                    <div class="user-avatar small">
                      <UserIcon :size="16" />
                    </div>
                    <div class="user-info-cell">
                      <div class="user-name">{{ user.usuario }}</div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['type-badge', getRolClass(user.id_rol)]">
                      {{ getRolName(user.id_rol) }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status-badge', user.estado === 'en linea' ? 'success' : 'danger']">
                      {{ user.estado === 'en linea' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.fecha_ultimo_login) }}</td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <div class="row-actions">
                      <button class="row-action view" @click="viewUserDetails(user.id_usuario)">
                        <EyeIcon :size="16" />
                      </button>
                      <button class="row-action edit" @click="editUser(user.id_usuario)">
                        <EditIcon :size="16" />
                      </button>
                      <button 
                        class="row-action"
                        :class="user.activo ? 'block' : 'unblock'"
                        @click="toggleUserStatus(user.id_usuario, user.activo)"
                      >
                        <LockIcon v-if="user.activo" :size="16" />
                        <UnlockIcon v-else :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="table-footer">
            <div class="pagination">
              <button class="pagination-btn prev" @click="prevPage" :disabled="currentPage === 1">
                <ChevronLeftIcon :size="16" />
              </button>
              <button v-for="page in displayedPages" :key="page" 
                      :class="['pagination-btn', 'page', currentPage === page ? 'active' : '']"
                      @click="goToPage(page)">
                {{ page }}
              </button>
              <span v-if="totalPages > maxDisplayedPages && currentPage < totalPages - maxDisplayedPages/2" class="pagination-ellipsis">...</span>
              <button v-if="totalPages > 1 && currentPage !== totalPages" 
                      class="pagination-btn page" 
                      @click="goToPage(totalPages)">
                {{ totalPages }}
              </button>
              <button class="pagination-btn next" @click="nextPage" :disabled="currentPage === totalPages">
                <ChevronRightIcon :size="16" />
              </button>
            </div>
            <div class="per-page-selector">
              <span>Filas por página:</span>
              <select class="per-page-select" v-model="perPage">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Block User Modal -->
        <div v-if="blockUserModalOpen" class="modal-overlay">
          <div class="modal-container">
            <div class="modal-header">
              <h3>{{ selectedUser.activo ? 'Bloquear Usuario' : 'Desbloquear Usuario' }}</h3>
              <button @click="closeBlockUserModal" class="close-button">
                <XIcon :size="16" />
              </button>
            </div>
            
            <div class="modal-body">
              <div class="block-user-content">
                <div class="user-info-block">
                  <div class="user-avatar medium">
                    <UserIcon :size="24" />
                  </div>
                  <div class="user-details-block">
                    <div class="user-name">{{ selectedUser.usuario }}</div>
                    <div class="user-email">{{ selectedUser.email }}</div>
                    <div class="user-type">
                      <span :class="['type-badge', getRolClass(selectedUser.id_rol)]">
                        {{ getRolName(selectedUser.id_rol) }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div v-if="selectedUser.activo" class="block-options">
                  <div class="block-option-title">Motivo del bloqueo:</div>
                  <div class="block-options-container">
                    <div class="block-option">
                      <input type="radio" id="payment" name="blockReason" value="payment" v-model="blockReason">
                      <label for="payment">Pagos pendientes</label>
                    </div>
                    <div class="block-option">
                      <input type="radio" id="behavior" name="blockReason" value="behavior" v-model="blockReason">
                      <label for="behavior">Comportamiento inapropiado</label>
                    </div>
                    <div class="block-option">
                      <input type="radio" id="fraud" name="blockReason" value="fraud" v-model="blockReason">
                      <label for="fraud">Actividad sospechosa / fraude</label>
                    </div>
                    <div class="block-option">
                      <input type="radio" id="other" name="blockReason" value="other" v-model="blockReason">
                      <label for="other">Otro motivo</label>
                    </div>
                  </div>
                  
                  <div v-if="blockReason === 'payment'" class="payment-details">
                    <div class="payment-detail-title">Detalles del pago pendiente:</div>
                    <div class="payment-form">
                      <div class="form-row">
                        <label class="form-label">Monto pendiente:</label>
                        <div class="payment-amount">
                          <span class="payment-currency">L.</span>
                          <input type="number" v-model="pendingAmount" class="payment-input" placeholder="0.00">
                        </div>
                      </div>
                      <div class="form-row">
                        <label class="form-label">Fecha límite:</label>
                        <input type="date" v-model="paymentDeadline" class="form-input">
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <label class="form-label">Comentarios adicionales:</label>
                    <textarea v-model="blockComments" class="form-textarea" placeholder="Ingrese detalles adicionales..."></textarea>
                  </div>
                </div>
                
                <div v-else class="unblock-message">
                  <AlertCircleIcon :size="20" />
                  <p>¿Estás seguro que deseas desbloquear a este usuario? Esto permitirá que vuelva a acceder a la plataforma.</p>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button @click="closeBlockUserModal" class="modal-button cancel">
                <XIcon :size="16" />
                <span>Cancelar</span>
              </button>
              <button @click="confirmBlockUser" class="modal-button confirm" :class="selectedUser.activo ? 'danger' : 'success'">
                <LockIcon v-if="selectedUser.activo" :size="16" />
                <UnlockIcon v-else :size="16" />
                <span>{{ selectedUser.activo ? 'Bloquear Usuario' : 'Desbloquear Usuario' }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Placeholder Empty State for Other Sections -->
        <div v-if="['clients', 'stores', 'drivers', 'orders', 'trips', 'errands', 'payments', 'settings'].includes(activeSection)" class="empty-section-state">
          <div class="empty-icon">
            <component :is="getEmptyStateIcon()" :size="64" />
          </div>
          <h2 class="empty-section-title">{{ getSectionTitle() }}</h2>
          <p class="empty-section-description">Esta sección está en desarrollo</p>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div class="toast-container">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
          <div class="toast-icon">
            <CheckCircleIcon v-if="toast.type === 'success'" :size="16" />
            <AlertCircleIcon v-if="toast.type === 'info'" :size="16" />
            <XCircleIcon v-if="toast.type === 'error'" :size="16" />
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button @click="dismissToast(toast.id)" class="toast-close">
            <XIcon :size="12" />
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  Truck as TruckIcon,
  Bell as BellIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  LayoutDashboard as LayoutDashboardIcon,
  BadgeCheck as BadgeCheckIcon,
  Headphones as HeadphonesIcon,
  AlertTriangle as AlertTriangleIcon,
  BarChart as BarChartIcon,
  BellRing as BellRingIcon,
  Users as UsersIcon,
  Package as PackageIcon,
  Store as StoreIcon,
  X as XIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  RefreshCw as RefreshCwIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  DollarSign as DollarSignIcon,
  Send as SendIcon,
  MapPin as MapPinIcon,
  FileText as FileTextIcon,
  ArrowRight as ArrowRightIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  ShoppingBag as ShoppingBagIcon,
  ChevronDown as ChevronDownIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Copy as CopyIcon,
  Search as SearchIcon,
  UserPlus as UserPlusIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MessageSquare as MessageSquareIcon,
  Car as CarIcon,
  Image as ImageIcon,
  Phone as PhoneIcon,
  Clock as ClockIcon
} from "lucide-vue-next";

// Theme
const isDarkMode = ref(false);

// Sidebar state (for mobile)
const sidebarOpen = ref(false);

// Selected Profile and User Data
const selectedProfile = ref("admin");
const userData = ref({
  id: 1,
  nombre: "Administrador del Sistema",
  email: "admin@deliverypro.hn"
});

// Current active section and tabs
const activeSection = ref("dashboard");
const activeStatsTab = ref("orders");
const activeTab = ref("pending");
const orderTimeRange = ref("today");
const membershipType = ref("all");
const complaintType = ref("all");
const ticketStatus = ref("all");

// Counts for badges
const pendingMemberships = ref(8);
const pendingTickets = ref(5);
const pendingComplaints = ref(7);

// Date range for statistics
const dateRange = ref({
  start: "01 Ene 2023",
  end: "31 Dic 2023"
});

// Notification form data
const notificationRecipient = ref("all");
const notificationTitle = ref("");
const notificationMessage = ref("");
const notificationType = ref("predeterminada");

// Block user modal
const blockUserModalOpen = ref(false);
const selectedUser = ref({});
const blockReason = ref("payment");
const blockComments = ref("");
const pendingAmount = ref("");
const paymentDeadline = ref("");

// Pagination for users
const currentPage = ref(1);
const perPage = ref(10);
const totalUsers = ref(85);
const maxDisplayedPages = 5;
const userSearchQuery = ref("");
const userRoleFilter = ref("all");

// Toast notifications
const toasts = ref([]);
let toastIdCounter = 0;

// Stats data
const stats = ref({
  pedidosHoy: 138,
  usuariosNuevos: 243,
  ingresos: "25,438",
  ticketsAbiertos: 12,
  totalPedidos: 4827,
  tasaCompletados: 93.4,
  tasaEnProceso: 3.8,
  tasaCancelados: 2.8,
  tiempoPromedio: 18.5,
  pedidosDiarios: 156,
  totalUsuarios: 12845,
  usuariosActivos: 8932,
  nuevosUsuariosMes: 458,
  tasaRetencion: 88.2,
  porcentajeClientes: 82,
  porcentajeDrivers: 14,
  porcentajeLocales: 4
});

// Computed props
const totalPages = computed(() => Math.ceil(totalUsers.value / perPage.value));

// Displayed pages for pagination (creates a sliding window of page numbers)
const displayedPages = computed(() => {
  if (totalPages.value <= maxDisplayedPages) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  let start = Math.max(1, currentPage.value - Math.floor(maxDisplayedPages / 2));
  let end = Math.min(totalPages.value, start + maxDisplayedPages - 1);
  
  if (end - start + 1 < maxDisplayedPages) {
    start = Math.max(1, end - maxDisplayedPages + 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Mock data
const recentOrders = ref([
  { 
    id_pedido: 1053, 
    cliente: "María González", 
    driver: "Juan Pérez", 
    local: "Burger King", 
    estado_pedido: "entregado", 
    fecha_pedido: "2023-12-15T10:30:00"
  },
  { 
    id_pedido: 1052, 
    cliente: "Carlos López", 
    driver: "Ana Ruiz", 
    local: "Farmacia Kielsa", 
    estado_pedido: "en_proceso", 
    fecha_pedido: "2023-12-15T10:15:00"
  },
  { 
    id_pedido: 1051, 
    cliente: "Roberto Díaz", 
    driver: "Luis Mejía", 
    local: "La Colonia", 
    estado_pedido: "entregado", 
    fecha_pedido: "2023-12-15T09:45:00"
  },
  { 
    id_pedido: 1050, 
    cliente: "Sandra Flores", 
    driver: "Mario Contreras", 
    local: "Pizza Hut", 
    estado_pedido: "cancelado", 
    fecha_pedido: "2023-12-15T09:20:00"
  },
  { 
    id_pedido: 1049, 
    cliente: "José Martinez", 
    driver: "Carmen Bonilla", 
    local: "Supermercado Más x Menos", 
    estado_pedido: "entregado", 
    fecha_pedido: "2023-12-15T09:05:00"
  }
]);

// Unread notifications
const unreadNotifications = ref([
  { id: 1, message: "Nueva solicitud de membresía pendiente", read: false },
  { id: 2, message: "3 nuevos tickets de soporte", read: false },
  { id: 3, message: "Nueva queja contra repartidor", read: false }
]);

// Membresías (PagoMembresiaLocal y PagoMembresiaDriver)
const storesMemberships = ref([
  {
    id_pago: 101,
    id_local: 1,
    id_membresia: 2,
    nombre_local: "Burger King - Mall Multiplaza",
    nombre_cliente: "Juan Pérez",
    nombre_membresia: "Premium",
    monto: 1500,
    deposito_url: "https://example.com/comprobante1.jpg",
    fecha_pago: "2023-12-14T14:30:00",
    estado: "pendiente"
  },
  {
    id_pago: 102,
    id_local: 2,
    id_membresia: 1,
    nombre_local: "Pizza Hut - City Mall",
    nombre_cliente: "María López",
    nombre_membresia: "Básica",
    monto: 800,
    deposito_url: "https://example.com/comprobante2.jpg",
    fecha_pago: "2023-12-14T11:45:00",
    estado: "pendiente"
  },
  {
    id_pago: 103,
    id_local: 3,
    id_membresia: 3,
    nombre_local: "Farmacia Kielsa - Centro",
    nombre_cliente: "Pedro Rodríguez",
    nombre_membresia: "Platinum",
    monto: 2500,
    deposito_url: "https://example.com/comprobante3.jpg",
    fecha_pago: "2023-12-13T16:20:00",
    estado: "aprobado"
  },
  {
    id_pago: 104,
    id_local: 4,
    id_membresia: 1,
    nombre_local: "La Colonia - Kennedy",
    nombre_cliente: "Ana Martínez",
    nombre_membresia: "Básica",
    monto: 800,
    deposito_url: "https://example.com/comprobante4.jpg",
    fecha_pago: "2023-12-12T10:15:00",
    estado: "pendiente"
  },
  {
    id_pago: 105,
    id_local: 5,
    id_membresia: 2,
    nombre_local: "Little Caesars - Las Cascadas",
    nombre_cliente: "Carlos Sánchez",
    nombre_membresia: "Premium",
    monto: 1500,
    deposito_url: "https://example.com/comprobante5.jpg",
    fecha_pago: "2023-12-11T09:30:00",
    estado: "denegada"
  }
]);

const driversMemberships = ref([
  {
    id_pago: 201,
    id_driver: 1,
    id_membresia: 1,
    nombre_driver: "Roberto Mejía",
    saldo_solicitado: 1000,
    monto: 500,
    deposito_url: "https://example.com/comprobante_driver1.jpg",
    fecha_pago: "2023-12-14T15:30:00",
    estado: "pendiente"
  },
  {
    id_pago: 202,
    id_driver: 2,
    id_membresia: 2,
    nombre_driver: "Sandra Flores",
    saldo_solicitado: 2000,
    monto: 600,
    deposito_url: "https://example.com/comprobante_driver2.jpg",
    fecha_pago: "2023-12-13T12:45:00",
    estado: "pendiente"
  },
  {
    id_pago: 203,
    id_driver: 3,
    id_membresia: 3,
    nombre_driver: "Luis García",
    saldo_solicitado: null,
    monto: 400,
    deposito_url: "https://example.com/comprobante_driver3.jpg",
    fecha_pago: "2023-12-12T10:20:00",
    estado: "aprobado"
  }
]);

// Tickets
const supportTickets = ref([
  {
    id_ticket: 101,
    id_cliente: 1,
    nombre_cliente: "María González",
    asunto: "No recibí mi pedido pero me cobraron",
    descripcion: "Realicé un pedido hace 2 horas (Orden #1045) pero nunca llegó. El repartidor marcó como entregado, pero yo no recibí nada y ya me hicieron el cargo a mi tarjeta.",
    estado: "Abierto",
    fecha_creacion: "2023-12-15T09:35:00",
    fecha_cierre: null,
    imagen_url: "https://example.com/evidencia1.jpg"
  },
  {
    id_ticket: 100,
    id_cliente: 2,
    nombre_cliente: "Jorge Altamirano",
    asunto: "Problema con registro de mi local",
    descripcion: "Estoy intentando registrar mi local, pero cuando subo las imágenes del menú la aplicación me da un error. He intentado varias veces y sigue fallando.",
    estado: "Procesando",
    fecha_creacion: "2023-12-14T15:20:00",
    fecha_cierre: null,
    imagen_url: null
  },
  {
    id_ticket: 99,
    id_cliente: 3,
    nombre_cliente: "Claudia Bonilla",
    asunto: "Repartidor con comportamiento inapropiado",
    descripcion: "El repartidor que me entregó el pedido #1032 fue muy grosero, se molestó cuando le pedí que esperara mientras verificaba el pedido y lanzó comentarios inapropiados.",
    estado: "Procesando",
    fecha_creacion: "2023-12-14T11:45:00",
    fecha_cierre: null,
    imagen_url: null
  },
  {
    id_ticket: 98,
    id_cliente: 4,
    nombre_cliente: "Roberto Martínez",
    asunto: "Solicitud de reembolso",
    descripcion: "Me cobraron dos veces por el mismo pedido (#1028). Necesito que revisen y me hagan el reembolso de uno de los cargos.",
    estado: "Abierto",
    fecha_creacion: "2023-12-13T14:30:00",
    fecha_cierre: null,
    imagen_url: null
  },
  {
    id_ticket: 97,
    id_cliente: 5,
    nombre_cliente: "Luis Mejía",
    asunto: "No puedo cambiar mi información bancaria",
    descripcion: "Soy repartidor y necesito actualizar mi cuenta bancaria para recibir mis pagos, pero el sistema no me deja cambiarla.",
    estado: "Cerrado",
    fecha_creacion: "2023-12-12T13:45:00",
    fecha_cierre: "2023-12-13T10:30:00",
    imagen_url: "https://example.com/captura_error.jpg"
  }
]);

// Quejas
const driverComplaints = ref([
  {
    id_queja: 301,
    id_cliente: 1,
    nombre_cliente: "María González",
    id_driver: 10,
    nombre_driver: "Juan Pérez",
    id_pedido: 1045,
    comentario: "El repartidor fue muy grosero al entregar el pedido y además llegó más de 40 minutos tarde sin avisar.",
    imagen_url: "https://example.com/evidencia_queja1.jpg",
    fecha: "2023-12-15T08:30:00"
  },
  {
    id_queja: 302,
    id_cliente: 2,
    nombre_cliente: "Carlos López",
    id_driver: 11,
    nombre_driver: "Pedro Rodríguez",
    id_pedido: 1042,
    comentario: "El repartidor entregó comida fría y el paquete estaba dañado. Cuando lo mencioné, reaccionó de forma agresiva.",
    imagen_url: "https://example.com/evidencia_queja2.jpg",
    fecha: "2023-12-14T19:15:00"
  }
]);

const storeComplaints = ref([
  {
    id_queja: 401,
    id_cliente: 3,
    nombre_cliente: "Roberto Díaz",
    id_local: 5,
    nombre_local: "Pizza Hut - Las Cascadas",
    id_pedido: 1040,
    comentario: "El pedido llegó incompleto, faltaban ingredientes en la pizza y no incluyeron las bebidas que pagué.",
    imagen_url: "https://example.com/evidencia_queja_local1.jpg",
    fecha: "2023-12-15T14:20:00"
  },
  {
    id_queja: 402,
    id_cliente: 4,
    nombre_cliente: "Ana Martínez",
    id_local: 6,
    nombre_local: "Burger King - Mall Multiplaza",
    id_pedido: 1035,
    comentario: "La comida estaba en mal estado, lo cual me provocó problemas de salud. Adjunto foto del producto.",
    imagen_url: "https://example.com/evidencia_queja_local2.jpg",
    fecha: "2023-12-14T12:40:00"
  }
]);

const uberComplaints = ref([
  {
    id_quejauber: 501,
    id_cliente: 5,
    nombre_cliente: "Luis García",
    id_driver: 12,
    nombre_driver: "Miguel Sánchez",
    id_viaje: 3045,
    comentario: "El conductor tomó una ruta muy larga a propósito para cobrar más. El viaje duró 30 minutos cuando normalmente toma 15.",
    imagen_url: null,
    fecha: "2023-12-15T17:30:00"
  }
]);

const clientComplaints = ref([
  {
    id_queja: 601,
    id_driver: 13,
    nombre_driver: "Sandra Flores",
    id_cliente: 6,
    nombre_cliente: "Javier Reyes",
    id_viaje: 3042,
    comentario: "El cliente proporcionó una dirección incorrecta y se negó a proporcionar indicaciones claras, lo que me hizo perder más de 30 minutos.",
    imagen_url: null,
    fecha: "2023-12-14T20:15:00"
  }
]);

// Top Stores
const topStores = ref([
  { 
    nombre: "Burger King", 
    pedidos: 843, 
    porcentaje: 17.5, 
    crecimiento: 12.4, 
    promedio: 185 
  },
  { 
    nombre: "La Colonia", 
    pedidos: 756, 
    porcentaje: 15.7, 
    crecimiento: 18.7, 
    promedio: 425 
  },
  { 
    nombre: "Farmacia Kielsa", 
    pedidos: 576, 
    porcentaje: 11.9, 
    crecimiento: 9.2, 
    promedio: 235 
  },
  { 
    nombre: "Pizza Hut", 
    pedidos: 512, 
    porcentaje: 10.6, 
    crecimiento: 22.5, 
    promedio: 145 
  },
  { 
    nombre: "Little Caesars", 
    pedidos: 482, 
    porcentaje: 10.0, 
    crecimiento: -3.2, 
    promedio: 210 
  }
]);

// Notifications History
const notificationsHistory = ref([
  {
    id_notificacion: 1,
    tipo: "predeterminada",
    titulo: "Actualización de la aplicación",
    mensaje: "Hemos lanzado una nueva versión con mejoras importantes. Actualice ahora para disfrutar de nuevas funciones.",
    creado_por: null
  },
  {
    id_notificacion: 2,
    tipo: "personalizada",
    titulo: "¡Ofertas especiales de fin de semana!",
    mensaje: "Este fin de semana disfruta de envíos gratuitos en todos tus pedidos. ¡No te lo pierdas!",
    creado_por: "Burger King - Mall Multiplaza"
  },
  {
    id_notificacion: 3,
    tipo: "predeterminada",
    titulo: "Mantenimiento programado",
    mensaje: "La aplicación estará en mantenimiento el día 20 de diciembre de 00:00 a 03:00 horas.",
    creado_por: null
  }
]);

// Users
const users = ref([
  {
    id_usuario: 1,
    id_rol: 3, // superadmin
    usuario: "superadmin",
    email: "superadmin@deliverypro.hn",
    estado: "en linea",
    created_at: "2023-01-01T00:00:00",
    updated_at: "2023-12-15T08:30:00",
    fecha_ultimo_login: "2023-12-15T08:30:00",
    imagen_perfil_url: null,
    activo: 1
  },
  {
    id_usuario: 2,
    id_rol: 2, // admin
    usuario: "admin",
    email: "admin@deliverypro.hn",
    estado: "en linea",
    created_at: "2023-01-01T00:00:00",
    updated_at: "2023-12-15T09:15:00",
    fecha_ultimo_login: "2023-12-15T09:15:00",
    imagen_perfil_url: null,
    activo: 1
  },
  {
    id_usuario: 3,
    id_rol: 1, // cliente
    usuario: "maria.gonzalez",
    email: "maria.g@gmail.com",
    estado: "en linea",
    created_at: "2023-06-15T10:30:00",
    updated_at: "2023-12-15T10:30:00",
    fecha_ultimo_login: "2023-12-15T10:30:00",
    imagen_perfil_url: null,
    activo: 1
  },
  {
    id_usuario: 4,
    id_rol: 1, // cliente
    usuario: "juan.perez",
    email: "juan.p@outlook.com",
    estado: "en linea",
    created_at: "2023-03-10T11:15:00",
    updated_at: "2023-12-15T11:15:00",
    fecha_ultimo_login: "2023-12-15T11:15:00",
    imagen_perfil_url: null,
    activo: 1
  },
  {
    id_usuario: 5,
    id_rol: 1, // cliente
    usuario: "burgerking.multiplaza",
    email: "bk.multiplaza@burgerking.hn",
    estado: "en linea",
    created_at: "2023-01-20T09:45:00",
    updated_at: "2023-12-15T09:45:00",
    fecha_ultimo_login: "2023-12-15T09:45:00",
    imagen_perfil_url: null,
    activo: 1
  },
  {
    id_usuario: 6,
    id_rol: 1, // cliente
    usuario: "roberto.diaz",
    email: "roberto.d@yahoo.com",
    estado: "inactivo",
    created_at: "2023-05-05T15:20:00",
    updated_at: "2023-12-10T15:20:00",
    fecha_ultimo_login: "2023-12-10T15:20:00",
    imagen_perfil_url: null,
    activo: 0
  },
  {
    id_usuario: 7,
    id_rol: 1, // cliente
    usuario: "ana.ruiz",
    email: "ana.r@gmail.com",
    estado: "en linea",
    created_at: "2023-07-12T08:20:00",
    updated_at: "2023-12-15T08:20:00",
    fecha_ultimo_login: "2023-12-15T08:20:00",
    imagen_perfil_url: null,
    activo: 1
  },
  {
    id_usuario: 8,
    id_rol: 2, // admin
    usuario: "pedro.sosa",
    email: "pedro.s@hotmail.com",
    estado: "en linea",
    created_at: "2023-02-01T16:45:00",
    updated_at: "2023-12-14T16:45:00",
    fecha_ultimo_login: "2023-12-14T16:45:00",
    imagen_perfil_url: null,
    activo: 1
  },
  {
    id_usuario: 9,
    id_rol: 1, // cliente
    usuario: "farmacia.kielsa",
    email: "info@kielsa.hn",
    estado: "inactivo",
    created_at: "2023-04-18T14:30:00",
    updated_at: "2023-12-12T14:30:00",
    fecha_ultimo_login: "2023-12-12T14:30:00",
    imagen_perfil_url: null,
    activo: 0
  }
]);

// Filtered data
const filteredStoresMemberships = computed(() => {
  return storesMemberships.value.filter(m => {
    if (activeTab.value === 'pending') return m.estado === 'pendiente';
    if (activeTab.value === 'approved') return m.estado === 'aprobado';
    if (activeTab.value === 'rejected') return m.estado === 'denegada';
    return true;
  });
});

const filteredDriversMemberships = computed(() => {
  return driversMemberships.value.filter(m => {
    if (activeTab.value === 'pending') return m.estado === 'pendiente';
    if (activeTab.value === 'approved') return m.estado === 'aprobado';
    if (activeTab.value === 'rejected') return m.estado === 'denegada';
    return true;
  });
});

const filteredTickets = computed(() => {
  if (ticketStatus.value === 'all') return supportTickets.value;
  return supportTickets.value.filter(ticket => ticket.estado === ticketStatus.value);
});

const filteredUsers = computed(() => {
  let filtered = users.value;
  
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.usuario.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  if (userRoleFilter.value !== 'all') {
    const roleId = userRoleFilter.value === 'cliente' ? 1 : 
                  (userRoleFilter.value === 'admin' ? 2 : 3);
    filtered = filtered.filter(user => user.id_rol === roleId);
  }
  
  // Apply pagination
  const startIndex = (currentPage.value - 1) * perPage.value;
  return filtered.slice(startIndex, startIndex + perPage.value);
});

onMounted(() => {
  // Comprobar tema al montar el componente
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true;
  }

  // Escuchar cambios en el tema
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      isDarkMode.value = event.matches;
    });
  }
  
  // Establecer total de usuarios para paginación
  totalUsers.value = users.value.length;
});

// Watch para actualizar la página cuando cambia perPage
watch(perPage, () => {
  currentPage.value = 1; // Reiniciar a la primera página
  totalUsers.value = users.value.length; // Actualizar total para paginación
});

// Watch para filtros de usuarios
watch([userSearchQuery, userRoleFilter], () => {
  currentPage.value = 1;
  
  // Recalcular total de usuarios filtrados
  let filtered = users.value;
  
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.usuario.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  if (userRoleFilter.value !== 'all') {
    const roleId = userRoleFilter.value === 'cliente' ? 1 : 
                  (userRoleFilter.value === 'admin' ? 2 : 3);
    filtered = filtered.filter(user => user.id_rol === roleId);
  }
  
  totalUsers.value = filtered.length;
});

// Funciones

// Get section title
const getSectionTitle = () => {
  const titles = {
    dashboard: "Dashboard",
    memberships: "Membresías",
    tickets: "Tickets",
    complaints: "Quejas",
    statistics: "Estadísticas",
    notifications: "Notificaciones",
    users: "Usuarios",
    clients: "Clientes",
    stores: "Locales",
    drivers: "Repartidores",
    orders: "Pedidos",
    trips: "Viajes",
    errands: "Mandaditos",
    payments: "Pagos",
    settings: "Configuración"
  };
  return titles[activeSection.value] || "Dashboard";
};

// Get empty state icon based on section
const getEmptyStateIcon = () => {
  const icons = {
    clients: UserIcon,
    stores: StoreIcon,
    drivers: TruckIcon,
    orders: ShoppingBagIcon,
    trips: CarIcon,
    errands: PackageIcon,
    payments: DollarSignIcon,
    settings: SettingsIcon
  };
  return icons[activeSection.value] || LayoutDashboardIcon;
};

// Get stats tab name
const getStatsTabName = () => {
  const names = {
    users: "Usuarios",
    revenue: "Ingresos",
    stores: "Locales",
    drivers: "Repartidores"
  };
  return names[activeStatsTab.value] || "Pedidos";
};

// Status class mapping
const getStatusClass = (status) => {
  switch(status) {
    case 'entregado': return 'success';
    case 'en_proceso': case 'pendiente_local': return 'warning';
    case 'cancelado': return 'danger';
    default: return 'pending';
  }
};

// Format estado pedido
const formatEstadoPedido = (estado) => {
  switch(estado) {
    case 'entregado': return 'Entregado';
    case 'en_proceso': return 'En Proceso';
    case 'pendiente_local': return 'Pendiente';
    case 'cancelado': return 'Cancelado';
    default: return estado;
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Check if today
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Hoy, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // Check if yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // Format as date
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format current date
const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

// Generate random height for chart bars
const getRandomHeight = () => {
  return `${Math.floor(20 + Math.random() * 60)}%`;
};

// Get month name
const getMonthName = (index) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months[index - 1];
};

// Get ticket status class
const getTicketStatusClass = (status) => {
  switch(status) {
    case 'Abierto': return 'open';
    case 'Procesando': return 'processing';
    case 'Cerrado': return 'solved';
    default: return '';
  }
};

// Get role name
const getRolName = (rolId) => {
  switch(rolId) {
    case 1: return 'Cliente';
    case 2: return 'Admin';
    case 3: return 'SuperAdmin';
    default: return 'Desconocido';
  }
};

// Get role class
const getRolClass = (rolId) => {
  switch(rolId) {
    case 1: return 'customer';
    case 2: return 'admin';
    case 3: return 'superadmin';
    default: return '';
  }
};

// Get recipient count for notifications
const getRecipientCount = () => {
  const counts = {
    all: "12,845",
    customers: "10,512",
    drivers: "1,875",
    stores: "458"
  };
  return counts[notificationRecipient.value] || "0";
};

// Send notification
const sendNotification = () => {
  if (!notificationTitle.value || !notificationMessage.value) {
    showToast("Error", "Por favor complete el título y mensaje de la notificación", "error");
    return;
  }
  
  // Here you would typically make an API call to save the notification
  // For demo purposes, we'll just add it to the history
  notificationsHistory.value.unshift({
    id_notificacion: notificationsHistory.value.length + 1,
    tipo: notificationType.value,
    titulo: notificationTitle.value,
    mensaje: notificationMessage.value,
    creado_por: null // Admin created
  });
  
  showToast("Notificación enviada", "La notificación ha sido enviada correctamente", "success");
  
  // Reset form
  notificationTitle.value = "";
  notificationMessage.value = "";
};

// Duplicate notification
const duplicateNotification = (notification) => {
  notificationTitle.value = notification.titulo;
  notificationMessage.value = notification.mensaje;
  notificationType.value = notification.tipo;
  
  showToast("Notificación duplicada", "Puedes editar y enviar la notificación ahora", "info");
};

// View document (image, comprobante, etc.)
const viewDocument = (url) => {
  // In a real application, this would open a modal with the document
  window.open(url, '_blank');
};

// Pagination
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Block/unblock user
const toggleUserStatus = (userId, isActive) => {
  const user = users.value.find(u => u.id_usuario === userId);
  if (user) {
    selectedUser.value = {...user};
    blockUserModalOpen.value = true;
  }
};

const closeBlockUserModal = () => {
  blockUserModalOpen.value = false;
  blockReason.value = "payment";
  blockComments.value = "";
  pendingAmount.value = "";
  paymentDeadline.value = "";
};

const confirmBlockUser = () => {
  const userIndex = users.value.findIndex(u => u.id_usuario === selectedUser.value.id_usuario);
  if (userIndex !== -1) {
    // Toggle user status
    users.value[userIndex].activo = users.value[userIndex].activo ? 0 : 1;
    users.value[userIndex].estado = users.value[userIndex].activo ? 'en linea' : 'inactivo';
    
    showToast(
      users.value[userIndex].activo ? "Usuario desbloqueado" : "Usuario bloqueado",
      `El usuario ${users.value[userIndex].usuario} ha sido ${users.value[userIndex].activo ? 'desbloqueado' : 'bloqueado'} correctamente`,
      users.value[userIndex].activo ? "success" : "info"
    );
  }
  
  closeBlockUserModal();
};

// Approve/Reject memberships
const approveMembership = (membershipId, type) => {
  if (type === 'local') {
    const index = storesMemberships.value.findIndex(m => m.id_pago === membershipId);
    if (index !== -1) {
      storesMemberships.value[index].estado = 'aprobado';
      pendingMemberships.value--;
      showToast("Membresía aprobada", `La membresía de ${storesMemberships.value[index].nombre_local} ha sido aprobada`, "success");
    }
  } else {
    const index = driversMemberships.value.findIndex(m => m.id_pago === membershipId);
    if (index !== -1) {
      driversMemberships.value[index].estado = 'aprobado';
      pendingMemberships.value--;
      showToast("Membresía aprobada", `La membresía de ${driversMemberships.value[index].nombre_driver} ha sido aprobada`, "success");
    }
  }
};

const rejectMembership = (membershipId, type) => {
  if (type === 'local') {
    const index = storesMemberships.value.findIndex(m => m.id_pago === membershipId);
    if (index !== -1) {
      storesMemberships.value[index].estado = 'denegada';
      pendingMemberships.value--;
      showToast("Membresía rechazada", `La membresía de ${storesMemberships.value[index].nombre_local} ha sido rechazada`, "info");
    }
  } else {
    const index = driversMemberships.value.findIndex(m => m.id_pago === membershipId);
    if (index !== -1) {
      driversMemberships.value[index].estado = 'denegado';
      pendingMemberships.value--;
      showToast("Membresía rechazada", `La membresía de ${driversMemberships.value[index].nombre_driver} ha sido rechazada`, "info");
    }
  }
};

// Update ticket status
const updateTicketStatus = (ticketId, newStatus) => {
  const index = supportTickets.value.findIndex(t => t.id_ticket === ticketId);
  if (index !== -1) {
    supportTickets.value[index].estado = newStatus;
    if (newStatus === 'Cerrado') {
      supportTickets.value[index].fecha_cierre = new Date().toISOString();
      pendingTickets.value--;
    }
    showToast("Ticket actualizado", `El ticket #${ticketId} ha sido actualizado a estado: ${newStatus}`, "success");
  }
};

// View ticket details
const viewTicketDetails = (ticketId) => {
  // In a real application, this would open a detailed view of the ticket
  showToast("Ver detalles", `Mostrando detalles del ticket #${ticketId}`, "info");
};

// Contact methods
const contactUser = (userId) => {
  showToast("Contactar cliente", `Iniciando contacto con cliente #${userId}`, "info");
};

const contactDriver = (driverId) => {
  showToast("Contactar repartidor", `Iniciando contacto con repartidor #${driverId}`, "info");
};

const contactStore = (storeId) => {
  showToast("Contactar local", `Iniciando contacto con local #${storeId}`, "info");
};

// Warning actions
const warnDriver = (driverId) => {
  showToast("Advertencia enviada", `Se ha enviado una advertencia al repartidor #${driverId}`, "success");
};

const warnStore = (storeId) => {
  showToast("Advertencia enviada", `Se ha enviado una advertencia al local #${storeId}`, "success");
};

// User actions
const viewUserDetails = (userId) => {
  showToast("Ver detalles", `Mostrando detalles del usuario #${userId}`, "info");
};

const editUser = (userId) => {
  showToast("Editar usuario", `Editando usuario #${userId}`, "info");
};

// Toast notification system
const showToast = (title, message, type = "success") => {
  const id = toastIdCounter++;
  toasts.value.push({ id, title, message, type });
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    dismissToast(id);
  }, 4000);
};

const dismissToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};
</script>

<style scoped>
/* Estilos base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.app-container.dark {
  background-color: #121826;
  color: #f3f4f6;
}

/* Header */
.header {
  background-color: #5D5CDE;
  color: white;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

.dark .header {
  background-color: #1f2937;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-selector {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
}

.profile-selector option {
  background-color: #5D5CDE;
  color: white;
}

.dark .profile-selector option {
  background-color: #1f2937;
}

.notification-icon {
  position: relative;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Layout */
.main-layout {
  display: flex;
  flex: 1;
  position: relative;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 40;
}

.dark .sidebar {
  background-color: #1f2937;
  border-right-color: #374151;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .sidebar-header {
  border-bottom-color: #374151;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5D5CDE;
}

.dark .user-avatar {
  background-color: #374151;
  color: #3b82f6;
}

.user-avatar.small {
  width: 1.75rem;
  height: 1.75rem;
}

.user-avatar.medium {
  width: 3rem;
  height: 3rem;
}

.user-avatar.driver {
  color: #3b82f6;
}

.user-avatar.store {
  color: #10b981;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .user-role {
  color: #9ca3af;
}

.sidebar-menu {
  padding: 0.5rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  position: relative;
}

.dark .sidebar-item {
  color: #9ca3af;
}

.sidebar-item span {
  margin-left: 0.75rem;
  font-weight: 500;
}

.sidebar-item:hover {
  background-color: #f3f4f6;
  color: #5D5CDE;
}

.dark .sidebar-item:hover {
  background-color: #374151;
  color: #3b82f6;
}

.sidebar-item.active {
  background-color: #5D5CDE;
  color: white;
}

.dark .sidebar-item.active {
  background-color: #3b82f6;
}

.item-badge {
  position: absolute;
  right: 1rem;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}

.mobile-close-btn {
  display: none;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.dark .mobile-close-btn {
  color: #9ca3af;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 1rem;
  overflow-x: hidden;
}

.dark .content-area {
  background-color: #121826;
}

/* Mobile Header */
.mobile-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.mobile-menu-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.dark .mobile-menu-btn {
  color: #9ca3af;
}

.mobile-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.mobile-actions {
  display: flex;
  gap: 0.75rem;
}

.mobile-action-btn {
  background: none;
  border: none;
  color: #6b7280;
  position: relative;
  cursor: pointer;
}

.dark .mobile-action-btn {
  color: #9ca3af;
}

.mobile-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 9999px;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.dark .section-title {
  color: #f9fafb;
}

.section-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.dark .section-subtitle {
  color: #f9fafb;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-selector, .date-range-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .date-selector, .dark .date-range-picker {
  background-color: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.refresh-btn, .export-btn, .add-btn, .view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .refresh-btn, .dark .export-btn, .dark .add-btn, .dark .view-all-btn {
  background-color: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.refresh-btn:hover, .export-btn:hover, .add-btn:hover, .view-all-btn:hover {
  border-color: #5D5CDE;
  color: #5D5CDE;
}

.dark .refresh-btn:hover, .dark .export-btn:hover, .dark .add-btn:hover, .dark .view-all-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-select, .time-range-select, .per-page-select {
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  outline: none;
}

.dark .filter-select, .dark .time-range-select, .dark .per-page-select {
  background-color: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.search-container {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0 0.75rem;
}

.dark .search-container {
  background-color: #1f2937;
  border-color: #374151;
}

.search-container svg {
  color: #6b7280;
}

.dark .search-container svg {
  color: #9ca3af;
}

.search-input {
  border: none;
  padding: 0.5rem;
  outline: none;
  font-size: 0.875rem;
  background: transparent;
  color: #111827;
}

.dark .search-input {
  color: #f9fafb;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* Tabs */
.tabs-container {
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  overflow-x: auto;
}

.dark .tabs {
  border-bottom-color: #374151;
}

.tab-button {
  position: relative;
  padding: 0.75rem 1.25rem;
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.dark .tab-button {
  color: #9ca3af;
}

.tab-button.active {
  background-color: #5D5CDE;
  color: white;
}

.dark .tab-button.active {
  background-color: #3b82f6;
}

.tab-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  min-width: 1.25rem;
  height: 1.25rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.625rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}

/* Dashboard Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .stat-card {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.delivery {
  background-color: rgba(93, 92, 222, 0.1);
  color: #5D5CDE;
}

.dark .stat-icon.delivery {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.stat-icon.users {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.dark .stat-icon.users {
  background-color: rgba(16, 185, 129, 0.15);
}

.stat-icon.revenue {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.dark .stat-icon.revenue {
  background-color: rgba(245, 158, 11, 0.15);
}

.stat-icon.tickets {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dark .stat-icon.tickets {
  background-color: rgba(239, 68, 68, 0.15);
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.dark .stat-title {
  color: #9ca3af;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

/* Dashboard Layout */
.dashboard-rows {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .dashboard-row {
    grid-template-columns: 1.75fr 1fr;
  }
}

/* Chart Container */
.chart-container, .recent-table-container, .stats-table-container, 
.table-container {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.dark .chart-container, .dark .recent-table-container, 
.dark .stats-table-container, .dark .table-container {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.chart-header, .table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .chart-header, .dark .table-header {
  border-bottom-color: #374151;
}

.chart-title, .table-title {
  font-size: 1rem;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chart-content, .table-content {
  padding: 1.25rem;
}

/* Activity Chart Placeholder */
.activity-chart-placeholder {
  height: 200px;
  display: flex;
  align-items: flex-end;
}

.chart-bars {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 1rem;
  align-items: flex-end;
  padding-bottom: 1.5rem;
  position: relative;
}

.chart-bar-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.chart-bar {
  width: 100%;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #5D5CDE;
  transition: height 0.5s ease;
}

.dark .chart-bar {
  background-color: #3b82f6;
}

.chart-bar-label {
  position: absolute;
  bottom: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .chart-bar-label {
  color: #9ca3af;
}

/* Quick Actions */
.quick-actions {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .quick-actions {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.quick-actions-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.dark .action-button {
  background-color: #374151;
  border-color: #4b5563;
}

.action-button svg {
  color: #5D5CDE;
}

.dark .action-button svg {
  color: #3b82f6;
}

.action-button span {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.action-button:hover {
  background-color: #5D5CDE;
  border-color: #5D5CDE;
  color: white;
  transform: translateY(-2px);
}

.dark .action-button:hover {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.action-button:hover svg {
  color: white;
}

/* Data Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
}

.data-table thead tr {
  border-bottom: 1px solid #e5e7eb;
}

.dark .data-table thead tr {
  border-bottom-color: #374151;
}

.data-table th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  padding: 0.75rem 1rem;
}

.dark .data-table th {
  color: #9ca3af;
}

.data-table td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f3f4f6;
}

.dark .data-table td {
  border-bottom-color: #374151;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.dark .status-badge.success {
  background-color: rgba(16, 185, 129, 0.2);
}

.status-badge.warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.dark .status-badge.warning {
  background-color: rgba(245, 158, 11, 0.2);
}

.status-badge.danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dark .status-badge.danger {
  background-color: rgba(239, 68, 68, 0.2);
}

.status-badge.pending {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.dark .status-badge.pending {
  background-color: rgba(156, 163, 175, 0.2);
  color: #9ca3af;
}

.status-badge.open {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.dark .status-badge.open {
  background-color: rgba(236, 72, 153, 0.2);
}

.status-badge.processing {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.dark .status-badge.processing {
  background-color: rgba(79, 70, 229, 0.2);
}

.status-badge.solved {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.dark .status-badge.solved {
  background-color: rgba(16, 185, 129, 0.2);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-badge.customer {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.dark .type-badge.customer {
  background-color: rgba(14, 165, 233, 0.2);
}

.type-badge.driver {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.dark .type-badge.driver {
  background-color: rgba(59, 130, 246, 0.2);
}

.type-badge.store {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.dark .type-badge.store {
  background-color: rgba(16, 185, 129, 0.2);
}

.type-badge.admin {
  background-color: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.dark .type-badge.admin {
  background-color: rgba(124, 58, 237, 0.2);
}

.type-badge.superadmin {
  background-color: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
}

.dark .type-badge.superadmin {
  background-color: rgba(244, 63, 94, 0.2);
}

.type-badge.info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.dark .type-badge.info {
  background-color: rgba(59, 130, 246, 0.2);
}

.type-badge.custom {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.dark .type-badge.custom {
  background-color: rgba(139, 92, 246, 0.2);
}

.row-actions {
  display: flex;
  gap: 0.5rem;
}

.row-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  border: none;
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .row-action {
  background-color: #374151;
  color: #9ca3af;
}

.row-action:hover {
  background-color: #e5e7eb;
}

.dark .row-action:hover {
  background-color: #4b5563;
}

.row-action.view:hover {
  background-color: #5D5CDE;
  color: white;
}

.dark .row-action.view:hover {
  background-color: #3b82f6;
}

.row-action.edit:hover {
  background-color: #f59e0b;
  color: white;
}

.row-action.approve:hover {
  background-color: #10b981;
  color: white;
}

.row-action.reject:hover {
  background-color: #ef4444;
  color: white;
}

.row-action.block:hover {
  background-color: #ef4444;
  color: white;
}

.row-action.unblock:hover {
  background-color: #10b981;
  color: white;
}

.row-action.duplicate:hover {
  background-color: #6366f1;
  color: white;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info-cell {
  display: flex;
  flex-direction: column;
}

.user-phone {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .user-phone {
  color: #9ca3af;
}

/* View Document Button */
.view-document-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #5D5CDE;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .view-document-btn {
  background-color: #374151;
  color: #3b82f6;
}

.view-document-btn:hover {
  background-color: #e5e7eb;
}

.dark .view-document-btn:hover {
  background-color: #4b5563;
}

/* Table Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
}

.dark .table-footer {
  border-top-color: #374151;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .pagination-btn {
  background-color: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.pagination-btn.active {
  background-color: #5D5CDE;
  border-color: #5D5CDE;
  color: white;
}

.dark .pagination-btn.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.pagination-btn:hover:not(.active):not(:disabled) {
  border-color: #5D5CDE;
  color: #5D5CDE;
}

.dark .pagination-btn:hover:not(.active):not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 0 0.5rem;
  color: #6b7280;
}

.dark .pagination-ellipsis {
  color: #9ca3af;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .per-page-selector {
  color: #9ca3af;
}

/* Tickets */
.tickets-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.ticket-card {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .ticket-card {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .ticket-header {
  border-bottom-color: #374151;
}

.ticket-id {
  font-weight: 600;
  color: #5D5CDE;
}

.dark .ticket-id {
  color: #3b82f6;
}

.ticket-title {
  padding: 0.75rem 1rem;
  font-weight: 600;
}

.ticket-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .ticket-info {
  border-bottom-color: #374151;
}

.info-col {
  flex: 1;
  min-width: 120px;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.dark .info-label {
  color: #9ca3af;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.ticket-type {
  font-size: 0.875rem;
  font-weight: 500;
}

.ticket-date {
  font-size: 0.875rem;
}

.ticket-message {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
  max-height: 80px;
  overflow: hidden;
  position: relative;
}

.dark .ticket-message {
  color: #9ca3af;
}

.ticket-message::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, transparent, white);
}

.dark .ticket-message::after {
  background: linear-gradient(to bottom, transparent, #1f2937);
}

.ticket-actions {
  padding: 0.75rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ticket-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .ticket-action {
  background-color: #374151;
  color: #9ca3af;
}

.ticket-action.view-ticket:hover {
  background-color: #5D5CDE;
  color: white;
}

.dark .ticket-action.view-ticket:hover {
  background-color: #3b82f6;
}

.ticket-action.view-image:hover {
  background-color: #8b5cf6;
  color: white;
}

.ticket-action.process-ticket:hover {
  background-color: #f59e0b;
  color: white;
}

.ticket-action.solve-ticket:hover {
  background-color: #10b981;
  color: white;
}

/* Complaints */
.complaints-container {
  margin-bottom: 2rem;
}

.complaints-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.complaint-card {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

.dark .complaint-card {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.complaint-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.complaint-id {
  font-weight: 600;
  color: #5D5CDE;
}

.dark .complaint-id {
  color: #3b82f6;
}

.complaint-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .complaint-date {
  color: #9ca3af;
}

.complaint-parties {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.complaint-by, .complaint-against {
  flex: 1;
  min-width: 140px;
}

.label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .label {
  color: #9ca3af;
}

.complaint-info {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.dark .complaint-info {
  background-color: #374151;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-value {
  font-weight: 500;
  margin-left: 0.5rem;
}

.complaint-message {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border-left: 3px solid #5D5CDE;
}

.dark .complaint-message {
  color: #9ca3af;
  background-color: #374151;
  border-left-color: #3b82f6;
}

.complaint-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Statistics Section */
.stats-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.stats-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dark .stats-tab {
  background-color: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.stats-tab.active {
  background-color: #5D5CDE;
  border-color: #5D5CDE;
  color: white;
}

.dark .stats-tab.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.stats-tab.active svg {
  color: white;
}

.stats-tab:not(.active) svg {
  color: #5D5CDE;
}

.dark .stats-tab:not(.active) svg {
  color: #3b82f6;
}

.stats-tab:hover:not(.active) {
  border-color: #5D5CDE;
  color: #5D5CDE;
}

.dark .stats-tab:hover:not(.active) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.stats-panel {
  animation: fadeIn 0.3s ease;
}

.stats-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.highlight-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .highlight-card {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.highlight-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.highlight-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.dark .highlight-label {
  color: #9ca3af;
}

.highlight-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.highlight-change.positive {
  color: #10b981;
}

.highlight-change.negative {
  color: #ef4444;
}

.stats-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 1024px) {
  .stats-charts {
    grid-template-columns: 1.5fr 1fr;
  }
}

.stats-chart {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .stats-chart {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .chart-header {
  border-bottom-color: #374151;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .legend-item {
  color: #9ca3af;
}

.legend-color {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.25rem;
}

.volume-chart {
  height: 300px;
}

.donut-chart {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.donut-placeholder {
  position: relative;
  width: 150px;
  height: 150px;
}

.donut-segments {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.donut-segment {
  position: absolute;
  width: 100%;
  height: 100%;
}

.donut-segment.completed {
  background-color: #10b981;
  clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0);
}

.donut-segment.in-progress {
  background-color: #f59e0b;
  clip-path: polygon(50% 50%, 100% 100%, 100% 80%, 100% 80%);
}

.donut-segment.cancelled {
  background-color: #ef4444;
  clip-path: polygon(50% 50%, 0 100%, 5% 100%, 5% 100%);
}

.donut-segments.user-segments .donut-segment.clients {
  background-color: #3b82f6;
  clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 75%, 100% 75%);
}

.donut-segments.user-segments .donut-segment.drivers {
  background-color: #f59e0b;
  clip-path: polygon(50% 50%, 100% 75%, 25% 100%, 25% 100%);
}

.donut-segments.user-segments .donut-segment.stores {
  background-color: #10b981;
  clip-path: polygon(50% 50%, 25% 100%, 0 100%, 0 0, 0 0);
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;
}

.dark .donut-center {
  background-color: #1f2937;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-item span:first-of-type {
  margin-right: auto;
}

.legend-value {
  font-weight: 600;
}

.simplified-chart {
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem 1rem 1rem;
}

.chart-column {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.chart-bar {
  width: 80%;
  background-color: #5D5CDE;
  border-radius: 3px 3px 0 0;
}

.dark .chart-bar {
  background-color: #3b82f6;
}

.chart-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .chart-label {
  color: #9ca3af;
}

.store-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.growth-cell {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.growth-cell.positive {
  color: #10b981;
}

.growth-cell.negative {
  color: #ef4444;
}

/* Notifications Section */
.notifications-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .notifications-form {
    grid-template-columns: 1.5fr 1fr;
  }
}

.form-section {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .form-section {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.form-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .form-header {
  border-bottom-color: #374151;
}

.form-title {
  font-size: 1rem;
  font-weight: 600;
}

.form-row {
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  color: #111827;
}

.dark .form-input, .dark .form-textarea {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.form-input:focus, .form-textarea:focus {
  border-color: #5D5CDE;
  outline: none;
}

.dark .form-input:focus, .dark .form-textarea:focus {
  border-color: #3b82f6;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.recipients-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.recipient-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.notification-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dark .notification-type {
  border-color: #4b5563;
}

.notification-type.active {
  border-color: #5D5CDE;
  background-color: rgba(93, 92, 222, 0.1);
}

.dark .notification-type.active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.15);
}

.notification-type svg {
  color: #6b7280;
}

.dark .notification-type svg {
  color: #9ca3af;
}

.notification-type.active svg {
  color: #5D5CDE;
}

.dark .notification-type.active svg {
  color: #3b82f6;
}

.notification-type span {
  font-size: 0.875rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dark .form-actions {
  border-top-color: #374151;
}

.notification-preview {
  padding: 1rem;
}

.preview-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.phone-frame {
  width: 100%;
  max-width: 300px;
  background-color: #f3f4f6;
  border-radius: 1.5rem;
  padding: 1rem 0.75rem;
}

.dark .phone-frame {
  background-color: #111827;
}

.phone-header {
  text-align: center;
  margin-bottom: 1rem;
}

.phone-time {
  font-weight: 500;
}

.notification-panel {
  background-color: white;
  border-radius: 0.75rem;
  padding: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 0.75rem;
}

.dark .notification-panel {
  background-color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.app-icon {
  width: 2rem;
  height: 2rem;
  background-color: #5D5CDE;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.dark .app-icon {
  background-color: #3b82f6;
}

.notification-content {
  flex: 1;
}

.notification-app {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.notification-text {
  font-size: 0.875rem;
  color: #4b5563;
}

.dark .notification-text {
  color: #9ca3af;
}

.preview-info {
  padding: 0 1rem;
}

.preview-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.dark .preview-info p {
  color: #9ca3af;
}

.recipient-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.dark .recipient-count {
  background-color: #374151;
}

.notifications-history {
  width: 100%;
  overflow-x: auto;
}

.message-cell, .title-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Block User Modal */
.block-user-content {
  padding: 1rem;
}

.user-info-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .user-info-block {
  border-bottom-color: #374151;
}

.user-details-block {
  flex: 1;
}

.user-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .user-email {
  color: #9ca3af;
}

.block-options {
  margin-bottom: 1.5rem;
}

.block-option-title, .block-duration-title, .payment-detail-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.block-options-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.block-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.payment-details {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.dark .payment-details {
  background-color: #374151;
  border-color: #4b5563;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-amount {
  position: relative;
}

.payment-currency {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0.75rem;
  font-weight: 600;
}

.payment-input {
  padding-left: 2rem;
}

.unblock-message {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.dark .unblock-message {
  background-color: #374151;
}

.unblock-message svg {
  color: #f59e0b;
  flex-shrink: 0;
}

.cancel-btn, .submit-btn {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-btn {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.dark .cancel-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.submit-btn {
  background-color: #5D5CDE;
  border: 1px solid #5D5CDE;
  color: white;
  flex: 1;
}

.dark .submit-btn {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.dark .cancel-btn:hover {
  background-color: #4b5563;
}

.submit-btn:hover {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.dark .submit-btn:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.modal-button {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.modal-button.confirm {
  background-color: #5D5CDE;
  color: white;
  flex: 1.5;
}

.dark .modal-button.confirm {
  background-color: #3b82f6;
}

.modal-button.cancel {
  background-color: #f3f4f6;
  color: #6b7280;
  flex: 1;
}

.dark .modal-button.cancel {
  background-color: #374151;
  color: #9ca3af;
}

.modal-button.confirm.danger {
  background-color: #ef4444;
}

.modal-button.confirm.success {
  background-color: #10b981;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-state svg {
  color: #5D5CDE;
  margin-bottom: 1.5rem;
}

.dark .empty-state svg {
  color: #3b82f6;
}

.empty-state p {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .empty-subtitle {
  color: #9ca3af;
}

.empty-section-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.empty-icon {
  color: #5D5CDE;
  margin-bottom: 1.5rem;
}

.dark .empty-icon {
  color: #3b82f6;
}

.empty-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.empty-section-description {
  font-size: 1rem;
  color: #6b7280;
}

.dark .empty-section-description {
  color: #9ca3af;
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
}

.toast {
  display: flex;
  align-items: flex-start;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 0.75rem;
  animation: slideIn 0.3s forwards;
}

.dark .toast {
  background-color: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.info {
  border-left: 4px solid #5D5CDE;
}

.dark .toast.info {
  border-left: 4px solid #3b82f6;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast-icon {
  margin-right: 0.75rem;
}

.toast.success .toast-icon {
  color: #10b981;
}

.toast.info .toast-icon {
  color: #5D5CDE;
}

.dark .toast.info .toast-icon {
  color: #3b82f6;
}

.toast.error .toast-icon {
  color: #ef4444;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #111827;
}

.dark .toast-title {
  color: #f9fafb;
}

.toast-message {
  font-size: 0.875rem;
  color: #4b5563;
}

.dark .toast-message {
  color: #d1d5db;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
}

.dark .toast-close {
  color: #6b7280;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.3s forwards;
}

.dark .modal-container {
  background-color: #1f2937;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .modal-header {
  border-bottom-color: #374151;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.dark .close-button {
  color: #9ca3af;
}

.close-button:hover {
  background-color: #f3f4f6;
}

.dark .close-button:hover {
  background-color: #374151;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
}

.dark .modal-footer {
  border-top-color: #374151;
}

/* Animaciones */
@keyframes slideIn {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Users Table Container */
.users-table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .dark .sidebar {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  }
  
  .sidebar-open {
    transform: translateX(0);
  }
  
  .mobile-close-btn {
    display: block;
  }
  
  .mobile-header {
    display: flex;
  }
  
  .header-actions {
    flex-wrap: wrap;
  }
  
  .stats-tabs {
    padding-bottom: 0.5rem;
  }
  
  .stats-tab {
    padding: 0.5rem 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .stats-highlights, .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-charts, .dashboard-row {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .table-content {
    overflow-x: auto;
  }
  
  .tickets-list {
    grid-template-columns: 1fr;
  }
  
  .notification-types, .recipients-options {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
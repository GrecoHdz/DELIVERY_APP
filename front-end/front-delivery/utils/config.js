// Configuración de la aplicación

// Límite de tamaño para subida de imágenes (4MB)
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024

// Configuración para Cloudinary
export const CLOUDINARY_CONFIG = {
  // Configuración para imágenes de banners
  banners: {
    width: 1200,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  },
  // Configuración para imágenes de productos
  productos: {
    width: 500,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  },
  // Configuración para imágenes de tiendas/locales
  locales: {
    width: 600,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  },
  // Configuración para imágenes de casas
  casas: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  },
  // Configuración para imágenes de autos
  autos: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  }
}

// Lista de ciudades disponibles
export const CIUDADES = [
  'Tegucigalpa',
  'San Pedro Sula',
  'La Ceiba',
  'Choloma',
  'El Progreso',
  'Choluteca',
  'Comayagua',
  'Puerto Cortés',
  'La Lima',
  'Danlí',
  'Juticalpa',
  'Catacamas',
  'Santa Rosa de Copán',
  'Tela',
  'Villanueva',
  'Siguatepeque',
  'Tocoa',
  'Olanchito',
  'Santa Bárbara',
  'Yoro'
]

// Formatos de fecha
export const DATE_FORMAT = {
  short: 'dd/MM/yyyy',
  medium: 'dd MMM yyyy',
  long: 'dd MMMM yyyy'
}

// Estados de pedidos
export const PEDIDO_ESTADOS = {
  PENDIENTE: 'pendiente',
  ACEPTADO: 'aceptado',
  EN_PREPARACION: 'en_preparacion',
  LISTO: 'listo',
  EN_CAMINO: 'en_camino',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado'
}

// Estados de cobros
export const COBRO_ESTADOS = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  VENCIDO: 'vencido'
}

// Tipos de membresía
export const MEMBRESIA_TIPOS = {
  GRATUITA: 1,
  BASICA: 2,
  PREMIUM: 3
}

// Configuración de la API
export const API_CONFIG = {
  timeout: 30000, // 30 segundos
  retries: 3,
  retryDelay: 1000 // 1 segundo
}

// Configuración de paginación
export const PAGINATION_CONFIG = {
  itemsPerPage: 10,
  maxPagesShown: 5
}

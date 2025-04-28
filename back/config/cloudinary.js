const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configuraciones específicas para diferentes tipos de imágenes
const imageConfigs = {
  banner: {
    folder: 'Delivery/banners',
    transformation: [{
      width: 1200,
      height: 400,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      format: 'webp',
      dpr: 'auto'
    }]
  },
  product: {
    folder: 'Delivery/products',
    transformation: [{
      width: 500,
      height: 400,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      format: 'webp',
      dpr: 'auto'
    }]
  },
  store: {
    folder: 'Delivery/stores',
    transformation: [{
      width: 600,
      height: 400,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      format: 'webp',
      dpr: 'auto'
    }]
  },
  car: {
    folder: 'Delivery/cars',
    transformation: [{
      width: 800,
      height: 600,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      format: 'webp',
      dpr: 'auto'
    }]
  },
  house: {
    folder: 'Delivery/houses',
    transformation: [{
      width: 1000,
      height: 750,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      format: 'webp',
      dpr: 'auto'
    }]
  }
};

// Función para crear storage según el tipo
const createStorage = (type) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      ...imageConfigs[type],
      resource_type: "image",
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      overwrite: true,
      invalidate: true
    }
  });
};

// Crear diferentes uploads para cada tipo
const uploadBanner = multer({
  storage: createStorage('banner'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB para banners
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

const uploadProduct = multer({
  storage: createStorage('product'),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB para productos
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

const uploadStore = multer({
  storage: createStorage('store'),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB para locales
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

const uploadCar = multer({
  storage: createStorage('car'),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB para carros
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

const uploadHouse = multer({
  storage: createStorage('house'),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB para casas
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

// Mantener el upload original para compatibilidad con código existente
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Delivery', // Carpeta donde se guardarán las imágenes
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Formatos permitidos
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Transformaciones
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
  fileFilter: (req, file, cb) => {
    // Verificar si es una imagen
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

module.exports = {
  cloudinary,
  upload,
  uploadBanner,
  uploadProduct,
  uploadStore,
  uploadCar,
  uploadHouse
};
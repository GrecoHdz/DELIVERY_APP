const BannerPublicitario = require("../models/BannerPublicitario");
const { cloudinary } = require("../config/cloudinary");

// Obtener todos los banners (activos e inactivos)
const getAllBanners = async (req, res) => {
  try {
    const banners = await BannerPublicitario.findAll(); // No filtramos por "activo"
    if (!banners || banners.length === 0) {
      return res.status(404).json({ message: "No se encontraron banners" });
    }
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los banners", error });
  }
};

// Obtener solo los banners activos
const getActiveBanners = async (req, res) => {
  try {
    const banners = await BannerPublicitario.findAll({
      where: { activo: true }, // Filtramos solo los banners activos
    });
    if (!banners || banners.length === 0) {
      return res.status(404).json({ message: "No se encontraron banners activos" });
    }
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los banners activos", error });
  }
};

// Obtener todos los banners de un local
const getBannersByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const banners = await BannerPublicitario.findAll({
      where: { id_local },
    });

    if (!banners || banners.length === 0) {
      return res.status(404).json({ message: "No se encontraron banners para este local" });
    }

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los banners del local", error });
  }
};

// Crear un nuevo banner
const createBanner = async (req, res) => {
  const { id_local } = req.params;
  const { titulo, descripcion, url_destino } = req.body;

  try {
    // Datos para crear el banner
    const bannerData = {
      id_local,
      titulo,
      descripcion,
      url_destino,
      activo: true,
    };

    // Si el middleware 'uploadBanner' subió una imagen, usar su información
    if (req.file) {
      bannerData.imagen_url = req.file.path; // URL segura proporcionada por multer-storage-cloudinary
      bannerData.imagen_public_id = req.file.filename; // public_id proporcionado por multer-storage-cloudinary
      console.log('Imagen de banner subida con éxito:', req.file.filename);
    } else {
      return res.status(400).json({ message: "Se requiere una imagen para el banner" });
    }

    // Crear el nuevo banner
    const banner = await BannerPublicitario.create(bannerData);

    res.status(201).json({
      message: "Banner creado exitosamente",
      banner
    });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El local no existe" });
    }
    res.status(500).json({ message: "Error al crear el banner", error });
  }
};

// Actualizar un banner
const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, url_destino, activo } = req.body;

  try {
    const banner = await BannerPublicitario.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    // Datos para actualizar
    const updateData = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (url_destino !== undefined) updateData.url_destino = url_destino;
    if (activo !== undefined) updateData.activo = activo;

    // Manejar eliminación de imagen antigua si hay una nueva imagen
    if (req.file) {
      if (banner.imagen_public_id) {
        try {
          // Usar cloudinary.uploader.destroy para eliminar la imagen
          const result = await cloudinary.uploader.destroy(banner.imagen_public_id);
          console.log('Resultado de eliminación de imagen antigua:', result);
          if (result.result === 'ok' || result.result === 'not found') {
            console.log('Imagen antigua eliminada con éxito o no encontrada en Cloudinary');
          } else {
            console.warn('No se pudo eliminar la imagen antigua de Cloudinary:', result);
          }
        } catch (error) {
          console.error('Error al intentar eliminar imagen antigua de Cloudinary:', error);
          // Considerar si se debe detener la actualización o continuar sin eliminar la imagen antigua
        }
      }
      // Usar la información de req.file proporcionada por el middleware
      updateData.imagen_url = req.file.path;
      updateData.imagen_public_id = req.file.filename;
      console.log('Middleware subió nueva imagen con éxito:', req.file.filename);
    }

    await banner.update(updateData);

    res.status(200).json({
      message: "Banner actualizado correctamente",
      banner: await BannerPublicitario.findByPk(id)
    });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El local no existe" });
    }
    res.status(500).json({ message: "Error al actualizar el banner", error });
  }
};

// Eliminar un banner
const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await BannerPublicitario.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    // Si el banner tiene una imagen, eliminarla de Cloudinary
    if (banner.imagen_public_id) {
      try {
        const result = await cloudinary.uploader.destroy(banner.imagen_public_id);
        console.log('Resultado de eliminación de imagen:', result);
        if (result.result === 'ok' || result.result === 'not found') {
          console.log('Imagen eliminada con éxito o no encontrada en Cloudinary');
        } else {
          console.warn('No se pudo eliminar la imagen de Cloudinary:', result);
        }
      } catch (cloudinaryError) {
        console.error('Error al eliminar imagen de Cloudinary:', cloudinaryError);
        // Continuamos con la eliminación del banner aunque falle la eliminación de la imagen
      }
    }

    await banner.destroy();
    res.status(200).json({ message: "Banner eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el banner", error });
  }
};

module.exports = {
  getAllBanners,
  getActiveBanners,
  getBannersByLocal,
  createBanner,
  updateBanner,
  deleteBanner,
};
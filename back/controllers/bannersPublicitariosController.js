const BannerPublicitario = require("../models/BannerPublicitario");

// Obtener todos los banners de un local
const getBannersByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const banners = await BannerPublicitario.findAll({
      where: { id_local, activo: true }, // Solo banners activos
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
  const { id_local, titulo, descripcion, imagen_url, url_destino } = req.body;

  try {
    const nuevoBanner = await BannerPublicitario.create({
      id_local,
      titulo,
      descripcion,
      imagen_url,
      url_destino,
    });

    res.status(201).json({ message: "Banner creado exitosamente", banner: nuevoBanner });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el banner", error });
  }
};

// Actualizar un banner
const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { id_local, titulo, descripcion, imagen_url, url_destino, activo } = req.body;

  try {
    const banner = await BannerPublicitario.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    await banner.update({
      id_local,
      titulo,
      descripcion,
      imagen_url,
      url_destino,
      activo,
    });

    res.status(200).json({ message: "Banner actualizado correctamente", banner });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
    }
    res.status(500).json({ message: "Error al actualizar el banner", error });
  }
};

// Eliminar un banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await BannerPublicitario.findByPk(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    await banner.destroy();
    res.status(200).json({ message: "Banner eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el banner", error });
  }
};

module.exports = {
  getBannersByLocal,
  createBanner,
  updateBanner,
  deleteBanner,
};
const BannerPublicitario = require("../models/BannerPublicitario");

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
      where: { id_local, activo: true }, // Solo los banners activos del local
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
    const banner = await BannerPublicitario.create({
      id_local,
      titulo,
      descripcion,
      imagen_url,
      url_destino,
      activo: true,
    });

    res.status(201).json({ message: "Banner creado exitosamente" });
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
  const { titulo, descripcion, imagen_url, url_destino, activo } = req.body;

  try {
    const banner = await BannerPublicitario.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    await banner.update({
      titulo,
      descripcion,
      imagen_url,
      url_destino,
      activo,
    });

    res.status(200).json({ message: "Banner actualizado correctamente" });
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
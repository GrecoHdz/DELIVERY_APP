const Favorito = require("../models/Favorito");

// Obtener todos los favoritos
const getAllFavoritos = async (req, res) => {
  try {
    const favoritos = await Favorito.findAll();
    if (!favoritos || favoritos.length === 0) {
      return res.status(404).json({ message: "No se encontraron favoritos" });
    }
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los favoritos", error });
  }
};

// Obtener un favorito por su ID
const getFavoritoById = async (req, res) => {
  const { id } = req.params;

  try {
    const favorito = await Favorito.findByPk(id);
    if (!favorito) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }
    res.json(favorito);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el favorito", error });
  }
};

// Crear un nuevo favorito
const createFavorito = async (req, res) => {
    const { id_cliente } = req.params;
    const { id_producto, id_local } = req.body;

  try {
    const favorito = await Favorito.create({
      id_cliente,
      id_producto,
      id_local,
    });

    res.status(201).json({ message: "Favorito creado exitosamente", data: favorito });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_producto")) {
        return res.status(400).json({ message: "El producto no existe" });
      }
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el favorito", error });
  }
};

// Eliminar un favorito
const deleteFavorito = async (req, res) => {
  const { id } = req.params;

  try {
    const favorito = await Favorito.findByPk(id);
    if (!favorito) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    await favorito.destroy();
    res.status(200).json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el favorito", error });
  }
};

module.exports = {
  getAllFavoritos,
  getFavoritoById,
  createFavorito,
  deleteFavorito,
};
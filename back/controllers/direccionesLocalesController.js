const DireccionLocal = require("../models/DireccionLocal");

// Obtener todas las direcciones de un local
const getDireccionesByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const direcciones = await DireccionLocal.findAll({
      where: { id_local },
    });

    if (!direcciones || direcciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron direcciones para este local" });
    }

    res.json(direcciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las direcciones del local", error });
  }
};

// Crear una nueva dirección para un local
const createDireccion = async (req, res) => {
  const { id_local, id_ciudad, colonia, direccion_precisa, latitud, longitud } = req.body;

  try {
    const nuevaDireccion = await DireccionLocal.create({
      id_local,
      id_ciudad,
      colonia,
      direccion_precisa,
      latitud,
      longitud,
    });

    res.status(201).json({ message: "Dirección creada exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
      if (error.fields.includes("id_ciudad")) {
        return res.status(400).json({ message: "La ciudad no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la dirección", error });
  }
};

// Actualizar una dirección específica de un local
const updateDireccion = async (req, res) => {
  const { id_local } = req.params; // ID del local desde la URL
  const { id_direccion_local, colonia, direccion_precisa, latitud, longitud, activo } = req.body;

  try {
    // Buscar la dirección específica del local
    const direccion = await DireccionLocal.findOne({
      where: {
        id_direccion_local,
        id_local, // Asegurarse de que pertenezca al local correcto
      },
    });

    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada para este local" });
    }

    // Actualizar los campos de la dirección
    await direccion.update({
      colonia,
      direccion_precisa,
      latitud,
      longitud,
      activo,
    });

    res.status(200).json({ message: "Dirección actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la dirección", error });
  }
};

// Eliminar una dirección
const deleteDireccion = async (req, res) => {
  const { id_local, id_direccion_local } = req.params;

  try {
    const direccion = await DireccionLocal.findOne({
      where: {
        id_direccion_local,
        id_local,
      },
    });

    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada para este local" });
    }

    await direccion.destroy();
    res.status(200).json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la dirección", error });
  }
};

module.exports = {
  getDireccionesByLocal,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};
const DireccionCliente = require("../models/DireccionCliente");

// Obtener todas las direcciones de un cliente
const getDireccionesByCliente = async (req, res) => {
    const { id_cliente } = req.params;
  
    try {
      const direcciones = await DireccionCliente.findAll({
        where: { id_cliente },  
      });
  
      if (!direcciones || direcciones.length === 0) {
        return res.status(404).json({ message: "No se encontraron direcciones para este cliente" });
      }
  
      res.json(direcciones);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las direcciones del cliente", error });
    }
  };

// Crear una nueva dirección para un cliente
const createDireccion = async (req, res) => {
  const { id_cliente, id_ciudad, colonia, direccion_precisa, alias_direccion, latitud, longitud } = req.body;

  try {
    const nuevaDireccion = await DireccionCliente.create({
      id_cliente,
      id_ciudad,
      colonia,
      direccion_precisa,
      alias_direccion,
      latitud,
      longitud,
    });

    res.status(201).json({ message: "Dirección creada exitosamente"});
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_ciudad")) {
        return res.status(400).json({ message: "La ciudad no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la dirección", error });
  }
};

// Actualizar una dirección específica de un cliente
const updateDireccion = async (req, res) => {
    const { id_cliente } = req.params; // ID del cliente desde la URL
    const { id_direccion_cliente, colonia, direccion_precisa, alias_direccion, latitud, longitud, activo } = req.body;
  
    try {
      // Buscar la dirección específica del cliente
      const direccion = await DireccionCliente.findOne({
        where: {
          id_direccion_cliente,
          id_cliente, // Asegurarse de que pertenezca al cliente correcto
        },
      });
  
      if (!direccion) {
        return res.status(404).json({ message: "Dirección no encontrada para este cliente" });
      }
  
      // Actualizar los campos de la dirección
      await direccion.update({
        colonia,
        direccion_precisa,
        alias_direccion,
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
  try {
    const direccion = await DireccionCliente.findByPk(req.params.id);
    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    await direccion.destroy();
    res.status(200).json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la dirección", error });
  }
};

module.exports = {
  getDireccionesByCliente,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};
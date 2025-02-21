const Cliente = require("../models/Cliente");

// Obtener todos los clientes
const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

// Obtener un cliente por su ID
const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};

// Crear un nuevo cliente
const createCliente = async (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, identidad, fecha_nacimiento, telefono } = req.body;

  try {
    const cliente = await Cliente.create({
      id_usuario,
      nombre,
      identidad,
      fecha_nacimiento,
      telefono,
    });
    res.status(201).json({ message: "Cliente creado exitosamente"});
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El ID de usuario ya está asociado a otro cliente" });
    }
    res.status(500).json({ message: "Error al crear el cliente", error });
  }
};

// Actualizar un cliente
const updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, identidad, fecha_nacimiento, telefono, activo } = req.body;

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await cliente.update({
      nombre,
      identidad,
      fecha_nacimiento,
      telefono,
      activo,
    });

    res.status(200).json({ message: "Cliente actualizado correctamente"});
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El ID de usuario ya está asociado a otro cliente" });
    }
    res.status(500).json({ message: "Error al actualizar el cliente", error });
  }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await cliente.destroy();
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente", error });
  }
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
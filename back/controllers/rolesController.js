const Rol = require("../models/Rol");

// Obtener todos los roles
const getRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los roles", error });
  }
};

// Obtener un rol por su ID
const getRolById = async (req, res) => {
  try {
    const rol = await Rol.findByPk(req.params.id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el rol", error });
  }
};

// Crear un nuevo rol
const createRol = async (req, res) => {
  const { nombre_rol } = req.body;

  try {
    await Rol.create({ nombre_rol });
    res.status(201).json({ message: "Rol creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el rol", error });
  }
};

// Actualizar un rol
const updateRol = async (req, res) => {
  const { id } = req.params;
  const { nombre_rol } = req.body;

  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await rol.update({ nombre_rol });
    res.status(200).json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol", error });
  }
};

// Eliminar un rol
const deleteRol = async (req, res) => {
  try {
    const rol = await Rol.findByPk(req.params.id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await rol.destroy();
    res.status(200).json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el rol", error });
  }
};

module.exports = {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
};
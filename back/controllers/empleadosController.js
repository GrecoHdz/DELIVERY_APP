const Empleado = require("../models/Empleado");

// Obtener todos los empleados
const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    if (!empleados || empleados.length === 0) {
      return res.status(404).json({ message: "No se encontraron empleados" });
    }
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los empleados", error });
  }
};

// Obtener un empleado por su ID
const getEmpleadoById = async (req, res) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el empleado", error });
  }
};

// Crear un nuevo empleado
const createEmpleado = async (req, res) => {
  const { id_local } = req.params;
  const { id_usuario } = req.body;

  try {
    const empleado = await Empleado.create({
      id_local,
      id_usuario,
    });

    res.status(201).json({ message: "Empleado creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
      if (error.fields.includes("id_usuario")) {
        return res.status(400).json({ message: "El usuario no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el empleado", error });
  }
};

// Actualizar un empleado
const updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const { id_local, id_usuario, activo } = req.body;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    await empleado.update({
      id_local,
      id_usuario,
      activo,
    });

    res.status(200).json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el empleado", error });
  }
};

// Eliminar un empleado
const deleteEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    await empleado.destroy();
    res.status(200).json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el empleado", error });
  }
};

module.exports = {
  getAllEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
};
const Local = require("../models/Local");

// Obtener todos los locales
const getLocales = async (req, res) => {
  try {
    const locales = await Local.findAll();
    res.json(locales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los locales", error });
  }
};

// Obtener un local por su ID
const getLocalById = async (req, res) => {
  try {
    const local = await Local.findByPk(req.params.id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }
    res.json(local);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el local", error });
  }
};

// Crear un nuevo local
const createLocal = async (req, res) => {
  const { id_cliente } = req.params;
  const { nombre_local, apertura, cierre, rtn, imagen_url, pedidos_restantes, usuario_empleado} = req.body;

  try {
    const local = await Local.create({
      id_cliente,
      nombre_local,
      apertura,
      cierre,
      rtn,
      imagen_url,
      pedidos_restantes,
      usuario_empleado,
    });
    res.status(201).json({ message: "Local creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      // Manejar errores específicos de claves foráneas
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("rtn")) {
        return res.status(400).json({ message: "El rtn ya esta registrado" });
      }
    }
    res.status(500).json({ message: "Error al crear el local", error });
  }
};

// Actualizar un local
const updateLocal = async (req, res) => {
  const { id } = req.params;
  const { id_cliente, id_membresia, nombre_local, apertura, cierre, rtn, imagen_url, activo, pedidos_restantes, usuario_empleado } = req.body;

  try {
    const local = await Local.findByPk(id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    await local.update({
      id_cliente,
      id_membresia,
      nombre_local,
      apertura,
      cierre,
      rtn,
      imagen_url,
      activo,
      pedidos_restantes,
      usuario_empleado,
    });

    res.status(200).json({ message: "Local actualizado correctamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_membresia")) {
        return res.status(400).json({ message: "La membresía no existe" });
      }else 
        return res.status(400).json({ message: "Usuario no encontrado" });
       
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      if (error.errors.some(e => e.path === "rtn_UNIQUE")) {
        return res.status(400).json({ message: "El RTN ya está registrado" });
      }
    }

    res.status(500).json({ message: "Error al actualizar el local", error });
  }
};

// Eliminar un local
const deleteLocal = async (req, res) => {
  try {
    const local = await Local.findByPk(req.params.id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    await local.destroy();
    res.status(200).json({ message: "Local eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el local", error });
  }
};

module.exports = {
  getLocales,
  getLocalById,
  createLocal,
  updateLocal,
  deleteLocal,
};
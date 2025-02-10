const UsuarioRol = require("../models/UsuarioRol");
const Usuario = require("../models/Usuario");

// Obtener todas las relaciones usuario-rol
const getUsuarioRoles = async (req, res) => {
  try {
    const usuarioRoles = await UsuarioRol.findAll();
    res.json(usuarioRoles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las relaciones usuario-rol", error });
  }
};

// Obtener una relación usuario-rol por su ID de usuario y ID de rol
const getUsuarioRolById = async (req, res) => {
  const { id_usuario, id_rol } = req.params;

  try {
    const usuarioRol = await UsuarioRol.findOne({
      where: { id_usuario, id_rol },
    });
    if (!usuarioRol) {
      return res.status(404).json({ message: "Relación usuario-rol no encontrada" });
    }
    res.json(usuarioRol);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la relación usuario-rol", error });
  }
};

// Crear una nueva relación usuario-rol
const createUsuarioRol = async (req, res) => {
  const { id_usuario, id_rol } = req.body;

  try {
    await UsuarioRol.create({ id_usuario, id_rol });
    res.status(201).json({ message: "Relación usuario-rol creada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la relación usuario-rol", error });
  }
};

// Actualizar el rol de un usuario
const updateUsuarioRol = async (req, res) => {
    const { id_usuario } = req.params;
    const { nuevo_id_rol } = req.body;
  
    try {
      // Buscar el usuario
      const usuario = await Usuario.findByPk(id_usuario);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Actualizar el rol en la tabla Usuarios
      await usuario.update({ id_rol: nuevo_id_rol });
  
      // Verificar si la relación en UsuarioRoles existe
      const usuarioRol = await UsuarioRol.findOne({ where: { id_usuario } });
  
      if (usuarioRol) {
        // Si existe, eliminar la relación anterior y crear una nueva
        await usuarioRol.destroy();
      }
  
      // Crear la nueva relación en UsuarioRoles
      await UsuarioRol.create({ id_usuario, id_rol: nuevo_id_rol });
  
      res.status(200).json({ message: "Rol de usuario actualizado correctamente en ambas tablas" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el rol del usuario", error });
    }
  };

// Eliminar una relación usuario-rol (si fuera necesario)
const deleteUsuarioRol = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Reiniciar el rol a 1 (cliente)
    await usuario.update({ id_rol: 1 });

    res.status(200).json({ message: "Rol de usuario restablecido a cliente" });
  } catch (error) {
    res.status(500).json({ message: "Error al restablecer el rol del usuario", error });
  }
};

module.exports = {
  getUsuarioRoles,
  getUsuarioRolById,
  updateUsuarioRol,
  deleteUsuarioRol,
  createUsuarioRol,
};

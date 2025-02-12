const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Cliente = require("../models/Cliente")
const UsuarioRol = require("../models/UsuarioRol");

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Obtener un usuario por su ID
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};
// Obtener un usuario por su nombre
const getUserByUsername = async (usuario) => {
  return await Usuario.findOne({ where: { usuario } });
};
// Crear un nuevo usuario
const createUsuario = async (req, res) => {
  const { usuario, clave, id_rol = 1, email, imagen_perfil_url, nombre, identidad, fecha_nacimiento, telefono } = req.body;

  try {
    // Generar el hash de la clave antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(clave, salt);

    // Crear el usuario y obtener su ID
    const nuevoUsuario = await Usuario.create({
      usuario,
      clave_hash: hashedPassword,
      id_rol,
      email,
      imagen_perfil_url,
    });

    // Insertar en UsuarioRoles
    await UsuarioRol.create({
      id_usuario: nuevoUsuario.id_usuario,
      id_rol,
    });

    // Crear el cliente asociado al usuario
    await Cliente.create({
      id_usuario: nuevoUsuario.id_usuario, 
      nombre,
      identidad,
      fecha_nacimiento,
      telefono,
      activo: true,
    });
    res.status(201).json({ message: "Usuario creado exitosamente y registrado en UsuarioRoles" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de usuario o email ya existe" });
    }
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { usuario, clave, id_rol, email, imagen_perfil_url } = req.body;

  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si el usuario envió una nueva clave, la hasheamos antes de guardarla
    let hashedPassword;
    if (clave) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(clave, salt);
    }

    // Actualizamos los datos del usuario
    await user.update({
      usuario: usuario || user.usuario,
      clave_hash: hashedPassword || user.clave_hash,
      id_rol: id_rol || user.id_rol,
      email: email || user.email,
      imagen_perfil_url: imagen_perfil_url || user.imagen_perfil_url,
    });
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de usuario o email ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  getUserByUsername,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};

const getUserByUsername = async (usuario) => {
  return await Usuario.findOne({ where: { usuario } });
};

const createUsuario = async (req, res) => {
  const { usuario, clave, id_rol, email, imagen_perfil_url } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(clave, salt);
    const nuevoUsuario = await Usuario.create({
      usuario,
      clave_hash: hashedPassword,
      id_rol,
      email,
      imagen_perfil_url,
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { usuario, clave, email, imagen_perfil_url } = req.body;
  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    let hashedPassword;
    if (clave) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(clave, salt);
    }
    await user.update({
      usuario: usuario || user.usuario,
      clave_hash: hashedPassword || user.clave_hash,
      email: email || user.email,
      imagen_perfil_url: imagen_perfil_url || user.imagen_perfil_url,
    });
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    await usuario.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
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
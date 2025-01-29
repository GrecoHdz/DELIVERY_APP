const Usuario = require("../models/Usuario");

// Obtener usuarios
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

const createUsuario = async (req, res) => {
  try {
    const { usuario, clave, id_rol } = req.body;
    const nuevoUsuario = await Usuario.create({ usuario, clave, id_rol });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { usuario, clave, id_rol } = req.body;
    const usuarioExistente = await Usuario.findByPk(req.params.id);
    if (!usuarioExistente) return res.status(404).json({ message: "Usuario no encontrado" });

    await usuarioExistente.update({ usuario, clave, id_rol });
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
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
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
};

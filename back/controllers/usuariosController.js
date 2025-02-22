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
  const { usuario, clave, id_rol = 1, email, 
    nombre, identidad, fecha_nacimiento, telefono, id_ciudad } = req.body;

  // Iniciar una transacción
  const t = await Usuario.sequelize.transaction();

  try {
    // Generar el hash de la clave antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(clave, salt);

    // Crear el usuario dentro de la transacción
    const nuevoUsuario = await Usuario.create(
      {
        usuario,
        clave_hash: hashedPassword,
        id_rol,
        email,
      },
      { transaction: t } // Asociar la transacción
    );

    // Insertar en UsuarioRoles dentro de la transacción
    await UsuarioRol.create(
      {
        id_usuario: nuevoUsuario.id_usuario,
        id_rol,
      },
      { transaction: t } // Asociar la transacción
    );

    // Crear el cliente asociado al usuario dentro de la transacción
    await Cliente.create(
      {
        id_usuario: nuevoUsuario.id_usuario, // Relacionamos con el usuario recién creado
        id_ciudad,
        nombre,
        identidad,
        fecha_nacimiento,
        telefono,
         // Por defecto, el cliente está activo
      },
      { transaction: t } // Asociar la transacción
    );

    // Confirmar la transacción
    await t.commit();

    res.status(201).json({ message: "Usuario y cliente creados exitosamente" });
  } catch (error) {
    // Revertir la transacción en caso de error
    await t.rollback();
 
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "Ciudad no Disponible" });
    }
    else if (error.name === "SequelizeUniqueConstraintError") {
      // Manejar errores específicos de campos únicos
      const errors = error.errors.map(err => {
        if (err.path === "identidad") {
          return { message: "La identidad ya está registrada" };
        } else if (err.path === "telefono") {
          return { message: "El número de teléfono ya está registrado" };
        } else if (err.path === "usuario") {
          return { message: "El nombre de usuario ya existe" };
        } else if (err.path === "email") {
          return { message: "El email ya está registrado" };
        }
      });
      return res.status(400).json({ errores: errors });
    } 
    res.status(500).json({ message: "Error al crear el usuario o cliente", error });
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
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El Rol no existe" });
    }
    else if (error.name === "SequelizeUniqueConstraintError") {
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
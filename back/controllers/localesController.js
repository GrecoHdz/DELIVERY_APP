const Local = require("../models/Local");
const MembresiaLocal = require("../models/MembresiaLocales");
const { cloudinary } = require("../config/cloudinary");

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

// Obtener la membresía de un local por su ID
const getLocalMembresiaById = async (req, res) => {
  try {
    const local = await Local.findByPk(req.params.id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    const membresia = await MembresiaLocal.findByPk(local.id_membresia);
    if (!membresia) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }

    res.json({
      id_local: local.id_local,
      id_membresia: local.id_membresia,
      nombre_membresia: membresia.nombre_membresia,
      limite_recomendaciones: membresia.limite_recomendaciones || 1 // Por defecto, 1 recomendación
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la membresía del local", error });
  }
};

// Crear un nuevo local
const createLocal = async (req, res) => {
  const { id_cliente } = req.params;
  const { nombre_local, apertura, cierre, rtn, pedidos_restantes } = req.body;

  try {
    // Datos para crear el local
    const localData = {
      id_cliente,
      nombre_local,
      apertura,
      cierre,
      rtn,
      pedidos_restantes,
    };

    // Si el middleware 'uploadStore' subió una imagen, usar su información
    if (req.file) {
      localData.imagen_url = req.file.path; // URL segura proporcionada por multer-storage-cloudinary
      localData.imagen_public_id = req.file.filename; // public_id proporcionado por multer-storage-cloudinary
      console.log('Imagen de local subida con éxito:', req.file.filename);
    }

    // Crear el nuevo local
    const local = await Local.create(localData);

    res.status(201).json({
      message: "Local creado exitosamente",
      local
    });
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
  const { id_cliente, id_membresia, nombre_local, apertura, cierre, rtn, activo, pedidos_restantes, recomendaciones_restantes, usuario_empleado } = req.body;

  try {
    const local = await Local.findByPk(id);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    // Datos para actualizar
    const updateData = {};
    if (id_cliente !== undefined) updateData.id_cliente = id_cliente;
    if (id_membresia !== undefined) updateData.id_membresia = id_membresia;
    if (nombre_local !== undefined) updateData.nombre_local = nombre_local;
    if (apertura !== undefined) updateData.apertura = apertura;
    if (cierre !== undefined) updateData.cierre = cierre;
    if (rtn !== undefined) updateData.rtn = rtn;
    if (activo !== undefined) updateData.activo = activo;
    if (pedidos_restantes !== undefined) updateData.pedidos_restantes = pedidos_restantes;
    if (recomendaciones_restantes !== undefined) updateData.recomendaciones_restantes = recomendaciones_restantes;
    if (usuario_empleado !== undefined) updateData.usuario_empleado = usuario_empleado;

    // Manejar eliminación de imagen antigua si hay una nueva imagen
    if (req.file) {
      if (local.imagen_public_id) {
        try {
          // Usar cloudinary.uploader.destroy para eliminar la imagen
          const result = await cloudinary.uploader.destroy(local.imagen_public_id);
          console.log('Resultado de eliminación de imagen antigua:', result);
          if (result.result === 'ok' || result.result === 'not found') {
            console.log('Imagen antigua eliminada con éxito o no encontrada en Cloudinary');
          } else {
            console.warn('No se pudo eliminar la imagen antigua de Cloudinary:', result);
          }
        } catch (error) {
          console.error('Error al intentar eliminar imagen antigua de Cloudinary:', error);
          // Considerar si se debe detener la actualización o continuar sin eliminar la imagen antigua
        }
      }
      // Usar la información de req.file proporcionada por el middleware
      updateData.imagen_url = req.file.path;
      updateData.imagen_public_id = req.file.filename;
      console.log('Middleware subió nueva imagen con éxito:', req.file.filename);
    }

    await local.update(updateData);

    res.status(200).json({
      message: "Local actualizado correctamente",
      local: await Local.findByPk(id)
    });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_membresia")) {
        return res.status(400).json({ message: "La membresía no existe" });
      } else {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
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

    // Si el local tiene una imagen, eliminarla de Cloudinary
    if (local.imagen_public_id) {
      try {
        const result = await cloudinary.uploader.destroy(local.imagen_public_id);
        console.log('Resultado de eliminación de imagen:', result);
        if (result.result === 'ok' || result.result === 'not found') {
          console.log('Imagen eliminada con éxito o no encontrada en Cloudinary');
        } else {
          console.warn('No se pudo eliminar la imagen de Cloudinary:', result);
        }
      } catch (cloudinaryError) {
        console.error('Error al eliminar imagen de Cloudinary:', cloudinaryError);
        // Continuamos con la eliminación del local aunque falle la eliminación de la imagen
      }
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
  getLocalMembresiaById,
  createLocal,
  updateLocal,
  deleteLocal,
};
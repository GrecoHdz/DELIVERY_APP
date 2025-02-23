const NotificacionDestinatario = require("../models/NotificacionDestinatario");

// Obtener todos los destinatarios de notificaciones
const getAllDestinatarios = async (req, res) => {
  try {
    const destinatarios = await NotificacionDestinatario.findAll();
    if (!destinatarios || destinatarios.length === 0) {
      return res.status(404).json({ message: "No se encontraron destinatarios" });
    }
    res.json(destinatarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los destinatarios", error });
  }
};

// Obtener un destinatario por su ID
const getDestinatarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const destinatario = await NotificacionDestinatario.findByPk(id);
    if (!destinatario) {
      return res.status(404).json({ message: "Destinatario no encontrado" });
    }
    res.json(destinatario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el destinatario", error });
  }
};

// Crear un nuevo destinatario
const createDestinatario = async (req, res) => {
  const { id_notificacion, parametros, id_usuario, id_cliente, id_local, id_driver } = req.body;

  try {
    const destinatario = await NotificacionDestinatario.create({
      id_notificacion,
      parametros,
      id_usuario,
      id_cliente,
      id_local,
      id_driver,
    });

    res.status(201).json({ message: "Destinatario creado exitosamente", data: destinatario });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "La notificación o alguno de los destinatarios no existe" });
    }
    res.status(500).json({ message: "Error al crear el destinatario", error });
  }
};

// Actualizar un destinatario existente
const updateDestinatario = async (req, res) => {
  const { id } = req.params;
  const { parametros, id_usuario, id_cliente, id_local, id_driver } = req.body;

  try {
    const destinatario = await NotificacionDestinatario.findByPk(id);
    if (!destinatario) {
      return res.status(404).json({ message: "Destinatario no encontrado" });
    }

    await destinatario.update({
      parametros,
      id_usuario,
      id_cliente,
      id_local,
      id_driver,
    });

    res.status(200).json({ message: "Destinatario actualizado correctamente", data: destinatario });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el destinatario", error });
  }
};

// Eliminar un destinatario
const deleteDestinatario = async (req, res) => {
  const { id } = req.params;

  try {
    const destinatario = await NotificacionDestinatario.findByPk(id);
    if (!destinatario) {
      return res.status(404).json({ message: "Destinatario no encontrado" });
    }

    await destinatario.destroy();
    res.status(200).json({ message: "Destinatario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el destinatario", error });
  }
};

module.exports = {
  getAllDestinatarios,
  getDestinatarioById,
  createDestinatario,
  updateDestinatario,
  deleteDestinatario,
};
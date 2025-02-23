const Notificacion = require('../models/Notificacion');

// Obtener todas las notificaciones
exports.getAllNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll({
            include: [{ model: require('../models/Local'), as: 'local' }] // Incluye el local relacionado
        });
        res.status(200).json(notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las notificaciones', error });
    }
};

// Obtener una notificación por ID
exports.getNotificacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const notificacion = await Notificacion.findByPk(id, {
            include: [{ model: require('../models/Local'), as: 'local' }]
        });
        if (!notificacion) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.status(200).json(notificacion);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la notificación', error });
    }
};

// Crear una nueva notificación
exports.createNotificacion = async (req, res) => {
    const { tipo, titulo, mensaje, creado_por } = req.body;

    // Validaciones básicas
    if (!tipo || !titulo) {
        return res.status(400).json({ message: 'El tipo y el título son obligatorios' });
    }

    try {
        const nuevaNotificacion = await Notificacion.create({
            tipo,
            titulo,
            mensaje,
            creado_por
        });
        res.status(201).json({ message: 'Notificación creada exitosamente', data: nuevaNotificacion });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la notificación', error });
    }
};

// Actualizar una notificación existente
exports.updateNotificacion = async (req, res) => {
    const { id } = req.params;
    const { tipo, titulo, mensaje, creado_por } = req.body;

    try {
        const notificacion = await Notificacion.findByPk(id);
        if (!notificacion) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        await notificacion.update({ tipo, titulo, mensaje, creado_por });
        res.status(200).json({ message: 'Notificación actualizada exitosamente', data: notificacion });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la notificación', error });
    }
};

// Eliminar una notificación
exports.deleteNotificacion = async (req, res) => {
    const { id } = req.params;

    try {
        const notificacion = await Notificacion.findByPk(id);
        if (!notificacion) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        await notificacion.destroy();
        res.status(200).json({ message: 'Notificación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la notificación', error });
    }
};
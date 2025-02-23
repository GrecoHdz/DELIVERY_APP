const SoporteTicket = require("../models/SoporteTicket");

// Obtener todos los tickets de soporte
const getAllTickets = async (req, res) => {
  try {
    const tickets = await SoporteTicket.findAll();
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No se encontraron tickets de soporte" });
    }
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tickets de soporte", error });
  }
};

// Obtener un ticket por su ID
const getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await SoporteTicket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el ticket", error });
  }
};

// Crear un nuevo ticket
const createTicket = async (req, res) => {
    const {id_cliente} = req.params;
    const { asunto, descripcion, imagen_url } = req.body;


  try {
    const ticket = await SoporteTicket.create({
      id_cliente,
      asunto,
      descripcion,
      imagen_url,
    });

    res.status(201).json({ message: "Ticket creado exitosamente", data: ticket });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El cliente no existe" });
    }
    res.status(500).json({ message: "Error al crear el ticket", error });
  }
};

// Actualizar un ticket existente
const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { estado, fecha_cierre } = req.body;

  try {
    const ticket = await SoporteTicket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    await ticket.update({
      estado,
      fecha_cierre,
    });

    res.status(200).json({ message: "Ticket actualizado correctamente", data: ticket });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el ticket", error });
  }
};

// Eliminar un ticket
const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await SoporteTicket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    await ticket.destroy();
    res.status(200).json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el ticket", error });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
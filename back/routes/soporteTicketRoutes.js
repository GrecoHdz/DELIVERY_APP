const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/soporteTicketController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los tickets
router.get("/", getAllTickets);

// Obtener un ticket por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del ticket debe ser un número entero"),
  ],
  validarErrores,
  getTicketById
);

// Crear un nuevo ticket
router.post(
  "/:id_cliente",
  [
    param("id_cliente")
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("asunto")
      .notEmpty()
      .withMessage("El asunto es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El asunto no puede exceder los 255 caracteres"),
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción es obligatoria"),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
  ],
  validarErrores,
  createTicket
);

// Actualizar un ticket
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del ticket debe ser un número entero"),
    body("estado")
      .optional()
      .isIn(["Abierto", "En Proceso", "Cerrado"])
      .withMessage("El estado debe ser 'Abierto', 'En Proceso' o 'Cerrado'"),
    body("fecha_cierre")
      .optional()
      .isISO8601()
      .withMessage("La fecha de cierre debe ser una fecha válida"),
  ],
  validarErrores,
  updateTicket
);

// Eliminar un ticket
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del ticket debe ser un número entero"),
  ],
  validarErrores,
  deleteTicket
);

module.exports = router;
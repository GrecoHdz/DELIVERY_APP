const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} = require("../controllers/clientesController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los clientes
router.get("/", getClientes);

// Obtener un cliente por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getClienteById
);

// Crear un nuevo cliente
router.post(
  "/",
  [ 
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del cliente es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre no puede exceder los 255 caracteres"),
    body("identidad")
      .notEmpty()
      .withMessage("La identidad del cliente es obligatoria")
      .isLength({ max: 255 })
      .withMessage("La identidad no puede exceder los 255 caracteres"),
    body("fecha_nacimiento")
      .optional()
      .isDate()
      .withMessage("La fecha de nacimiento debe ser una fecha válida"),
    body("telefono")
      .optional()
      .isLength({ max: 20 })
      .withMessage("El teléfono no puede exceder los 20 caracteres"),
  ],
  validarErrores,
  createCliente
);

// Actualizar un cliente
router.put(
  "/:id",
  [
    body("nombre")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El nombre no puede exceder los 255 caracteres"),
    body("identidad")
      .optional()
      .isLength({ max: 255 })
      .withMessage("La identidad no puede exceder los 255 caracteres"),
    body("fecha_nacimiento")
      .optional()
      .isDate()
      .withMessage("La fecha de nacimiento debe ser una fecha válida"),
    body("telefono")
      .optional()
      .isLength({ max: 20 })
      .withMessage("El teléfono no puede exceder los 20 caracteres"),
  ],
  validarErrores,
  updateCliente
);

// Eliminar un cliente
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteCliente
);

module.exports = router;
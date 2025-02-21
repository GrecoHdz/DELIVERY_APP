const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllMembresias,
  getMembresiaById,
  createMembresia,
  updateMembresia,
  deleteMembresia,
} = require("../controllers/membresiasDriversController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las membresías de drivers
router.get("/", getAllMembresias);

// Obtener una membresía por su ID
router.get("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
getMembresiaById
);

// Crear una nueva membresía
router.post(
  "/:id_driver",
  [
    param("id_driver").isInt().withMessage("El ID debe ser un número entero"),
     body("saldo_solicitado")
      .optional()
      .isDecimal()
      .withMessage("El saldo solicitado debe ser un número decimal válido"),
    body("comprobante")
      .optional()
      .isURL()
      .withMessage("La URL del comprobante debe ser válida"),
  ],
  validarErrores,
  createMembresia
);

// Actualizar una membresía
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("saldo_solicitado")
      .optional()
      .isDecimal()
      .withMessage("El saldo solicitado debe ser un número decimal válido"),
    body("comprobante")
      .optional()
      .isURL()
      .withMessage("La URL del comprobante debe ser válida"),
  ],
  validarErrores,
  updateMembresia
);

// Eliminar una membresía
router.delete("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
deleteMembresia
);

module.exports = router;
const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllQuejasClientes,
  getQuejaClienteById,
  createQuejaCliente,
  updateQuejaCliente,
  deleteQuejaCliente,
} = require("../controllers/quejaClienteController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las quejas
router.get("/", getAllQuejasClientes);

// Obtener una queja por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la queja debe ser un número entero"),
  ],
  validarErrores,
  getQuejaClienteById
);

// Crear una nueva queja
router.post(
  "/:id_driver",
  [
    param("id_driver")
      .isInt()
      .withMessage("El ID del driver debe ser un número entero"),
    body("id_cliente")
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("id_viaje").optional().isInt().withMessage("El ID del viaje debe ser un número entero"),
    body("comentario").optional(),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
  ],
  validarErrores,
  createQuejaCliente
);

// Actualizar una queja
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la queja debe ser un número entero"),
    body("comentario").optional(),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
  ],
  validarErrores,
  updateQuejaCliente
);

// Eliminar una queja
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la queja debe ser un número entero"),
  ],
  validarErrores,
  deleteQuejaCliente
);

module.exports = router;
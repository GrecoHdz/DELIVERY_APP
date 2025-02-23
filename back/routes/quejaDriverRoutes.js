const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllQuejas,
  getQuejaById,
  createQueja,
  updateQueja,
  deleteQueja,
} = require("../controllers/quejaDriverController");

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
router.get("/", getAllQuejas);

// Obtener una queja por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la queja debe ser un número entero"),
  ],
  validarErrores,
  getQuejaById
);

// Crear una nueva queja
router.post(
  "/:id_cliente",
  [
    param("id_cliente")
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("id_driver")
      .isInt()
      .withMessage("El ID del driver debe ser un número entero"),
    body("id_pedido").optional().isInt().withMessage("El ID del pedido debe ser un número entero"),
    body("comentario").optional(),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
  ],
  validarErrores,
  createQueja
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
  updateQueja
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
  deleteQueja
);

module.exports = router;
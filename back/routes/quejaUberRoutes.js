const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllQuejasUber,
  getQuejaUberById,
  createQuejaUber,
  updateQuejaUber,
  deleteQuejaUber,
} = require("../controllers/quejaUberController");

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
router.get("/", getAllQuejasUber);

// Obtener una queja por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la queja debe ser un número entero"),
  ],
  validarErrores,
  getQuejaUberById
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
    body("id_viaje").optional().isInt().withMessage("El ID del viaje debe ser un número entero"),
    body("comentario").optional(),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
  ],
  validarErrores,
  createQuejaUber
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
  updateQuejaUber
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
  deleteQuejaUber
);

module.exports = router;
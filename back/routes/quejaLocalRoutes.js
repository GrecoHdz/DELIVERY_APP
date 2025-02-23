const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllQuejasLocales,
  getQuejaLocalById,
  createQuejaLocal,
  updateQuejaLocal,
  deleteQuejaLocal,
} = require("../controllers/quejaLocalController");

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
router.get("/", getAllQuejasLocales);

// Obtener una queja por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la queja debe ser un número entero"),
  ],
  validarErrores,
  getQuejaLocalById
);

// Crear una nueva queja
router.post(
  "/:id_cliente",
  [
    body("id_cliente")
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("id_local")
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("id_pedido")
      .isInt()
      .withMessage("El ID del pedido debe ser un número entero"),
    body("comentario").optional(),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
  ],
  validarErrores,
  createQuejaLocal
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
  updateQuejaLocal
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
  deleteQuejaLocal
);

module.exports = router;
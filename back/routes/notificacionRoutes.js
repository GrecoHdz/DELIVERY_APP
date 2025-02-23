const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllDestinatarios,
  getDestinatarioById,
  createDestinatario,
  updateDestinatario,
  deleteDestinatario,
} = require("../controllers/notificacionDestinatarioController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los destinatarios
router.get("/", getAllDestinatarios);

// Obtener un destinatario por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del destinatario debe ser un número entero"),
  ],
  validarErrores,
  getDestinatarioById
);

// Crear un nuevo destinatario
router.post(
  "/",
  [
    body("id_notificacion")
      .isInt()
      .withMessage("El ID de la notificación debe ser un número entero"),
    body("parametros").optional().isObject().withMessage("Los parámetros deben ser un objeto JSON"),
    body("id_usuario").optional().isInt().withMessage("El ID del usuario debe ser un número entero"),
    body("id_cliente").optional().isInt().withMessage("El ID del cliente debe ser un número entero"),
    body("id_local").optional().isInt().withMessage("El ID del local debe ser un número entero"),
    body("id_driver").optional().isInt().withMessage("El ID del driver debe ser un número entero"),
  ],
  validarErrores,
  createDestinatario
);

// Actualizar un destinatario
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del destinatario debe ser un número entero"),
    body("parametros").optional().isObject().withMessage("Los parámetros deben ser un objeto JSON"),
    body("id_usuario").optional().isInt().withMessage("El ID del usuario debe ser un número entero"),
    body("id_cliente").optional().isInt().withMessage("El ID del cliente debe ser un número entero"),
    body("id_local").optional().isInt().withMessage("El ID del local debe ser un número entero"),
    body("id_driver").optional().isInt().withMessage("El ID del driver debe ser un número entero"),
  ],
  validarErrores,
  updateDestinatario
);

// Eliminar un destinatario
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del destinatario debe ser un número entero"),
  ],
  validarErrores,
  deleteDestinatario
);

module.exports = router;
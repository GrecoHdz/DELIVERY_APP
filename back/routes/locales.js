const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { uploadStore } = require("../config/cloudinary");
const {
  getLocales,
  getLocalById,
  getLocalMembresiaById,
  createLocal,
  updateLocal,
  deleteLocal,
} = require("../controllers/localesController");
const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los locales
router.get("/", getLocales);

// Obtener un local por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getLocalById
);

// Obtener la membresía de un local por su ID
router.get(
  "/:id/membresia",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getLocalMembresiaById
);

// Crear un nuevo local
router.post(
  "/:id_cliente",
  uploadStore.single("imagen"), // Middleware de subida de imagen optimizado para tiendas
  [
    param("id_cliente").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_local")
      .notEmpty()
      .withMessage("El nombre del local es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del local no puede exceder los 255 caracteres"),
    body("apertura")
      .notEmpty()
      .withMessage("La hora de apertura es obligatoria"),
    body("cierre")
      .optional().notEmpty()
      .withMessage("La hora de cierre es obligatoria"),
    body("rtn")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El RTN no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  createLocal
);

// Actualizar un local
router.put(
  "/:id",
  uploadStore.single("imagen"), // Middleware de subida de imagen optimizado para tiendas
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("id_cliente")
      .optional()
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("id_membresia")
      .optional()
      .isInt()
      .withMessage("El ID de membresía debe ser un número entero"),
    body("nombre_local")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El nombre del local no puede exceder los 255 caracteres"),
    body("apertura")
      .optional()
      .isTime()
      .withMessage("La hora de apertura debe ser una hora válida"),
    body("cierre")
      .optional()
      .isTime()
      .withMessage("La hora de cierre debe ser una hora válida"),
    body("rtn")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El RTN no puede exceder los 255 caracteres"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateLocal
);

// Eliminar un local
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteLocal
);

module.exports = router;
const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAtributos,
  getAtributoById,
  createAtributo,
  updateAtributo,
  deleteAtributo,
} = require("../controllers/atributosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los atributos
router.get("/", getAtributos);

// Obtener un atributo por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getAtributoById
);

// Crear un nuevo atributo
router.post(
  "/",
  [
    body("nombre_atributo")
      .notEmpty()
      .withMessage("El nombre del atributo es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del atributo no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  createAtributo
);

// Actualizar un atributo
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_atributo")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El nombre del atributo no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  updateAtributo
);

// Eliminar un atributo
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteAtributo
);

module.exports = router;
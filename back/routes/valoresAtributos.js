const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getValoresAtributos,
  getValorAtributoById,
  createValorAtributo,
  updateValorAtributo,
  deleteValorAtributo,
} = require("../controllers/valoresAtributosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los valores de atributos
router.get("/", getValoresAtributos);

// Obtener un valor de atributo por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getValorAtributoById
);

// Crear un nuevo valor de atributo
router.post(
  "/",
  [
    body("id_atributo")
      .isInt()
      .withMessage("El ID del atributo debe ser un número entero"),
    body("valor")
      .notEmpty()
      .withMessage("El valor es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El valor no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  createValorAtributo
);

// Actualizar un valor de atributo
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("id_atributo")
      .optional()
      .isInt()
      .withMessage("El ID del atributo debe ser un número entero"),
    body("valor")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El valor no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  updateValorAtributo
);

// Eliminar un valor de atributo
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteValorAtributo
);

module.exports = router;
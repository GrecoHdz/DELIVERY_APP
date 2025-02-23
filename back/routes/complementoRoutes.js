const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllComplementos,
  getComplementoById,
  createComplemento,
  updateComplemento,
  deleteComplemento,
} = require("../controllers/complementoController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los complementos
router.get("/", getAllComplementos);

// Obtener un complemento por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del complemento debe ser un número entero"),
  ],
  validarErrores,
  getComplementoById
);

// Crear un nuevo complemento
router.post(
  "/:id_producto",
  [
    param("id_producto")
      .isInt()
      .withMessage("El ID del producto debe ser un número entero"),
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del complemento es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del complemento no puede exceder los 255 caracteres"),
    body("precio")
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
   ],
  validarErrores,
  createComplemento
);

// Actualizar un complemento
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del complemento debe ser un número entero"),
    body("nombre")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El nombre del complemento no puede exceder los 255 caracteres"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
    body("activo").optional().isBoolean().withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateComplemento
);

// Eliminar un complemento
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del complemento debe ser un número entero"),
  ],
  validarErrores,
  deleteComplemento
);

module.exports = router;
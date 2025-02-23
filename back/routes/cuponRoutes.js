const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllCupones,
  getCuponById,
  createCupon,
  updateCupon,
  deleteCupon,
} = require("../controllers/cuponController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los cupones
router.get("/", getAllCupones);

// Obtener un cupón por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del cupón debe ser un número entero"),
  ],
  validarErrores,
  getCuponById
);

// Crear un nuevo cupón
router.post(
  "/",
  [
    body("tipo_descuento")
      .isIn(["porcentaje", "fijo"])
      .withMessage("El tipo de descuento debe ser 'porcentaje' o 'fijo'"),
    body("codigo_cupon")
      .notEmpty()
      .withMessage("El código del cupón es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El código del cupón no puede exceder los 255 caracteres"),
    body("descuento")
      .isDecimal()
      .withMessage("El descuento debe ser un número decimal válido"),
    body("limite_uso").optional().isInt().withMessage("El límite de uso debe ser un número entero"),
    body("usos_actuales").optional().isInt().withMessage("Los usos actuales deben ser un número entero"),
    body("fecha_vencimiento").optional().isISO8601().toDate().withMessage("La fecha de vencimiento debe ser una fecha válida"),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
    body("activo").optional().isBoolean().withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  createCupon
);

// Actualizar un cupón
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del cupón debe ser un número entero"),
    body("tipo_descuento")
      .optional()
      .isIn(["porcentaje", "fijo"])
      .withMessage("El tipo de descuento debe ser 'porcentaje' o 'fijo'"),
    body("codigo_cupon")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El código del cupón no puede exceder los 255 caracteres"),
    body("descuento")
      .optional()
      .isDecimal()
      .withMessage("El descuento debe ser un número decimal válido"),
    body("limite_uso").optional().isInt().withMessage("El límite de uso debe ser un número entero"),
    body("usos_actuales").optional().isInt().withMessage("Los usos actuales deben ser un número entero"),
    body("fecha_vencimiento").optional().isISO8601().toDate().withMessage("La fecha de vencimiento debe ser una fecha válida"),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
    body("activo").optional().isBoolean().withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateCupon
);

// Eliminar un cupón
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del cupón debe ser un número entero"),
  ],
  validarErrores,
  deleteCupon
);

module.exports = router;
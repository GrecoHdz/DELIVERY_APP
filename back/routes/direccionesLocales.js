const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getDireccionesByLocal,
  createDireccion,
  updateDireccion,
  deleteDireccion,
} = require("../controllers/direccionesLocalesController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las direcciones de un local
router.get(
  "/:id_local",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  getDireccionesByLocal
);

// Crear una nueva dirección para un local
router.post(
  "/:id_local",
  [
    param("id_local").isInt().withMessage("El ID debe ser un número entero"),
    body("id_ciudad")
      .isInt()
      .withMessage("El ID de la ciudad debe ser un número entero"),
    body("colonia")
      .notEmpty()
      .withMessage("La colonia es obligatoria")
      .isLength({ max: 255 })
      .withMessage("La colonia no puede exceder los 255 caracteres"),
    body("direccion_precisa")
      .notEmpty()
      .withMessage("La dirección precisa es obligatoria")
      .isLength({ max: 255 })
      .withMessage("La dirección precisa no puede exceder los 255 caracteres"),
    body("latitud")
      .optional()
      .isDecimal()
      .withMessage("La latitud debe ser un número decimal"),
    body("longitud")
      .optional()
      .isDecimal()
      .withMessage("La longitud debe ser un número decimal"),
  ],
  validarErrores,
  createDireccion
);

// Actualizar una dirección específica de un local
router.put(
  "/:id_local",
  [
    param("id_local").isInt().withMessage("El ID del local debe ser un número entero"),
    body("id_direccion_local")
      .isInt()
      .withMessage("El ID de la dirección es obligatorio"),
    body("colonia")
      .optional()
      .isLength({ max: 255 })
      .withMessage("La colonia no puede exceder los 255 caracteres"),
    body("direccion_precisa")
      .optional()
      .isLength({ max: 255 })
      .withMessage("La dirección precisa no puede exceder los 255 caracteres"),
    body("latitud")
      .optional()
      .isDecimal()
      .withMessage("La latitud debe ser un número decimal"),
    body("longitud")
      .optional()
      .isDecimal()
      .withMessage("La longitud debe ser un número decimal"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateDireccion
);

// Eliminar una dirección específica de un local
router.delete(
  "/:id_local/:id_direccion_local",
  [
    param("id_local").isInt().withMessage("El ID del local debe ser un número entero"),
    param("id_direccion_local").isInt().withMessage("El ID de la dirección debe ser un número entero"),
  ],
  validarErrores,
  deleteDireccion
);

module.exports = router;
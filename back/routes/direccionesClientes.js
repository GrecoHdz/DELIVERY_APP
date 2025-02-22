const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getDireccionesByCliente,
  createDireccion,
  updateDireccion,
  deleteDireccion,
} = require("../controllers/direccionesClientesController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las direcciones de un cliente
router.get(
  "/:id_cliente",
  [param("id_cliente").isInt().withMessage("El ID del cliente debe ser un número entero")],
  validarErrores,
  getDireccionesByCliente
);
 

// Crear una nueva dirección para un cliente
router.post(
  "/:id_cliente",
  [
    param("id_cliente").isInt().withMessage("El ID del cliente debe ser un número entero"),
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
    body("alias_direccion")
      .notEmpty()
      .withMessage("El alias de la dirección es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El alias de la dirección no puede exceder los 255 caracteres"),
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

// Ruta para actualizar una dirección específica de un cliente
router.put(
  "/:id_direccion_cliente",
  [
    param("id_direccion_cliente").isInt().withMessage("El ID del cliente debe ser un número entero"),
    body("id_direccion_cliente")
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
    body("alias_direccion")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El alias de la dirección no puede exceder los 255 caracteres"),
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
// Eliminar una dirección
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID de la dirección debe ser un número entero")],
  validarErrores,
  deleteDireccion
);

module.exports = router;
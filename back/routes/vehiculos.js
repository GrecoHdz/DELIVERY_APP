const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} = require("../controllers/vehiculosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los vehículos
router.get(
  "/", 
  getAllVehiculos
);

// Obtener un vehículo por su ID
router.get(
  "/:id", 
  [param("id").isInt().withMessage("ID inválido")], 
  validarErrores, 
  getVehiculoById
);

// Crear un nuevo vehículo
router.post(
  "/",
  [
    body("tipo_vehiculo")
      .notEmpty()
      .withMessage("El tipo de vehículo es obligatorio")
      .isLength({ max: 55 })
      .withMessage("El tipo de vehículo no puede exceder los 55 caracteres"),
    body("marca")
      .notEmpty()
      .withMessage("La marca es obligatoria")
      .isLength({ max: 55 })
      .withMessage("La marca no puede exceder los 55 caracteres"),
    body("modelo")
      .notEmpty()
      .withMessage("El modelo es obligatorio")
      .isLength({ max: 55 })
      .withMessage("El modelo no puede exceder los 55 caracteres"),
    body("anio")
      .isInt()
      .withMessage("El año debe ser un número entero válido"),
    body("imagen_url")
      .optional()
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
    body("disponible_para_renta")
      .optional()
      .isBoolean()
      .withMessage("El campo 'disponible_para_renta' debe ser un valor booleano"),
  ],
  validarErrores,
  createVehiculo
);

// Actualizar un vehículo
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("tipo_vehiculo")
      .optional()
      .isLength({ max: 55 })
      .withMessage("El tipo de vehículo no puede exceder los 55 caracteres"),
    body("marca")
      .optional()
      .isLength({ max: 55 })
      .withMessage("La marca no puede exceder los 55 caracteres"),
    body("modelo")
      .optional()
      .isLength({ max: 55 })
      .withMessage("El modelo no puede exceder los 55 caracteres"),
    body("anio")
      .optional()
      .isInt()
      .withMessage("El año debe ser un número entero válido"),
    body("imagen_url")
      .optional()
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
    body("disponible_para_renta")
      .optional()
      .isBoolean()
      .withMessage("El campo 'disponible_para_renta' debe ser un valor booleano"),
  ],
  validarErrores,
  updateVehiculo
);

// Eliminar un vehículo
router.delete("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
deleteVehiculo
);

module.exports = router;
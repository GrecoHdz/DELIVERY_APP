const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driversController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los drivers
router.get("/", getAllDrivers);

// Obtener un driver por su ID
router.get("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
getDriverById
);

// Crear un nuevo driver
router.post(
  "/:cliente",
  [
    param("id_cliente").isInt().withMessage("El ID debe ser un número entero"),
  ],
  validarErrores,
  createDriver
);

// Actualizar un driver
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("membresia_driver")
      .optional()
      .isDecimal()
      .withMessage("La membresía debe ser un número decimal válido"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateDriver
);

// Eliminar un driver
router.delete("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
deleteDriver
);

module.exports = router;
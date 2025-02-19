const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getVehiculosByDriver,
  associateVehiculoToDriver,
  deleteVehiculoFromDriver,
} = require("../controllers/driverVehiculoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los vehículos de un driver
router.get("/:id_driver/vehiculos", [param("id_driver").isInt().withMessage("ID inválido")], validarErrores, getVehiculosByDriver);

// Asociar un vehículo a un driver
router.post(
  "/",
  [
    body("id_driver").isInt().withMessage("ID de driver inválido"),
    body("id_vehiculo").isInt().withMessage("ID de vehículo inválido"),
  ],
  validarErrores,
  associateVehiculoToDriver
);

// Eliminar la asociación entre un driver y un vehículo
router.delete(
  "/:id_driver/:id_vehiculo",
  [
    param("id_driver").isInt().withMessage("ID de driver inválido"),
    param("id_vehiculo").isInt().withMessage("ID de vehículo inválido"),
  ],
  validarErrores,
  deleteVehiculoFromDriver
);

module.exports = router;
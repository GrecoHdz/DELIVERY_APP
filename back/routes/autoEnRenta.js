const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllAutosEnRenta,
  getAutoEnRentaById,
  createAutoEnRenta,
  updateAutoEnRenta,
  deleteAutoEnRenta,
} = require("../controllers/autoEnRentaController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los autos en renta
router.get("/", getAllAutosEnRenta);

// Obtener un auto en renta por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getAutoEnRentaById);

// Crear un nuevo auto en renta
router.post(
  "/:id_cliente",
  [
    param("id_cliente").isInt().withMessage("ID inválido"),
    body("id_vehiculo").isInt().withMessage("ID de vehículo inválido"),
    body("precio_por_dia").isDecimal().withMessage("El precio por día debe ser un número decimal válido"),
    body("direccion_recogida")
      .optional()
      .isLength({ max: 255 })
      .withMessage("La dirección de recogida no puede exceder los 255 caracteres"),
   body("opcion_conductor")
      .optional()
      .isBoolean()
      .withMessage("El campo 'opcion_conductor' debe ser un valor booleano"),
    body("entrega_a_domicilio")
      .optional()
      .isBoolean()
      .withMessage("El campo 'entrega_a_domicilio' debe ser un valor booleano"),
    body("id_metodo_pago").isInt().withMessage("ID de método de pago inválido"),
  ],
  validarErrores,
  createAutoEnRenta
);

// Actualizar un auto en renta
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("direccion_recogida")
      .optional()
      .isLength({ max: 255 })
      .withMessage("La dirección de recogida no puede exceder los 255 caracteres"),
    body("precio_por_dia")
      .optional()
      .isDecimal()
      .withMessage("El precio por día debe ser un número decimal válido"),
    body("opcion_conductor")
      .optional()
      .isBoolean()
      .withMessage("El campo 'opcion_conductor' debe ser un valor booleano"),
    body("entrega_a_domicilio")
      .optional()
      .isBoolean()
      .withMessage("El campo 'entrega_a_domicilio' debe ser un valor booleano"),
    body("id_metodo_pago")
      .optional()
      .isInt()
      .withMessage("ID de método de pago inválido"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateAutoEnRenta
);

// Eliminar un auto en renta
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteAutoEnRenta);

module.exports = router;
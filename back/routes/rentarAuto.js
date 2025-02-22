const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllRentas,
  getRentaById,
  createRenta,
  updateRenta,
  deleteRenta,
} = require("../controllers/rentarAutoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las solicitudes de renta
router.get("/", getAllRentas);

// Obtener una solicitud de renta por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getRentaById);

// Crear una nueva solicitud de renta
router.post(
  "/:id_auto_en_renta",
  [
    param("id_auto_en_renta").isInt().withMessage("ID inválido"),
    body("id_cliente").isInt().withMessage("ID de cliente inválido"),
    body("fecha_inicio").isDate().withMessage("La fecha de inicio debe ser válida"),
    body("fecha_fin").isDate().withMessage("La fecha de fin debe ser válida"),
    body("con_conductor")
      .optional()
      .isBoolean()
      .withMessage("El campo 'con_conductor' debe ser un valor booleano"),
    body("direccion_entrega")
      .optional()
      .isLength({ max: 255 })
      .withMessage("La dirección de entrega no puede exceder los 255 caracteres"),
    body("imagen_licencia")
      .isURL()
      .withMessage("La URL de la licencia debe ser válida"),
    body("id_metodo_pago").isInt().withMessage("ID de método de pago inválido"),
    body("total").isDecimal().withMessage("El total debe ser un número decimal válido"),
  ],
  validarErrores,
  createRenta
);

// Actualizar una solicitud de renta
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("fecha_inicio")
      .optional()
      .isDate()
      .withMessage("La fecha de inicio debe ser válida"),
    body("fecha_fin")
      .optional()
      .isDate()
      .withMessage("La fecha de fin debe ser válida"),
    body("con_conductor")
      .optional()
      .isBoolean()
      .withMessage("El campo 'con_conductor' debe ser un valor booleano"),
    body("direccion_entrega")
      .optional()
      .isLength({ max: 255 })
      .withMessage("La dirección de entrega no puede exceder los 255 caracteres"),
    body("imagen_licencia")
      .optional()
      .isURL()
      .withMessage("La URL de la licencia debe ser válida"),
    body("id_metodo_pago")
      .optional()
      .isInt()
      .withMessage("ID de método de pago inválido"),
    body("total")
      .optional()
      .isDecimal()
      .withMessage("El total debe ser un número decimal válido"),
    body("estado")
      .optional()
      .isIn(["pendiente", "aceptada", "denegada", "finalizada"])
      .withMessage("Estado no válido"),
  ],
  validarErrores,
  updateRenta
);

// Eliminar una solicitud de renta
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteRenta);

module.exports = router;
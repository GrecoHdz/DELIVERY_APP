const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllMandaditos,
  getMandaditoById,
  createMandadito,
  updateMandadito,
  deleteMandadito,
} = require("../controllers/mandaditoController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los mandaditos
router.get("/", getAllMandaditos);

// Obtener un mandadito por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del mandadito debe ser un número entero"),
  ],
  validarErrores,
  getMandaditoById
);

// Crear un nuevo mandadito
router.post(
  "/:id_cliente",
  [
    param("id_cliente")
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("metodo_pago")
      .isIn(["efectivo", "transferencia"])
      .withMessage("El método de pago debe ser 'efectivo' o 'transferencia'"),
    body("direccion_origen")
      .notEmpty()
      .withMessage("La dirección de origen es obligatoria"),
    body("direccion_destino")
      .notEmpty()
      .withMessage("La dirección de destino es obligatoria"),
    body("descripcion").optional(),
    body("tiempo_llegada_recogida_estimado").optional().isInt().withMessage("El tiempo de llegada estimado debe ser un número entero"),
    body("tiempo_entrega_estimado").optional().isInt().withMessage("El tiempo de entrega estimado debe ser un número entero"),
    body("estado")
      .optional()
      .isString()
      .withMessage("El estado debe ser una cadena de texto"),
  ],
  validarErrores,
  createMandadito
);

// Actualizar un mandadito
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del mandadito debe ser un número entero"),
    body("id_driver").optional().isInt().withMessage("El ID del driver debe ser un número entero"),
    body("metodo_pago")
      .optional()
      .isIn(["efectivo", "transferencia"])
      .withMessage("El método de pago debe ser 'efectivo' o 'transferencia'"),
    body("direccion_origen").optional().notEmpty().withMessage("La dirección de origen es obligatoria"),
    body("direccion_destino").optional().notEmpty().withMessage("La dirección de destino es obligatoria"),
    body("descripcion").optional(),
    body("tiempo_llegada_recogida_estimado").optional().isInt().withMessage("El tiempo de llegada estimado debe ser un número entero"),
    body("tiempo_entrega_estimado").optional().isInt().withMessage("El tiempo de entrega estimado debe ser un número entero"),
    body("fecha_entregado").optional().isISO8601().toDate().withMessage("La fecha de entrega debe ser una fecha válida"),
    body("estado").optional().isString().withMessage("El estado debe ser una cadena de texto"),
  ],
  validarErrores,
  updateMandadito
);

// Eliminar un mandadito
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del mandadito debe ser un número entero"),
  ],
  validarErrores,
  deleteMandadito
);

module.exports = router;
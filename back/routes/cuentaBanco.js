const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} = require("../controllers/cuentaBancoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las cuentas bancarias
router.get("/", getAllCuentas);

// Obtener una cuenta bancaria por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getCuentaById);

// Crear una nueva cuenta bancaria
router.post(
  "/:id_cliente",
  [
    param("id_cliente").isInt().withMessage("ID de cliente inválido"),
    body("id_banco").isInt().withMessage("ID de banco inválido"),
    body("identidad")
      .notEmpty()
      .withMessage("La identidad es obligatoria")
      .isLength({ max: 50 })
      .withMessage("La identidad no puede exceder los 50 caracteres"),
    body("nombre_dueno_cuenta")
      .notEmpty()
      .withMessage("El nombre del titular es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del titular no puede exceder los 255 caracteres"),
    body("tipo_cuenta")
      .isIn(["Ahorro", "Cheque", "Tarjeta de Credito"])
      .withMessage("Tipo de cuenta no válido"),
    body("num_cuenta")
      .notEmpty()
      .withMessage("El número de cuenta es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El número de cuenta no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  createCuenta
);

// Actualizar una cuenta bancaria
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("identidad")
      .optional()
      .notEmpty()
      .withMessage("La identidad es obligatoria")
      .isLength({ max: 50 })
      .withMessage("La identidad no puede exceder los 50 caracteres"),
    body("nombre_dueno_cuenta")
      .optional()
      .notEmpty()
      .withMessage("El nombre del titular es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del titular no puede exceder los 255 caracteres"),
    body("tipo_cuenta")
      .optional()
      .isIn(["Ahorro", "Cheque", "Tarjeta de Credito"])
      .withMessage("Tipo de cuenta no válido"),
    body("num_cuenta")
      .optional()
      .notEmpty()
      .withMessage("El número de cuenta es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El número de cuenta no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  updateCuenta
);

// Eliminar una cuenta bancaria
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteCuenta);

module.exports = router;
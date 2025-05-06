const express = require("express");
const { body, param, validationResult } = require("express-validator");

// Autenticación desactivada temporalmente
// const verifyToken = require("../middlewares/authMiddleware");
const { getBancos, getBancoById, createBanco, updateBanco, deleteBanco } = require("../controllers/bancoController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Autenticación desactivada temporalmente
router.get("/", getBancos);

router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getBancoById
);

router.post(
  "/",
  [
    body("nombre_banco")
      .notEmpty().withMessage("El nombre del banco es obligatorio")
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  ],
  validarErrores,
  createBanco
);

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_banco")
      .optional()
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  ],
  validarErrores,
  updateBanco
);

router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteBanco
);

module.exports = router;
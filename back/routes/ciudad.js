const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { getCiudades, getCiudadById, createCiudad, updateCiudad, deleteCiudad } = require("../controllers/ciudadController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

router.get("/", getCiudades);

router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getCiudadById
);

router.post(
  "/",
  [
    body("nombre_ciudad")
      .notEmpty().withMessage("El nombre de la ciudad es obligatorio")
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  ],
  validarErrores,
  createCiudad
);

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_ciudad")
      .optional()
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  ],
  validarErrores,
  updateCiudad
);

router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteCiudad
);

module.exports = router;
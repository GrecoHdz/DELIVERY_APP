const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUserByUsername,
} = require("../controllers/usuariosController");
const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

router.get("/", getUsuarios);

router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getUsuarioById
);

router.get("/usuarios/:username", getUserByUsername);

router.post(
  "/",
  [
    body("usuario")
      .notEmpty().withMessage("El usuario es obligatorio")
      .isLength({ min: 3 }).withMessage("El usuario debe tener al menos 3 caracteres"),
    body("clave")
      .notEmpty().withMessage("La clave es obligatoria")
      .isLength({ min: 6 }).withMessage("La clave debe tener al menos 6 caracteres"),
    body("email")
      .notEmpty().withMessage("El email es obligatorio")
      .isEmail().withMessage("El email debe ser válido"),
  ],
  validarErrores,
  createUsuario
);

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("usuario")
      .optional()
      .isLength({ min: 3 }).withMessage("El usuario debe tener al menos 3 caracteres"),
    body("clave")
      .optional()
      .isLength({ min: 6 }).withMessage("La clave debe tener al menos 6 caracteres"),
    body("email")
      .optional()
      .isEmail().withMessage("El email debe ser válido"),
  ],
  validarErrores,
  updateUsuario
);

router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteUsuario
);

module.exports = router;

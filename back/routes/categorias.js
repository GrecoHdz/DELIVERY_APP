const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} = require("../controllers/categoriasController");
const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las categorías
router.get("/", getCategorias);

// Obtener una categoría por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getCategoriaById
);

// Crear una nueva categoría
router.post(
  "/",
  [
    body("nombre_categoria")
      .notEmpty().withMessage("El nombre de la categoría es obligatorio")
      .isLength({ max: 255 }).withMessage("El nombre de la categoría no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  createCategoria
);

// Actualizar una categoría
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_categoria")
      .notEmpty().withMessage("El nombre de la categoría es obligatorio")
      .isLength({ max: 255 }).withMessage("El nombre de la categoría no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  updateCategoria
);

// Eliminar una categoría
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteCategoria
);

module.exports = router;
const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getSubcategorias,
  getSubcategoriaById,
  createSubcategoria,
  updateSubcategoria,
  deleteSubcategoria,
} = require("../controllers/subcategoriasController");
const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las subcategorías
router.get("/", getSubcategorias);

// Obtener una subcategoría por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getSubcategoriaById
);

// Crear una nueva subcategoría
router.post(
  "/:id_categoria",
  [
    param("id_categoria").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_subcategoria")
      .notEmpty().withMessage("El nombre de la subcategoría es obligatorio")
      .isLength({ max: 255 }).withMessage("El nombre de la subcategoría no puede exceder los 255 caracteres"),
    body("id_categoria")
      .notEmpty().withMessage("El ID de la categoría es obligatorio")
      .isInt().withMessage("El ID de la categoría debe ser un número entero"),
  ],
  validarErrores,
  createSubcategoria
);

// Actualizar una subcategoría
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_subcategoria")
      .notEmpty().withMessage("El nombre de la subcategoría es obligatorio")
      .isLength({ max: 255 }).withMessage("El nombre de la subcategoría no puede exceder los 255 caracteres"),
    body("id_categoria")
      .notEmpty().withMessage("El ID de la categoría es obligatorio")
      .isInt().withMessage("El ID de la categoría debe ser un número entero"),
  ],
  validarErrores,
  updateSubcategoria
);

// Eliminar una subcategoría
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteSubcategoria
);

module.exports = router;
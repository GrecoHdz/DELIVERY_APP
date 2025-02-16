const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getBannersByLocal,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannersPublicitariosController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los banners de un local
router.get(
  "/local/:id_local",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  getBannersByLocal
);

// Crear un nuevo banner
router.post(
  "/",
  [
    body("id_local")
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("titulo")
      .notEmpty()
      .withMessage("El título es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El título no puede exceder los 255 caracteres"),
    body("descripcion")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("La descripción no puede exceder los 1000 caracteres"),
    body("imagen_url")
      .notEmpty()
      .withMessage("La URL de la imagen es obligatoria")
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
    body("url_destino")
      .optional()
      .isURL()
      .withMessage("La URL de destino debe ser válida"),
  ],
  validarErrores,
  createBanner
);

// Actualizar un banner
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID del banner debe ser un número entero"),
    body("id_local")
      .optional()
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("titulo")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El título no puede exceder los 255 caracteres"),
    body("descripcion")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("La descripción no puede exceder los 1000 caracteres"),
    body("imagen_url")
      .optional()
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
    body("url_destino")
      .optional()
      .isURL()
      .withMessage("La URL de destino debe ser válida"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateBanner
);

// Eliminar un banner
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID del banner debe ser un número entero")],
  validarErrores,
  deleteBanner
);

module.exports = router;
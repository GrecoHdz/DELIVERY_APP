const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllFavoritos,
  getFavoritoById,
  createFavorito,
  deleteFavorito,
} = require("../controllers/favoritoController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los favoritos
router.get("/", getAllFavoritos);

// Obtener un favorito por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del favorito debe ser un número entero"),
  ],
  validarErrores,
  getFavoritoById
);

// Crear un nuevo favorito
router.post(
  "/:id_cliente",
  [
    param("id_cliente")
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("id_producto")
      .isInt()
      .withMessage("El ID del producto debe ser un número entero"),
    body("id_local")
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
  ],
  validarErrores,
  createFavorito
);

// Eliminar un favorito
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del favorito debe ser un número entero"),
  ],
  validarErrores,
  deleteFavorito
);

module.exports = router;
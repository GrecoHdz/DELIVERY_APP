const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { upload } = require("../config/cloudinary");
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosByLocal,
} = require("../controllers/productoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los productos
router.get("/", getProductos);

// Obtener todos los productos por id_local
router.get("/:id_local", getProductosByLocal);

// Obtener un producto por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getProductoById
);

// Crear un nuevo producto con subida de imagen
router.post(
  "/:id_local",
  upload.single("imagen"), // Middleware de subida de imagen
  [
    param("id_local").isInt().withMessage("El ID debe ser un número entero"),
    body("id_subcategoria").optional().isInt().withMessage("ID de subcategoría inválido"),
    body("nombre_producto")
      .notEmpty()
      .withMessage("El nombre del producto es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("descripcion_producto").optional(),
    body("precio").isDecimal().withMessage("El precio debe ser un número decimal válido"),
    body("preciooferta").optional().isDecimal().withMessage("El precio de oferta debe ser un número decimal válido"),
    body("precioofertafinal").optional().isDecimal().withMessage("El precio final debe ser un número decimal válido"),
    body("preciofinal").isDecimal().withMessage("El precio final debe ser un número decimal"),
    body("imagen_url")
      .optional()
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
    body("imagen_url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
    body("imagen_public_id").optional(),
  ],
  validarErrores,
  createProducto
);

// Ruta para subir imagen a Cloudinary
router.post("/upload", upload.single("imagen"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha proporcionado una imagen" });
    }

    // Obtener la URL de la imagen subida
    const imageUrl = req.file.path;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ message: "Error al subir la imagen", error });
  }
});

// Actualizar un producto
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("id_local")
      .optional()
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("id_subcategoria")
      .optional()
      .isInt()
      .withMessage("ID de subcategoría inválido"),
    body("nombre_producto")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("descripcion_producto").optional(),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
    body("preciooferta")
    .optional({ nullable: true })
    .isDecimal()
    .withMessage("El precio oferta debe ser un número decimal"),
    body("precioofertafinal")
    .optional({ nullable: true })
    .isDecimal()
    .withMessage("El precio de oferta final debe ser un número decimal"),
    body("preciofinal")
    .optional()
    .isDecimal()
    .withMessage("El precio final debe ser un número decimal"),
    body("imagen_url")
      .optional()
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
    body("imagen_public_id").optional(),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateProducto
);

// Eliminar un producto
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteProducto
);

module.exports = router;
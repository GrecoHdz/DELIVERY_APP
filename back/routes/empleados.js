const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} = require("../controllers/empleadosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los empleados
router.get("/", getAllEmpleados);

// Obtener un empleado por su ID
router.get("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
getEmpleadoById
);

// Crear un nuevo empleado
router.post(
  "/:id_local",
  [
    param("id_local").isInt().withMessage("El ID debe ser un número entero"),
    body("id_usuario").isInt().withMessage("ID de usuario inválido"),
  ],
  validarErrores,
  createEmpleado
);

// Actualizar un empleado
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("id_local")
      .optional()
      .isInt()
      .withMessage("ID de local inválido"),
    body("id_usuario")
      .optional()
      .isInt()
      .withMessage("ID de usuario inválido"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateEmpleado
);

// Eliminar un empleado
router.delete("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
deleteEmpleado
);

module.exports = router;
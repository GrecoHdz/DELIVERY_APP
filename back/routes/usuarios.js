const express = require("express");
const { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } = require("../controllers/usuariosController");

const router = express.Router();

router.get("/", getUsuarios);       // Obtener todos los usuarios
router.get("/:id", getUsuarioById);  
router.post("/", createUsuario);    
router.put("/:id", updateUsuario);   
router.delete("/:id", deleteUsuario);

module.exports = router;
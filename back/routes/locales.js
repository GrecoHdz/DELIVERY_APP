const express = require("express");
const { getLocales } = require("../controllers/localesController");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

// Ruta protegida para obtener locales
router.get("/", authenticateToken, getLocales);

module.exports = router;

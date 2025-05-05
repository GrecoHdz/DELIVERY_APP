const express = require("express");
const router = express.Router();
const cobroSemanalController = require("../controllers/cobroSemanalController");
const cobroProductoController = require("../controllers/cobroProductoController");
const exportController = require("../controllers/exportController");
const multer = require("multer");
const path = require("path");

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `comprobante-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error("Solo se permiten archivos de imagen (jpeg, jpg, png) y PDF"));
  },
});

// Rutas para cobros semanales
router.get("/local/:id_local", cobroSemanalController.getCobrosByLocal);
router.get("/local/:id_local/actual", cobroSemanalController.getCobroActualByLocal);
router.get("/:id_cobro", cobroSemanalController.getCobroById);
router.post("/local/:id_local/generar", cobroSemanalController.generarCobroSemanal);
router.put("/:id_cobro/pagar", upload.single("comprobante"), cobroSemanalController.marcarComoPagado);

// Rutas para productos de cobros
router.get("/:id_cobro/productos", cobroProductoController.getProductosByCobro);
router.post("/:id_cobro/productos", cobroProductoController.addProductoToCobro);
router.delete("/productos/:id_cobro_producto", cobroProductoController.removeProductoFromCobro);

// Rutas para exportación
router.get("/:id_cobro/export/excel", exportController.exportToExcel);
router.get("/:id_cobro/export/pdf", exportController.exportToPDF);

module.exports = router;

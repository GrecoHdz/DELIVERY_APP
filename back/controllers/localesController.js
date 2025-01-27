const database = require("../database/database");

const getLocales = async (req, res) => {
  try {
    // Simulación de consulta a la base de datos
    const productos = [
      { id: 1, nombre: "Pizza", precio: 10 },
      { id: 2, nombre: "Hamburguesa", precio: 8 },
    ];

    res.json(locales);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { getLocales };

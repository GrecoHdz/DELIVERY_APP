const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/database");
const usuariosRoutes = require("./routes/usuarios");

const app = express(); 

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: true, //process.env.NODE_ENV === "production" ? "https://tuapp.com" : true,
    credentials: true,
  })
);

// Rutas
app.use("/usuarios", usuariosRoutes);
 
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

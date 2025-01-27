const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config(); 

const localesRoutes = require("./routes/locales");
const authRoutes = require("./routes/auth");

// Configuración inicial
const app = express();
const PORT = process.env.PORT || 4000;

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
app.use("/auth", authRoutes);
app.use("/locales", localesRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Escuchando comunicaciones en el puerto ${PORT}`);
});

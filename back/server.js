const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB, sequelize } = require("./config/database"); 
const authRoutes = require("./routes/auth"); 
const productRoutes = require("./routes/producto"); // Import product routes
const notificationRoutes = require("./routes/notificacionRoutes"); // Import notification routes
const orderRoutes = require("./routes/pedido"); // Import order routes
const userRoutes = require("./routes/usuarios"); // Import user routes
const vehicleRoutes = require("./routes/vehiculos"); // Import vehicle routes
 
const app = express();  

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",//true, //process.env.NODE_ENV === "production" ? "https://tuapp.com" : true,
    credentials: true,
  })
); 
app.use(cookieParser());
// Rutas
app.use("/login", authRoutes);
app.use("/productos", productRoutes); // Use product routes
app.use("/notificaciones", notificationRoutes); // Use notification routes
app.use("/pedidos", orderRoutes); // Use order routes
app.use("/usuarios", userRoutes); // Use user routes
app.use("/vehiculos", vehicleRoutes); // Use vehicle routes

app.use("/productos", productRoutes); // Use product routes
 

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

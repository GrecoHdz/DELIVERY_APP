const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/database");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const ciudadRoutes = require("./routes/ciudad");
const bancoRoutes = require("./routes/banco");
const metodoPagoRoutes = require("./routes/metodoPago");
const categoriasRoutes = require("./routes/categorias");
const subcategoriasRoutes = require("./routes/subcategorias");
const membresiasRoutes = require("./routes/membresialocales");
const extrasRoutes = require("./routes/extras")
const rolesRoutes = require("./routes/roles"); 
const usuarioRolesRoutes = require("./routes/usuarioRoles");
const clientesRoutes = require("./routes/clientes")
const localesRoutes = require("./routes/locales")
const direccionesclientesRoutes = require("./routes/direccionesClientes") 
const direccioneslocalesRoutes = require("./routes/direccionesLocales")

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
app.use("/auth", authRoutes); 
app.use("/usuarios", usuariosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/subcategorias", subcategoriasRoutes);
app.use("/membresialocales", membresiasRoutes);
app.use("/extras", extrasRoutes);
app.use("/roles", rolesRoutes);
app.use("/usuarioroles", usuarioRolesRoutes);
app.use("/clientes", clientesRoutes);
app.use("/ciudad", ciudadRoutes);
app.use("/banco", bancoRoutes);
app.use("/metodopago", metodoPagoRoutes);
app.use("/locales",localesRoutes);
app.use("/direccionesclientes",direccionesclientesRoutes);
app.use("/direccioneslocales",direccioneslocalesRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

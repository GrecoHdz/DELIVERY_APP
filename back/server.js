const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB, sequelize } = require("./config/database");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const ciudadRoutes = require("./routes/ciudad");
const bancoRoutes = require("./routes/banco");
const metodoPagoRoutes = require("./routes/metodoPago");
const categoriasRoutes = require("./routes/categorias");
const subcategoriasRoutes = require("./routes/subcategorias");
const membresiasRoutes = require("./routes/membresialocales");
const rolesRoutes = require("./routes/roles"); 
const usuarioRolesRoutes = require("./routes/usuarioRoles");
const clientesRoutes = require("./routes/clientes")
const localesRoutes = require("./routes/locales")
const direccionesclientesRoutes = require("./routes/direccionesClientes") 
const direccioneslocalesRoutes = require("./routes/direccionesLocales")
const productoRoutes = require('./routes/producto')
const productoExtraRoutes = require("./routes/productoExtra");
const atributosRoutes = require("./routes/atributo"); 
const recomendadosRoutes = require("./routes/recomendados");
const bannersRoutes = require("./routes/banners");
const driversRoutes = require("./routes/drivers");
const vehiculosRoutes = require("./routes/vehiculos");
const driverVehiculoRoutes = require("./routes/driverVehiculo");
const pagosRoutes = require("./routes/pagos");
const pagosTransferenciaRoutes = require("./routes/pagosTransferencia");
const pagosEfectivoRoutes = require("./routes/pagosEfectivo");
const empleadosRoutes = require("./routes/empleados");
const localMetodoPagoRoutes = require("./routes/localMetodoPago");
const pedidoRoutes = require("./routes/pedido");
const pagomembresiasDrivers = require ("./routes/pagoMembresiaDriver")
const viajeRoutes = require("./routes/viaje");
const productoSucursalRoutes = require("./routes/productoSucursal");
const pagoRentarAutoRoutes = require("./routes/pagoRentarAuto");
const rentarAutoRoutes = require("./routes/rentarAuto");
const autoEnRentaRoutes = require("./routes/autoEnRenta"); 
const atributoRoutes = require("./routes/atributo"); 
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
app.use(cookieParser());
// Rutas
app.use("/login", authRoutes); 
app.use("/usuarios", usuariosRoutes);
app.use("/bancos",bancoRoutes) 
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

/* eslint-disable no-unused-vars */
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
const recomendadosRoutes = require("./routes/recomendados"); // Import
const extraRoues = require("./routes/productoExtra");
const atributosRoute = require("./routes/atributo");
const productoSucursalRoute = require("./routes/productoSucursal");
const direccionesLocalesRoute = require("./routes/direccionesLocales");
const categoriasRoute = require("./routes/categorias");
const subcategoriasRoute = require("./routes/subcategorias");
const localesRoute = require("./routes/locales");
const configRoutes = require('./routes/configRoutes')
  
 const ciudadRoutes = require("./routes/ciudad");
 const bancoRoutes = require("./routes/banco");
 const metodoPagoRoutes = require("./routes/metodoPago");  
 const membresiasRoutes = require("./routes/membresialocales");
 const rolesRoutes = require("./routes/roles"); 
 const usuarioRolesRoutes = require("./routes/usuarioRoles");
 const clientesRoutes = require("./routes/clientes") 
 const direccionesclientesRoutes = require("./routes/direccionesClientes")   
 const bannersRoutes = require("./routes/banners");
 const driversRoutes = require("./routes/drivers"); 
 const driverVehiculoRoutes = require("./routes/driverVehiculo");
 const pagosRoutes = require("./routes/pagos");
 const pagosTransferenciaRoutes = require("./routes/pagosTransferencia");
 const pagosEfectivoRoutes = require("./routes/pagosEfectivo");
 const empleadosRoutes = require("./routes/empleados");
 const localMetodoPagoRoutes = require("./routes/localMetodoPago"); 
 const pagomembresiasDrivers = require ("./routes/pagoMembresiaDriver")
 const viajeRoutes = require("./routes/viaje"); 
 const pagoRentarAutoRoutes = require("./routes/pagoRentarAuto");
 const rentarAutoRoutes = require("./routes/rentarAuto");
 const autoEnRentaRoutes = require("./routes/autoEnRenta"); 
const pedidodetalleRoutes= require("./routes/pedidoDetalle");
const estadisticasRoutes = require("./routes/estadisticas");
const quejaLocalRoutes = require("./routes/quejaLocalRoutes");
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
app.use("/forgot-password", authRoutes);
app.use("/reset-password", authRoutes);
app.use("/productos", productRoutes); // Use product routes 
app.use("/notificaciones", notificationRoutes); // Use notification routes
app.use("/pedidos", orderRoutes); // Use order routes
app.use("/carrito", pedidodetalleRoutes);
app.use("/usuarios", userRoutes); // Use user routes
app.use("/vehiculos", vehicleRoutes); // Use vehicle routes
app.use("/recomendados", recomendadosRoutes); // Use recomendados routes
app.use("/extra", extraRoues);
app.use("/atributos", atributosRoute);
app.use("/productoSucursal", productoSucursalRoute);
app.use("/direccioneslocales",direccionesLocalesRoute);
app.use("/categorias", categoriasRoute);
app.use("/subcategorias", subcategoriasRoute);
app.use("/locales", localesRoute);
app.use('/config', configRoutes);
app.use("/ciudad", ciudadRoutes);
app.use("/banco", bancoRoutes);
app.use("/metodopago", metodoPagoRoutes);
app.use("/membresiaslocales", membresiasRoutes);
app.use("/roles", rolesRoutes);
app.use("/usuarioroles", usuarioRolesRoutes);
app.use("/clientes", clientesRoutes);
app.use("/direccionesclientes", direccionesclientesRoutes);
app.use("/banners", bannersRoutes);
app.use("/drivers", driversRoutes);
app.use("/drivervehiculo", driverVehiculoRoutes);
app.use("/pagos", pagosRoutes);
app.use("/pagostransferencia", pagosTransferenciaRoutes);
app.use("/pagosefectivo", pagosEfectivoRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/localmetodopago", localMetodoPagoRoutes);
app.use("/pagomembresiadriver", pagomembresiasDrivers);
app.use("/viaje", viajeRoutes);
app.use("/pagorentarauto", pagoRentarAutoRoutes);
app.use("/rentarauto", rentarAutoRoutes);
app.use("/autoenrenta", autoEnRentaRoutes);
app.use("/estadisticas", estadisticasRoutes);
app.use("/quejalocal",quejaLocalRoutes)

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

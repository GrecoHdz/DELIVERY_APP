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
const rolesRoutes = require("./routes/roles"); 
const usuarioRolesRoutes = require("./routes/usuarioRoles");
const clientesRoutes = require("./routes/clientes")
const localesRoutes = require("./routes/locales")
const direccionesclientesRoutes = require("./routes/direccionesClientes") 
const direccioneslocalesRoutes = require("./routes/direccionesLocales")
const productoRoutes = require('./routes/producto')
const productoExtraRoutes = require("./routes/productoExtra");
const atributosRoutes = require("./routes/atributos");
const valoresAtributosRoutes = require("./routes/valoresAtributos");
const productoAtributosRoutes = require("./routes/productoAtributos");
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
const productoExtraRoutes = require("./routes/productoExtra");
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
app.use("/roles", rolesRoutes);
app.use("/usuarioroles", usuarioRolesRoutes);
app.use("/clientes", clientesRoutes);
app.use("/ciudad", ciudadRoutes);
app.use("/banco", bancoRoutes);
app.use("/metodopago", metodoPagoRoutes);
app.use("/locales",localesRoutes);
app.use("/direccionesclientes",direccionesclientesRoutes);
app.use("/direccioneslocales",direccioneslocalesRoutes);
app.use('/productos', productoRoutes);
app.use("/productoextra", productoExtraRoutes);
app.use("/atributos", atributosRoutes);
app.use("/valoresatributos", valoresAtributosRoutes);
app.use("/productoatributos", productoAtributosRoutes);
app.use("/recomendados", recomendadosRoutes);
app.use("/banners", bannersRoutes);
app.use("/drivers", driversRoutes);
app.use("/vehiculos", vehiculosRoutes); 
app.use("/drivervehiculo", driverVehiculoRoutes);
app.use("/pagos", pagosRoutes);
app.use("/pagostransferencia", pagosTransferenciaRoutes);
app.use("/pagosefectivo", pagosEfectivoRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/localmetodopago", localMetodoPagoRoutes);
app.use("/pagomembresiadriver",pagomembresiasDrivers);
app.use("/viajes", viajeRoutes); 
app.use("/productossucursales", productoSucursalRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pagorentarauto", pagoRentarAutoRoutes);
app.use("/rentarauto", rentarAutoRoutes);
app.use("/autosenrenta", autoEnRentaRoutes);
app.use("/productosextras", productoExtraRoutes);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

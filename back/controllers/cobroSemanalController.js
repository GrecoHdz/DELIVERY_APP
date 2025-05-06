const { CobroSemanal, CobroProducto, Local, DireccionLocal, MembresiaLocal, Ciudad } = require("../models");
const { Op } = require("sequelize");
const { uploadToCloudinary } = require("../config/cloudinary");

// Obtener todos los cobros semanales de un local
exports.getCobrosByLocal = async (req, res) => {
  try {
    const { id_local } = req.params;

    const cobros = await CobroSemanal.findAll({
      where: { id_local },
      order: [["periodo_fin", "DESC"]],
      include: [
        {
          model: Local,
          attributes: ["nombre_local", "id_membresia"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: cobros,
    });
  } catch (error) {
    console.error("Error al obtener cobros semanales:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los cobros semanales",
      error: error.message,
    });
  }
};

// Obtener un cobro semanal específico con sus productos
exports.getCobroById = async (req, res) => {
  try {
    const { id_cobro } = req.params;

    // Primero obtenemos el cobro sin productos
    const cobro = await CobroSemanal.findByPk(id_cobro, {
      include: [
        {
          model: Local,
          attributes: ["nombre_local", "id_membresia"],
          include: [
            {
              model: MembresiaLocal,
              attributes: ["nombre_membresia", "precio_delivery_extra", "limite_recomendaciones"],
            },
          ],
        },
      ],
    });

    if (!cobro) {
      return res.status(404).json({
        success: false,
        message: "Cobro semanal no encontrado",
      });
    }

    // Ahora buscamos los productos vendidos en el período del cobro
    const productos = await CobroProducto.findAll({
      where: {
        id_local: cobro.id_local,
        fecha_venta: {
          [Op.between]: [cobro.periodo_inicio, cobro.periodo_fin]
        }
      },
      include: [
        {
          model: DireccionLocal,
          as: "sucursal",
          attributes: ["id_direccion_local", "colonia", "id_ciudad"],
          include: [
            {
              model: Local,
              attributes: ["nombre_local"],
            },
            {
              model: Ciudad,
              attributes: ["nombre_ciudad"],
            },
          ],
        },
      ],
    });

    // Agregamos los productos al objeto del cobro
    cobro.dataValues.productos = productos;

    console.log(`[API] Se encontraron ${productos.length} productos para el cobro ID: ${id_cobro}`);

    res.status(200).json({
      success: true,
      data: cobro,
    });
  } catch (error) {
    console.error("Error al obtener cobro semanal:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el cobro semanal",
      error: error.message,
    });
  }
};

// Obtener el cobro semanal actual de un local
exports.getCobroActualByLocal = async (req, res) => {
  try {
    const { id_local } = req.params;
    console.log(`[API] Solicitando cobro semanal actual para local ID: ${id_local}`);

    // Obtener la fecha actual
    const fechaActual = new Date();
    console.log(`[API] Fecha actual: ${fechaActual.toISOString()}`);
    console.log(`[API] Día de la semana actual (0=domingo, 1=lunes): ${fechaActual.getDay()}`);

    // Calcular el período de la semana anterior (la que ya finalizó)
    // Encontrar el lunes de la semana anterior
    const inicioSemanaAnterior = new Date(fechaActual);

    // Si hoy es domingo (getDay() == 0), restamos 6 días para llegar al lunes anterior
    // Si hoy es lunes (getDay() == 1), restamos 7 días para llegar al lunes anterior
    // Si hoy es martes (getDay() == 2), restamos 8 días para llegar al lunes anterior, etc.
    const diasARestar = fechaActual.getDay() === 0 ? 6 : fechaActual.getDay() + 6;
    inicioSemanaAnterior.setDate(fechaActual.getDate() - diasARestar);
    inicioSemanaAnterior.setHours(0, 0, 0, 0);

    // Encontrar el domingo de la semana anterior
    const finSemanaAnterior = new Date(inicioSemanaAnterior);
    finSemanaAnterior.setDate(inicioSemanaAnterior.getDate() + 6);
    finSemanaAnterior.setHours(23, 59, 59, 999);

    console.log(`[API] Buscando cobro para la semana anterior: ${inicioSemanaAnterior.toISOString()} - ${finSemanaAnterior.toISOString()}`);
    console.log(`[API] Fecha inicio formateada: ${inicioSemanaAnterior.getFullYear()}-${(inicioSemanaAnterior.getMonth() + 1).toString().padStart(2, '0')}-${inicioSemanaAnterior.getDate().toString().padStart(2, '0')}`);
    console.log(`[API] Fecha fin formateada: ${finSemanaAnterior.getFullYear()}-${(finSemanaAnterior.getMonth() + 1).toString().padStart(2, '0')}-${finSemanaAnterior.getDate().toString().padStart(2, '0')}`);

    // Buscar el cobro de la semana anterior con un margen de tolerancia de 1 día
    const cobroSemanaAnterior = await CobroSemanal.findOne({
      where: {
        id_local,
        periodo_inicio: {
          [Op.between]: [
            new Date(inicioSemanaAnterior.getTime() - 24 * 60 * 60 * 1000), // 1 día antes
            new Date(inicioSemanaAnterior.getTime() + 24 * 60 * 60 * 1000)  // 1 día después
          ]
        },
        periodo_fin: {
          [Op.between]: [
            new Date(finSemanaAnterior.getTime() - 24 * 60 * 60 * 1000), // 1 día antes
            new Date(finSemanaAnterior.getTime() + 24 * 60 * 60 * 1000)  // 1 día después
          ]
        }
      },
      include: [
        {
          model: Local,
          attributes: ["nombre_local", "id_membresia"],
          include: [
            {
              model: MembresiaLocal,
              attributes: ["nombre_membresia", "precio_delivery_extra", "limite_recomendaciones"],
            },
          ],
        },
      ],
    });

    // Si existe un cobro para la semana anterior, obtener sus productos y devolverlo
    if (cobroSemanaAnterior) {
      console.log(`[API] Cobro encontrado para la semana anterior con ID: ${cobroSemanaAnterior.id_cobro}`);

      // Obtener los productos vendidos en el período del cobro
      const productos = await CobroProducto.findAll({
        where: {
          id_local: cobroSemanaAnterior.id_local,
          fecha_venta: {
            [Op.between]: [cobroSemanaAnterior.periodo_inicio, cobroSemanaAnterior.periodo_fin]
          }
        },
        include: [
          {
            model: DireccionLocal,
            as: "sucursal",
            attributes: ["id_direccion_local", "colonia", "id_ciudad"],
            include: [
              {
                model: Local,
                attributes: ["nombre_local"],
              },
              {
                model: Ciudad,
                attributes: ["nombre_ciudad"],
              },
            ],
          },
        ],
      });

      // Agregar los productos al objeto del cobro
      cobroSemanaAnterior.dataValues.productos = productos;

      console.log(`[API] Se encontraron ${productos.length} productos para el cobro ID: ${cobroSemanaAnterior.id_cobro}`);

      return res.status(200).json({
        success: true,
        data: cobroSemanaAnterior,
      });
    }

    // Si no existe un cobro para la semana anterior, crear uno nuevo
    console.log(`[API] No se encontró cobro para la semana anterior. Creando uno nuevo...`);

    // Generar número de factura: FAC-fecha-id_local
    const fechaFormateada = inicioSemanaAnterior.toISOString().split('T')[0].replace(/-/g, '');
    const numFactura = `FAC-${fechaFormateada}-${id_local}`;

    console.log(`[API] Generando nuevo cobro con número de factura: ${numFactura}`);
    console.log(`[API] Período: ${inicioSemanaAnterior.toISOString()} - ${finSemanaAnterior.toISOString()}`);

    // Buscar productos vendidos en el período
    const productosVendidos = await CobroProducto.findAll({
      where: {
        id_local,
        fecha_venta: {
          [Op.between]: [inicioSemanaAnterior, finSemanaAnterior]
        }
      }
    });

    console.log(`[API] Se encontraron ${productosVendidos.length} productos vendidos en el período`);

    // Calcular ventas y comisiones
    let ventasEfectivo = 0;
    let ventasTarjeta = 0;

    // Sumar las ventas por método de pago
    productosVendidos.forEach(producto => {
      if (producto.metodo_pago === 'efectivo') {
        ventasEfectivo += parseFloat(producto.total);
      } else if (producto.metodo_pago === 'tarjeta') {
        ventasTarjeta += parseFloat(producto.total);
      }
    });

    // Calcular comisiones (15%)
    const comisionEfectivo = ventasEfectivo * 0.15;
    const comisionTarjeta = ventasTarjeta * 0.15;

    // Por ahora, usamos valores de ejemplo para pedidos extra
    const pedidosExtra = 0;
    const costoPedidosExtra = 0;

    // Calcular el total a pagar
    const total = comisionEfectivo + costoPedidosExtra - (ventasTarjeta * 0.85);

    console.log(`[API] Ventas en efectivo: ${ventasEfectivo}, Ventas con tarjeta: ${ventasTarjeta}`);
    console.log(`[API] Comisión efectivo: ${comisionEfectivo}, Comisión tarjeta: ${comisionTarjeta}`);
    console.log(`[API] Total a pagar: ${total}`);

    // Crear un nuevo cobro semanal
    const nuevoCobro = await CobroSemanal.create({
      id_local,
      num_factura: numFactura,
      periodo_inicio: inicioSemanaAnterior,
      periodo_fin: finSemanaAnterior,
      ventas_efectivo: ventasEfectivo,
      ventas_tarjeta: ventasTarjeta,
      comision_efectivo: comisionEfectivo,
      comision_tarjeta: comisionTarjeta,
      pedidos_extra: pedidosExtra,
      costo_pedidos_extra: costoPedidosExtra,
      total,
      estado: "pendiente",
    });

    console.log(`[API] Nuevo cobro creado con ID: ${nuevoCobro.id_cobro}`);

    // Obtener el cobro recién creado con sus relaciones
    const cobroCompleto = await CobroSemanal.findByPk(nuevoCobro.id_cobro, {
      include: [
        {
          model: Local,
          attributes: ["nombre_local", "id_membresia"],
          include: [
            {
              model: MembresiaLocal,
              attributes: ["nombre_membresia", "precio_delivery_extra", "limite_recomendaciones"],
            },
          ],
        },
      ],
    });

    // Obtener los productos vendidos en el período
    const productos = await CobroProducto.findAll({
      where: {
        id_local,
        fecha_venta: {
          [Op.between]: [inicioSemanaAnterior, finSemanaAnterior]
        }
      },
      include: [
        {
          model: DireccionLocal,
          as: "sucursal",
          attributes: ["id_direccion_local", "colonia", "id_ciudad"],
          include: [
            {
              model: Local,
              attributes: ["nombre_local"],
            },
            {
              model: Ciudad,
              attributes: ["nombre_ciudad"],
            },
          ],
        },
      ],
    });

    // Agregar los productos al objeto del cobro
    cobroCompleto.dataValues.productos = productos;

    console.log(`[API] Se encontraron ${productos.length} productos para el cobro ID: ${nuevoCobro.id_cobro}`);
    console.log(`[API] Enviando datos del nuevo cobro:`, JSON.stringify(cobroCompleto, null, 2));

    return res.status(201).json({
      success: true,
      data: cobroCompleto,
      message: "Se ha creado un nuevo cobro semanal",
    });
  } catch (error) {
    console.error("Error al obtener cobro semanal actual:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el cobro semanal actual",
      error: error.message,
    });
  }
};

// Marcar un cobro como pagado y subir comprobante
exports.marcarComoPagado = async (req, res) => {
  try {
    const { id_cobro } = req.params;
    // Extraemos metodo_pago del body pero no lo usamos por ahora
    // const { metodo_pago } = req.body;

    // Verificar si existe el cobro
    const cobro = await CobroSemanal.findByPk(id_cobro);

    if (!cobro) {
      return res.status(404).json({
        success: false,
        message: "Cobro semanal no encontrado",
      });
    }

    // Si se envió un archivo, subirlo a Cloudinary
    let comprobanteUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "comprobantes_pago");
      comprobanteUrl = result.secure_url;
    }

    // Actualizar el cobro
    await cobro.update({
      estado: "pagado",
      fecha_pago: new Date(),
      comprobante_url: comprobanteUrl || cobro.comprobante_url,
    });

    res.status(200).json({
      success: true,
      message: "Cobro marcado como pagado exitosamente",
      data: cobro,
    });
  } catch (error) {
    console.error("Error al marcar cobro como pagado:", error);
    res.status(500).json({
      success: false,
      message: "Error al marcar el cobro como pagado",
      error: error.message,
    });
  }
};

// Generar cobro semanal para un local
exports.generarCobroSemanal = async (req, res) => {
  try {
    const { id_local } = req.params;

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Encontrar el lunes de la semana anterior
    const inicioSemanaAnterior = new Date(fechaActual);
    inicioSemanaAnterior.setDate(fechaActual.getDate() - fechaActual.getDay() - 6);
    inicioSemanaAnterior.setHours(0, 0, 0, 0);

    // Encontrar el domingo de la semana anterior
    const finSemanaAnterior = new Date(inicioSemanaAnterior);
    finSemanaAnterior.setDate(inicioSemanaAnterior.getDate() + 6);
    finSemanaAnterior.setHours(23, 59, 59, 999);

    // Verificar si ya existe un cobro para la semana anterior con un margen de tolerancia
    const cobroExistente = await CobroSemanal.findOne({
      where: {
        id_local,
        periodo_inicio: {
          [Op.between]: [
            new Date(inicioSemanaAnterior.getTime() - 24 * 60 * 60 * 1000), // 1 día antes
            new Date(inicioSemanaAnterior.getTime() + 24 * 60 * 60 * 1000)  // 1 día después
          ]
        },
        periodo_fin: {
          [Op.between]: [
            new Date(finSemanaAnterior.getTime() - 24 * 60 * 60 * 1000), // 1 día antes
            new Date(finSemanaAnterior.getTime() + 24 * 60 * 60 * 1000)  // 1 día después
          ]
        }
      },
    });

    if (cobroExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un cobro para la semana anterior",
      });
    }

    // Obtener los productos vendidos en el período
    const productos = await CobroProducto.findAll({
      where: {
        id_local,
        fecha_venta: {
          [Op.between]: [inicioSemanaAnterior, finSemanaAnterior]
        }
      }
    });

    console.log(`[API] Se encontraron ${productos.length} productos vendidos en el período`);

    // Calcular las ventas y comisiones
    let ventasEfectivo = 0;
    let ventasTarjeta = 0;

    // Sumar las ventas por método de pago
    productos.forEach(producto => {
      if (producto.metodo_pago === 'efectivo') {
        ventasEfectivo += parseFloat(producto.total);
      } else if (producto.metodo_pago === 'tarjeta') {
        ventasTarjeta += parseFloat(producto.total);
      }
    });

    // Calcular comisiones (15%)
    const comisionEfectivo = ventasEfectivo * 0.15;
    const comisionTarjeta = ventasTarjeta * 0.15;

    // Por ahora, usamos valores de ejemplo para pedidos extra
    const pedidosExtra = 5;
    const costoPedidosExtra = pedidosExtra * 10;
    const total = comisionEfectivo + costoPedidosExtra - (ventasTarjeta * 0.85);

    // Generar número de factura: FAC-fecha-id_local
    const fechaFormateada = inicioSemanaAnterior.toISOString().split('T')[0].replace(/-/g, '');
    const numFactura = `FAC-${fechaFormateada}-${id_local}`;

    // Crear el cobro semanal
    const nuevoCobro = await CobroSemanal.create({
      id_local,
      num_factura: numFactura,
      periodo_inicio: inicioSemanaAnterior,
      periodo_fin: finSemanaAnterior,
      ventas_efectivo: ventasEfectivo,
      ventas_tarjeta: ventasTarjeta,
      comision_efectivo: comisionEfectivo,
      comision_tarjeta: comisionTarjeta,
      pedidos_extra: pedidosExtra,
      costo_pedidos_extra: costoPedidosExtra,
      total,
      estado: "pendiente",
    });

    res.status(201).json({
      success: true,
      message: "Cobro semanal generado exitosamente",
      data: nuevoCobro,
    });
  } catch (error) {
    console.error("Error al generar cobro semanal:", error);
    res.status(500).json({
      success: false,
      message: "Error al generar el cobro semanal",
      error: error.message,
    });
  }
};

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

    const cobro = await CobroSemanal.findByPk(id_cobro, {
      include: [
        {
          model: CobroProducto,
          as: "productos",
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
        },
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

    // Encontrar el lunes de la semana actual
    const inicioSemana = new Date(fechaActual);
    inicioSemana.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
    inicioSemana.setHours(0, 0, 0, 0);

    // Encontrar el domingo de la semana actual
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    console.log(`[API] Buscando cobro para el período: ${inicioSemana.toISOString()} - ${finSemana.toISOString()}`);

    // Buscar el cobro de la semana actual
    const cobro = await CobroSemanal.findOne({
      where: {
        id_local,
        periodo_inicio: {
          [Op.lte]: finSemana,
        },
        periodo_fin: {
          [Op.gte]: inicioSemana,
        },
      },
      include: [
        {
          model: CobroProducto,
          as: "productos",
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
        },
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

    // Si no existe un cobro para la semana actual, crear uno nuevo
    if (!cobro) {
      console.log(`[API] No se encontró cobro para la semana actual. Creando uno nuevo...`);

      // Generar número de factura: FAC-fecha-id_local
      const fechaFormateada = inicioSemana.toISOString().split('T')[0].replace(/-/g, '');
      const numFactura = `FAC-${fechaFormateada}-${id_local}`;

      // Crear un nuevo cobro semanal
      const nuevoCobro = await CobroSemanal.create({
        id_local,
        num_factura: numFactura,
        periodo_inicio: inicioSemana,
        periodo_fin: finSemana,
        ventas_efectivo: 0,
        ventas_tarjeta: 0,
        comision_efectivo: 0,
        comision_tarjeta: 0,
        pedidos_extra: 0,
        costo_pedidos_extra: 0,
        total: 0,
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

      console.log(`[API] Enviando datos del nuevo cobro:`, JSON.stringify(cobroCompleto, null, 2));

      return res.status(201).json({
        success: true,
        data: cobroCompleto,
        message: "Se ha creado un nuevo cobro semanal",
      });
    }

    console.log(`[API] Cobro encontrado con ID: ${cobro.id_cobro}`);
    console.log(`[API] Productos asociados: ${cobro.productos ? cobro.productos.length : 0}`);
    console.log(`[API] Enviando datos del cobro existente`);

    res.status(200).json({
      success: true,
      data: cobro,
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
    const { metodo_pago } = req.body;

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

    // Verificar si ya existe un cobro para la semana anterior
    const cobroExistente = await CobroSemanal.findOne({
      where: {
        id_local,
        periodo_inicio: inicioSemanaAnterior,
        periodo_fin: finSemanaAnterior,
      },
    });

    if (cobroExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un cobro para la semana anterior",
      });
    }

    // Aquí iría la lógica para calcular las ventas y comisiones
    // Por ahora, usaremos valores de ejemplo
    const ventasEfectivo = 1000;
    const ventasTarjeta = 500;
    const comisionEfectivo = ventasEfectivo * 0.15;
    const comisionTarjeta = ventasTarjeta * 0.15;
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

const { CobroProducto, CobroSemanal, Producto, DireccionLocal, Local, Ciudad } = require("../models");

// Obtener todos los productos de un cobro
exports.getProductosByCobro = async (req, res) => {
  try {
    const { id_cobro } = req.params;
    console.log(`[API] Solicitando productos para el cobro ID: ${id_cobro}`);

    // Verificar si existe el cobro
    const cobro = await CobroSemanal.findByPk(id_cobro);

    if (!cobro) {
      console.log(`[API] Cobro con ID ${id_cobro} no encontrado`);
      return res.status(404).json({
        success: false,
        message: "Cobro semanal no encontrado",
      });
    }

    // Obtener los productos del cobro
    const productos = await CobroProducto.findAll({
      where: { id_cobro },
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

    console.log(`[API] Se encontraron ${productos.length} productos para el cobro ID: ${id_cobro}`);

    // Mostrar información resumida de los productos
    if (productos.length > 0) {
      console.log('[API] Resumen de productos:');
      productos.forEach((producto, index) => {
        console.log(`  ${index + 1}. ${producto.nombre_producto} - Cantidad: ${producto.cantidad} - Total: ${producto.total} - Método: ${producto.metodo_pago}`);
      });
    }

    res.status(200).json({
      success: true,
      data: productos,
    });
  } catch (error) {
    console.error("Error al obtener productos del cobro:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos del cobro",
      error: error.message,
    });
  }
};

// Agregar un producto a un cobro
exports.addProductoToCobro = async (req, res) => {
  try {
    const { id_cobro } = req.params;
    const { id_producto, nombre_producto, cantidad, precio_unitario, total, metodo_pago, id_direccion_local } = req.body;

    // Verificar si existe el cobro
    const cobro = await CobroSemanal.findByPk(id_cobro);

    if (!cobro) {
      return res.status(404).json({
        success: false,
        message: "Cobro semanal no encontrado",
      });
    }

    // Crear el producto del cobro
    const nuevoProducto = await CobroProducto.create({
      id_cobro,
      id_producto,
      nombre_producto,
      cantidad,
      precio_unitario,
      total,
      metodo_pago,
      id_direccion_local,
    });

    // Actualizar los totales del cobro
    let { ventas_efectivo, ventas_tarjeta, comision_efectivo, comision_tarjeta, total: totalCobro } = cobro;

    if (metodo_pago === "efectivo") {
      ventas_efectivo += parseFloat(total);
      comision_efectivo = ventas_efectivo * 0.15;
    } else if (metodo_pago === "tarjeta") {
      ventas_tarjeta += parseFloat(total);
      comision_tarjeta = ventas_tarjeta * 0.15;
    }

    // Calcular el nuevo total del cobro
    totalCobro = comision_efectivo + cobro.costo_pedidos_extra - (ventas_tarjeta * 0.85);

    // Actualizar el cobro
    await cobro.update({
      ventas_efectivo,
      ventas_tarjeta,
      comision_efectivo,
      comision_tarjeta,
      total: totalCobro,
    });

    res.status(201).json({
      success: true,
      message: "Producto agregado al cobro exitosamente",
      data: nuevoProducto,
    });
  } catch (error) {
    console.error("Error al agregar producto al cobro:", error);
    res.status(500).json({
      success: false,
      message: "Error al agregar el producto al cobro",
      error: error.message,
    });
  }
};

// Eliminar un producto de un cobro
exports.removeProductoFromCobro = async (req, res) => {
  try {
    const { id_cobro_producto } = req.params;

    // Verificar si existe el producto del cobro
    const producto = await CobroProducto.findByPk(id_cobro_producto);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto del cobro no encontrado",
      });
    }

    // Obtener el cobro
    const cobro = await CobroSemanal.findByPk(producto.id_cobro);

    if (!cobro) {
      return res.status(404).json({
        success: false,
        message: "Cobro semanal no encontrado",
      });
    }

    // Actualizar los totales del cobro
    let { ventas_efectivo, ventas_tarjeta, comision_efectivo, comision_tarjeta, total } = cobro;

    if (producto.metodo_pago === "efectivo") {
      ventas_efectivo -= parseFloat(producto.total);
      comision_efectivo = ventas_efectivo * 0.15;
    } else if (producto.metodo_pago === "tarjeta") {
      ventas_tarjeta -= parseFloat(producto.total);
      comision_tarjeta = ventas_tarjeta * 0.15;
    }

    // Calcular el nuevo total del cobro
    total = comision_efectivo + cobro.costo_pedidos_extra - (ventas_tarjeta * 0.85);

    // Actualizar el cobro
    await cobro.update({
      ventas_efectivo,
      ventas_tarjeta,
      comision_efectivo,
      comision_tarjeta,
      total,
    });

    // Eliminar el producto del cobro
    await producto.destroy();

    res.status(200).json({
      success: true,
      message: "Producto eliminado del cobro exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto del cobro:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el producto del cobro",
      error: error.message,
    });
  }
};

const EstadisticaLocal = require("../models/EstadisticaLocal");
const Pedido = require("../models/Pedido");
const PedidoDetalle = require("../models/PedidoDetalle");
const Local = require("../models/Local");
const MembresiaLocal = require("../models/MembresiaLocales");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

// Obtener estadísticas de un local por su ID
const getEstadisticasByLocalId = async (req, res) => {
  const { id_local } = req.params;
  try {
    // Verificar que el local existe
    const local = await Local.findByPk(id_local);
    if (!local) {
      return res.status(404).json({ message: "Local no encontrado" });
    }

    // Buscar estadísticas existentes
    let estadisticas = await EstadisticaLocal.findOne({
      where: { id_local }
    });

    // Si no existen estadísticas, calcularlas y crearlas
    if (!estadisticas) {
      estadisticas = await calcularYCrearEstadisticas(id_local);
    } else {
      // Verificar si las estadísticas están actualizadas (menos de 1 día)
      const fechaActualizacion = new Date(estadisticas.fecha_actualizacion);
      const ahora = new Date();
      const diferenciaTiempo = ahora - fechaActualizacion;
      const diferenciaHoras = diferenciaTiempo / (1000 * 60 * 60);

      // Si han pasado más de 24 horas, actualizar estadísticas
      if (diferenciaHoras > 24) {
        estadisticas = await calcularYCrearEstadisticas(id_local);
      }
    }

    // Obtener información de la membresía
    const membresia = await MembresiaLocal.findByPk(local.id_membresia);

    // Preparar respuesta con toda la información
    const respuesta = {
      ...estadisticas.toJSON(),
      local_info: {
        id_local: local.id_local,
        nombre_local: local.nombre_local,
        apertura: local.apertura,
        cierre: local.cierre,
        pedidos_restantes: local.pedidos_restantes,
        recomendaciones_restantes: local.recomendaciones_restantes
      },
      membresia_info: membresia ? {
        id_membresia: membresia.id_membresia,
        nombre_membresia: membresia.nombre_membresia,
        limite_recomendaciones: membresia.limite_recomendaciones || 1
      } : null
    };

    res.json(respuesta);
  } catch (error) {
    console.error("Error al obtener estadísticas del local:", error);
    res.status(500).json({ message: "Error al obtener estadísticas del local", error });
  }
};

// Función para calcular y crear/actualizar estadísticas
const calcularYCrearEstadisticas = async (id_local) => {
  try {
    // Obtener fecha de hace una semana
    const fechaHaceSemana = new Date();
    fechaHaceSemana.setDate(fechaHaceSemana.getDate() - 7);

    // Obtener fecha de hace dos semanas
    const fechaHaceDosSemanas = new Date();
    fechaHaceDosSemanas.setDate(fechaHaceDosSemanas.getDate() - 14);

    // Calcular pedidos e ingresos de la semana actual
    const pedidosSemanaActual = await Pedido.findAll({
      where: {
        id_local,
        fecha_pedido: {
          [Op.gte]: fechaHaceSemana
        },
        estado: 'entregado'
      },
      include: [
        {
          model: PedidoDetalle,
          as: 'items'
        }
      ]
    });

    // Calcular pedidos e ingresos de la semana anterior
    const pedidosSemanaAnterior = await Pedido.findAll({
      where: {
        id_local,
        fecha_pedido: {
          [Op.gte]: fechaHaceDosSemanas,
          [Op.lt]: fechaHaceSemana
        },
        estado: 'entregado'
      },
      include: [
        {
          model: PedidoDetalle,
          as: 'items'
        }
      ]
    });

    // Calcular número de pedidos semanales
    const pedidosSemanales = pedidosSemanaActual.length;

    // Calcular ingresos semanales
    let ingresosSemanales = 0;
    pedidosSemanaActual.forEach(pedido => {
      pedido.items.forEach(item => {
        ingresosSemanales += parseFloat(item.subtotal);
      });
    });

    // Calcular tendencias
    const pedidosSemanaAnteriorCount = pedidosSemanaAnterior.length;
    let ingresosSemanaAnterior = 0;
    pedidosSemanaAnterior.forEach(pedido => {
      pedido.items.forEach(item => {
        ingresosSemanaAnterior += parseFloat(item.subtotal);
      });
    });

    // Calcular porcentaje de tendencia
    let tendenciaPedidos = 0;
    let tendenciaIngresos = 0;

    if (pedidosSemanaAnteriorCount > 0) {
      tendenciaPedidos = Math.round(((pedidosSemanales - pedidosSemanaAnteriorCount) / pedidosSemanaAnteriorCount) * 100);
    }

    if (ingresosSemanaAnterior > 0) {
      tendenciaIngresos = Math.round(((ingresosSemanales - ingresosSemanaAnterior) / ingresosSemanaAnterior) * 100);
    }

    // Buscar estadísticas existentes para actualizar o crear nuevas
    const [estadisticas, created] = await EstadisticaLocal.findOrCreate({
      where: { id_local },
      defaults: {
        pedidos_semanales: pedidosSemanales,
        ingresos_semanales: ingresosSemanales,
        tendencia_pedidos: tendenciaPedidos,
        tendencia_ingresos: tendenciaIngresos,
        fecha_actualizacion: new Date()
      }
    });

    // Si ya existían estadísticas, actualizarlas
    if (!created) {
      await estadisticas.update({
        pedidos_semanales: pedidosSemanales,
        ingresos_semanales: ingresosSemanales,
        tendencia_pedidos: tendenciaPedidos,
        tendencia_ingresos: tendenciaIngresos,
        fecha_actualizacion: new Date()
      });
    }

    return estadisticas;
  } catch (error) {
    console.error("Error al calcular estadísticas:", error);
    throw error;
  }
};

// Actualizar estadísticas manualmente
const updateEstadisticasLocal = async (req, res) => {
  const { id_local } = req.params;
  try {
    const estadisticas = await calcularYCrearEstadisticas(id_local);
    res.json({ message: "Estadísticas actualizadas correctamente", estadisticas });
  } catch (error) {
    console.error("Error al actualizar estadísticas:", error);
    res.status(500).json({ message: "Error al actualizar estadísticas", error });
  }
};

module.exports = {
  getEstadisticasByLocalId,
  updateEstadisticasLocal
};

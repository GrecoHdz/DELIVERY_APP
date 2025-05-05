const { CobroSemanal, CobroProducto, Local, DireccionLocal, Ciudad } = require("../models");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

// Exportar cobro semanal a Excel
exports.exportToExcel = async (req, res) => {
  try {
    const { id_cobro } = req.params;

    // Obtener el cobro con sus productos
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
        },
      ],
    });

    if (!cobro) {
      return res.status(404).json({
        success: false,
        message: "Cobro semanal no encontrado",
      });
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Delivery App";
    workbook.lastModifiedBy = "Delivery App";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Crear una hoja para el resumen
    const resumenSheet = workbook.addWorksheet("Resumen");

    // Agregar encabezado
    resumenSheet.mergeCells("A1:F1");
    const headerCell = resumenSheet.getCell("A1");
    headerCell.value = `Cobro Semanal - ${cobro.Local.nombre_local}`;
    headerCell.font = { size: 16, bold: true };
    headerCell.alignment = { horizontal: "center" };

    // Agregar información del periodo
    resumenSheet.mergeCells("A3:F3");
    const periodoCell = resumenSheet.getCell("A3");
    periodoCell.value = `Periodo: ${formatDate(cobro.periodo_inicio)} al ${formatDate(cobro.periodo_fin)}`;
    periodoCell.font = { size: 12, bold: true };
    periodoCell.alignment = { horizontal: "center" };

    // Agregar resumen financiero
    resumenSheet.getCell("B5").value = "Resumen Financiero";
    resumenSheet.getCell("B5").font = { size: 14, bold: true };

    resumenSheet.getCell("B6").value = "Ventas en Efectivo:";
    resumenSheet.getCell("C6").value = cobro.ventas_efectivo;
    resumenSheet.getCell("C6").numFmt = "L. #,##0.00";

    resumenSheet.getCell("B7").value = "Ventas con Tarjeta:";
    resumenSheet.getCell("C7").value = cobro.ventas_tarjeta;
    resumenSheet.getCell("C7").numFmt = "L. #,##0.00";

    resumenSheet.getCell("B8").value = "Comisión por Ventas en Efectivo:";
    resumenSheet.getCell("C8").value = cobro.comision_efectivo;
    resumenSheet.getCell("C8").numFmt = "L. #,##0.00";
    resumenSheet.getCell("C8").font = { color: { argb: "FFFF0000" } };

    resumenSheet.getCell("B9").value = "Pago por Ventas con Tarjeta:";
    resumenSheet.getCell("C9").value = cobro.ventas_tarjeta * 0.85;
    resumenSheet.getCell("C9").numFmt = "L. #,##0.00";
    resumenSheet.getCell("C9").font = { color: { argb: "FF008000" } };

    resumenSheet.getCell("B10").value = "Pedidos Extra:";
    resumenSheet.getCell("C10").value = cobro.pedidos_extra;

    resumenSheet.getCell("B11").value = "Costo Pedidos Extra:";
    resumenSheet.getCell("C11").value = cobro.costo_pedidos_extra;
    resumenSheet.getCell("C11").numFmt = "L. #,##0.00";
    resumenSheet.getCell("C11").font = { color: { argb: "FFFF0000" } };

    resumenSheet.getCell("B13").value = "Balance Final:";
    resumenSheet.getCell("C13").value = cobro.total;
    resumenSheet.getCell("C13").numFmt = "L. #,##0.00";
    resumenSheet.getCell("C13").font = { bold: true, color: { argb: cobro.total >= 0 ? "FFFF0000" : "FF008000" } };

    // Crear una hoja para los productos
    const productosSheet = workbook.addWorksheet("Productos Vendidos");

    // Agregar encabezados de columnas
    productosSheet.columns = [
      { header: "Producto", key: "nombre", width: 30 },
      { header: "Cantidad", key: "cantidad", width: 10 },
      { header: "Precio Unitario", key: "precio", width: 15 },
      { header: "Total", key: "total", width: 15 },
      { header: "Método de Pago", key: "metodo_pago", width: 15 },
      { header: "Sucursal", key: "sucursal", width: 20 },
    ];

    // Estilo para los encabezados
    productosSheet.getRow(1).font = { bold: true };
    productosSheet.getRow(1).alignment = { horizontal: "center" };

    // Agregar datos de productos
    cobro.productos.forEach(producto => {
      productosSheet.addRow({
        nombre: producto.nombre_producto,
        cantidad: producto.cantidad,
        precio: producto.precio_unitario,
        total: producto.total,
        metodo_pago: producto.metodo_pago === "efectivo" ? "Efectivo" : "Tarjeta",
        sucursal: producto.sucursal && producto.sucursal.Local ?
          `${producto.sucursal.Local.nombre_local} (${producto.sucursal.Ciudad ? producto.sucursal.Ciudad.nombre_ciudad : "N/A"})` :
          "N/A",
      });
    });

    // Formato para las columnas de precios
    productosSheet.getColumn("precio").numFmt = "L. #,##0.00";
    productosSheet.getColumn("total").numFmt = "L. #,##0.00";

    // Agregar fila de total
    const totalRow = productosSheet.addRow({
      nombre: "TOTAL",
      cantidad: "",
      precio: "",
      total: cobro.productos.reduce((sum, producto) => sum + parseFloat(producto.total), 0),
      metodo_pago: "",
      sucursal: "",
    });
    totalRow.font = { bold: true };
    totalRow.getCell("total").numFmt = "L. #,##0.00";

    // Escribir el archivo en un buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Enviar el archivo al cliente
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=cobro-semanal-${formatDate(cobro.periodo_inicio)}.xlsx`);
    res.send(buffer);
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    res.status(500).json({
      success: false,
      message: "Error al exportar a Excel",
      error: error.message,
    });
  }
};

// Exportar cobro semanal a PDF
exports.exportToPDF = async (req, res) => {
  try {
    const { id_cobro } = req.params;
    const { sucursal } = req.query;

    // Obtener el cobro con sus productos
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
              model: DireccionLocal,
              attributes: ["id_direccion_local", "colonia", "id_ciudad", "direccion_precisa"],
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
      ],
    });

    if (!cobro) {
      return res.status(404).json({
        success: false,
        message: "Cobro semanal no encontrado",
      });
    }

    // Filtrar productos por sucursal si se especifica
    let productosFiltrados = cobro.productos;
    if (sucursal && sucursal !== "todas") {
      productosFiltrados = cobro.productos.filter(producto => producto.id_sucursal === parseInt(sucursal));
    }

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });

    // Configurar la respuesta HTTP
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=cobro-semanal-${formatDate(cobro.periodo_inicio)}.pdf`);

    // Pipe el PDF a la respuesta
    doc.pipe(res);

    // Agregar encabezado
    doc.fontSize(20).text("Cobro Semanal", { align: "center" });
    doc.moveDown();

    // Agregar información del local
    doc.fontSize(12).text("Información del Local:", { underline: true });
    doc.fontSize(10).text(`Nombre: ${cobro.Local.nombre_local}`);

    // Obtener la dirección de la sucursal seleccionada o la primera disponible
    let direccionLocal = "No disponible";
    if (cobro.Local.DireccionLocales && cobro.Local.DireccionLocales.length > 0) {
      const sucursalSeleccionada = cobro.Local.DireccionLocales.find(dir => dir.id_direccion_local === parseInt(sucursal));
      const sucursalMostrar = sucursalSeleccionada || cobro.Local.DireccionLocales[0];
      direccionLocal = `${sucursalMostrar.Local ? sucursalMostrar.Local.nombre_local : "N/A"}, ${sucursalMostrar.colonia}, ${sucursalMostrar.Ciudad ? sucursalMostrar.Ciudad.nombre_ciudad : "N/A"}`;
    }

    doc.text(`Dirección: ${direccionLocal}`);
    doc.text(`Periodo: ${formatDate(cobro.periodo_inicio)} al ${formatDate(cobro.periodo_fin)}`);
    doc.moveDown();

    // Agregar resumen financiero
    doc.fontSize(12).text("Resumen Financiero:", { underline: true });
    doc.fontSize(10).text(`Ventas en Efectivo: L. ${formatNumber(cobro.ventas_efectivo)}`);
    doc.fontSize(10).text(`Ventas con Tarjeta: L. ${formatNumber(cobro.ventas_tarjeta)}`);
    doc.fontSize(10).text(`Comisión por Ventas en Efectivo: L. ${formatNumber(cobro.comision_efectivo)}`, { color: "red" });
    doc.fontSize(10).text(`Pago por Ventas con Tarjeta: L. ${formatNumber(cobro.ventas_tarjeta * 0.85)}`, { color: "green" });
    doc.fontSize(10).text(`Pedidos Extra: ${cobro.pedidos_extra}`);
    doc.fontSize(10).text(`Costo Pedidos Extra: L. ${formatNumber(cobro.costo_pedidos_extra)}`, { color: "red" });
    doc.moveDown();

    // Agregar balance final
    const colorBalance = cobro.total >= 0 ? "red" : "green";
    const textoBalance = cobro.total >= 0 ? "Total a Pagar:" : "Total a Recibir:";
    doc.fontSize(12).text(`${textoBalance} L. ${formatNumber(Math.abs(cobro.total))}`, { color: colorBalance, bold: true });
    doc.moveDown(2);

    // Agregar tabla de productos
    doc.fontSize(12).text("Productos Vendidos en la Semana:", { underline: true });
    doc.moveDown();

    // Definir posiciones de las columnas
    const columnas = {
      producto: 50,
      cantidad: 250,
      precio: 320,
      total: 400,
      metodo: 480
    };

    // Encabezados de la tabla
    doc.fontSize(10).text("Producto", columnas.producto, doc.y);
    doc.text("Cantidad", columnas.cantidad, doc.y);
    doc.text("Precio", columnas.precio, doc.y);
    doc.text("Total", columnas.total, doc.y);
    doc.text("Método", columnas.metodo, doc.y);

    // Línea separadora
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Filas de la tabla
    let totalProductos = 0;
    productosFiltrados.forEach(producto => {
      const y = doc.y;
      doc.fontSize(9).text(`${producto.nombre_producto}`, columnas.producto, y, { width: 190 });
      doc.text(`x${producto.cantidad}`, columnas.cantidad, y);
      doc.text(`L. ${formatNumber(producto.precio_unitario)}`, columnas.precio, y);
      doc.text(`L. ${formatNumber(producto.total)}`, columnas.total, y);
      doc.text(`${producto.metodo_pago === "efectivo" ? "Efectivo" : "Tarjeta"}`, columnas.metodo, y);

      totalProductos += parseFloat(producto.total);
      doc.moveDown();
    });

    // Línea separadora
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Total
    doc.fontSize(10).text("Total:", columnas.precio, doc.y);
    doc.text(`L. ${formatNumber(totalProductos)}`, columnas.total, doc.y, { bold: true });

    // Información de pago
    doc.moveDown(2);
    doc.fontSize(12).text("Información de Pago:", { underline: true });
    doc.fontSize(10).text("Banco: Banco Atlántida");
    doc.fontSize(10).text("Cuenta: 1234-5678-9012-3456");
    doc.fontSize(10).text("Titular: Delivery App, S.A.");

    // Finalizar el documento
    doc.end();
  } catch (error) {
    console.error("Error al exportar a PDF:", error);
    res.status(500).json({
      success: false,
      message: "Error al exportar a PDF",
      error: error.message,
    });
  }
};

// Función para formatear fechas
function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

// Función para formatear números
function formatNumber(num) {
  return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

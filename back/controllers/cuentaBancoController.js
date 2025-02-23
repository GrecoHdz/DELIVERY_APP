const CuentaBanco = require("../models/CuentaBanco");

// Obtener todas las cuentas bancarias
const getAllCuentas = async (req, res) => {
  try {
    const cuentas = await CuentaBanco.findAll();
    if (!cuentas || cuentas.length === 0) {
      return res.status(404).json({ message: "No se encontraron cuentas bancarias" });
    }
    res.json(cuentas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las cuentas bancarias", error });
  }
};

// Obtener una cuenta bancaria por su ID
const getCuentaById = async (req, res) => {
  const { id } = req.params;

  try {
    const cuenta = await CuentaBanco.findByPk(id);
    if (!cuenta) {
      return res.status(404).json({ message: "Cuenta bancaria no encontrada" });
    }
    res.json(cuenta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la cuenta bancaria", error });
  }
};

// Crear una nueva cuenta bancaria
const createCuenta = async (req, res) => {
    const { id_cliente } = req.params;
    const {
    id_banco,
    identidad,
    nombre_dueno_cuenta,
    tipo_cuenta,
    num_cuenta,
  } = req.body;

  try {
    const cuenta = await CuentaBanco.create({
      id_cliente,
      id_banco,
      identidad,
      nombre_dueno_cuenta,
      tipo_cuenta,
      num_cuenta,
    });

    res.status(201).json({ message: "Cuenta bancaria creada exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El número de cuenta ya existe" });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_banco")) {
        return res.status(400).json({ message: "El banco no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la cuenta bancaria", error });
  }
};

// Actualizar una cuenta bancaria
const updateCuenta = async (req, res) => {
    const { id } = req.params;
  const { identidad, nombre_dueno_cuenta, tipo_cuenta, num_cuenta } = req.body;

  try {
    const cuenta = await CuentaBanco.findByPk(id);
    if (!cuenta) {
      return res.status(404).json({ message: "Cuenta bancaria no encontrada" });
    }

    await cuenta.update({
      identidad,
      nombre_dueno_cuenta,
      tipo_cuenta,
      num_cuenta,
    });

    res.status(200).json({ message: "Cuenta bancaria actualizada correctamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El número de cuenta ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar la cuenta bancaria", error });
  }
};

// Eliminar una cuenta bancaria
const deleteCuenta = async (req, res) => {
  const { id } = req.params;

  try {
    const cuenta = await CuentaBanco.findByPk(id);
    if (!cuenta) {
      return res.status(404).json({ message: "Cuenta bancaria no encontrada" });
    }

    await cuenta.destroy();
    res.status(200).json({ message: "Cuenta bancaria eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la cuenta bancaria", error });
  }
};

module.exports = {
  getAllCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta,
};
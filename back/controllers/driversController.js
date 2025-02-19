const Driver = require("../models/Driver");

// Obtener todos los drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    if (!drivers || drivers.length === 0) {
      return res.status(404).json({ message: "No se encontraron drivers" });
    }
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los drivers", error });
  }
};

// Obtener un driver por su ID
const getDriverById = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver no encontrado" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el driver", error });
  }
};

// Crear un nuevo driver
const createDriver = async (req, res) => {
  const { id_cliente, membresia_driver } = req.body;

  try {
    const driver = await Driver.create({
      id_cliente,
      membresia_driver,
    });

    res.status(201).json({ message: "Driver creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El cliente no existe" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El cliente ya está registrado como driver" });
    }
    res.status(500).json({ message: "Error al crear el driver", error });
  }
};

// Actualizar un driver
const updateDriver = async (req, res) => {
  const { id } = req.params;
  const { membresia_driver, activo } = req.body;

  try {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver no encontrado" });
    }

    await driver.update({
      membresia_driver,
      activo,
    });

    res.status(200).json({ message: "Driver actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el driver", error });
  }
};

// Eliminar un driver
const deleteDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver no encontrado" });
    }

    await driver.destroy();
    res.status(200).json({ message: "Driver eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el driver", error });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
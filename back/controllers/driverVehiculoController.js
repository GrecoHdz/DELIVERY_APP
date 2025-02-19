const DriverVehiculo = require("../models/DriverVehiculo");

// Obtener todos los vehículos de un driver
const getVehiculosByDriver = async (req, res) => {
  const { id_driver } = req.params;

  try {
    const relaciones = await DriverVehiculo.findAll({
      where: { id_driver },
    });

    if (!relaciones || relaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron vehículos para este driver" });
    }

    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los vehículos del driver", error });
  }
};

// Asociar un vehículo a un driver
const associateVehiculoToDriver = async (req, res) => {
  const { id_driver, id_vehiculo } = req.body;

  try {
    const relacion = await DriverVehiculo.create({
      id_driver,
      id_vehiculo,
    });

    res.status(201).json({ message: "Vehículo asociado al driver exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
      if (error.fields.includes("id_vehiculo")) {
        return res.status(400).json({ message: "El vehículo no existe" });
      }
    }
    res.status(500).json({ message: "Error al asociar el vehículo al driver", error });
  }
};

// Eliminar la asociación entre un driver y un vehículo
const deleteVehiculoFromDriver = async (req, res) => {
  const { id_driver, id_vehiculo } = req.params;

  try {
    const relacion = await DriverVehiculo.findOne({
      where: { id_driver, id_vehiculo },
    });

    if (!relacion) {
      return res.status(404).json({ message: "Asociación driver-vehículo no encontrada" });
    }

    await relacion.destroy();
    res.status(200).json({ message: "Asociación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la asociación", error });
  }
};

module.exports = {
  getVehiculosByDriver,
  associateVehiculoToDriver,
  deleteVehiculoFromDriver,
};
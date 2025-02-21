const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MembresiaDriver = sequelize.define(
  "MembresiaDriver",
  {
    id_membresia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    saldo_solicitado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // El saldo solicitado es opcional
    },
    comprobante: {
      type: DataTypes.TEXT,
      allowNull: true, // La URL del comprobante es opcional
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "MembresiasDrivers", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
MembresiaDriver.associate = (models) => {
  MembresiaDriver.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "CASCADE", // Si se elimina el driver, también se eliminan sus membresías asociadas
  });
};

module.exports = MembresiaDriver;
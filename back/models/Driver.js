const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Driver = sequelize.define(
  "Driver",
  {
    id_driver: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Un cliente solo puede ser un driver
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Fecha de registro automática
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Por defecto, el driver no está activo
    },
    membresia_driver: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // La membresía es opcional
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Drivers", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Driver.associate = (models) => {
  Driver.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se elimina el driver
  });
};

module.exports = Driver;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LocalMetodoPago = sequelize.define(
  "LocalMetodoPago",
  {
    id_local: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Local_MetodoPago", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
LocalMetodoPago.associate = (models) => {
  LocalMetodoPago.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus métodos de pago asociados
  });
  LocalMetodoPago.belongsTo(models.MetodoPago, {
    foreignKey: "id_metodo_pago",
    onDelete: "CASCADE", // Si se elimina el método de pago, también se eliminan sus relaciones con locales
  });
};

module.exports = LocalMetodoPago;
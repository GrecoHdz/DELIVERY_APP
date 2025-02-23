const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const QuejaUber = sequelize.define(
  "QuejaUber",
  {
    id_quejauber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_viaje: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "QuejaUber", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
QuejaUber.associate = (models) => {
  QuejaUber.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus quejas asociadas
  });
  QuejaUber.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "CASCADE", // Si se elimina el driver, también se eliminan sus quejas asociadas
  });
  QuejaUber.belongsTo(models.Viaje, {
    foreignKey: "id_viaje",
    onDelete: "SET NULL", // Si se elimina el viaje, el campo id_viaje se establece en NULL
  });
};

module.exports = QuejaUber;
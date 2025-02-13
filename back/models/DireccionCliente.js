const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DireccionCliente = sequelize.define(
  "DireccionCliente",
  {
    id_direccion_cliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    colonia: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    direccion_precisa: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alias_direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
    tableName: "DireccionesClientes",
  }
);

// Relaciones
DireccionCliente.associate = (models) => {
  DireccionCliente.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE",
  });
  DireccionCliente.belongsTo(models.Ciudad, {
    foreignKey: "id_ciudad",
    onDelete: "CASCADE",
  });
};

module.exports = DireccionCliente;
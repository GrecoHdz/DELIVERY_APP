const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DireccionLocal = sequelize.define(
  "DireccionLocal",
  {
    id_direccion_local: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
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
    latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true, // Opcional
    },
    longitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true, // Opcional
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "DireccionesLocales", // Nombre de la tabla en la base de datos
  }
);

// Relaciones con otras tablas
DireccionLocal.associate = (models) => {
  DireccionLocal.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE",
  });
  DireccionLocal.belongsTo(models.Ciudad, {
    foreignKey: "id_ciudad",
    onDelete: "CASCADE",
  });
};

module.exports = DireccionLocal;
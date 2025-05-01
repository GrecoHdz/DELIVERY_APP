const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const EstadisticaLocal = sequelize.define(
  "EstadisticaLocal",
  {
    id_estadistica: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pedidos_semanales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ingresos_semanales: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tendencia_pedidos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    tendencia_ingresos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "EstadisticasLocales",
  }
);

// Relaciones con otras tablas
EstadisticaLocal.associate = (models) => {
  EstadisticaLocal.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE",
  });
};

module.exports = EstadisticaLocal;

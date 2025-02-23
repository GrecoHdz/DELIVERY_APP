const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cupon = sequelize.define(
  "Cupon",
  {
    id_cupon: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipo_descuento: {
      type: DataTypes.ENUM("porcentaje", "fijo"),
      allowNull: false,
    },
    codigo_cupon: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    limite_uso: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    usos_actuales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activo: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Cupones", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Cupon.associate = (models) => {
  Cupon.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus cupones asociados
  });
};

module.exports = Cupon;
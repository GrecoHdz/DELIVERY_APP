const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BannerPublicitario = sequelize.define(
  "BannerPublicitario",
  {
    id_banner: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true, // Descripción opcional
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url_destino: {
      type: DataTypes.TEXT,
      allowNull: true, // URL de destino opcional
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Banners_Publicitarios", // Nombre de la tabla en la base de datos
  }
);

// Relaciones con otras tablas
BannerPublicitario.associate = (models) => {
  BannerPublicitario.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "SET NULL", // Si se elimina el local, el campo se establece como NULL
  });
};

module.exports = BannerPublicitario;
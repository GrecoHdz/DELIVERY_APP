const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const OfertaMandadito = sequelize.define(
  "OfertaMandadito",
  {
    id_oferta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_mandadito: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    monto_ofrecido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aceptada"),
      defaultValue: "pendiente",
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Ofertas_Mandaditos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
OfertaMandadito.associate = (models) => {
  OfertaMandadito.belongsTo(models.Mandadito, {
    foreignKey: "id_mandadito",
    onDelete: "CASCADE", // Si se elimina el mandadito, también se eliminan sus ofertas asociadas
  });
  OfertaMandadito.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "CASCADE", // Si se elimina el driver, también se eliminan sus ofertas asociadas
  });
};

module.exports = OfertaMandadito;
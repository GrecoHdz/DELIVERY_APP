const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PagoRentarAuto = sequelize.define(
  "PagoRentarAuto",
  {
    id_rentar_auto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    deposito_url: {
      type: DataTypes.TEXT,
      allowNull: false, // La URL del depósito es obligatoria
    },
    estado: {
      type: DataTypes.STRING(55),
      defaultValue: "pendiente", // Estados: 'pendiente', 'aprobado', 'rechazado'
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Pagos_Rentar_Autos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
PagoRentarAuto.associate = (models) => {
  PagoRentarAuto.belongsTo(models.RentarAuto, {
    foreignKey: "id_rentar_auto",
    onDelete: "CASCADE", // Si se elimina la solicitud de renta, también se eliminan sus pagos asociados
  });
};

module.exports = PagoRentarAuto;
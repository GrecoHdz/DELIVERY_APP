const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const RentarAuto = sequelize.define(
  "RentarAuto",
  {
    id_rentar_auto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_auto_en_renta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    con_conductor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Por defecto, no se solicita conductor
    },
    direccion_entrega: {
      type: DataTypes.STRING(255),
      allowNull: true, // Dirección de entrega es opcional
    },
    imagen_licencia: {
      type: DataTypes.TEXT,
      allowNull: false, // URL de la licencia no es opcional
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(55),
      defaultValue: "pendiente", // Estados: 'pendiente_dueño', 'aceptada', 'rechazada', 'finalizada'
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Rentar_Autos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
RentarAuto.associate = (models) => {
  RentarAuto.belongsTo(models.AutoEnRenta, {
    foreignKey: "id_auto_en_renta",
    onDelete: "CASCADE", // Si se elimina el auto en renta, también se eliminan sus solicitudes de renta
  });
  RentarAuto.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus solicitudes de renta
  });
  RentarAuto.belongsTo(models.MetodoPago, {
    foreignKey: "id_metodo_pago",
    onDelete: "CASCADE", // Si se elimina el método de pago, también se eliminan sus registros asociados
  });
};

module.exports = RentarAuto;
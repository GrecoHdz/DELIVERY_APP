const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SoporteTicket = sequelize.define(
  "SoporteTicket",
  {
    id_ticket: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    asunto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(50),
      defaultValue: "Abierto", // Estados posibles: 'Abierto', 'En Proceso', 'Cerrado'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Soporte_Tickets", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
SoporteTicket.associate = (models) => {
  SoporteTicket.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus tickets asociados
  });
};

module.exports = SoporteTicket;
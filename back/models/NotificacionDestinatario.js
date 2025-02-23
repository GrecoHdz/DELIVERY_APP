const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const NotificacionDestinatario = sequelize.define(
  "NotificacionDestinatario",
  {
    id_destinatario_notificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parametros: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Notificaciones_Destinatarios", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
NotificacionDestinatario.associate = (models) => {
  NotificacionDestinatario.belongsTo(models.Notificacion, {
    foreignKey: "id_notificacion",
    onDelete: "CASCADE", // Si se elimina la notificación, también se eliminan sus destinatarios asociados
  });
};

module.exports = NotificacionDestinatario;
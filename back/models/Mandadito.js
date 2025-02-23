const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Mandadito = sequelize.define(
  "Mandadito",
  {
    id_mandadito: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metodo_pago: {
      type: DataTypes.ENUM("efectivo", "transferencia"),
      allowNull: false,
    },
    direccion_origen: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    direccion_destino: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tiempo_llegada_recogida_estimado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tiempo_entrega_estimado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_entregado: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING(50),
      defaultValue: "pendiente",
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Mandaditos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Mandadito.associate = (models) => {
  Mandadito.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus mandaditos asociados
  });
  Mandadito.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "SET NULL", // Si se elimina el driver, el campo id_driver se establece en NULL
  });
};

module.exports = Mandadito;
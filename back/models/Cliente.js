const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cliente = sequelize.define(
  "Cliente",
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Relación única con la tabla usuarios
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    identidad: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // Asegura que la identidad sea única
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY, // Solo fecha (sin hora)
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true, // Asegura que el teléfono sea único
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Clientes", // Nombre de la tabla en la base de datos
  }
);

// Relación con la tabla Usuarios
Cliente.associate = (models) => {
  Cliente.belongsTo(models.Usuario, {
    foreignKey: "id_usuario",
    onDelete: "CASCADE",
  });
};

module.exports = Cliente;
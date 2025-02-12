const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Rol = sequelize.define("Rol", {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_rol: {
    type: DataTypes.ENUM("cliente", "admin", "superadmin"),
    allowNull: false,
  },
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "Roles", // Nombre de la tabla en la base de datos
});

module.exports = Rol;
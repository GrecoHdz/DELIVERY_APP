const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Empleado = sequelize.define(
  "Empleado",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Por defecto, el empleado está activo
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Empleados", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Empleado.associate = (models) => {
  Empleado.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus empleados asociados
  });
  Empleado.belongsTo(models.Usuario, {
    foreignKey: "id_usuario",
    onDelete: "CASCADE", // Si se elimina el usuario, también se eliminan sus registros de empleado
  });
};

module.exports = Empleado;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CuentaBanco = sequelize.define(
  "CuentaBanco",
  {
    id_cuenta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_banco: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    identidad: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nombre_dueno_cuenta: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo_cuenta: {
      type: DataTypes.ENUM("Ahorro", "Cheque", "Tarjeta de Credito"),
      allowNull: false,
    },
    num_cuenta: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // El número de cuenta debe ser único
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Cuentas_Bancos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
CuentaBanco.associate = (models) => {
  CuentaBanco.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus cuentas bancarias
  });
  CuentaBanco.belongsTo(models.Banco, {
    foreignKey: "id_banco",
    onDelete: "CASCADE", // Si se elimina el banco, también se eliminan sus cuentas asociadas
  });
};

module.exports = CuentaBanco;
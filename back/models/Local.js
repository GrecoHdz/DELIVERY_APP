const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Local = sequelize.define(
  "Local",
  {
    id_local: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_membresia: {
      type: DataTypes.INTEGER,
      allowNull: true, // Puede ser nulo si no tiene membresía
    },
    nombre_local: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    apertura: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    cierre: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    rtn: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true, // URL de la imagen (opcional)
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Locales", // Nombre de la tabla en la base de datos
  }
);

// Relaciones con otras tablas
Local.associate = (models) => {
  Local.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE",
  });
  Local.belongsTo(models.MembresiaLocal, {
    foreignKey: "id_membresia",
    onDelete: "SET NULL", // Si se elimina la membresía, el campo se establece como NULL
  });
};

module.exports = Local;
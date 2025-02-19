const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ValorAtributo = sequelize.define(
  "ValorAtributo",
  {
    id_valor_atributo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_atributo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Valores_Atributos", // Nombre de la tabla en la base de datos
    indexes: [
      {
        unique: true,
        fields: ["id_atributo", "valor"], // Asegura que la combinación de atributo y valor sea única
      },
    ],
  }
);

// Asociaciones
ValorAtributo.associate = (models) => {
  ValorAtributo.belongsTo(models.Atributo, {
    foreignKey: "id_atributo",
    onDelete: "CASCADE", // Si se elimina el atributo, también se eliminan sus valores asociados
  });
};

module.exports = ValorAtributo;
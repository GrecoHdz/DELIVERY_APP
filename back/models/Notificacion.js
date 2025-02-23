const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de configurar tu conexión a la base de datos aquí
const Local = require('./Local'); // Modelo de Locales (asumiendo que ya existe)

const Notificacion = sequelize.define('Notificacion', {
    id_notificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.ENUM('predeterminada', 'personalizada'),
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    creado_por: {
        type: DataTypes.STRING(55),
        allowNull: true,
        references: {
            model: Local, // Referencia al modelo Local
            key: 'id_local'
        }
    }
}, {
    tableName: 'Notificaciones',
    timestamps: false // Si no usas createdAt y updatedAt
});

// Relación con el modelo Local
Notificacion.belongsTo(Local, { foreignKey: 'creado_por', as: 'local' });

module.exports = Notificacion;
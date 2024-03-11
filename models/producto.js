const { DataTypes } = require('sequelize');
const db = require('./../db/connection');

const Producto = db.define('Producto', {
    idProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT, allowNull: true
    },
    img: {
        type: DataTypes.STRING(200), allowNull: true
    },
    precio: {
        type: DataTypes.INTEGER, allowNull: false
    },
    facturable: {
        type: DataTypes.BOOLEAN, defaultValue: true
    },
    idusuario: {
        type: DataTypes.INTEGER, allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN, defaultValue: true
    },
    idmarca: {
        type: DataTypes.INTEGER, allowNull: false
    },
    idunidad: {
        type: DataTypes.INTEGER, allowNull: false
    },
}, {
    createdAt: true,
    updatedAt: true,
    tableName: 'producto'
});

module.exports = Producto;
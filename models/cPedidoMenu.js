const { DataTypes } = require('sequelize');
const db = require('./../db/connection');

const CPedidoMenu = db.define('CPedidoMenu', {
    idcabecerapedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    fechaAlta: {
        type: DataTypes.DATETIME,
        allowNull: false
    },
    idusurio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaEntrega: {
        type: DataTypes.DATETIME,
        allowNull: false
    }
}, {
    tableName: 'cpedidomenu',
    createdAt: true,
    updatedAt: true
})

module.exports = CPedidoMenu;
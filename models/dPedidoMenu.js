const {DataTypes} = require('sequelize');
const db = require('./../db/connection');

const DPedidoMenu = db.define('DPedidoMenu',{
    idcabecerapedido:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique:true
    },
    item:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idproducto:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    idcabeceramenu:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'dpedidomenu',
    createdAt:true,
    updatedAt:true
});

modeule.exports = DPedidoMenu;
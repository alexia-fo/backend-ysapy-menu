const {DataTypes} = require('sequelize');
const db = require('../db/connection');
const Producto = require('./producto');


const DMenuSemanal = db.define('dmenusemanal', {
    idcabeceramenu:{
        type: DataTypes.INTEGER,
        //primarykey: true,
        //unique: true
        primaryKey:true
    },
    idproducto:{
        type: DataTypes.INTEGER,
        //allowNull: false,
        //primarykey: true,
        //unique: true
        primaryKey:true
    },
    item:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    observacion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue:true
    }
}, {
    tableName:'dmenusemanal',
    createdAt: true,
    updatedAt: true
});

DMenuSemanal.belongsTo(Producto,{
    foreignKey:'idproducto'
});

module.exports = DMenuSemanal;
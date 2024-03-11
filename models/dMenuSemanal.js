const {DataTypes} = require('sequelize');
const db = require('../db/connection');

const DMenuSemanal = db.define('dmenusemanal', {
    idcabeceramenu:{
        type: DataTypes.INTEGER,
        primarykey: true,
        unique: true
    },
    idproducto:{
        type: DataTypes.INTEGER,
        allowNull: false
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
        allowNull:false
    }
}, {
    tableName:'dmenusemanal',
    createdAt: true,
    updatedAt: true
});

module.exports = DMenuSemanal;
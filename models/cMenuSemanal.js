const {DataTypes} = require('sequelize');
const db = require('../db/connection');

const CMenuSemanal = db.define('CMenuSemanal', {
    idcabeceramenu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    nrosemana:{
        type: DataTypes.NUMBER,
        allowNull:false
    },
    nrodia:{
        type: DataTypes.NUMBER,
        allowNull: false
    },
    observacion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaAlta:{
        type: DataTypes.TIME,
        allowNull:false
    }
}, {
    tableName: 'cmenusemanal',
    createdAt: true,
    updatedAt: true
});

module.exports=CMenuSemanal;
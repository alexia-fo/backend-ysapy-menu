const db = require('./../db/connection');
const { DataTypes } = rquire('sequelize');

const Usuario = db.define('Usuario', {
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nusuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contra: {
        type: DataTypes.STRING
    },
    activo: {
        type: DataTypes.BOOLEAN, defaultValue: true
    },
    img: {
        type: DataTypes.STRING(200)
    },
    google: {
        type: DataTypes.BOOLEAN, defaultValue: false
    },
    idsucursal: {
        type: DataTypes.INTEGER, allowNull: false
    },
    idrol: {
        type: DataTypes.INTEGER, allowNull: false
    },
    turno: {
        type: DataTypes.CHAR(1), allowNull: false
    },
    categoria: {
        type: DataTypes.CHAR(2), allowNull: true
    }
},{
    tableName: 'usuarios'
});

module.exports = Usuario;



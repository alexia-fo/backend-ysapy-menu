const {Sequelize} = require('sequelize');

const db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASS,{
    host: process.env.HOST,
    dialect:'mysql',
    pool:{
        min:0,
        max:10,
        idle:10000
    }
});

module.exports = db;
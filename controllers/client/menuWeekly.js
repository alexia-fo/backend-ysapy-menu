// const {DMenuSemanal}= require('./../../models/dMenuSemanal');

const CMenuSemanal = require("../../models/cMenuSemanal");
const DMenuSemanal = require("../../models/dMenuSemanal")

const getMenuWeekly = async (req, res)=>{
    try {
        const [total, cabeceras] = await Promise.all([
            CMenuSemanal.count(),
            CMenuSemanal.findAll({
                //todo: falta obtener por between
            }),
        ]);

        res.status(200).json({
            total,
            cabeceras
        })
    } catch (e) {
        res.status(500).json({
            msg:'Ha ocurrido un error durante la obtencion de datos',
            error:e.message
        })
    }
}

module.exports={
    getMenuWeekly
}
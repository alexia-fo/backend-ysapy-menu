// const {DMenuSemanal}= require('./../../models/dMenuSemanal');

const CMenuSemanal = require("../../models/cMenuSemanal");
const DMenuSemanal = require("../../models/dMenuSemanal")

const getDetailMenuWeekly = async(req, res)=>{
    const {limit, offset} = req.params;

    try {
        
        const {total, detalle} = Promise.all([
            DMenuSemanal.count({
                limit,
                offset
            }),
            DMenuSemanal.findAll({
                limit,
                offset,
                include:[
                    {
                        model:CMenuSemanal
                    }
                ]
            })
        ])

    } catch (e) {
        res.status(500).json({
            msg:'Error durante la obtencion del listado de menu',
            e
        })
    }
}

module.exports={
    getDetailMenuWeekly
}
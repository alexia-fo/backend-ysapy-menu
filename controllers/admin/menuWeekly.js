const CMenuSemanal = require('../../models/cMenuSemanal');
const DMenuSemanal = require('../../models/dMenuSemanal');
const db = require('./../../db/connection');
const {Producto} = require('./../../models/producto');


const getMenuWeekly = async (req, res)=>{
    try {
        const {total, cabeceras} = await Promise.all([
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

const postMenuWeekly = async (req, res)=>{
    const {menu} = req.body;
    const {nrosemana, nrodia, observacion, productos} = menu;
    let t;
    let item=0;

    try{
        t = db.transaction();

        await CMenuSemanal.create({
            nrosemana,
            nrodia,
            observacion
        });

        let idcabeceramenu = bd.query('SELECT LAST_INSERT_ID() as lastId',{
            type: bd.queryTypes.SELECT,
            transaction: t
        });

        console.log(idcabeceramenu);

        try{
            
            data = productos.map(async (producto)=>{
                const {idproducto, observacion} = producto;
                item++;

                const existsProduct = await Producto.findByPk(idproducto);


                if(!existsProduct){
                    throw new Error(`El producto con id ${idproducto} no existe`);
                }

                return {
                    idcabeceramenu,
                    idproducto,
                    item,
                    observacion
                };
            });

            await DMenuSemanal.bulkCreate(await Promise(data),{
                transaction:t
            });
            
            await t.commit();

            res.status(200).json({
                msg:'Datos almacenados correctamente'
            })
        }catch(e){
            t.rollback();
            res.status(500).json({
                msg:`Error durante el proceso ${e.message}`
            })
        }

        await D
    }catch(e){
        t.rollback();
        res.status(500).json({
            msg:'Ha ocurrido un error en el servidor durante el almacenamiento del menú',
            error:e.message
        })
    }

}

const deleteDetailMenu = async (req, res)=>{
    const {idDetail} = req.params;

    try {

        const producto = await DMenuSemanal.findByPk(idDetail);

        await producto.update({
            estado: !estado
        });
        
    } catch (e) {
        res.status(500).json({
            msg:'Error al eliminar el producto',
            error:e.message
        })
    }
}

const putDetailMenu = async (req, res)=>{
    const {idproducto, observacion} = req.body;

    try {
        const producto = await DMenuSemanal.findByPk(idDetail);
        
        producto.update({
            idproducto,
            observacion
        })
    } catch (e) {
        res.status(500).json({
            msg:'Error al actualizar los datos del producto',
            error:e.message
        })
    }
}

module.exports={
    getMenuWeekly,
    postMenuWeekly,
    deleteDetailMenu,
    putDetailMenu
}
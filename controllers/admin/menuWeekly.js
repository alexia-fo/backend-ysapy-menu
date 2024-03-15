const CMenuSemanal = require('../../models/cMenuSemanal');
const DMenuSemanal = require('../../models/dMenuSemanal');
const db = require('./../../db/connection');
const Producto = require('../../models/producto');

//todo: hecho la primera prueba
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

//hecho la primera prueba
const postMenuWeekly = async (req, res)=>{
    const {menu} = req.body;
    //todo:falta modificar el nro de semana y numero de dia se calculara dentro del backend, solo se enviara la fecha
    //nro semana dentro del año y numero de dia dentro de la semana
    const {nrosemana, nrodia, observacion, productos} = menu;
    let t;
    let item=0;
    let fechaAlta = new Date();

    try{
        t = await db.transaction();

        console.log('antes de consultar la cabecera')
        await CMenuSemanal.create({
            nrosemana,
            nrodia,
            observacion,
            fechaAlta
        }, {
            transaction: t
        });

        console.log('despues de consultar la cabecera')


        let idcabeceramenu = 1;
        let result = await db.query('SELECT LAST_INSERT_ID() as lastId',{
            type: db.QueryTypes.SELECT,
            transaction: t
        });

        idcabeceramenu = result[0].lastId;

        console.log('despues de consultar el id de la cabecera')
        try{

            const data = await Promise.all(
                productos.map(async (producto)=>{
                    const {idproducto, observacion} = producto;
                    item++;
                    
                    const prod= await Producto.findByPk(idproducto);

                    if(!prod){
                        throw new Error(`El producto con id ${idproducto} no existe`);
                    }
                    
                    return {
                        idcabeceramenu,
                        idproducto,
                        item,
                        observacion
                    };
                })
            );
            console.log(data);

            await DMenuSemanal.bulkCreate(await Promise.all(data),{
                transaction:t
            });
            
            await t.commit();

            res.status(200).json({
                msg:'Datos almacenados correctamente'
            })
        }catch(e){
            t.rollback();
            res.status(500).json({
                msg:`Error durante el proceso. ${e.message}`
            });
      }

    }catch(e){
        t.rollback();
        res.status(500).json({
            msg:'Ha ocurrido un error en el servidor durante el almacenamiento del menú',
            error:e.message
        })
    }
}

//hecho la primera prueba
const deleteDetailMenu = async (req, res)=>{
    const {idDetail} = req.params;
    console.log('Ejecutando Delete');

    try {

        const producto = await DMenuSemanal.findByPk(idDetail);
        console.log(producto)

        await producto.update({
            estado: !producto.estado
        });

        res.status(200).json({
            msg: 'Detalle anulado/habilitado correctamente'
        })
        
    } catch (e) {
        res.status(500).json({
            msg:'Error al anular/habilitar el detalle de menú',
            error:e.message
        })
    }
}

const putDetailMenu = async (req, res)=>{
    const {idproducto, observacion} = req.body;
    const {idDetail} = req.params;

    try {
        const producto = await DMenuSemanal.findByPk(idDetail);
        
        producto.update({
            idproducto,
            observacion
        });

        res.status(200).json({
            msg:'Detalle de menú actualizado correctamente'
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
const CMenuSemanal = require('../../models/cMenuSemanal');
const DMenuSemanal = require('../../models/dMenuSemanal');
const db = require('./../../db/connection');
const Producto = require('../../models/producto');
const moment = require('moment-timezone');
const zonaHorariaParaguay = 'America/Asuncion';

//TODO: EN TORIA YA ESTA FUNCIONANDO
const getMenu = async(req, res)=>{
    const {idcabecera} = req.params;

    try {
        let [cabecera, productos] = await Promise.all([
            CMenuSemanal.findByPk(idcabecera,{
                attributes:['fecha', 'observacion']
            }),
            DMenuSemanal.findAll({
                where:{
                    idcabeceramenu: idcabecera
                },
                include:[
                    {
                        model: Producto,
                        attributes:['nombre']
                    }
                ],
                attributes:['idproducto', 'observacion']
            })
        ]);

            // Mapeamos los resultados para ajustar el formato
            productos = productos.map(detalle => ({
                idproducto: detalle.idproducto,
                observacion: detalle.observacion,
                nombre: detalle.Producto.nombre // Accedemos al nombre del producto
            }));

        res.status(200).json({
            ...cabecera.dataValues,
            productos
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg:'Error durante la obtención del menú',
            error: e.message
        })
    }
}


//todo: EN TEORIA YA ESTA FUNCIONANDO 
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

//TODO: EN TEORIA YA ESTA FUNCIONANDO
const postMenuWeekly = async (req, res)=>{
    const {menu} = req.body;
    //nro semana dentro del año y numero de dia dentro de la semana
    const {fecha, observacion, productos} = menu;
    let t;
    let item=0;

    // Obtener la fecha actual según la zona horaria de Paraguay
    const fechaActual = moment().tz(zonaHorariaParaguay);
    const fechaTiempoHoy = fechaActual.format('YYYY-MM-DD HH:mm:ss');


    // Convertir la fecha a un objeto moment con la zona horaria especificada
    // const fechaMoment = moment.tz(fecha, zonaHorariaParaguay);

    // Crear una instancia de moment sin especificar la zona horaria
    const fechaMoment = moment(fecha);

    // Obtener el número de la semana del año
    const nrosemana = fechaMoment.isoWeek();

    // Obtener el número de día de la semana (0 para Domingo, 1 para Lunes, ..., 6 para Sábado)
    const nrodia = fechaMoment.day();

    try{
        t = await db.transaction();

        console.log('antes de consultar la cabecera')
        await CMenuSemanal.create({
            fecha: fechaMoment.format('YYYY-MM-DD'),
            nrosemana,
            nrodia,
            observacion,
            fechaAlta: fechaTiempoHoy
        }, {
            transaction: t
        });

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
            console.log(e);
            t.rollback();
            res.status(500).json({
                msg:`Error durante el proceso. ${e.message}`
            });
      }

    }catch(e){
        console.log(e);
        t.rollback();
        res.status(500).json({
            msg:'Ha ocurrido un error en el servidor durante el almacenamiento del menú',
            error:e.message
        })
    }
}

//FALTA CORREGIR. NO ESTA DEFINIDO QUE VA  A INCLUIR LA ELIMINACION, BORRAR COMPLETAMENTE O ANULAR
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

//TODO: EN TEORIA YA ESTA FUNCIONANDO
const putMenu = async (req, res)=>{
    const {idCabecera} = req.params;
    const {fecha, observacion, productos} = req.body.menu;
    let t;
    try{
        t=await db.transaction();

        // Elimina los registros de dMenuSemanal
        await DMenuSemanal.destroy({ where: { idcabeceramenu: idCabecera }, transaction: t });

        // Recorre los productos para insertarlos nuevamente en la tabla dMenuSemanal
        let item=1;
        console.log("---------productos",productos)
        await Promise.all(
            productos.map(async (producto) => {
                const { idproducto, observacion } = producto;
                await DMenuSemanal.create({
                    idcabeceramenu: idCabecera,
                    idproducto,
                    item,
                    observacion
                }, { transaction: t });

                item++;
            })
        );

        //actualiza la cabecera del menu 
        //todo: falta validar si existe id de cabecera
        //en este punto ya debe estar validado
        const cabeceraMenu = await CMenuSemanal.findByPk(idCabecera);

        await cabeceraMenu.update({fecha, observacion}, {
            transaction:t
        });

        //confirma la transaccion
        await t.commit();

        res.status(200).json({
            msg: "Datos actualizados correctamente"
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Error al actualizar el menú',
            error: e.message
        })
    }
}

module.exports={
    getMenu,
    getMenuWeekly,
    postMenuWeekly,
    deleteDetailMenu,
    putMenu
}
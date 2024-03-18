// const {DMenuSemanal}= require('./../../models/dMenuSemanal');

const CMenuSemanal = require("../../models/cMenuSemanal");
const DMenuSemanal = require("../../models/dMenuSemanal");
const Producto = require("../../models/producto");

//para ver las cabeceras de menu de una semana completa, para ver el detalle de productos de cada dia despues
const getMenuWeekly = async (req, res)=>{//para listar cabeceras de menu
    try {
        const [total, cabeceras] = await Promise.all([
            CMenuSemanal.count(),
            CMenuSemanal.findAll({
                //todo: falta obtener por between
                limit:10,
                offset:0
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

//para el listado de productos del menu del dia en la ventana principal para imprimirlos en tarjetas
const productsMenu = async(req, res)=>{

    try {
        const idCabecera = 38;//debe ser dinamico

        let [cabecera, productos] = await Promise.all([
            //todo: falta tener en cuenta la fecha de los detalles del menu principal, puede ser la fecha del dia
            CMenuSemanal.findByPk(idCabecera, {
                attributes:['fecha', 'observacion']
            }),
            DMenuSemanal.findAll({
                where: { idcabeceramenu: idCabecera},
                attributes:['idproducto', 'item', 'observacion'],
                include:[
                    {
                        model:Producto,
                        attributes:['nombre']
                    }
                ]
            }),  
        ])

        productos=productos.map((producto)=>{
            return {
                idproducto: producto.idproducto,
                item: producto.item,
                nombre:producto.Producto.nombre,
                observacion: producto.observacion
            }
        });

        console.log(productos);

        res.status(200).json({
            cabecera,
            productos
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg:"Error en la obtención del listado del menú",
            e
        })
    }
}

module.exports={
    getMenuWeekly,
    productsMenu
}
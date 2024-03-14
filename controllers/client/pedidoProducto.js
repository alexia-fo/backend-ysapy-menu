const CPedidoMenu = require('../../models/cPedidoMenu');
const bd = require('./../../db/connection');
const {Producto} = require('./../../models/producto');
//por ahora solo se trabajara con el local storage
const postProductoCarrito = async(req, res)=>{

}


const postPedido = async (req, res)=>{
    const idusuario = 1;
    const {fechaEntrega=new Date(), productos} = req.body;
    let t;
    let item=0;
    const fechaAlta = new Date();

    try {
        t = bd.transaction();

        await CPedidoMenu.create({
            fechaAlta,
            idusuario,
            fechaEntrega
        });

        const idcabecerapedido = db.query('SELECT LAST_INSERT_ID() as lastId', {
            type: bd.queryType.SELECT,
            transaction:t
        });

        console.log(idcabecerapedido);

        try {
            data = productos.map(async (producto) =>{
                const {idproducto, idcabeceramenu, cantidad} = producto;
                item++;

                const existsProduct = await Producto.findByPk(idproducto);

                if(!existsProduct){
                    throw new Error(`El producto con id ${idproducto} no existe`);
                }

                return {
                    idcabecerapedido,
                    item,
                    idproducto,
                    idcabeceramenu,
                    cantidad
                }
            });

            await DMenuSemanal.bulkCreate(await Promise(data),{
                transaction: t
            });

            await t.commit();

            res.status(200).json({
                msg: 'Datos almacenados correctamente'
            });
        } catch (e) {
            t.rollback();
            res.status(500).json({
                msg:`Error durante el proceso. ${e.message}`
            })
        }

    } catch (e) {
        await t.rollback();
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servidor durante el almacenamiento del pedido',
            error: e.message
        })
    }
}

module.exports = {
    postPedido
}
const Producto = require('./../../models/producto');

const getProducts = async (req, res)=>{
    try {
        const [total, products] = await Promise.all([
            Producto.count({
                limit:10,
                offset:0
            }),
            Producto.findAll({
                limit:10,
                offset:0
            }),
        ])
        
        res.status(200).json({
            total,
            products,
        })
    } catch (e) {
        res.status(500).json({
            msg: 'Error al obtener el listado de productos',
            error: e.message
        })
    }
}   

module.exports = {
    getProducts
}
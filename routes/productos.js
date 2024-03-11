console.log('hola')

const { Router } = require("express");

const router = Router();

router.get('/', (req, res)=>{
    console.log('get ejecutado')
    res.json({
        productos:[{id:'Producto 1'}, {id:'Producto 2'}]
    })
})

module.exports = router;
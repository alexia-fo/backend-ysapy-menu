const {Router} = require('express');
const { getMenuWeekly, productsMenu } = require('../../controllers/client/menuWeekly');
const router = Router();


router.get('/getMenuWeekly', getMenuWeekly);//para listar las cabeceras de menu en una ventana // por si se quiere ver el de todos los dias

router.get('/getProducts', productsMenu);//para listar el listado de productos de un dia especifico de los cuales se podran hacer los pedidos


module.exports=router;
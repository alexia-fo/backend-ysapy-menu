const {Router} = require('express');
const { postPedido } = require('../../controllers/client/pedidoProducto');
const router = Router();

router.post('/', postPedido);
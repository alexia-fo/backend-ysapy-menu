const {Router} = require('express');
const { getProducts } = require('../../controllers/admin/products');
const router = Router();

router.get('/', getProducts);

module.exports = router;
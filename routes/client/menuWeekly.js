const {Router} = require('express');
const { getMenuWeekly } = require('../../controllers/client/menuWeekly');
const router = Router();

router.get('/', getMenuWeekly);

module.exports=router;
const {Router} = require('express');
const { getDetailMenuWeekly } = require('../../controllers/client/menuWeekly');
const router = Router();

router.get('/', getDetailMenuWeekly);

module.exports=router;
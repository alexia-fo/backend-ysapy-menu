const {Router} = require('express');
const {getMenuWeekly, postMenuWeekly } = require('../../controllers/admin/menuWeekly');
const router = Router();

router.get('/', getMenuWeekly);

router.post('/', postMenuWeekly);

module.exports=router;
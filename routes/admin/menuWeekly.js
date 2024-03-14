const {Router} = require('express');
const {getMenuWeekly, postMenuWeekly, deleteDetailMenu, putDetailMenu } = require('../../controllers/admin/menuWeekly');
const router = Router();

router.get('/', getMenuWeekly);

router.post('/', postMenuWeekly);

router.delete('/:idDetail', deleteDetailMenu);

router.put('/:idDetail', putDetailMenu);

module.exports=router;
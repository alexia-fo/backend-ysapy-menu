const {Router} = require('express');
const {getMenuWeekly, postMenuWeekly, deleteDetailMenu, putDetailMenu, getMenu } = require('../../controllers/admin/menuWeekly');
const router = Router();

router.get('/:idcabecera', getMenu);

router.get('/', getMenuWeekly);

router.post('/', postMenuWeekly);

router.delete('/:idDetail', deleteDetailMenu);

router.put('/:idDetail', putDetailMenu);

module.exports=router;
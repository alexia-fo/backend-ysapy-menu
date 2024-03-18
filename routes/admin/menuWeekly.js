const {Router} = require('express');
const {getMenuWeekly, postMenuWeekly, deleteDetailMenu, putMenu, getMenu } = require('../../controllers/admin/menuWeekly');
const router = Router();

router.get('/:idcabecera', getMenu);

router.get('/', getMenuWeekly);

router.post('/', postMenuWeekly);

router.delete('/:idDetail', deleteDetailMenu);

router.put('/:idCabecera', putMenu);

module.exports=router;
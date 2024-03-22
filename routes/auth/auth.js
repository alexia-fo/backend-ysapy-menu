const Router = require('express');
const { login, getProfile } = require('../../controllers/auth/auth');
const { valdateJWT } = require('../../middlewares/validate-jwt');
const router = Router();

router.post('/login', login);

router.get('/getProfile', [
    valdateJWT
],getProfile);

module.exports = router;
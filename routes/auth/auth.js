const Router = require('express');
const { login, getProfile, googleSignIn } = require('../../controllers/auth/auth');
const { valdateJWT } = require('../../middlewares/validate-jwt');
const router = Router();

router.post('/login', login);

router.get('/getProfile', [
    valdateJWT
],getProfile);

router.post('/google', googleSignIn);//TODO: EL id_token debe ser obligatorio

module.exports = router;
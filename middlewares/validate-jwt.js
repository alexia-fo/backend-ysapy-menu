const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const valdateJWT = async(req, res)=>{
    const token = req.header('x-token');

    try {
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la petición'
            });
        };

        const payload = jwt.verify(token, process.env.SECRETPRIVATEKEY);
        
        //Leer los datos del  usuario autenticado

        const usuario = await Usuario.findByPk(payload.idusuario);

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido, usuario no existe'
            });
        };

        if(!usuario.activo){
            return res.status(401).json({
                msg:'Token no valido, usuario inactivo'
            });
        };

        req.usuario=usuario;

        next();
    } catch (e) {
        res.status(500).json({
            msg: 'Error durante el proceso de verificacion de token',
            error: e.message
        })
    }   
}

module.exports = {
    valdateJWT
}
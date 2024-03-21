const jwt = require('jsonwebtoken');

const generateJWT = (idusuario='')=>{
    return new Promise((resolve, reject)=>{
        const payload = {idusuario};

        jwt.sign(payload, process.env.SECRETPRIVATEKEY,{ expiresIn: '24h' }, (err, token)=>{
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        });
    });
};

module.exports = {
    generateJWT,
}
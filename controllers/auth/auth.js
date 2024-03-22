const { generateJWT } = require('../../helpers/generate-jwt');
const Rol = require('../../models/rol');
const Usuario = require('./../../models/usuario');
const bcryptjs = require('bcryptjs');

const login = async (req, res)=>{
    const {correo, contra} = req.body;

    try {
        const usuario =  await Usuario.findOne({
            where: {correo, activo:true} 
         });
     
         if(!usuario){
             return res.status(401).json({
                 msg:  'Usuario/contraseña incorrecta'
             });
         };
     
         const validContra = bcryptjs.compareSync(contra, usuario.contra);
     
         if(!validContra){
             res.status(401).json({
                 msg: 'Usuario/contraseña incorrecta'
             });
         }
     
         //generate JWT
     
         const token = await generateJWT(usuario.idUsuario);
     
         res.status(200).json({
            token
         });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Error durante la autenticación',
            error: e.message
        });       
    }
}
const getProfile = async (req, res) => {
    try {
        // EL ID DE USUARIO VA A EXISTIR EN ESTE PUNTO PORQUE SE VERIFICARA EL JWT

        const {idUsuario} = req.usuario;
  
        const usuario = await Usuario.findAll({
            where:{idUsuario},
            attributes:['idUsuario', 'nombre', 'nusuario', 'correo', 'img', 'google', 'idRol'],
            include: [{ model: Rol, attributes: ['rol']}]
        });

            
        if(usuario){
            res.json({usuario:usuario[0]});
        }else{
            res.status(404).json({
                msg: `No existe el usuario con id ${ id } `
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error al obtener el perfil del usuario" });
    }
}


module.exports = {
    login,
    getProfile
}
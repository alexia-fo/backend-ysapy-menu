const { json } = require('sequelize');
const { generateJWT } = require('../../helpers/generate-jwt');
const { googleVerify } = require('../../helpers/google-verify');
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

const googleSignIn = async(req, res = response) => {
    // console.log("-------------------------------------")
    // console.log(req.body);
    // res.redirect("http://localhost:4200/profile")

    //segundo ejemplo
    const {id_token } = req.body;
    // console.log(id_token);

    // try {

        const {nombre, img, correo} = await googleVerify(id_token );

        console.log(correo);
        let usuario = await Usuario.findOne({
            where:{correo}
        });
        console.log(usuario)
      
        if(!usuario){
            //tengo que crearlo
            const data={
                nombre,
                nusuario:'',//add
                correo,
                contra:':P',
                img,
                google:true,
                //sucursal, rol, turno add
                idrol:4//CLIENTE
            }

            usuario = new Usuario(data);

            await usuario.save();
        }

        //TODO: falta probar con un usuario anulado
        //si el usuario esta anulado
        if(!usuario.activo){
            res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        //si no esta anulado genero el jwt
        //TODO: ver si el id no es null, para volver a consultar si es necesario
        const token = await generateJWT(usuario.id);

        
        res.json({
            msg:'Todo bien',
            usuario,
            token
        })
    // } catch (error) {
    //     res.status(400).json({
    //         ok: false,
    //         msg:'El token no se pudo verificar'
    //     })
    // }

}


module.exports = {
    login,
    getProfile,
    googleSignIn
}
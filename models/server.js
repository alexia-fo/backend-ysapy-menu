const express = require('express');
const fileupload = require('express-fileupload');
const path = require('path');
const db = require('../db/connection')
const cors = require('cors');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths={
            menuWeeklyAdmin: '/menu/admin/menuWeekly',
            menuWeeklyClient: '/menu/client/menuWeekly',
        }

        this.dbConnection();
        this.middlewares();  
        
        this.pages();
        this.routes();
    }

    async dbConnection(){
        try {
            await db.authenticate();
            console.log('Base de datos en línea..')
        } catch (error) {
            throw new Error(error);
        }
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.app.use(fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes(){
        console.log('routes')
        this.app.use(this.paths.menuWeeklyAdmin, require('../routes/admin/menuWeekly'))
        this.app.use(this.paths.menuWeeklyClient, require('../routes/client/menuWeekly'))
    }

    pages(){//FIXME: PARA JS
        this.app.set('views', path.join(__dirname, '../views/pages'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Servidor corriendo en el puerto ${this.port}`)
        })
    }
}

module.exports=Server;
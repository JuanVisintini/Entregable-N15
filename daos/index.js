require("dotenv").config();

const Mongo = process.env.contenedor;

const elegirContenedor = async (nombre) => {
    try{
        const conectando = await import (`./${nombre}${Mongo}.js`);
        return conectando.default;
    }
    catch(e){
        console.log(e);
    }
}

module.exports = elegirContenedor;

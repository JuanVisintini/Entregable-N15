const mongo = require("../contenedores/mongo"); 
const mongoose = require("mongoose");

const autorSchema = new mongoose.Schema(
    {
        nombre: { type: String },
        apellido: { type: String },
        edad: { type: Number },
        alias: { type: String },
        avatar: { type: String },
        email: { type: String },
    });

const mensajeSchema = new mongoose.Schema(
    {
        mensaje: { type: String },
        autor: { type: autorSchema, id_: true },
        data: { type: String },
    },
    { timestamps: true }
);

const Message = mongoose.model("mensajes", mensajeSchema);

class MessageMongo extends mongo {
    constructor(schema) {
        super(schema);
    }
}

const messageMongo = new MessageMongo(Message);

module.exports = messageMongo;

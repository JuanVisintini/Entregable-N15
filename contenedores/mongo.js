const { connect } = require("../configdb/db");

connect();

class Mongo {

    constructor(schema) {
        this.schema = schema;
    }

    async create(data) {
        try{
            const model = new this.schema(data);
            return await model.save();
        }
        catch(e){
            console.log(e);
        }        
    }

    async getAll() {
        try{
            const object = await this.schema.find();
            if(object){
                return object;
            }
            else{
                console.log("No hay datos");
            }
            }catch(e){
            console.log(e);
        }
        
    }

    async getById(id) {
        try{
            return await this.schema.findById(id);
        }
        catch(e){
            console.log(e);
        }
        
    }

    async update(id, data) {
        try{
            return await this.schema.findByIdAndUpdate(id, data, { new: true });
        }
        catch(e){
            console.log(e);
        }
        
    }

    async delete(id) {
        try{
            return await this.schema.findByIdAndDelete(id);
        }
        catch(e){
            console.log(e);
        }
       
    }
}

module.exports = Mongo;
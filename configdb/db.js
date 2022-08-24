require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.DB_URL;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connect = async () => {
    try {
        await mongoose.connect(url, connectionParams);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    connect
}
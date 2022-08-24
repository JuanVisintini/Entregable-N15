const mongo = require("../contenedores/mongo");
const mongoose = require("mongoose");

const products = new mongoose.Schema(
  {
    title: { type: String },
    price: { type: String },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

const Productos = mongoose.model("productos", products);

class ContendorProductsMongo extends mongo {
  constructor(schema) {
    super(schema);
  }
}

const contendorProductsMongo = new ContendorProductsMongo(Productos);

module.exports = contendorProductsMongo;
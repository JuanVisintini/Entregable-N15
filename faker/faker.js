const { faker } = require("@faker-js/faker");

const productosFaker = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image()
    };
}

const productos = cantidad => {
    let productos = [];
    for (let i = 0; i < cantidad; i++) {
        productos.push(productosFaker());
    }
    return productos;
}

module.exports = { productos };
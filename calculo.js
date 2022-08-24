process.on("message", (msg) => {
    const cantidad = parseInt(msg)
    const numeros = calcularRandom(cantidad);
    process.send(numeros);
});

const calcularRandom = (cantidad) => {

    let numeros = {};

    for (let i = 0; i < cantidad; i++) {
        const numeroRandom = Math.floor(Math.random() * 1000 + 1)
        const index = numeroRandom.toString();

        if (numeros[index]) {
            numeros[index]++;
        }else{
            numeros[index] = 1;
        }
    }
    return numeros;
}
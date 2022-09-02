const { fork } = require('child_process');

const random = (req, res) => {
    const cantidad = req.params.cantidad || "100000000";

    const calculo = fork('./calculo.js');
    calculo.send(cantidad);
    calculo.on('message', (data) => {
        res.send(data);
    })
}

module.exports = { random };
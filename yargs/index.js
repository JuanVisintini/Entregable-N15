const yargs = require('yargs');

const argv = process.argv.slice(2);

const parser = yargs(argv).default({
    port: 8081,
    modo: 'FORK',
}).alias({
    p: 'port',
    m: 'modo',
}).argv;

module.exports = parser;
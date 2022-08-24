const yargs = require('yargs');

const argv = process.argv.slice(2);

const parser = yargs(argv).default({
    port: 8080,
}).alias({
    p: 'port',
}).argv;

module.exports = parser;
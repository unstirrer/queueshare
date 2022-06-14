import qsHttpServer from './qsHttpServer.js';

qsHttpServer.on('request', (req, res) => {

    res.writeHead(503).end();

});

await new Promise((resolve, reject) => {

    qsHttpServer.once('listening', resolve);

    qsHttpServer.listen(29749);

});

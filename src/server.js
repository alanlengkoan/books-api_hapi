const Hapi = require('@hapi/hapi');
const myRoute = require('./routes');

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
           cors: {
               origin: [
                   '*'
               ],
           }
        },
    });

    server.route(myRoute);

    await server.start();
    console.log('Server berjalan pada %s', server.info.uri);
}

init();
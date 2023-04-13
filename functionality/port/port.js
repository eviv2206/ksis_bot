const net = require("net");
const {PORT_AVAILABLE, PORT_UNAVAILABLE, PORT_UNAVAILABLE_TIMEOUT} = require("../../message/messages");

const checkPort = (host, port) => {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        // Обработка событий сокета
        socket.on('connect', () => {
            socket.end();
            resolve(PORT_AVAILABLE
                .replace('$host', host)
                .replace('$port', port)
            ); // порт доступен
        });
        socket.on('timeout', () => {
            socket.destroy();
            reject(PORT_UNAVAILABLE_TIMEOUT
                .replace('$host', host)
                .replace('$port', port)
            ); // таймаут, порт недоступен
        });
        socket.on('error', (err) => {
            socket.destroy();
            reject(PORT_UNAVAILABLE
                .replace('$host', host)
                .replace('$port', port)
                .replace('$reason', err),
            ); // ошибка, порт недоступен
        });

        // Подключение к хосту и порту
        socket.connect(port, host);
    });
}

module.exports = checkPort;
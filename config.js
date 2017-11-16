const Io = require("socket.io");
const Table = require("./table");

function run_server(port) {
    const io = Io.listen(port);
    io.on("connection", (socket) => {
        setTimeout(function() {
            handler(socket);
        }, 1000);
    });

    

    function handler (socket) {
        socket.io.once("add", (data) => {
            if (data.phone && data.id) {
                Table.add_contact(data.id, data.phone);
            }

            socket.disconnect();
        });

        socket.io.once("remove", (data) => {
            if (data.phone && data.id) {
                Table.rem_contact(data.id);
            }

            socket.disconnect();
        });
    }
}
module.exports.run_server = run_server;
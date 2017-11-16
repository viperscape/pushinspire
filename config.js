const Io = require("socket.io");
const Table = require("./table");

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function run_server(port) {
    http.listen(port);
    io.on("connection", (socket) => {
        setTimeout(function() {
            handler(socket);
        }, 1000);
    });

    

    function handler (socket) {
        socket.once("add", (data) => {
            console.log("adding", data);
            if (data.phone && data.id) {
                Table.add_contact(data.id, data.phone);
            }

            socket.disconnect();
        });

        socket.once("remove", (data) => {
            if (data.phone && data.id) {
                Table.rem_contact(data.id);
            }

            socket.disconnect();
        });
    }
}
module.exports.run_server = run_server;
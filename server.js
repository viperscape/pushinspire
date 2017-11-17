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
        socket.on("add", (data) => {
            Table.get_contact(data.id+"_", (_) => {
                if (data.phone) {
                    Table.add_contact(
                        data.id.substr(), 
                        data.phone,
                        function() { 
                            socket.emit("added");    
                            socket.disconnect();
                        });
                }
                else socket.disconnect();
            });
        });

        socket.once("remove", (data) => {
            if (!data.id) socket.disconnect();

            Table.get_contact(data.id+"_", (_) => {
                Table.rem_contact(
                    data.id, 
                    function() { 
                        socket.emit("removed");
                        socket.disconnect();
                    });
            });
        });
    }
}
module.exports.run_server = run_server;
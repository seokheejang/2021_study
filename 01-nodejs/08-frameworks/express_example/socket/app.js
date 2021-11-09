// App execute
const io = require('socket.io')(3000);
const socket = require('./server.js').socket;

const RunServer = async function(){
    
    io.on("connection", socket);
    
    console.log("websocket server start ...");

}
RunServer();
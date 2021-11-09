//// Socket.js

module.exports.socket = function(socket) {
    // client connect 신호 시 socket 이벤트 실행 전, 현재 함수의 지역 scope 먼저 전체 실행.
    socket.on("request", async function (msgId, callback) {
        try {
            console.log("msgId", msgId);

            callback({ msgId: msgId, status: "OK" });
            
        } catch (error) {
            console.log("Action: socket.on(request)", error);
            callback({ error: error, status: "NOK" });
        }
    });
}
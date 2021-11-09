
/**
 * @dev socket connect 접속을 위한 방법 1 (현재 코드)
 * @notice socket = io(); 호출로 바로 접속
 * @code const socket = io("ws://localhost:3000");
 */

/**
 * @dev socket connect 접속을 위한 방법 2
 * @notice baseUrl 별로로 입력 받아서 io.connect(); 호출
 * @code const serverBaseUrl = "ws://localhost:3000";
 *       const socket = io.connect(serverBaseUrl);
 */

//// Soekct.io
const io = require('socket.io-client');
const socket = io("ws://localhost:3000");

function request() {

    socket.on('connect', async function() {
        console.log("connect", socket.connected);
        
        const msgId = "test msg";

        socket.emit("request", msgId, function(response) {
            console.log("response", response);
            if (response.status === 'OK') {
                socket.disconnect();
            }
        });
    });

    socket.on("response", function(elem1, elem2) {
        console.log(elem1, elem2);
        socket.disconnect();
    });

    socket.on('disconnect', function() {
        console.log('disconnect client event....');
        socket.disconnect();
    });
    
    socket.on('error', function(reason) {
        console.log('Unable to connect to server', reason);
    });
    
}
request();
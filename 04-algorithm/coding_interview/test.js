let nonce = 0;

function nonceManager() { nonce++; }

function startFunc(userId, cbNonce) {
    console.log('start', userId, nonce);
    cbNonce(middleFunc(userId));
}

function middleFunc(userId) {
    finishFunc(userId, nonceManager);
}

function finishFunc(userId, cbNonce) {
    console.log('finish', userId, nonce);
    cbNonce();
}

let main = function() {
    startFunc("0xA", nonceManager);
    startFunc("0xB", nonceManager);
    console.log("end nonce", nonce);
}
main();
/* 
* @result 4
*/
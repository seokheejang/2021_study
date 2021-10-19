## Pseudo-code interview
문제 제출용

### 문자열 처리

https://programmers.co.kr/learn/courses/30/lessons/12931
```js
function solution(n){
    return (n+"").split("").reduce((acc, curr) => acc + parseInt(curr), 0);
    // 마지막에 0을 넣어서 acc 초기값을 정수화
}
```
> 학습필요: map, reduce 

https://programmers.co.kr/learn/courses/30/lessons/81301
```js
const transList = {zero:"0", one:"1", two:"2", three:"3", four:"4", five:"5", six:"6", seven:"7", eight:"8", nine:"9"};

function solution(s) {
    var answer = new Array();

    let word = "";
    for(let char of s) {
        if(char >= "0" && char <= "9") {
            answer.push(char);
        } else {
            word += char;
            if(transList[word]) {
                answer.push(transList[word]);
                word = "";
            }
        }
    }
    return Number(answer.join(""));
}

function solution(s) {
    let number = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    for(let i=0; i<number.length; i++) {
        s = s.replace(new RegExp(`${number[i]}`,'g'), i);
    }
    return parseInt(s);
}
```
> 학습필요: join, replace, 정규식 

**대소문자 비교**
```js
/** 
 * @문제 : 대소문자가 혼합된 문자열을 소문자로 출력하는 함수
 * @파라미터 예시 : dKarGo BlockChAiN tEAm
 * @input  {string} str
 * @output {string} res
 */
const str = 'dKarGo BlockChAiN tEAm';

function solution(str) {
    str = (str+'').split(''); // String() 사용 가능 
    let res = '';
    for(let i = 0; i < str.length; i++) {
        if(str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
            res += str[i].toLowerCase();
        } else {
            res += str[i];
        }
    }
    return res;
}

console.log(solution(str));

/* 
* @output dkargo blockchain team
* @hint .toUpperCase(), .toLowerCase()
*/
```
**addHexPrefix**
```js
/* 
* @문제 : 입력된 문자열이 16진수(Hex)값 인지 확인하고 아니라면 Prefix '0x'를 추가하는 함수
* @파라미터 예시 : abcdef123456
* @input  {string} str
* @output {string} res
*/
const str = 'abcdef123456';

function solution(str) {
	let res = str.slice(0,2) === '0x' ? str : `0x${str}`;
    return res;
}

console.log(solution(str));

/* 
* @output 0xabcdef123456
* @hint .slice()
*/
```
**uft8ToHex**
```js
/* 
* @문제 : 입력된 문자열을 16진수(Hex)로 변환 시키는 함수
* @파라미터 예시 : abcdef123456
* @input  {string} str
* @output {string} hex
*/
const str = 'blockchain';

function solution(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i)
        const n = code.toString(16)
        hex += n.length < 2 ? `0${n}` : n
    }

    return `0x${hex}`
}

console.log(solution(str));

/* 
* @output 0x626c6f636b636861696e
* @hint 유니코드 반환: .charCodeAt(), 16진수 변환: toString(16)
*/
```
**hexToUtf8**
```js
const hexToUtf8 = function(hex) {
    if (!isHexStrict(hex)) {
        throw new Error(`The parameter "${hex}" must be a valid HEX string.`)
    }

    let str = ''
    let code = 0
    hex = hex.replace(/^0x/i, '')

    // remove 00 padding from either side
    hex = hex.replace(/^(?:00)*/, '')
    hex = hex
        .split('')
        .reverse()
        .join('')
    hex = hex.replace(/^(?:00)*/, '')
    hex = hex
        .split('')
        .reverse()
        .join('')

    const l = hex.length

    for (let i = 0; i < l; i += 2) {
        code = parseInt(hex.substr(i, 2), 16)
        // if (code !== 0) {
        str += String.fromCharCode(code)
        // }
    }

    return utf8.decode(str)
}
```
**JSON Object 다루기**
```js
/* 
* @문제 : myReceipt 객체의 nonce값이 30 이하 일 때, balance 총 합을 구하는 함수
* @파라미터 예시 : myReceipt
* @input  {object} str
* @output {num} res
*/

const myReceipt = {
    transaction: [
        {nonce: 10, balance: 300},
        {nonce: 20, balance: 150},
        {nonce: 30, balance: 200},
        {nonce: 40, balance: 100},
        {nonce: 50, balance: 500},
    ]
}

function solution(obj) {
    let res = 0;
    obj.transaction.forEach(element => {  // 1. forEach
        if(element.nonce <= 30) {
            res += element.balance;
        }
    });

    for(let key in obj.transaction) { // 2. for in
        if(obj.transaction[key].nonce <= 30) {
            res += obj.transaction[key].balance;
        }
    }

    for(let i = 0; i < obj.transaction.length; i++) { // 3. for
        if(obj.transaction[i].nonce <= 30) {
            res += obj.transaction[i].balance;
        }
    }
    return res;
}
console.log(solution(myReceipt));
```
**정규식으로 address check**
```js
/* 
* @문제 : 입력된 16진수 address 값이 올바른지 확인하는 함수
* @파라미터 예시 : address 
* @address 조건식 : / 16진수 값 / 처음 2자리 '0x'를 제외한 총 길이 40 / 대소문자 구분하지 않음
* @input  {object} str
* @output {bool} res
*/

const address = '0xd940fa3f34a438f86cd3c367b281f07635ce3f41'

function solution(str) {
    let res = /^(0x)?[0-9a-f]{40}$/i.test(str);
    return res;
}
console.log(solution(address));

/* 
* @output true
* @hint 정규식 사용 / .test() 
*/
```
2. callback 처리
3. 동기/비동기 처리
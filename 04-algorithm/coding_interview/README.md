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

2. callback 처리
3. 동기/비동기 처리
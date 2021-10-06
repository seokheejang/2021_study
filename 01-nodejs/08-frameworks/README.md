# Express
## 설치
```
mkdir myapp & cd myapp
npm init
npm install express --save
```
## Hello World
```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```
> req(요청) 및 res(응답)는 Node가 제공하는 동일한 오브젝트이며, 따라서 req.pipe(), req.on('data', callback) 그리고 Express의 관여가 필요 없는 다른 모든 항목을 호출할 수 있다.

`node app.js`로 앱 실행 후 http://localhost:3000 웹 확인

## Express 앱 생성기
```
npm install express-generator -g
```
```
express --view=pug myapp
```
```
cd myapp
npm install  # 추가 디펜던시 항목 설치
```
window 환경
```
set DEBUG=myapp:* & npm start
```
### Express 기본 디렉토리 구조
```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug

7 directories, 9 files
```
## 기본 라우팅
라우팅은 URI(또는 경로) 및 특정한 HTTP 요청 메소드(GET, POST 등)인 특정 엔드포인트에 대한 클라이언트 요청에 애플리케이션이 응답하는 방법을 결정하는 것을 말한다.

각 라우트는 하나 이상의 핸들러 함수를 가질 수 있으며, 이러한 함수는 라우트가 일치할 때 실행됩니다.

라우트 정의에는 다음과 같은 구조가 필요
```
app.METHOD(PATH, HANDLER)
```
* app은 express의 인스턴스
* METHOD는 HTTP 요청 메소드
* PATH는 서버에서의 경로
* HANDLER는 라우트가 일치할 때 실행되는 함수

간단한 라우트의 정의를 설명
홈 페이지에서 Hello World!로 응답:
```js
app.get('/', function (req, res) {
  res.send('Hello World!');
});
```
애플리케이션의 홈 페이지인 루트 라우트(/)에서 POST 요청에 응답:
```js
app.post('/', function (req, res) {
  res.send('Got a POST request');
});
```
/user 라우트에 대한 PUT 요청에 응답:
```js
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});
```
/user 라우트에 대한 DELETE 요청에 응답:
```js
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
});
```

## Exrpess 애플리케이션 구조화
* Route listings
    https://github.com/expressjs/express/blob/4.13.1/examples/route-separation/index.js#L32-47
* Route map
    https://github.com/expressjs/express/blob/4.13.1/examples/route-map/index.js#L52-L66
* MVC style controllers
    https://github.com/expressjs/express/tree/master/examples/mvc
* 모델 중심의 Express 기반 프레임워크
    https://loopback.io/
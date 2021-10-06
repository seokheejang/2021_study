# Express Guide
## Routing
라우팅은 애플리케이션 엔드 포인트(URI)의 정의와 URI를 통해 클라이언트 request에 response하는 방식을 말한다.
```js
var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});
```
### express.Router
express.Router 클래스를 사용하면 모듈식 마운팅이 가능한 핸들러를 작성할 수 있다. Router 인스턴스는 완전한 미들웨어이자 라우팅 시스템이며, “미니 앱(mini-app)”이라 불린다.

birds.js
```js
var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;
```
이후 앱 다른 js에서 다음과 같이 라우터 모듈을 로드 가능

```js
var birds = require('./birds');
...
app.use('/birds', birds);
```
/birds 및 /birds/about에 대한 요청을 처리할 수 있게 되며, 해당 라우트에 대한 특정한 미들웨어 함수인 timeLog를 호출

## Writing middleware for use in Express apps
## Using middleware
## Overriding the Express API
## Using template engines with Express
## Error Handling
## Debugging Express
## 프록시 환경에서 Express 사용
# DB
## MongoDB
모듈: mongodb 설치 (https://github.com/mongodb/node-mongodb-native)
```
npm install mongodb
```
예제
```js
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
  if (err) {
    throw err;
  }
  db.collection('mammals').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});
```
MongoDB용 오브젝트 모델 드라이버가 필요한 경우에는 Mongoose를 확인 (https://github.com/Automattic/mongoose)

## MySQL
모듈: mysql 설치 (https://github.com/mysqljs/mysql)
```
npm install mysql
```
예제
```js
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : 's3kreee7'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

connection.end();
```
## Cassandra
모듈: cassandra-driver 설치 (https://github.com/datastax/nodejs-driver)
```
npm install cassandra-driver
```
예제
```js
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['localhost']});

client.execute('select key from system.local', function(err, result) {
  if (err) throw err;
  console.log(result.rows[0]);
});
```
## CouchDB
모듈: nano 설치 (https://github.com/apache/nano)
```
npm install nano
```
예제
```js
var nano = require('nano')('http://localhost:5984');
nano.db.create('books');
var books = nano.db.use('books');

//Insert a book document in the books database
books.insert({name: 'The Art of war'}, null, function(err, body) {
  if (!err){
    console.log(body);
  }
});

//Get a list of all books
books.list(function(err, body){
  console.log(body.rows);
});
```
## LevelDB
모듈: levelup 설치 (https://github.com/Level/levelup)
```
npm install level levelup leveldown
```
예제
```js
var levelup = require('levelup');
var db = levelup('./mydb');

db.put('name', 'LevelUP', function (err) {

  if (err) return console.log('Ooops!', err);
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err);
    console.log('name=' + value);
  });

});
```
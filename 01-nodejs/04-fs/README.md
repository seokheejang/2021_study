# FS
fs 모듈을 사용하면 표준 POSIX 기능을 모델링한 방식으로 파일 시스템과 상호 작용할 수 있다.
```js
const fs = require('fs');
```
모든 파일 시스템 작업에는 동기, 콜백 및 약속 기반 형식이 있다.
## Synchronous example
동기 형식은 작업이 완료될 때까지 Node.js 이벤트 루프와 추가 JavaScript 실행을 차단한다.
```js
try {
  fs.unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
## Callback example
콜백 형식은 완료 콜백 함수를 마지막 인수로 사용하고 작업을 비동기적으로 호출한다.
```js
fs.unlink('/tmp/hello', (err) => {  // fs.unlink를 진행하고 마지막 funciton 실행
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
## Promise example
Promise 기반 작업은 비동기 작업이 완료될 때 이행되는 Promise를 반환한다.
```js
(async function(path) {
  try {
    await fs.unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
## Ordering of callback and promise-based operations
fs 함수는 비동기적으로 작동하기 때문에 작업 순서를 지켜주려면 callback이나 promise 형식으로 작성해야 한다.
```js
const fs = require('fs/promises');

(async function(from, to) {
  try {
    await fs.rename(from, to);
    const stats = await fs.stat(to);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
## File paths
대부분의 fs 작업은 file: 프로토콜을 사용하여 문자열, 버퍼 또는 URL 개체 형식으로 지정할 수 있는 파일 경로를 허용한다.
```js
fs.open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  fs.close(fd, (err) => {
    if (err) throw err;
  });
});
```
## File descriptors
## Threadpool usage
## Class: fs.Dir
```js
async function print(path) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    console.log(dirent.name);
  }
}
print('./').catch(console.error);
```
## Class: fs.Dirent
## Class: fs.FSWatcher
모든 fs.FSWatcher 객체는 특정 감시 파일이 수정될 때마다 'change' 이벤트를 발생시킨다.
### Event: 'change'
```js
// Example when handled through fs.watch() listener
fs.watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Prints: <Buffer ...>
  }
});
```
## Class: fs.StatWatcher
## Class: fs.ReadStream
## Class: fs.Stats
fs.Stats 객체는 파일에 대한 정보를 제공한다.

fs.stat(), fs.lstat() 및 fs.fstat()에서 반환된 객체.
```js
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
## Class: fs.WriteStream
## fs.access(path[, mode], callback)
경로로 지정된 파일 또는 디렉토리에 대한 사용자 권한을 테스트
```js
fs.open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  writeMyData(fd);  // access
});
```
fs.open(), fs.readFile() 또는 fs.writeFile()을 호출하기 전에 fs.access()를 사용하여 파일의 액세스 가능성을 확인하지 않는다. 다른 프로세스가 두 호출 사이에 파일 상태를 변경할 수 있으므로 경쟁 조건이 발생한다. 대신 사용자 코드는 파일을 직접 열고/읽고/쓰기해야 하며 파일에 액세스할 수 없는 경우 발생하는 오류를 처리해야 한다.

## fs.accessSync(path[, mode])
경로로 지정된 파일 또는 디렉토리에 대한 사용자 권한을 동기적으로 테스트
```js
try {
  fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```

## fs.appendFileSync(path, data[, options])
파일에 데이터를 동기식으로 추가하고 아직 존재하지 않는 경우 파일을 생성
```js
try {
  fs.appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```
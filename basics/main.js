const express = require('express');
const app = express();

const multer = require('multer');
const fs = require('fs');

// REDIS
const redis = require('redis');
let client = redis.createClient(6379, '127.0.0.1', {});

///////////// GLOBAL HOOK

// Add hook to make it easier to get all visited URLS.
app.use(function (req, res, next) {
  console.log(req.method, req.url);

  client.lpush("recent", req.url);
  let r = client.ltrim("recent", 0, 4);
  // console.log(r);

  next(); // Passing the request to the next handler in the stack.
});

///////////// WEB ROUTES

// responding to GET request to / route (http://IP:3000/)
app.get('/', function (req, res) {
  res.send('hello world');
})

app.get('/test', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.write('test');
  res.end();
})

// Task 1 ===========================================

app.get('/set', function (req, res) {
  client.set("a new key", "this message will self-destruct in 10 seconds");
  client.expire("a new key", 10);

  res.send('set ok');
});

app.get('/get', function (req, res) {
  client.get("a new key", (err, reply) => {
    res.send(reply);
  });
});


// ===================================================


// Task 2 ============================================

app.get('/recent', function (req, res) {
  client.lrange("recent", 0, 4, (err, reply) => {
    res.send(reply);
  });
});

// ===================================================


// Task 3 ============================================
const upload = multer({ dest: './uploads/' })
app.post('/upload', upload.single('image'), function (req, res) {
  console.log(req.body) // form fields
  console.log(req.file) // form files

  if (req.file.fieldname === 'image') {
    fs.readFile(req.file.path, function (err, data) {
      if (err) throw err;
      var img = new Buffer(data).toString('base64');
      console.log(img);

      client.lpush('cats', img, function (err) {
        res.status(204).end()
      });
    });
  }
});

app.get('/meow', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' });

  // res.write("<h1>\n<img src='data:my_pic.jpg;base64," + imagedata + "'/>");
  res.end();
})
// ===================================================

// HTTP SERVER
let server = app.listen(3003, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
})
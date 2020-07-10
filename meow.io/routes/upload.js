const multer = require('multer');
const fs = require('fs');

const db = require('../data/db');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});

var express = require('express');
var router = express.Router();

const RECENT_CAT_KEY = "recent_cat_key";
const UPLOAD_QUEUE_KEY = "upload_queue_key";

/* GET users listing. */
const upload = multer({ dest: './uploads/' })

router.post('/', upload.single('image'), function (req, res) {
  console.log(req.body) // form fields
  console.log(req.file) // form files

  if (req.file.fieldname === 'image') {
    fs.readFile(req.file.path, async function (err, data) {
      if (err) throw err;
      var img = new Buffer(data).toString('base64');

      // await db.cat(img);
      client.lpush(UPLOAD_QUEUE_KEY, img);

      client.lpush(RECENT_CAT_KEY, img);
      client.ltrim(RECENT_CAT_KEY, 0, 4);
      res.send('Ok');

    });
  }
});

module.exports = router;

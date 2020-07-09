var express = require('express');
var router = express.Router();
const redis = require('redis');
let client = redis.createClient(6379, '127.0.0.1', {});

const db = require('../data/db');

const BEST_FACT_KEY = "best_fact_key";
const RECENT_CAT_KEY = "recent_cat_key";

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  let bestFacts = await new Promise((resolve) => {
    client.get(BEST_FACT_KEY, (err, reply) => {
      resolve(reply ? JSON.parse(reply) : null);
    });
  });
  if (bestFacts == null) {
    console.log("Load bestFacts from db");
    bestFacts = (await db.votes()).slice(0,100);
    client.set(BEST_FACT_KEY, JSON.stringify(bestFacts));
    client.expire(BEST_FACT_KEY, 10);
  }

  let recentUploads = await new Promise((resolve) => {
    client.lrange(RECENT_CAT_KEY, 0, 4, (err, reply) => {
      // console.log(reply);
      resolve(reply);
    });
  });
  // if (recentUploads.length != 5) {
  //   console.log("Load recentUploads from db");
  //   recentUploads = await db.recentCats(5);
  //   client.lpush(RECENT_CAT_KEY, recentUploads);
  //   client.ltrim(RECENT_CAT_KEY, 0, 4);
  // }

  res.render('index', { title: 'meow.io', recentUploads: recentUploads, bestFacts: bestFacts});
});

module.exports = router;

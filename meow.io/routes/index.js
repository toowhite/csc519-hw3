var express = require('express');
var router = express.Router();
const redis = require('redis');
const util = require('util');
let client = redis.createClient(6379, '127.0.0.1', {});

const db = require('../data/db');

const BEST_FACT_KEY = "best_fact_key";
const RECENT_CAT_KEY = "recent_cat_key";

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  const client_get = util.promisify(client.get).bind(client);
  let bestFacts = await client_get(BEST_FACT_KEY);
  
  if (bestFacts == null) {
    console.log("Load bestFacts from db");
    bestFacts = (await db.votes()).slice(0, 100);
    client.set(BEST_FACT_KEY, JSON.stringify(bestFacts));
    client.expire(BEST_FACT_KEY, 10);
  }
  else {
    bestFacts = JSON.parse(bestFacts);
  }

  const client_lrange = util.promisify(client.lrange).bind(client);
  let recentUploads = await client_lrange(RECENT_CAT_KEY, 0, 4);

  res.render('index', { title: 'meow.io', recentUploads: recentUploads, bestFacts: bestFacts});
});

module.exports = router;

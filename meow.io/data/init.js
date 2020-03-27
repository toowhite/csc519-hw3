const fs = require('fs');
const path = require('path');

let dbPath = path.resolve(__dirname, 'meowio.db')
console.log(dbPath);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
 
db.serialize(function() {
  db.run("CREATE TABLE facts (info TEXT)");
  db.run("CREATE TABLE votes (catId INT, votes INT)");
  db.run("CREATE TABLE cats (img TEXT)");

  // Load facts
  var stmt = db.prepare("INSERT INTO facts VALUES (?)");
  const data = fs.readFileSync(path.resolve(__dirname, "catfacts.txt"), 'utf8');
  const lines = data.split("\n");
  for( var line of lines ) {
    line=line.substring(1, line.length-2);
    stmt.run(line);
  }
  stmt.finalize();

  stmt = db.prepare("INSERT INTO votes VALUES (?,?)");
  let id = 1;
  for( var line of lines )
  {
    stmt.run(id++, 1);
  }

  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM facts", function(err, row) {
      console.log(`${row.id} ${row.info}`);
  });



});
 
db.close();

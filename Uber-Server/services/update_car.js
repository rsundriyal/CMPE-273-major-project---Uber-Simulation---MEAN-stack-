var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});
function handle_request(msg, callback) {
  var res = {};
  pool.getConnection(function(err, connection) {
	connection.query("UPDATE cars SET type=? ,door=?,year=? WHERE email = ?",
	    [ msg.type, msg.door, msg.year, msg.email ], function(err, rows) {
		  if (err) {
		    console.log("car update Failed");
		    res.code = "400";
		  }
		  console.log("car update Success");
		  res.code = "200";
		  
		  res = JSON.stringify(res);
		  callback(null, res);
	    });
  });
}
exports.handle_request = handle_request;
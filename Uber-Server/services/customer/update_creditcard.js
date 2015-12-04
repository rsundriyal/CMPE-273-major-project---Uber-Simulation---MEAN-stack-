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
	connection.query("UPDATE customers SET creditcard=? ,creditcard_month=?,creditcard_year=? WHERE email = ?", [
	    msg.creditcard, msg.creditcard_month, msg.creditcard_year, msg.email ], function(err, rows) {
	  if (err) {
		console.log("card update Failed");
		res.code = "400";
	  }
	  console.log("card update Success");
	  res.code = "200";
	  
	  res = JSON.stringify(res);
	  callback(null, res);
	});
  });
}
exports.handle_request = handle_request;
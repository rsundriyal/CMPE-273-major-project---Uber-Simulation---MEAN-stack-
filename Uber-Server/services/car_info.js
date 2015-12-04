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
	connection.query("SELECT * FROM cars WHERE email='" + msg + "'", function(err, user) {
	  if (err) {
		throw err;
		
	  }
	  else {
		if (user.length == 0) {
		  console.log("car Info Get Failed");
		  res.code = "400";
		}
		else {
		  console.log("car Info Get Successed");
		  
		  res.code = "200";
		  res.value = {
			"type" : user[0].type,
			"door" : user[0].door,
			"year" : user[0].year,
			"salvaged" : user[0].salvaged,
		  };
		  
		}
		res = JSON.stringify(res);
		callback(null, res);
	  }
	});
  });
  
}
exports.handle_request = handle_request;
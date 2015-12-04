var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});
function customer_ride_history(msg, callback) {
  var res = {};
  var message = JSON.parse(msg);
  pool.getConnection(function(err, connection) {
	connection.query("SELECT * FROM ride WHERE customer_id='" + message.customer_id + "'", function(err, ride) {
	  if (err) {
		console.log(err);
	  }
	  else {
		if (ride.length == 0) {
		  console.log("No Ride");
		  res.code = "400";
		}
		else {
		  console.log("Customer ride Get Successed");
		  res.code = "200";
		  res.value = ride;
		  
		}
		res = JSON.stringify(res);
		callback(null, res);
	  }
	});
  });
}
exports.customer_ride_history = customer_ride_history;
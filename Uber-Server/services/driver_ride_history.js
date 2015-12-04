var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});
function driver_ride_history(msg, callback) {
  var res = {};
  var message = JSON.parse(msg);
  console.log(message);
  pool.getConnection(function(err, connection) {
	connection.query("SELECT * FROM ride WHERE driver_id='" + message.driver_id + "'", function(err, ride) {
	  if (err) {
		console.log(err);
	  }
	  else {
		if (ride.length == 0) {
		  console.log("No Ride");
		  res.code = "400";
		}
		else {
		  console.log("driver ride Get Successed");
		  res.code = "200";
		  res.value = ride;
		}
		res = JSON.stringify(res);
		callback(null, res);
	  }
	});
  });
}
exports.driver_ride_history = driver_ride_history;
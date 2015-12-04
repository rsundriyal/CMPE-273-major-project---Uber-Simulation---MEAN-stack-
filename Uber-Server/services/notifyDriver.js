var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});
function notifyDriver(msg, callback) {
  var res = {};
  console.log(msg);
  var message = JSON.parse(msg);
  console.log(message.ride_id);
  pool.getConnection(function(err, connection) {
	connection.query("SELECT * FROM ride WHERE ride_id='" + message.ride_id + "'", function(err, ride) {
	  console.log(ride);
	  if (err) {
		console.log(err);
	  }
	  else {
		if (ride.length == 0) {
		  console.log("notify Login Failed");
		  res.code = "400";
		  res.value = "notify not found";
		}
		else {
		  console.log("notify Login Success");
		  console.log(ride);
		  res.code = "200";
		  res.value = ride;
		}
		res = JSON.stringify(res);
		callback(null, res);
	  }
	});
  });
}
exports.notifyDriver = notifyDriver;
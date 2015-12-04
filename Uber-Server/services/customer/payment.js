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
  msg = JSON.parse(msg);
  var query = "INSERT INTO bill(start_time,end_time,distance,price,origin,destination,date,customer_id,driver_id,ride_id) VALUES('"
	  + msg.start_time
	  + "','"
	  + msg.end_time
	  + "','"
	  + msg.distance
	  + "','"
	  + msg.price
	  + "','"
	  + msg.origin
	  + "','"
	  + msg.destination
	  + "','"
	  + msg.date
	  + "','"
	  + msg.customer_id
	  + "','"
	  + msg.driver_id
	  + "','"
	  + msg.ride_id
	  + "')";
  pool.getConnection(function(err, connection) {
	connection.query(query, function(err, bill) {
	  if (err) {
		console.log(err);
	  }
	  else {
		res.code = "200";
		res.value = "Bill Success";
		res = JSON.stringify(res);
		callback(null, res);
		connection.release();
	  }
	});
  });
  
};
exports.handle_request = handle_request;
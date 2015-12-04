var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});
function handle_request(msg, callback) {
  console.log("review");
  var res = {};
  
  var sql = "INSERT INTO `driver_review` (`rating`, `review`, `driver_id`, `customer_name`) VALUES (\"" + msg['rating']
	  + "\",\"" + msg['review'] + "\",\"" + msg['driver_id'] + "\",\"" + msg['customer_name'] + "\")";
  pool.getConnection(function(err, connection) {
	connection.query(sql, function(err, rows) {
	  console.log("hahahahhahah " + rows);
	  if (err) {
		console.log(err);
	  }
	  else {
		res.code = "200";
		res.value = "customer review exsist";
		res = JSON.stringify(res);
		callback(null, res);
		connection.release();
	  }
	});
  });
  
};
exports.handle_request = handle_request;
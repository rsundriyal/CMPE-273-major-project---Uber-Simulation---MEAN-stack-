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
	connection.query("SELECT * FROM drivers WHERE email='" + msg.email + "'OR driver_id='" + msg.driver_id + "'",
	    function(err, user) {
		  if (err) {
		    throw err;
		    
		  }
		  else {
		    if (user.length == 0) {
			  console.log("Driver Info Get Failed");
			  res.code = "400";
		    }
		    else {
			  console.log("Driver Info Get Successed");
			  res.code = "200";
			  res.value = {
			    "driver_id" : user[0].driver_id,
			    "email" : user[0].email,
			    "firstname" : user[0].firstname,
			    "lastname" : user[0].lastname,
			    "phone" : user[0].phone,
			    "city" : user[0].city,
			    "zip" : user[0].zip,
			    "address" : user[0].address,
			    "state" : user[0].state
			  };
			  
			  res = JSON.stringify(res);
			  callback(null, res);
		    }
		  }
	    });
  });
  
}
exports.handle_request = handle_request;
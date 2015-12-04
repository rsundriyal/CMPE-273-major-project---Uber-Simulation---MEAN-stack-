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
	connection.query("SELECT * FROM admin WHERE email='" + msg.email + "'AND password ='" + msg.password + "'",
	    function(err, user) {
		  console.log(user);
		  if (err) {
		    throw err;
		    
		  }
		  else {
		    if (user.length == 0) {
			  console.log("Server Login Failed");
			  res.code = "400";
			  res.value = "admin not found";
		    }
		    else {
			  
			  console.log("Server Login Success");
			  res.code = "200";
			  res.value = "admin success";
			  
			  /*
			   * if(user.status==0){ console.log("Server Login Failed");
			   * res.code = "400"; res.value = "User not approved"; }
			   */
		    }
		    res = JSON.stringify(res);
		    callback(null, res);
		  }
	    });
  });
}
exports.handle_request = handle_request;
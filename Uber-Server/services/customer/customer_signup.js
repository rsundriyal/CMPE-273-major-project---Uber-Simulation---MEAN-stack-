var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});
function customer_signup(msg, callback) {
  
  var res = {};
  var message = JSON.parse(msg);
  
  pool
	  .getConnection(function(err, connection) {
	    connection
	        .query(
	            "SELECT * FROM customers WHERE email ='" + message['email'] + "'",
	            function(err, rows) {
		          if (rows.length == 0) {
		            pool
		                .getConnection(function(err, connection) {
			              var sql = "INSERT INTO `customers` (`firstname`, `lastname`, `email`, `phone`, `password`, `address`,`city`,`state`,`zipcode`,`creditcard`,`cvv`,`creditcard_month`,`creditcard_year`) VALUES (\""
			                  + message["firstname"]
			                  + "\",\""
			                  + message["lastname"]
			                  + "\",\""
			                  + message["email"]
			                  + "\",\""
			                  + message["phone"]
			                  + "\",\""
			                  + message["password"]
			                  + "\",\""
			                  + message["address"]
			                  + "\",\""
			                  + message["city"]
			                  + "\",\""
			                  + message["state"]
			                  + "\",\""
			                  + message["zipcode"]
			                  + "\",\""
			                  + message["creditcard"]
			                  + "\",\""
			                  + message["cvv"]
			                  + "\",\"" + message["creditcard_month"] + "\",\"" + message["creditcard_year"] + "\")";
			              connection.query(sql, function(err, rows) {
			                if (err) {
				              console.log(err);
				              res.code = "401";
				              res.value = "fail";
			                }
			                else {
				              res.code = "200";
				              res.value = "success";
			                }
			                res = JSON.stringify(res);
			                callback(null, res);
			                connection.release();
			              });
		                });
		          }
		          else {
		            res.code = "402";
		            res.value = "Email exsist";
		            res = JSON.stringify(res);
		            callback(null, res);
		            connection.release();
		          }
	            });
	  });
  
};
exports.customer_signup = customer_signup;
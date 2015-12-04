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
	connection.query("SELECT * FROM customers WHERE email='" + msg.email + "'OR customer_id='" + msg.customer_id + "'",
	    function(err, user) {
		  if (err) {
		    throw err;
		  }
		  else {
		    if (user.length == 0) {
			  console.log("Customer Info Get Failed");
			  res.code = "400";
		    }
		    else {
			  console.log("Customer Info Get Successed");
			  res.code = "200";
			  res.value = {
			    "email" : user[0].email,
			    "firstname" : user[0].firstname,
			    "lastname" : user[0].lastname,
			    "phone" : user[0].phone,
			    "city" : user[0].city,
			    "zipcode" : user[0].zipcode,
			    "address" : user[0].address,
			    "state" : user[0].state,
			    "creditcard" : user[0].creditcard,
			    "cvv" : user[0].cvv,
			    "creditcard_month" : user[0].creditcard_month,
			    "creditcard_year" : user[0].creditcard_year,
			    "customer_id" : user[0].customer_id
			  
			  };
			  res = JSON.stringify(res);
			  callback(null, res);
		    }
		  }
	    });
  });
}
exports.handle_request = handle_request;
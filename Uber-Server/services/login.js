var bill_id;
var ride_id;
var bill_id;
var mongo = require('./mongo');
var mysql = require('mysql');
var mongojs = require('mongojs');

function connect() {
  var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	port : '3306',
	database : 'uber'
  });
  
  connection.connect();
  
  return connection;
}

function handle_request(msg, callback) {
  
  var res = {};
  console.log("In handle request:" + msg.username);
  
  var email = msg.username;
  var password = msg.password;
  var url1 = "mongodb://localhost:27017/login";
  ;
  mongo.connect(url1, function() {
	var db = mongo.collection('login');
	console.log(email);
	console.log(password);
	db.findOne({
	  username : email,
	  password : password
	}, function(err, user) {
	  if (user) {
		res.code = "200";
		res.value = "Succes Login";
	  }
	  else {
		res.code = "401";
		res.value = "Failed Login";
	  }
	  
	  callback(null, res);
	});
  });
  
}

function getuser_request(msg, callback) {
  
  var res = {};
  var query = "SELECT * FROM user WHERE(status='" + 0 + "')";
  var connection = connect();
  console.log("get user request");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Succes signup";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function getadmin_request(msg, callback) {
  
  var res = {};
  var query = "SELECT * FROM admin ";
  var connection = connect();
  console.log("get admin details request");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success admin details";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
};

function getdriver_request(msg, callback) {
  
  var res = {};
  var query = "SELECT * FROM drivers WHERE(status='" + 0 + "')";
  var connection = connect();
  console.log("get driver request");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0) {
		console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		console.log(results);
		res.code = "200";
		res.value = "Success driver request";
		res.details = results;
		callback(null, res);
	  }
	}
	
  });
  
};

function getdriver_response(msg, callback) {
  
  var res = {};
  
  var email = msg.email;
  
  if (msg.value == "yes") {
	var query = "UPDATE drivers SET status='" + 1 + "' WHERE(email='" + email + "')";
	var connection = connect();
	console.log("respond to driver request for yes");
	
	connection.query(query, function(err, results) {
	  if (err) {
		console.log("ERROR:" + err.message);
		callback(null, res);
	  }
	  else {
		if (results.length !== 0)

		{
		  res.code = "200";
		  res.value = "Success driver response for yes";
		  res.details = results;
		  console.log(results);
		  callback(null, res);
		}
	  }
	  
	});
  }
  else {
	var query = "DELETE FROM drivers WHERE (email='" + email + "')";
	var connection = connect();
	console.log("respond to driver request for no");
	
	connection.query(query, function(err, results) {
	  if (err) {
		console.log("ERROR:" + err.message);
		callback(null, res);
	  }
	  else {
		if (results.length !== 0)

		{
		  res.code = "200";
		  res.value = "Success driver response for no";
		  res.details = results;
		  console.log(results);
		  callback(null, res);
		}
	  }
	  
	});
  }
};

function getuser_response(msg, callback) {
  
  var res = {};
  
  var email = msg.email;
  
  if (msg.value == "yes") {
	var query = "UPDATE user SET status='" + 1 + "' WHERE(lastname='" + email + "')";
	var connection = connect();
	console.log("respond to user request for yes");
	
	connection.query(query, function(err, results) {
	  if (err) {
		console.log("ERROR:" + err.message);
		callback(null, res);
	  }
	  else {
		if (results.length !== 0)

		{
		  res.code = "200";
		  res.value = "Success user response for yes";
		  res.details = results;
		  console.log(results);
		  callback(null, res);
		}
	  }
	  
	});
  }
  else {
	var query = "DELETE FROM user WHERE (lastname='" + email + "')";
	var connection = connect();
	console.log("respond to user request for no");
	
	connection.query(query, function(err, results) {
	  if (err) {
		console.log("ERROR:" + err.message);
		callback(null, res);
	  }
	  else {
		if (results.length !== 0)

		{
		  res.code = "200";
		  res.value = "Success user response for no";
		  res.details = results;
		  console.log(results);
		  callback(null, res);
		}
	  }
	  
	});
  }
};
function charts1_response(msg, callback) {
  var res = {};
  var query = "SELECT date,SUM(ride_id) as revenue FROM ride GROUP BY date ";
  var connection = connect();
  console.log("get charts");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success chart date request";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function charts2_response(msg, callback) {
  var res = {};
  var query = "SELECT origin,COUNT(ride_id) as rides FROM ride GROUP BY origin";
  var connection = connect();
  console.log("get charts");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success chart origin request";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function charts_response(msg, callback) {
  
  var res = {};
  var query = "SELECT * FROM ride";
  var connection = connect();
  console.log("get charts");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success chart request";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function charts3_response(msg, callback) {
  var res = {};
  var query = "SELECT destination,COUNT(ride_id) as rides FROM ride GROUP BY destination";
  var connection = connect();
  console.log("get charts");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success chart destination request";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function distance_response(msg, callback) {
  var res = {};
  var connection = connect();
  connection
	  .query(
	      "UPDATE ride SET start_lat=?,start_lng=?, destination_lat=?,destination_lng=?,start_time=?,distance=?,origin=?,destination=? WHERE ride_id = ?",
	      [ msg.source1, msg.source2, msg.destination1, msg.destination2, msg.start_time, msg.distance, msg.origin,
	          msg.destination, msg.ride_id ], function(err, results) {
	        console.log(results);
	        if (err) {
		      console.log("ERROR:" + err.message);
		      callback(null, res);
	        }
	        else {
		      if (results.length !== 0)

		      {
		        res.code = "200";
		        res.value = "update ride details1 into ride";
		        
		        callback(null, res);
		      }
	        }
	      });
}

function endride_response(msg, callback) {
  
  var res = {};
  var connection = connect();
  connection.query("UPDATE ride SET end_time=? WHERE ride_id=?", [ msg.endtime, msg.ride_id ], function(err, results) {
	console.log(results);
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "update ride details2 into ride";
		
		callback(null, res);
	  }
	}
  });
  
};

function bill_response(msg, callback) {
  
  var res = {};
  var connection = connect();
  console.log("get bill response");
  connection.query("SELECT * FROM ride WHERE ride_id='" + msg.ride_id + "'", function(err, ride) {
	console.log(ride);
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (ride.length !== 0)

	  {
		res.code = "200";
		res.value = ride;
		callback(null, res);
	  }
	}
	
  });
  
};

function searchdriver_response(msg, callback) {
  
  var res = {};
  var query = "SELECT * FROM drivers WHERE(driver_id='" + msg.driver_id + "')";
  var connection = connect();
  console.log("search driver");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success driver search";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function pay_response(msg, callback) {
  var res = {};
  var connection = connect();
  connection
	  .query(
	      " SELECT * FROM ride WHERE ride_id='" + msg.ride_id + "'",
	      function(err, ride) {
	        console.log("pay bill");
	        connection
	            .query(
	                query,
	                function(err, results) {
		              
		              var query = "INSERT into bill(start_time,end_time,distance,price,origin,destination,date,status,customer_id,driver_id) VALUES('"
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
		                  + msg.destinatione
		                  + "','"
		                  + msg.date
		                  + "','"
		                  + 0
		                  + "','"
		                  + ride.customer_id + "','" + ride.driver_id + "')";
		              if (err) {
		                console.log("ERROR:" + err.message);
		                callback(null, res);
		              }
		              else {
		                if (results.length !== 0) {
			              res.code = "200";
			              res.value = "Success payment";
			              res.details = results;
			              console.log(results);
			              callback(null, res);
			              
		                }
		              }
	                });
	      });
  
};

function searchbill_response(msg, callback) {
  
  var id = parseInt(msg.bill_id);
  var res = {};
  var query = "SELECT * FROM bill WHERE (bill_id='" + id + "')";
  var connection = connect();
  var connection = connect();
  console.log("search bill");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success search bill";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
}

function searchcustomer_response(msg, callback) {
  
  var id = parseInt(msg.customer_id);
  var res = {};
  var query = "SELECT * FROM customers WHERE (customer_id='" + id + "')";
  var connection = connect();
  
  console.log("search customer");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success search customer";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
}

function updatebill_response(msg, callback) {
  
  var res = {};
  var query = "UPDATE bill SET status='" + 1 + "' WHERE (bill_id='" + msg.bill_id + "')";
  // console.log(query);
  var connection = connect();
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "update bill done";
		
		callback(null, res);
	  }
	}
  });
  
};

function cancelride_response(msg, callback) {
  
  var res = {};
  
  var query = "DELETE FROM ride WHERE (ride_id='" + msg.ride_id + "')";
  var connection = connect();
  console.log("cancelling a ride");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success ride cancelled";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function deletebill_response(msg, callback) {
  var res = {};
  
  var query = "DELETE FROM bill WHERE (bill_id='" + msg.bill_id + "')";
  var connection = connect();
  console.log("deleting a bill");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success bill deleted";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function deletedriver_response(msg, callback) {
  var res = {};
  
  var query = "DELETE FROM drivers WHERE (driver_id='" + msg.driver_id + "')";
  var connection = connect();
  console.log("deleting a driver");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success driver deleted";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function deletecustomer_response(msg, callback) {
  var res = {};
  
  var query = "DELETE FROM customers WHERE (customer_id='" + msg.customer_id + "')";
  var connection = connect();
  console.log("deleting a customer");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success customer deleted";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};


function driverStat_response(msg, callback) {
	var res = {};
	
	 var query = "SELECT date,COUNT(ride_id) as rides FROM ride WHERE driver_id='"+msg.driver_id+"' GROUP BY date ";
  var connection = connect();
  console.log("get driver stat");
  
  connection.query(query, function(err, results) {
	if (err) {
	  console.log("ERROR:" + err.message);
	  callback(null, res);
	}
	else {
	  if (results.length !== 0)

	  {
		res.code = "200";
		res.value = "Success chart destination request";
		res.details = results;
		console.log(results);
		callback(null, res);
	  }
	}
	
  });
  
};

function customerStat_response(msg, callback) {
	 	var res = {};
	 	
	 	 var query = "SELECT date,COUNT(ride_id) as rides FROM ride WHERE customer_id='"+msg.customer_id+"' GROUP BY date ";
	   var connection = connect();
	   console.log("get customer stat");
	   
	   connection.query(query, function(err, results) {
	 	if (err) {
	 	  console.log("ERROR:" + err.message);
	 	  callback(null, res);
	 	}
	 	else {
	 	  if (results.length !== 0)

	 	  {
	 		res.code = "200";
	 		res.value = "Success chart destination request";
	 		res.details = results;
	 		console.log(results);
	 		callback(null, res);
	 	  }
	 	}
	 	
	   });
	   
	 };

exports.customerStat_response=customerStat_response;		 
exports.driverStat_response=driverStat_response;	

exports.deletecustomer_response = deletecustomer_response;
exports.searchcustomer_response = searchcustomer_response;
exports.deletedriver_response = deletedriver_response;
exports.deletebill_response = deletebill_response;
exports.cancelride_response = cancelride_response;
exports.updatebill_response = updatebill_response;
exports.searchbill_response = searchbill_response;
exports.pay_response = pay_response;
exports.searchdriver_response = searchdriver_response;
exports.bill_response = bill_response;
exports.endride_response = endride_response;
exports.distance_response = distance_response;
exports.charts_response = charts_response;
exports.charts1_response = charts1_response;
exports.charts2_response = charts2_response;
exports.charts3_response = charts3_response;
exports.getuser_response = getuser_response;
exports.getdriver_response = getdriver_response;
exports.getadmin_request = getadmin_request;
exports.handle_request = handle_request;
exports.getuser_request = getuser_request;
exports.getdriver_request = getdriver_request;
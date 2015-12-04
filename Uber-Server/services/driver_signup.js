/**
 * New node file
 */
var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});

function driver_sign_up(msg, callback) {
  var res = {};
  var message = JSON.parse(msg);
  
  pool
	  .getConnection(function(err, connection) {
	    connection
	        .query(
	            "SELECT * FROM drivers WHERE email ='" + message['email'] + "'",
	            function(err, rows) {
		          if (rows.length == 0) {
		            
		            pool
		                .getConnection(function(err, connection) {
			              var sql = "INSERT INTO `drivers` (`firstname`, `lastname`, `email`, `phone`, `password`, `city`,`address`,`state`,`zipcode`) VALUES (\""
			                  
			                  + message["first_name"]
			                  + "\",\""
			                  + message["last_name"]
			                  + "\",\""
			                  + message["email"]
			                  + "\",\""
			                  + message["phone"]
			                  + "\",\""
			                  + message["password"]
			                  + "\",\""
			                  + message["city"]
			                  + "\",\""
			                  + message["address"]
			                  + "\",\""
			                  + message["state"]
			                  + "\",\""
			                  + message["zipcode"] + "\")";
			              connection.query(sql, function(err, rows) {
			                if (err) {
				              res.code = "401";
				              res.value = "fail";
			                }
			                else {
				              var car_default = {
				                email : message["email"],
				                type : "N/A",
				                door : "N/A",
				                year : "N/A",
				              }

				              connection.query('INSERT INTO cars SET ?', car_default, function(err, rows) {
				              });
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

function store_video(msg, callback) {
  var res = {};
  var message = JSON.parse(msg);
  
  res.code = "200";
  res.value = "success";
  res = JSON.stringify(res);
  callback(null, res);
  
};

exports.driver_sign_up = driver_sign_up;
exports.store_video = store_video;
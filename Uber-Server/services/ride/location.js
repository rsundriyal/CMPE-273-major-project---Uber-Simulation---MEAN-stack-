/**
 * New node file
 */
var moment = require("moment");
var mongo = require("./mongo");
// database name: location
var mongoURL = "mongodb://localhost:27017/location";
var mongo_ride = "mongodb://localhost:27017/uber"

var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'uber',
  port : 3306
});

function getAllTripsPositionInfo(msg, callback) {
  var res = {};
  mongo.connect(mongoURL, function() {
	var coll = mongo.collection('allTrips');
	coll.find({}).toArray(function(err, docs) {
	  if (docs.length == 0) {
		res.code = "401";
		res.value = "No music found";
	  }
	  else {
		res.code = "200"
		res.value = JSON.stringify(docs);
	  }
	  
	  res = JSON.stringify(res);
	  callback(null, res);
	});
  });
}

function getTenMilesDriver(msg, callback) {
  // 10mile = 16093m
  var distance = 16093;
  var res = {};
  var message = JSON.parse(msg);
  mongo.connect(mongoURL, function() {
	var coll = mongo.collection('driversLocation');
	
	coll.find({
	  "location" : {
		$near : {
		  $geometry : {
		    type : "Point",
		    coordinates : [ (message["lon"] * 1).toFixed(3) * 1, (message["lan"] * 1).toFixed(4) * 1, ]
		  },
		  $maxDistance : distance
		}
	  }
	}).toArray(function(err, docs) {
	  if (err) {
		console.log(err);
	  }
	  
	  if (docs.length == 0) {
		res.code = "401";
		res.value = "No driver found";
	  }
	  else {
		res.code = "200"
		res.value = JSON.stringify(docs);
	  }
	  
	  res = JSON.stringify(res);
	  callback(null, res);
	});
  });
}

function getDriverInfo(msg, callback) {
  var res = {};
  var message = JSON.parse(msg);
  
  pool.getConnection(function(err, connection) {
	connection.query("SELECT * FROM drivers WHERE driver_id ='" + message["driver_id"] + "'", function(err, rows) {
	  if (err) {
		res.code = "401";
		res.value = "fail";
		throw err;
	  }
	  else {
		res.code = "200";
		res.value = rows;
	  }
	  res = JSON.stringify(res);
	  callback(null, res);
	  connection.release();
	});
  });
  
}

function selectDriver(msg, callback) {
  var res = {};
  var message = JSON.parse(msg);
  var time = moment().format("MMMM Do YYYY");
  var time1 = moment().format();
  var info = {
	driver_id : message.driver_id,
	customer_id : message.customer_id,
	date : time,
	time : time1
  };
  
  pool.getConnection(function(err, connection) {
	connection.query("INSERT INTO ride SET ?", info, function(err, rows) {
	  if (err) {
		console.log("error");
		throw err;
	  }
	  else {
		connection.query("SELECT ride_id FROM ride WHERE customer_id='" + message.customer_id + "'AND time='" + time1
		    + "'", function(err, ride) {
		  if (err) {
			console.log(err);
		  }
		  res.code = "200";
		  res.value = ride[0].ride_id;
		  res = JSON.stringify(res);
		  console.log(res);
		  callback(null, res);
		  connection.release();
		});
		
	  }
	  
	});
  });
  
}

exports.selectDriver = selectDriver;
exports.getAllTripsPositionInfo = getAllTripsPositionInfo;
exports.getTenMilesDriver = getTenMilesDriver;
exports.getDriverInfo = getDriverInfo;
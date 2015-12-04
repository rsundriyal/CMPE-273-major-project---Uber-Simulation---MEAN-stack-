var express = require('express');
var ejs = require("ejs");
var mq_client = require('../rpc/client');
var moment = require('moment');
var geocoderProvider = 'google';
var httpAdapter = 'http';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var extra = {
  apiKey : 'AIzaSyDLN10Y7l6Kep2CDus1X5Uf7ITUvFbMLgI', // for Mapquest, OpenCage,
  // Google Premier
  formatter : null
// 'gpx', 'string', ...
};

var distance = require('google-distance');

function user_request(req, res) {
  var username = req.session.username;
  
  var msg_payload = {};
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('getuserrequest_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid request");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid Login");
		res.send({
		  "friends" : "Fail"
		});
	  }
	}
  });
}

function driver_request(req, res) {
  
  var msg_payload = {};
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('getdriverrequest_queue', msg_payload, function(err, results) {
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid driver request");
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid driver");
		res.send({
		  "driver" : "fail"
		});
	  }
	}
  });
}

function admin_details(req, res) {
  
  var msg_payload = {};
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('getadminrequest_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid admin details");
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid admin details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}

function driver_response(email, value) {
  
  var msg_payload = {};
  var msg_payload = {
	"email" : email,
	"value" : value
  };
  
  mq_client.make_request('getdriverresponse_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid driver response");
		res.render("driver_request");
		
	  }
	  else {
		
		console.log("Invalid driver response");
		res.send({
		  "driver" : "fail"
		});
	  }
	}
  });
}

function user_response(email, value) {
  
  var msg_payload = {
	"email" : email,
	"value" : value
  };
  
  mq_client.make_request('getuserresponse_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid user response");
		
		res.render("user_request");
		
	  }
	  else {
		
		console.log("Invalid driver response");
		res.send({
		  "driver" : "fail"
		});
	  }
	}
  });
}

function distance_response(req, res) {
  var dat = moment().format('L');
  var start_time = moment().format('HH:mm:ss');
  var msg_payload = {
	"source1" : req.body.source_lat,
	"source2" : req.body.source_lon,
	"destination1" : req.body.destination_lat,
	"destination2" : req.body.destination_lon,
	"distance" : req.body.distance,
	"start_time" : start_time,
	"origin" : req.body.source_location,
	"destination" : req.body.destination_location,
	"ride_id" : req.session.ride_id
  };
  mq_client.make_request('putdistance_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid start ride");
		res.render("map");
	  }
	  else {
		console.log("Invalid ride response");
		res.send({
		  "driver" : "fail"
		});
	  }
	}
  });
}

function charts1(req, res) {
  
  var msg_payload = {};
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('charts1_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid admin details");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid date details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}

function charts2(req, res) {
  
  var msg_payload = {};
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('charts2_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid origin details");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid admin details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}

function charts(req, res) {
  
  var msg_payload = {};
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('charts_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid admin details");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid admin details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}
function charts3(req, res) {
  
  var msg_payload = {};
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('charts3_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid destination details");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid admin details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}

function end_ride(req, res) {
  
  var end_time = moment().format('h:mm:ss a');
  
  var msg_payload = {
	"endtime" : end_time,
	"ride_id" : req.session.ride_id
  };
  mq_client.make_request('endriderequest_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid end ride request");
		
		res.render("bill");
		
	  }
	  else {
		
		console.log("Invalid end ride");
		res.send({
		  "end ride" : "Fail"
		});
	  }
	}
  });
}

function bill_request(req, res) {
  
  var msg_payload = {
	"ride_id" : req.session.ride_id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('billrequest_queue', msg_payload, function(err, results) {
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid bill details");
		console.log(results.value);
		console.log(results.value.start_time);
		res.send(results.value[0]);
	  }
	  else {
		
		console.log("Invalid admin details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}

function ride_history(req, res) {
  
  var msg_payload = {
	"ride_id" : req.session.ride_id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('billrequest_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid stat details");
		console.log(JSON.stringify(results.details));
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid admin details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}

function weird(req, res) {
  
  var dat = req.body.date;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var distance = req.body.distance;
  var price = req.body.price;
  var origin = req.body.origin;
  var destination = req.body.destination;
  var msg_payload = {
	"date" : dat,
	"start_time" : start_time,
	"end_time" : end_time,
	"distance" : distance,
	"price" : price,
	"origin" : origin,
	"destination" : destination,
	"ride_id" : req.session.ride_id
  };
  console.log("paying bill");
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('paid_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		
		console.log("valid request");
		res.end(JSON.stringify(results));
		console.log("y does it come here");
		
	  }
	  else {
		
		console.log("Invalid payment");
		res.send({
		  "end ride" : "Fail"
		});
	  }
	}
  });
  
}

function updatepay(req, res) {
  
  var msg_payload = {};
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('updatepay_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("its here");
		res.render("review", {
		  title : "review"
		});
		
	  }
	  else {
		
		console.log("Invalid payment update");
		
		callback();
	  }
	  
	}
	
  });
  
}

function search_driver(req, res) {
  
  var id = req.param("driver_id");
  console.log("iiidddd" + id);
  var msg_payload = {
	"driver_id" : id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('searchdriver_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid driver details");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid admin details");
		res.send({
		  "admin details" : "Fail"
		});
	  }
	}
  });
}

function search_bill(req, res) {
  
  var id = req.param("bill_id");
  console.log("iiidddd" + id);
  var msg_payload = {
	"bill_id" : id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('searchbill_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid bill details");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid bill details");
		res.send({
		  "bill details" : "Fail"
		});
	  }
	}
  });
}

function search_customer(req, res) {
  
  var id = req.param("customer_id");
  console.log("iiidddd" + id);
  var msg_payload = {
	"customer_id" : id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('searchcustomer_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid customer  details");
		
		res.end(JSON.stringify(results.details));
		
	  }
	  else {
		
		console.log("Invalid customer details");
		res.send({
		  "bill details" : "Fail"
		});
	  }
	}
  });
}

function cancel_ride(req, res) {
  
  var msg_payload = {
	"ride_id" : req.session.ride_id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('cancelride_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid cancel ride details");
		
		res.render("takeRide");
		
	  }
	  else {
		
		console.log("Invalid cancel ride details");
		res.send({
		  "cancel ride" : "Fail"
		});
		
	  }
	  
	}
  });
}

function delete_bill(req, res) {
  var id = req.param("bill_id");
  var msg_payload = {
	"bill_id" : id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('deletebill_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid delete bill");
		
		res.render("adminsearch");
		
	  }
	  else {
		
		console.log("Invalid delete bill details");
		res.send({
		  "delete bill" : "Fail"
		});
		
	  }
	  
	}
  });
}

function delete_driver(req, res) {
  var id = req.param("driver_id");
  var msg_payload = {
	"driver_id" : id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('deletedriver_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid delete driver bill");
		
		res.render("adminsearch");
		
	  }
	  else {
		
		console.log("Invalid delete driver details");
		res.send({
		  "delete bill" : "Fail"
		});
		
	  }
	  
	}
  });
}

function delete_customer(req, res) {
  var id = req.param("customer_id");
  var msg_payload = {
	"customer_id" : id
  };
  
  // console.log("In POST Request = UserName:"+ username+" group");
  
  mq_client.make_request('deletecustomer_queue', msg_payload, function(err, results) {
	
	if (err) {
	  throw err;
	}
	else {
	  if (results.code == 200) {
		console.log("valid delete customer");
		
		res.render("adminsearch");
		
	  }
	  else {
		
		console.log("Invalid delete customer details");
		res.send({
		  "delete bill" : "Fail"
		});
		
	  }
	  
	}
  });
}

function driverStat(req, res) {
	  
	var id=req.param("driver_id");
	  var msg_payload = {"driver_id":id};
	  
	  // console.log("In POST Request = UserName:"+ username+" group");
	  
	  mq_client.make_request('driverStat_queue', msg_payload, function(err, results) {
		
		console.log(results);
		if (err) {
		  throw err;
		}
		else {
		  if (results.code == 200) {
			console.log("valid destination details");
			console.log(results.details);
			res.end(JSON.stringify(results.details));
			
		  }
		  else {
			
			console.log("Invalid admin details");
			res.send({
			  "admin details" : "Fail"
			});
		  }
		}
	  });
	}


function customerStat(req, res) {
	  
	var id=req.param("customer_id");
	  var msg_payload = {"customer_id":id};
	  
	  // console.log("In POST Request = UserName:"+ username+" group");
	  
	  mq_client.make_request('customerStat_queue', msg_payload, function(err, results) {
		
		console.log(results);
		if (err) {
		  throw err;
		}
		else {
		  if (results.code == 200) {
			console.log("valid customer details");
			console.log(results.details);
			res.end(JSON.stringify(results.details));
			
		  }
		  else {
			
			console.log("Invalid customer details");
			res.send({
			  "admin details" : "Fail"
			});
		  }
		}
	  });
	}

exports.customerStat=customerStat;
exports.driverStat=driverStat;

exports.delete_customer = delete_customer;
exports.search_customer = search_customer;
exports.delete_driver = delete_driver;
exports.delete_bill = delete_bill;
exports.cancel_ride = cancel_ride;
exports.search_bill = search_bill;
exports.updatepay = updatepay;
exports.weird = weird;
exports.ride_history = ride_history;
exports.bill_request = bill_request;
exports.end_ride = end_ride;
exports.distance_response = distance_response;
exports.search_driver = search_driver;
exports.charts1 = charts1;
exports.charts2 = charts2;
exports.charts3 = charts3;
exports.charts = charts;
exports.user_response = user_response;
exports.user_request = user_request;
exports.driver_request = driver_request;
exports.admin_details = admin_details;
exports.driver_response = driver_response;

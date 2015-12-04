var amqp = require('amqplib/callback_api');
var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'd6F3Efeq';
var fs = require('fs');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var db = new mongo.Db('customer_image', new mongo.Server("127.0.0.1", 27017));
db.open(function(err) {
  if (err) return handleError(err);
  var gfs = Grid(db, mongo);
  // all set!
});
var gfs = Grid(db, mongo);
function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
exports.showCustomerSignin = function(req, res) {
  res.render('customerSignin');
};
exports.showCustomerSignup = function(req, res) {
  res.render('customerSignup');
};
exports.registration = function(req, res) {
  var email = req.param("email");
  var pass = req.param("password");
  var firstname = req.param("firstname");
  var lastname = req.param("lastname");
  var phone = req.param("phone");
  var address = req.param("address");
  var city = req.param("city");
  var state = req.param("state");
  var zipcode = req.param("zipcode");
  var creditcard = req.param("creditcard");
  var cvv = req.param("cvv");
  var creditcard_month = req.param("creditcard_month");
  var creditcard_year = req.param("creditcard_year");
  
  var cipher_signup = crypto.createCipher(algorithm, password);
  var crypted_signup = cipher_signup.update(pass, 'utf8', 'hex');
  crypted_signup += cipher_signup.final('hex');
  
  var message = {
	"email" : email,
	"password" : crypted_signup,
	"firstname" : firstname,
	"lastname" : lastname,
	"phone" : phone,
	"address" : address,
	"city" : city,
	"state" : state,
	"zipcode" : zipcode,
	"creditcard" : creditcard,
	"cvv" : cvv,
	"creditcard_month" : creditcard_month,
	"creditcard_year" : creditcard_year,
  };
  message = JSON.stringify(message);
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  ch.assertQueue('', {
		exclusive : true
	  }, function(err, q) {
		var corr = generateUuid();
		ch.consume(q.queue, function(msg) {
		  if (msg.properties.correlationId == corr) {
			var message = JSON.parse(msg.content.toString());
			if (message.code == 200) {
			  res.render('customerSignin');
			}
			else {
			  res.render('customerReSigninPage');
			}
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		
		ch.sendToQueue('customer_signup', new Buffer(message), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
  
};
exports.customerSignin = function(req, res) {
  var email = req.param("email");
  var pass = req.param("password");
  
  var cipher_signin = crypto.createCipher(algorithm, password);
  var crypted_signin = cipher_signin.update(pass, 'utf8', 'hex');
  crypted_signin += cipher_signin.final('hex');
  var customer_signin_info = {
	"email" : email,
	"password" : crypted_signin
  };
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  ch.assertQueue('', {
		exclusive : true
	  }, function(err, q) {
		var corr = generateUuid();
		ch.consume(q.queue, function(msg) {
		  if (msg.properties.correlationId == corr) {
			var message = JSON.parse(msg.content.toString());
			if (message.code == "200") {
			  req.session.customer_id = message.value.customer_id;
			  req.session.customer_email = message.value.email;
			  req.session.customer_firstname = message.value.firstname;
			  req.session.customer_lastname = message.value.lastname;
			}
			res.send(message);
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("customer_signin", new Buffer(JSON.stringify(customer_signin_info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.getCustomerInfo = function(req, res) {
  var customer_id = req.param("customer_id");
  var info = {
	"email" : req.session.customer_email,
	"customer_id" : customer_id
  };
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  ch.assertQueue('', {
		exclusive : true
	  }, function(err, q) {
		var corr = generateUuid();
		ch.consume(q.queue, function(msg) {
		  if (msg.properties.correlationId == corr) {
			var message = JSON.parse(msg.content.toString());
			res.send(message);
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("customer_info", new Buffer(JSON.stringify(info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.customerHomepage = function(req, res) {
  res.render('customerHomepage');
};
exports.customerUpload = function(req, res) {
  res.render('customerUpload');
  
};
exports.customer_upload_image = function(req, res) {
  
  gfs.exist({
	filename : req.session.customer_email + "-image"
  }, function(err, found) {
	if (err) return handleError(err);
	if (found) {
	  gfs.remove({
		filename : req.session.customer_email + "-image"
	  }, function(err) {
		if (err) return handleError(err);
		var item = req.files;
		var writestream = gfs.createWriteStream({
		  filename : req.session.customer_email + "-image"
		});
		fs.createReadStream(item.image.path).pipe(writestream);
		res.render("customerUpload");
	  });
	}
	else {
	  var item = req.files;
	  var writestream = gfs.createWriteStream({
		filename : req.session.customer_email + "-image"
	  });
	  fs.createReadStream(item.image.path).pipe(writestream);
	  res.render("customerUpload");
	}
  });
  
};
exports.customer_getimage = function(req, res) {
  gfs.exist({
	filename : req.session.customer_email + "-image"
  }, function(err, found) {
	if (err) return handleError(err);
	if (found) {
	  var readstream = gfs.createReadStream({
		filename : req.session.customer_email + "-image"
	  });
	  
	  readstream.on('error', function(err) {
		throw err;
	  });
	  
	  readstream.pipe(res);
	}
	else {
	  // 没有找到视频
	  res.send("no such file");
	}
	
  });
}
exports.takeRide = function(req, res) {
  res.render('takeRide');
};
exports.updateCreditcard = function(req, res) {
  var creditcard = req.param("creditcard");
  var creditcard_month = req.param("month");
  var creditcard_year = req.param("year");
  var car_info = {
	"email" : req.session.email,
	"creditcard" : creditcard,
	"creditcard_month" : creditcard_month,
	"creditcard_year" : creditcard_year,
  };
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  ch.assertQueue('', {
		exclusive : true
	  }, function(err, q) {
		var corr = generateUuid();
		ch.consume(q.queue, function(msg) {
		  if (msg.properties.correlationId == corr) {
			var message = JSON.parse(msg.content.toString());
			res.send(message);
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("update_creditcard", new Buffer(JSON.stringify(car_info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
  
};
exports.getBillImg = function(req, res) {
  var driver_email = req.param("driver_email");
  gfs.exist({
	filename : driver_email + "-image"
  }, function(err, found) {
	if (err) return handleError(err);
	if (found) {
	  var readstream = gfs.createReadStream({
		filename : driver_email + "-image"
	  });
	  
	  readstream.on('error', function(err) {
		console.log('An error occurred!', err);
		throw err;
	  });
	  
	  readstream.pipe(res);
	}
	else {
	  // 没有找到视频
	  res.send("no such file");
	}
	
  });
};
exports.payment = function(req, res) {
  var ride_id = req.param("ride_id");
  var driver_id = req.param("driver_id");
  var customer_id = req.param("customer_id");
  var start_time = req.param("start_time");
  var end_time = req.param("end_time");
  var distance = req.param("distance");
  var price = req.param("price");
  var origin = req.param("origin");
  var destination = req.param("destination");
  var date = req.param("date");
  
  var bill_info = {
	"ride_id" : ride_id,
	"driver_id" : driver_id,
	"customer_id" : customer_id,
	"start_time" : start_time,
	"end_time" : end_time,
	"distance" : distance,
	"price" : price,
	"origin" : origin,
	"destination" : destination,
	"date" : date,
  };
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  ch.assertQueue('', {
		exclusive : true
	  }, function(err, q) {
		var corr = generateUuid();
		ch.consume(q.queue, function(msg) {
		  if (msg.properties.correlationId == corr) {
			var message = JSON.parse(msg.content.toString());
			res.send(message);
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("payment", new Buffer(JSON.stringify(bill_info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.review = function(req, res) {
  var rating = req.param("rating");
  var review = req.param("review");
  var driver_id = req.param("driver_id");
  var customer_name = req.param("customer_name");
  var review_info = {
	"driver_id" : driver_id,
	"rating" : rating,
	"review" : review,
	"customer_name" : customer_name
  };
  console.log("review " + review_info);
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  ch.assertQueue('', {
		exclusive : true
	  }, function(err, q) {
		var corr = generateUuid();
		ch.consume(q.queue, function(msg) {
		  if (msg.properties.correlationId == corr) {
			var message = JSON.parse(msg.content.toString());
			res.send();
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("customer_review", new Buffer(JSON.stringify(review_info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.ride_history = function(req, res) {
  var info = {
	"customer_id" : req.session.customer_id
  }
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  ch.assertQueue('', {
		exclusive : true
	  }, function(err, q) {
		var corr = generateUuid();
		ch.consume(q.queue, function(msg) {
		  if (msg.properties.correlationId == corr) {
			var message = JSON.parse(msg.content.toString());
			res.send(message);
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("customer_ride_history", new Buffer(JSON.stringify(info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.getPage = function(req, res) {
  res.render("customerRideHistory");
};
exports.logout = function(req, res) {
  req.session.destroy();
  res.render('welcomePage');
};
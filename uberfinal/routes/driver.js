/**
 * New node file
 */
var amqp = require('amqplib/callback_api');
var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'd6F3Efeq';
var fs = require('fs');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var db = new mongo.Db('driver_video_and_image', new mongo.Server("127.0.0.1", 27017));
db.open(function(err) {
  if (err) return handleError(err);
  var gfs = Grid(db, mongo);
  // all set!
});
var gfs = Grid(db, mongo);
function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
exports.sign_up_page = function(req, res) {
  res.render('driverSignUp', {
	title : 'Sign Up'
  });
};
exports.showDriverSignIn = function(req, res) {
  res.render('driverSignIn');
};

exports.registration = function(req, res) {
  var first_name = req.param("first_name");
  var last_name = req.param("last_name");
  var email = req.param("email");
  var phone = req.param("phone");
  var pass = req.param("password");
  var city = req.param("city");
  var state = req.param("state");
  var address = req.param("address");
  var zipcode = req.param("zipcode");
  
  var cipher_signup = crypto.createCipher(algorithm, password);
  var crypted_signup = cipher_signup.update(pass, 'utf8', 'hex');
  crypted_signup += cipher_signup.final('hex');
  
  var message = {
	"first_name" : first_name,
	"last_name" : last_name,
	"email" : email,
	"password" : crypted_signup,
	"phone" : phone,
	"city" : city,
	"state" : state,
	"address" : address,
	"zipcode" : zipcode
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
			if (JSON.parse(msg.content.toString()).code == '200') {
			  res.render('driverSignIn');
			}
			else {
			  res.render('driverErrorPage');
			}
			
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		
		ch.sendToQueue('driver_sign_up', new Buffer(message), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};

exports.driverSignIn = function(req, res) {
  var email = req.param("email");
  var pass = req.param("password");
  var cipher_signin = crypto.createCipher(algorithm, password);
  var crypted_signin = cipher_signin.update(pass, 'utf8', 'hex');
  crypted_signin += cipher_signin.final('hex');
  var driver_signin_info = {
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
			  req.session.driver_id = message.value.driver_id;
			  req.session.email = message.value.email;
			  req.session.firstname = message.value.firstname;
			  req.session.lastname = message.value.lastname;
			  res.render("driverHomepage", {
				driver_id : req.session.driver_id
			  });
			}
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("driver_signin", new Buffer(JSON.stringify(driver_signin_info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.updateCar = function(req, res) {
  var type = req.param("type");
  var door = req.param("door");
  var year = req.param("year");
  var car_info = {
	"email" : req.session.email,
	"type" : type,
	"door" : door,
	"year" : year,
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
		ch.sendToQueue("update_car", new Buffer(JSON.stringify(car_info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
  
};
exports.driverHomepage = function(req, res) {
  res.render('driverHomepage', {
	driver_id : req.session.driver_id
  });
};
exports.getDriverInfo = function(req, res) {
  var driver_id = req.param("driver_id");
  var info = {
	"email" : req.session.email,
	"driver_id" : driver_id
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
		ch.sendToQueue("driver_info", new Buffer(JSON.stringify(info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.getCarInfo = function(req, res) {
  
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
		ch.sendToQueue("car_info", new Buffer(req.session.email), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};

exports.driverIntroduction = function(req, res) {
  res.render('driverIntroduction', {
	title : 'Introdcution Video'
  });
  
};
exports.getVideo = function(req, res) {
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
		ch.sendToQueue("driver_introduction_video", new Buffer(req.session.email), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.upload_video = function(req, res) {
  
  gfs.exist({
	filename : req.session.email + "-video"
  }, function(err, found) {
	if (err) return handleError(err);
	if (found) {
	  gfs.remove({
		filename : req.session.email + "-video"
	  }, function(err) {
		if (err) return handleError(err);
		var item = req.files;
		var writestream = gfs.createWriteStream({
		  filename : req.session.email + "-video"
		});
		fs.createReadStream(item.image.path).pipe(writestream);
		res.render("driverUpload");
	  });
	}
	else {
	  var item = req.files;
	  var writestream = gfs.createWriteStream({
		filename : req.session.email + "-video"
	  });
	  fs.createReadStream(item.video.path).pipe(writestream);
	  res.render("driverUpload");
	}
  });
  
};

exports.upload_image = function(req, res) {
  
  gfs.exist({
	filename : req.session.email + "-image"
  }, function(err, found) {
	if (err) return handleError(err);
	if (found) {
	  gfs.remove({
		filename : req.session.email + "-image"
	  }, function(err) {
		if (err) return handleError(err);
		var item = req.files;
		var writestream = gfs.createWriteStream({
		  filename : req.session.email + "-image"
		});
		fs.createReadStream(item.image.path).pipe(writestream);
		res.render("driverUpload");
	  });
	}
	else {
	  var item = req.files;
	  
	  var writestream = gfs.createWriteStream({
		filename : req.session.email + "-image"
	  });
	  fs.createReadStream(item.image.path).pipe(writestream);
	  res.render("driverUpload");
	}
  });
  
};

exports.get_image = function(req, res) {
  gfs.exist({
	filename : req.session.email + "-image"
  }, function(err, found) {
	if (err) return handleError(err);
	if (found) {
	  var readstream = gfs.createReadStream({
		filename : req.session.email + "-image"
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
}
exports.get_video = function(req, res) {
  // gfs.exist check whether the file is exist
  gfs.exist({
	filename : req.session.email + "-video"
  }, function(err, found) {
	if (err) return handleError(err);
	if (found) {
	  var readstream = gfs.createReadStream({
		filename : req.session.email + "-video"
	  });
	  
	  readstream.on('error', function(err) {
		console.log('An error occurred!', err);
		throw err;
	  });
	  
	  readstream.pipe(res);
	}
	else {
	  // use default image or video
	  res.send("no such file");
	}
  });
}

exports.driverUpload = function(req, res) {
  res.render('driverUpload');
  
};
exports.getPage = function(req, res) {
  res.render("driverRideHistory");
};
exports.ride_history = function(req, res) {
  var info = {
	"driver_id" : req.session.driver_id
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
		ch.sendToQueue("driver_ride_history", new Buffer(JSON.stringify(info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
exports.showAdminSignin = function(req, res) {
  res.render('adminSignin');
};

exports.adminSignin = function(req, res) {
  var email = req.param("email");
  var pass = req.param("password");
  var admin_signin_info = {
	"email" : email,
	"password" : pass
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
			  res.render("admin");
			}
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		ch.sendToQueue("admin_signin", new Buffer(JSON.stringify(admin_signin_info)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};
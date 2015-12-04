/**
 * New node file
 */
var amqp = require('amqplib/callback_api');
var distance = require('google-distance');
exports.getDistance = function(req, res) {
  var o = req.param('origin');
  var d = req.param('destination');
  
  distance.get({
	origin : o,
	destination : d
  }, function(err, data) {
	res.send(data);
	
  });
};

exports.getAllTrips = function(req, res) {
  var message = {
	"task" : "getAllTripsInfo"
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
			res.send(msg.content.toString());
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		
		ch.sendToQueue('allTrips', new Buffer(message), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};

exports.getTenMilesDrivers = function(req, res) {
  var lan = req.param("lan");
  var lon = req.param("lon");
  var message = {
	"lan" : lan,
	"lon" : lon
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
			res.send(msg.content.toString());
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		
		ch.sendToQueue('getTenMilesDrivers', new Buffer(message), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};

exports.getDriverInfo = function(req, res) {
  var id = req.param("id");
  var message = {
	"driver_id" : id
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
			res.send(msg.content.toString());
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		
		ch.sendToQueue('getDriverInfo', new Buffer(message), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
}

exports.selectDriver = function(req, res) {
  var driver_id = req.param("id");
  req.session.choosenDriverId = driver_id;
  // send a message to the selected driver
  var message = {
	"driver_id" : driver_id,
	"customer_id" : req.session.customer_id
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
			req.session.ride_id = JSON.parse(msg.content.toString()).value;
			console.log("aaaaaaaaaaaaaaaaaaaa" + req.session.ride_id);
			res.send(JSON.parse(msg.content.toString()));
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		
		ch.sendToQueue('selectDriver', new Buffer(message), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
};

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
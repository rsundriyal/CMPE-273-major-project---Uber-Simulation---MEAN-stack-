var mongo = require("./services//mongo");
// database name: location
var mongoURL = "mongodb://localhost:27017/location";
var l, ln, lat, lng;

var amqp = require('amqplib/callback_api');
var amqp1 = require('amqp')
var customer_signup = require('./services/customer/customer_signup');
var update_creditcard = require('./services/customer/update_creditcard');
var customer_signin = require('./services/customer/customer_signin');
var customer_info = require('./services/customer/customer_info');
var customer_review = require('./services/customer/customer_review');
var customer_ride_history = require('./services/customer/customer_ride_history');
var driver_ride_history = require('./services/driver_ride_history');
var payment = require('./services/customer/payment');
var driver_signup = require('./services/driver_signup');
var notifyDriver = require('./services/notifyDriver');
var driver_introduction_video = require('./services/driver_introduction_video');
var driver_signin = require('./services/driver_signin');
var admin_signin = require('./services/admin_signin');
var driver_info = require('./services/driver_info');
var car_info = require('./services/car_info');
var update_car = require('./services/update_car');
var location = require('./services/ride/location');
amqp.connect('amqp://localhost', function(err, conn) {
  // for (var i = 0; i < 100; i++) {
  // l = Math.floor(Math.random() * (37747 - 37464 + 1)) + 37464;
  // lat = l / 1000;
  // ln = Math.floor(Math.random() * (122153 - 121774 + 1)) + 121774;
  // lng = 0 - ln / 1000;
  // console.log(lng, " " + lat);
  // mongo.connect(mongoURL, (function(lat, lng, i) {
  // return function() {
  // var coll = mongo.collection('driversLocation');
  // coll.insertOne({
  // driver_id : i,
  // location : {
  // type : "Point",
  // coordinates : [ lng, lat ]
  // }
  // });
  // };
  // })(lat, lng, i), false);
  // }
  console.log("RabbitMQ Running");
  conn.createChannel(function(err, ch) {
	var q = 'driver_sign_up';
	ch.assertQueue(q, {
	  durable : false
	});
	ch.prefetch(1);
	ch.consume(q, function reply(msg) {
	  driver_signup.driver_sign_up(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
		ch.ack(msg);
	  });
	});
  });
  
  conn.createChannel(function(err, ch) {
	var q = 'driver_ride_history';
	ch.assertQueue(q, {
	  durable : false
	});
	ch.prefetch(1);
	ch.consume(q, function reply(msg) {
	  driver_ride_history.driver_ride_history(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
		ch.ack(msg);
	  });
	});
  });
  
  conn.createChannel(function(err, ch) {
	var q = 'customer_ride_history';
	ch.assertQueue(q, {
	  durable : false
	});
	ch.prefetch(1);
	ch.consume(q, function reply(msg) {
	  customer_ride_history.customer_ride_history(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
		ch.ack(msg);
	  });
	});
  });
  
  conn.createChannel(function(err, ch) {
	var q = 'notifyDriver';
	ch.assertQueue(q, {
	  durable : false
	});
	ch.prefetch(1);
	ch.consume(q, function reply(msg) {
	  notifyDriver.notifyDriver(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
		ch.ack(msg);
	  });
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("customer_signup", {
	  durable : false
	});
	
	ch.consume("customer_signup", function reply(msg) {
	  customer_signup.customer_signup(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("driver_info", {
	  durable : false
	});
	
	ch.consume("driver_info", function reply(msg) {
	  driver_info.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("customer_info", {
	  durable : false
	});
	ch.consume("customer_info", function reply(msg) {
	  customer_info.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("customer_review", {
	  durable : false
	});
	ch.consume("customer_review", function reply(msg) {
	  customer_review.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("update_car", {
	  durable : false
	});
	
	ch.consume("update_car", function reply(msg) {
	  update_car.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("update_creditcard", {
	  durable : false
	});
	
	ch.consume("update_creditcard", function reply(msg) {
	  update_creditcard.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("car_info", {
	  durable : false
	});
	
	ch.consume("car_info", function reply(msg) {
	  car_info.handle_request(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("payment", {
	  durable : false
	});
	
	ch.consume("payment", function reply(msg) {
	  payment.handle_request(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("driver_introduction_video", {
	  durable : false
	});
	ch.prefetch(1);
	
	ch.consume("driver_introduction_video", function reply(msg) {
	  driver_introduction_video.handle_request(msg.content.toString(), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("admin_signin", {
	  durable : false
	});
	ch.prefetch(1);
	
	ch.consume("admin_signin", function reply(msg) {
	  admin_signin.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  
  conn.createChannel(function(err, ch) {
	ch.assertQueue("driver_signin", {
	  durable : false
	});
	ch.prefetch(1);
	
	ch.consume("driver_signin", function reply(msg) {
	  driver_signin.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
  });
  conn.createChannel(function(err, ch) {
	ch.assertQueue("customer_signin", {
	  durable : false
	});
	ch.prefetch(1);
	
	ch.consume("customer_signin", function reply(msg) {
	  customer_signin.handle_request(JSON.parse(msg.content.toString()), function(err, res) {
		ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
		  correlationId : msg.properties.correlationId
		});
	  });
	  
	  ch.ack(msg);
	});
	
	// ride part
	conn.createChannel(function(err, ch) {
	  var q = 'allTrips';
	  ch.assertQueue(q, {
		durable : false
	  });
	  ch.prefetch(1);
	  ch.consume(q, function reply(msg) {
		location.getAllTripsPositionInfo(msg.content.toString(), function(err, res) {
		  ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
			correlationId : msg.properties.correlationId
		  });
		  ch.ack(msg);
		});
	  });
	});
	
	// channel 2 get all drivers in 10-miles.
	conn.createChannel(function(err, ch) {
	  var q = 'getTenMilesDrivers';
	  ch.assertQueue(q, {
		durable : false
	  });
	  ch.prefetch(1);
	  ch.consume(q, function reply(msg) {
		location.getTenMilesDriver(msg.content.toString(), function(err, res) {
		  ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
			correlationId : msg.properties.correlationId
		  });
		  ch.ack(msg);
		});
	  });
	});
	
	// channel 3 get driver info.
	conn.createChannel(function(err, ch) {
	  var q = 'getDriverInfo';
	  ch.assertQueue(q, {
		durable : false
	  });
	  ch.prefetch(1);
	  ch.consume(q, function reply(msg) {
		location.getDriverInfo(msg.content.toString(), function(err, res) {
		  ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
			correlationId : msg.properties.correlationId
		  });
		  ch.ack(msg);
		});
	  });
	});
	
	// select driver
	conn.createChannel(function(err, ch) {
	  var q = 'selectDriver';
	  ch.assertQueue(q, {
		durable : false
	  });
	  ch.prefetch(1);
	  ch.consume(q, function reply(msg) {
		location.selectDriver(msg.content.toString(), function(err, res) {
		  ch.sendToQueue(msg.properties.replyTo, new Buffer(res), {
			correlationId : msg.properties.correlationId
		  });
		  ch.ack(msg);
		});
	  });
	});
	
  });
  
});

var login = require('./services/login');
// var amqp = require('amqp')
var util = require('util');
var cnn = amqp1.createConnection({
  host : '127.0.0.1'
});

cnn.on('ready', function() {
  console.log("listening on login_queue");
  
  cnn.queue('login_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.handle_request(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('getuserrequest_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.getuser_request(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('getdriverrequest_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.getdriver_request(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('getadminrequest_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.getadmin_request(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('getdriverresponse_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.getdriver_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('getuserresponse_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.getuser_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('charts1_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.charts1_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('charts2_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.charts2_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('charts3_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.charts3_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('charts_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.charts_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('putdistance_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.distance_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('endriderequest_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.endride_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('billrequest_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.bill_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('searchdriver_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.searchdriver_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('searchcustomer_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.searchcustomer_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('deletecustomer_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.deletecustomer_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('paid_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.pay_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('searchbill_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.searchbill_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('updatepay_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.updatebill_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('cancelride_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.cancelride_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('deletebill_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.deletebill_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  
  cnn.queue('deletedriver_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
	  util.log(util.format(deliveryInfo.routingKey, message));
	  util.log("Message: " + JSON.stringify(message));
	  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
	  login.deletedriver_response(message, function(err, res) {
		
		// return index sent
		cnn.publish(m.replyTo, res, {
		  contentType : 'application/json',
		  contentEncoding : 'utf-8',
		  correlationId : m.correlationId
		});
	  });
	});
  });
  cnn.queue('driverStat_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
		  util.log(util.format(deliveryInfo.routingKey, message));
		  util.log("Message: " + JSON.stringify(message));
		  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		  login.driverStat_response(message, function(err, res) {
			
			// return index sent
			cnn.publish(m.replyTo, res, {
			  contentType : 'application/json',
			  contentEncoding : 'utf-8',
			  correlationId : m.correlationId
			});
		  });
		});
	  });
cnn.queue('customerStat_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
		  util.log(util.format(deliveryInfo.routingKey, message));
		  util.log("Message: " + JSON.stringify(message));
		  util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		  login.customerStat_response(message, function(err, res) {
			
			// return index sent
			cnn.publish(m.replyTo, res, {
			  contentType : 'application/json',
			  contentEncoding : 'utf-8',
			  correlationId : m.correlationId
			});
		  });
		});
	  });
});
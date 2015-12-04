var express = require('express'), routes = require('./routes'), home = require('./routes/home'), http = require('http')

// , customerSignup = require('./routes/customerSignup')
// , customerLogin=require('./routes/customerLogin')
, path = require('path');
var amqp = require('amqplib/callback_api');
var getDistance = require('./routes/getDistance');

// URL for the sessions collections in mongoDB
var driver = require('./routes/driver');
var customer = require('./routes/customer');
var ride = require('./routes/ride');
var mq_client = require('./rpc/client');
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
var app = express();
http = http.Server(app);
var io = require('socket.io')(http);

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.methodOverride());

app.use(expressSession({
  secret : 'cmpe273_teststring',
  resave : false, // don't save session if unmodified
  saveUninitialized : false, // don't create session until something stored
  duration : 30 * 60 * 1000,
  activeDuration : 5 * 60 * 1000,
  store : new mongoStore({
	url : mongoSessionConnectURL
  })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/user_request1', home.user_request);
app.get('/admindetails', home.admin_details);
app.get('/user_request', function(req, res) {
  res.render("user_request");
});
app.post('/user_response', function(req, res) {
  home.user_response(req.body.email, req.body.value);
});
app.get('/driver_request1', home.driver_request);

app.post('/driver_response', function(req, res) {
  home.driver_response(req.body.email, req.body.value);
});
app.post('/endride', home.end_ride);

app.post('/put_distance', home.distance_response);
app.get('/driver_request', function(req, res) {
  res.render("driver_request");
});
app.post('/ridehistory', function(req, res) {
  res.render("ridehistory", {
	title : "history"
  });
});
app.get('/ridehistory', home.ride_history);
app.get('/admin', function(req, res) {
  res.render("admin");
});
app.get('/driver', function(req, res) {
  res.render("driverSignIn");
});
app.get('/customer', function(req, res) {
  res.render("customerSignin");
});
app.post('/driver', function(req, res) {
  res.render("userSignin", {
	title : "User"
  });
});
app.get('/charts', home.charts);
app.get('/charts1', home.charts1);
app.get('/charts2', home.charts2);
app.get('/charts3', home.charts3);
//stats
app.post('/stats', function(req, res) {
	  res.render("stats");});
	  app.get('/driverStat', home.driverStat);
	  app.get('/customerStat', home.customerStat);
// revenue
app.post('/revenue', function(req, res) {
  res.render("revenue");
});
// app.get('/revenue', home.revenue);
app.post('/maps', function(req, res) {
  res.render("map");
});
app.get('/selectDestination', function(req, res) {
  res.render("map");
});
app.post('/getDistance', getDistance.getDistance);
// /////////SEARCH
app.post('/search', function(req, res) {
  res.render("adminsearch", {
	title : "Search Page"
  });
});
// ///////////////////BILL
app.get('/bill', home.bill_request);
app.post('/pay', home.weird);
app.post('/review', home.updatepay);
app.post('/cancelride', home.cancel_ride);

// //////////////SEARCH
app.get('/logout', customer.logout);
app.get('/search_driver', home.search_driver);
app.get('/search_bill', home.search_bill);
app.get('/search_customer', home.search_customer);
app.post('/delete_bill', home.delete_bill);
app.post('/delete_driver', home.delete_driver);
app.post('/delete_customer', home.delete_customer);

app.get('/adminSignin', driver.showAdminSignin);
app.post('/adminSignin', driver.adminSignin);
// ///////////////////DRIVER
app.get('/driverSignIn', driver.showDriverSignIn);
app.get('/driverHomepage', driver.driverHomepage);
app.get('/driverIntroduction', driver.driverIntroduction);
app.get('/driverUpload', driver.driverUpload);
app.get('/driverSignUp', driver.sign_up_page);

app.post('/driverSignIn', driver.driverSignIn);
app.post('/driver_registration', driver.registration);
app.post('/getDriverInfo', driver.getDriverInfo);
app.post('/getCarInfo', driver.getCarInfo);
app.post('/getVideo', driver.getVideo);
app.post('/updateCar', driver.updateCar);
app.post('/upload_image', driver.upload_image);
app.post('/upload_video', driver.upload_video);
app.get('/getvideo', driver.get_video);
app.get('/getimage', driver.get_image);
// ///////////////CUSTOMER
app.get('/customerHomepage', customer.customerHomepage);
app.get('/customerSignin', customer.showCustomerSignin);
app.get('/customerSignup', customer.showCustomerSignup);
app.get('/customerUpload', customer.customerUpload);
app.post('/customer_registration', customer.registration);
app.post('/customerSignin', customer.customerSignin);
app.post('/getCustomerInfo', customer.getCustomerInfo);
app.post('/updateCreditcard', customer.updateCreditcard);
app.post('/customer_upload_image', customer.customer_upload_image);
app.get('/customer_getimage', customer.customer_getimage);
app.get('/takeRide', customer.takeRide);
app.post('/payment', customer.payment);
app.post('/customer_review', customer.review);
app.post('/customerRideHistory', customer.ride_history);
app.get('/customerRideHistory', customer.getPage);
app.get('/driverRideHistory', driver.getPage);
app.post('/driverRideHistory', driver.ride_history);

app.post('/getDistance', ride.getDistance);
app.get('/getTenMilesDrivers', ride.getTenMilesDrivers);
app.get('/getDriverInfo', ride.getDriverInfo);
app.post('/selectDriver', ride.selectDriver);

app.get('/test', function(req, res) {
  res.render("testing");
});
io.on('connection', function(socket) {
});

app.get("/notifyDriver", function(req, res) {
  var message = {
	"ride_id" : req.session.ride_id
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
			io.emit(req.session.choosenDriverId, message);
			res.send("success");
			setTimeout(function() {
			  conn.close();
			}, 500);
		  }
		}, {
		  noAck : true
		});
		
		ch.sendToQueue('notifyDriver', new Buffer(JSON.stringify(message)), {
		  correlationId : corr,
		  replyTo : q.queue
		});
	  });
	});
  });
  
});
/*
 * app.get('/customerLogin', customerLogin.customerLogin); app.get('/homepage',
 * about.homepage); app.post('/userSignup', customerSignup.userSignup);
 * app.post('/checkLogin', customerLogin.checkLogin);
 */

mongo.connect(mongoSessionConnectURL, function() {
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
  http.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
  });
});

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
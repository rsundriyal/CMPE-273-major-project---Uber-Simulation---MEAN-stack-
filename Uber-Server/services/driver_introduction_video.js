/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/uber";
function handle_request(msg, callback) {
	var res = {};
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('drivers');
		coll.findOne({
			email : msg
		}, function(err, user) {
			if (user == null) {
				console.log("Get Video Fail");
				res.code = "400";
				res.value = "Cannot Find Video";
			} else {
				console.log("Get Video Success");
				res.code = "200";
				res.value = "video meta data";
			}
			res = JSON.stringify(res);
			callback(null, res);
		});
	});
}

exports.handle_request = handle_request;
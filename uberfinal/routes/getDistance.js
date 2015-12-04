/**
 * New node file
 */
var distance = require('google-distance');
exports.getDistance = function(req, res) {
  var o = req.param('origin');
  var d = req.param('destination');
  distance.get({
	origin : o,
	destination : d
  }, function(err, data) {
	res.send(data);
	console.log(data);
	
  });
};
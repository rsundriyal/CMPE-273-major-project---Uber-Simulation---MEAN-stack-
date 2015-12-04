angular.module('rideApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('rideApp').controller('rideCtrl', function($scope, $http) {
  $http({
	method : "POST",
	url : '/driverRideHistory'
  }).success(function(data) {
	$scope.rides = data.value;
  }).error(function(error) {
  });
});

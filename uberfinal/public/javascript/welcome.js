/**
 * New node file
 */

angular.module('welcome', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('welcome').controller('loginCtrl', function($scope) {
  $scope.rider_log_in = function($event) {
	window.location = "/customer";
  };
  $scope.driver_log_in = function($event) {
	window.location = "/driver";
  };
  $scope.admin_log_in = function($event) {
	window.location = "/adminSignin";
  };
  
});
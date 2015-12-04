angular.module('driverSignInApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('driverSignInApp').controller('driverSignInCtrl', function($scope, $http) {
  $scope.invalid_login = true;
  $scope.driver_signIn = function() {
	$http({
	  method : "POST",
	  url : '/driverSignIn',
	  data : {
	    "email" : $scope.email,
	    "password" : $scope.password
	  }
	}).success(function(data) {
	  
	}).error(function(error) {
	});
  };
  
});

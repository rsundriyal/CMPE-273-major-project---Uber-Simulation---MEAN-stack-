angular.module('customerSignInApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('customerSignInApp').controller('customerSignInCtrl', function($scope, $http) {
  $scope.invalid_login = true;
  $scope.customer_signIn = function() {
	$http({
	  method : "POST",
	  url : '/customerSignin',
	  data : {
	    "email" : $scope.email,
	    "password" : $scope.password
	  }
	}).success(function(data) {
	  if (data.code == "200") {
		window.location.assign("/customerHomepage");
	  }
	  else {
		$scope.invalid_login = false;
		
	  }
	}).error(function(error) {
	});
  };
  
});

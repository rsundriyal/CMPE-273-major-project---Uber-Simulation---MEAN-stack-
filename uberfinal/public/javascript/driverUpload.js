angular.module('driverUploadApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('driverUploadApp').controller('driverUploadCtrl', function($scope, $http) {
  $(":file").filestyle({
	input : false
  });
  $http({
	method : "POST",
	url : '/getDriverInfo',
  }).success(function(data) {
	if (data.code == "200") {
	  $scope.name = data.value.firstname + " " + data.value.lastname;
	  
	}
  }).error(function(error) {
  });
  $scope.driver_upload = function() {
	$http({
	  method : "GET",
	  url : '/driverUpload',
	  data : {
		"introduction_video" : $scope.video,
	  }
	}).success(function(data) {
	  
	}).error(function(error) {
	});
  };
  
});

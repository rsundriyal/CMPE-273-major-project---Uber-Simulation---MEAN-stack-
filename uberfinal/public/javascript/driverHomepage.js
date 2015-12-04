angular.module('driverHomepageApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('driverHomepageApp').controller('driverHomepageCtrl', function($scope, $http) {
  $scope.car_button = true;
  $scope.edit = function() {
	$scope.isDisabled = false;
	$scope.isBordered = true;
	$scope.car_button = false;
  };
  $scope.update_car = function() {
	$http({
	  method : "POST",
	  url : '/updateCar',
	  data : {
	    "type" : $scope.type,
	    "door" : $scope.door,
	    "year" : $scope.year,
	  }
	}).success(function(data) {
	  $scope.car_button = true;
	  window.location.assign("/driverHomepage");
	}).error(function(error) {
	});
  };
  
  $http({
	method : "POST",
	url : '/getDriverInfo',
  }).success(function(data) {
	if (data.code == "200") {
	  $scope.name = data.value.firstname + " " + data.value.lastname;
	  $scope.address = data.value.address + "," + data.value.city + " " + data.value.state + " " + data.value.zip;
	  $scope.phone = data.value.phone;
	  $scope.email = data.value.email;
	  var temp_id = data.value.driver_id.toString();
	  pre_id = "";
	  for (var i = temp_id.length; i < 9; i++) {
		pre_id += "0";
	  }
	  var driver_id = pre_id + temp_id;
	  $scope.id = driver_id;
	}
  }).error(function(error) {
  });
  $http({
	method : "POST",
	url : '/getCarInfo',
  }).success(function(data) {
	if (data.code == "200") {
	  $scope.type = data.value.type;
	  $scope.door = data.value.door;
	  $scope.year = data.value.year;
	}
  }).error(function(error) {
  });
  
});

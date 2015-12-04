angular.module('customerHomepageApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('customerHomepageApp').controller('customerHomepageCtrl', function($scope, $http) {
  $scope.creditcard_button = true;
  $scope.edit = function() {
	$scope.isDisabled = false;
	$scope.isBordered = true;
	$scope.creditcard_button = false;
  };
  $scope.update_creditcard = function() {
	$http({
	  method : "POST",
	  url : '/updateCreditcard',
	  data : {
	    "creditcard" : $scope.creditcard,
	    "year" : $scope.creditcard_year,
	    "month" : $scope.creditcard_month
	  }
	}).success(function(data) {
	  $scope.car_button = true;
	  window.location.assign("/customerHomepage");
	}).error(function(error) {
	});
  };
  
  $http({
	method : "POST",
	url : '/getCustomerInfo',
  }).success(function(data) {
	if (data.code == "200") {
	  $scope.name = data.value.firstname + " " + data.value.lastname;
	  $scope.address = data.value.address + "," + data.value.city + " " + data.value.state + " " + data.value.zipcode;
	  $scope.phone = data.value.phone;
	  $scope.email = data.value.email;
	  $scope.creditcard = data.value.creditcard;
	  $scope.cvv = data.value.cvv;
	  $scope.creditcard_month = data.value.creditcard_month;
	  $scope.creditcard_year = data.value.creditcard_year;
	  var temp_id = data.value.customer_id.toString();
	  pre_id = "";
	  for (var i = temp_id.length; i < 9; i++) {
		pre_id += "0";
	  }
	  var customer_id = pre_id + temp_id;
	  $scope.id = customer_id;
	}
  }).error(function(error) {
  });
  
});

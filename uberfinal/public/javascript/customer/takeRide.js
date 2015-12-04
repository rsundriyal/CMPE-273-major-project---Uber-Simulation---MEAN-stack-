angular.module('takeRideApp', [ 'ngMap' ]);
angular.module('takeRideApp').controller('takeRideCtrl', function(NgMap, $scope, $http) {

	  $http({
			method : "POST",
			url : '/getCustomerInfo',
		  }).success(function(data) {
			if (data.code == "200") {
			  $scope.name = data.value.firstname + " " + data.value.lastname;
//			  $scope.address = data.value.address + "," + data.value.city + " " + data.value.state + " " + data.value.zipcode;
//			  $scope.phone = data.value.phone;
//			  $scope.email = data.value.email;
//			  $scope.creditcard = data.value.creditcard;
//			  $scope.cvv = data.value.cvv;
//			  $scope.creditcard_month = data.value.creditcard_month;
//			  $scope.creditcard_year = data.value.creditcard_year;
//			  var temp_id = data.value.customer_id.toString();
//			  pre_id = "";
//			  for (var i = temp_id.length; i < 9; i++) {
//				pre_id += "0";
//			  }
//			  var customer_id = pre_id + temp_id;
//			  $scope.id = customer_id;
			}
		  }).error(function(error) {
		  });
		  
	
  var lat, lon, current_latlng, current;
  $scope.current = "current-location";
  navigator.geolocation.getCurrentPosition(function(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	current_latlng = new google.maps.LatLng(lat, lon);
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
	  'latLng' : current_latlng
	}, function(results, status) {
	  console.log(results);
	  if (status == google.maps.GeocoderStatus.OK) {
		current = results[0].formatted_address;
		// check your browser console to see your address
	  }
	  
	});
  });
  NgMap.getMap().then(function(map) {
	map.customMarkers.foo.setVisible(false);
	$scope.showCustomMarker = function() {
	  map.customMarkers.foo.setVisible(true);
	  map.customMarkers.foo.setPosition(this.getPosition());
	  $("#driverCard").show();
	  var driver_id = this.id;
	  $("#chooseDriverButton").bind("click", function(e) {
		$http({
		  method : 'POST',
		  url : '/selectDriver?id=' + driver_id
		}).success(function(data, status) {
		  window.location.assign("/selectDestination");
		});
	  });
	  $http({
		method : 'GET',
		url : '/getDriverInfo?id=' + driver_id
	  }).success(function(data, status) {
		$scope.driver_name = data.value[0].firstname + " " + data.value[0].lastname;
	  });
	};
	
	$scope.closeCustomMarker = function() {
	  this.style.display = 'none';
	  $("#driverCard").hide();
	  $("#chooseDriverButton").unbind("click");
	}
  })
  $scope.selectDriver = function(driver_id) {
	console.log(this.id);
	
  };
  
  // getTenMilesDriver
  $scope.getTenMilesDriver = function() {
	$http({
	  method : "get",
	  url : '/getTenMilesDrivers?lan=' + lat + "&lon=" + lon,
	}).success(function(data) {
	  $scope.positions = [];
	  var data = eval("(" + data.value + ")");
	  for (var i = 0; i < data.length; i++) {
		// start and end coordinates
		var point = data[i]["location"]["coordinates"];
		$scope.positions.push({
		  pos : "[" + point[1] + "," + point[0] + "]",
		  id : data[i]["driver_id"]
		});
	  }
	}).error(function(error) {
	});
  };
  
});

angular.module('uber_map', [ 'ngMap' ]);
angular.module('uber_map').controller(
    'uber_ctrl',
    function($scope, $http) {
	  /*
	   * lat is current position latitude, ex.(37.553819) lon is current
	   * position longitude, ex.(-121.97372759999999) current_latlng is the
	   * current coords ex.(37.553819,-121.97372759999999) current is the
	   * current address ex. (Central District, Fremont, CA, USA)
	   */

	  $scope.current = "current-location";
	  var lat, lon, current_latlng, current;
	  // this is the function to get the current position address and coords
	  navigator.geolocation.getCurrentPosition(function(position) {
	    lat = position.coords.latitude;
	    lon = position.coords.longitude;
	    console.log(lat + " " + lon);
	    current_latlng = new google.maps.LatLng(lat, lon);
	    var geocoder = new google.maps.Geocoder();
	    geocoder.geocode({
		  'latLng' : current_latlng
	    }, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
		    if (status == google.maps.GeocoderStatus.OK) {
			  
			  current = results[0].formatted_address;
			  // check your browser console to see your address
			  
		    }
		  }
		  
	    });
	  });
	  
	  $scope.geoCode = function() {
	    
	    if ($scope.search && $scope.search.length > 0) {
		  // this is the function to get the searched address infomation
		  if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
		  this.geocoder.geocode({
		    'address' : $scope.search
		  }, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
			  $scope.myVar1 = !$scope.myVar1;
			  $scope.myVar2 = !$scope.myVar2;
			  var loc = results[0].geometry.location;
			  var dlat = results[0].geometry.location.lat();
			  var dlon = results[0].geometry.location.lng();
			  var destination_latlng = new google.maps.LatLng(results[0].geometry.location.lat(),
			      results[0].geometry.location.lng());
			  $scope.search = results[0].formatted_address;
			  $scope.loc = results[0].formatted_address;
			  console.log(destination_latlng);
			  console.log("hi");
			  
			  console.log(current);
			  console.log($scope.loc);
			  $scope.distance = google.maps.geometry.spherical.computeDistanceBetween(current_latlng,
			      destination_latlng);
			  
			  $http({
			    method : "GET",
			    url : '/notifyDriver'
			  }).success(function(data) {
			    
			  }).error(function(error) {
			  });
			  
			  $http({
			    method : "POST",
			    url : '/getDistance',
			    data : {
			      "origin" : current,
			      "destination" : results[0].formatted_address
			    }
			  }).success(function(data) {
			    
			    $scope.real_distance = parseFloat(data.distance, 100);
			    $http.post('/put_distance', {
			      source_lat : lat,
			      source_lon : lon,
			      destination_lat : dlat,
			      destination_lon : dlon,
			      distance : $scope.real_distance,
			      source_location : current,
			      destination_location : $scope.loc
			    });
			    
			  }).error(function(error) {
			    alert("Sorry, this search produced no results.");
			  });
			  
		    }
		    
		  });
	    }
	  };
	  
    });

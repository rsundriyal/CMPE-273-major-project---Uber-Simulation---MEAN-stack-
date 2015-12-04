/**
 * New node file
 */


var app = angular.module('uber_map_app', ['ngMap']);
angular.module('uber_map_app', ['ngMap']).controller('uber_map_ctrl', function($scope,$http,$interval){
$scope.long=0;
$scope.lat=0;
$scope.coord=0;
$scope.destination=0;
	console.log("jjjaaaaadoooo");
	load_userrequest();

	
	function load_userrequest(){
		console.log("in angular user request view");
	$http.get('http://localhost:3001/getdistance').success(function(data){
		console.log("distance here");
		console.log(data.distanceValue);
			$scope.distance=data.distanceValue;
	});
	};
	
	$scope.getdestination=function(dest){ 
	    console.log(dest);
	    $scope.destination=String("'"+dest+"'");
	    console.log($scope.destination);
	    console.log($scope.long);
	    console.log($scope.lat);
	    console.log($scope.coord);
	    $http.post('/get_distance', {longi: $scope.long,lat:$scope.lat,dest:$scope.destination});
	}
	
getLocation();
	function getLocation(){ 
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    } else { 
	       
	    }
	}

	function showPosition(position,ans) {
	   
	 $scope.long=position.coords.latitude;
	  $scope.lat=position.coords.longitude;	
	  $scope.coord=String($scope.long+","+$scope.lat+"'");
	}

	

	});
/**
 * New node file
 */
var app = angular.module('billApp', [ 'ngMap', 'ngAnimate', 'ui.bootstrap' ]);
angular.module('billApp', [ 'ngMap', 'ngAnimate', 'ui.bootstrap' ]).controller(
    'billCtrl',
    function($scope, $http, $interval) {
	  $scope.pay = function() {
	    $http({
	      method : "POST",
	      url : '/payment',
	      data : {
	        "ride_id" : $scope.ride_id,
	        "driver_id" : $scope.driver_id,
	        "customer_id" : $scope.customer_id,
	        "start_time" : $scope.start_time,
	        "end_time" : $scope.endtime,
	        "distance" : $scope.distance,
	        "price" : $scope.price,
	        "origin" : $scope.origin,
	        "destination" : $scope.destination,
	        "date" : $scope.date,
	      }
	    }).success(function(data) {
		  window.location.assign("/customerHomepage");
	    }).error(function(error) {
	    });
	  };
	  $scope.submit_review = function() {
	    $http({
	      method : "POST",
	      url : '/customer_review',
	      data : {
	        "customer_name" : $scope.customer_name,
	        "driver_id" : $scope.driver_id,
	        "rating" : $scope.x,
	        "review" : $scope.review,
	      }
	    }).success(function(data) {
		  alert("Review Successed!");
	    }).error(function(error) {
	    });
	  }
	  $http({
	    method : "GET",
	    url : '/bill',
	  }).success(
	      function(data) {
	        
	        $http({
	          method : "POST",
	          url : '/getDriverInfo',
	          data : {
		        "driver_id" : data.driver_id
	          }
	        }).success(function(data) {
		      $scope.driver_name = data.value.firstname + " " + data.value.lastname;
	        }).error(function(error) {
	        });
	        $http({
	          method : "POST",
	          url : '/getCustomerInfo',
	          data : {
		        "customer_id" : data.customer_id
	          }
	        }).success(function(data) {
		      $scope.customer_name = data.value.firstname + " " + data.value.lastname;
	        }).error(function(error) {
	        });
	        $scope.ride_id = data.ride_id;
	        $scope.driver_id = data.driver_id;
	        $scope.customer_id = data.customer_id;
	        $scope.date = data.date;
	        $scope.origin = data.origin;
	        $scope.destination = data.destination;
	        if (data.start_time > "22:00:00") {
		      $scope.price = ((data.distance * 0.621371) * 3).toFixed(2);
	        }
	        else if (data.start_time < "22:00:00") {
		      $scope.price = ((data.distance * 0.621371) * 2).toFixed(2);
	        }
	        
	        $scope.duration = [];
	        $scope.end_time = [];
	        $scope.total = (parseFloat($scope.price) + (parseFloat($scope.price) / 10)).toFixed(2);
	        $scope.distance = data.distance;
	        /* $scope.tax = (data.distance * 0.621371) * 3 / 10; */
	        $scope.duration = data.end_time - data.start_time;
	        $scope.average_speed = data.distance / (data.end_time - data.start_time);
	        $scope.start_time = data.start_time;
	        var start = $scope.start_time.split(':');
	        var end = data.end_time.split(':');
	        if (parseInt(end[0]) - parseInt(start[0]) >= 0) {
		      if (parseInt(end[1]) - parseInt(start[1]) >= 0) {
		        $scope.duration = [ parseInt(end[0]) - parseInt(start[0]), parseInt(end[1]) - parseInt(start[1]) ];
		        
		        $scope.speed = ($scope.distance) / (($scope.duration[0]) + ($scope.duration[1] / 60));
		      }
		      else {
		        $scope.duration = [ ((parseInt(end[0])) - 1) - parseInt(start[0]),
		            (parseInt((end[1])) + 60) - parseInt(start[1]) ];
		        $scope.speed = ($scope.distance) / (($scope.duration[0]) + ($scope.duration[1] / 60));
		      }
	        }
	        $scope.endtime = data.end_time;
	        $scope.end_time = $scope.duration;
	        $scope.duration = $scope.starttime - $scope.end_time;
	        $scope.start_lat = data.start_lat;
	        $scope.start_lng = data.start_lng;
	        $scope.destination_lat = data.destination_lat;
	        $scope.destination_lng = data.destination_lng;
	        
	      }).error(function(error) {
	  });
    });
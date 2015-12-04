/**
 * New node file
 */

angular.module('testApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('testApp').controller('testCtrl', function($scope, $http) {
  
  $http({
	method : "POST",
	url : '/updateCar',
	data : {
	  "type" : "123",
	  "door" : "123",
	  "year" : "123",
	}
  }).success(function(data) {
	
  }).error(function(error) {
  });
  
  $http({
	method : "POST",
	url : '/getDriverInfo',
  }).success(function(data) {
	
  }).error(function(error) {
  });
  
  $http({
	method : "POST",
	url : '/getCarInfo',
  }).success(function(data) {
	
  }).error(function(error) {
  });
  
  $http({
	method : "POST",
	url : '/getDriverInfo',
  }).success(function(data) {
	
  }).error(function(error) {
  });
  $http({
	method : "POST",
	url : '/getVideo',
  }).success(function(data) {
	
  }).error(function(error) {
  });
  $http({
	method : "POST",
	url : '/driverSignIn',
	data : {
	  "email" : "123",
	  "password" : "123"
	}
  }).success(function(data) {
	
  }).error(function(error) {
  });
  $http({
	method : "POST",
	url : '/getDriverInfo',
  }).success(function(data) {
	
  }).error(function(error) {
  });
});

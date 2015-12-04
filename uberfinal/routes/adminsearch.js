/**
 * New node file
 */
	var app = angular.module('myApp', []);
angular.module('myApp', []).controller('orderCtrl', function($scope,$http,$interval){

	 $scope.myVar=true;
	 $scope.myVar1=true;
	 $scope.myVar2=true;
	
	$scope.driver=function (id){
		
		console.log(id);
	
		 $http({
			    method : "get",
			    url : '/search_driver?driver_id='+id,
			  }).success(
			      function(data) {
	console.log(data);
			    	  $scope.myVar=!$scope.myVar;	
						 $scope.driver=data;
						 });
	};
	
	$scope.bill=function (id){
		
		console.log(id);
	
		 $http({
			    method : "get",
			    url : '/search_bill?bill_id='+id,
			  }).success(
			      function(data) {
	console.log(data);
			    	  $scope.myVar1=!$scope.myVar;	
						 $scope.bill=data;
						 });
	};
	
	$scope.customer=function (id){
		
		console.log(id);
	
		 $http({
			    method : "get",
			    url : '/search_customer?customer_id='+id,
			  }).success(
			      function(data) {
	console.log(data);
			    	  $scope.myVar2=!$scope.myVar;	
						 $scope.customer=data;
						 });
	};
	
	});
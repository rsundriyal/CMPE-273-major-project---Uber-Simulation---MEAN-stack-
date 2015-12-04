var app = angular.module('app', ["chart.js"]);

angular.module("app", ["chart.js"]) // here i couldn't understand about chart.js fil
  // Optional configuration
  .config(['ChartJsProvider', function (ChartJsProvider) {
	  
	 
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#357ec7', '#357ec7'],
    	/*"colours": [{
    	    fillColor: 'rgba(53, 126, 199,8))',
    	    strokeColor: 'rgba(53, 126, 199,8)',
    	    highlightFill: 'rgba(53, 126, 199,8))',
    	    highlightStroke: 'rgba(53, 126, 199,8)'
    	}],*/
      responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Bar', {
      datasetFill: false
    });
  }])
  .controller("LineCtrl", function($scope,$http,$interval){
	$scope.myVar=true;
	$scope.myVar1=true;
//load_userrequest(value);
	  
	  $scope.opt=[{id:1,name:"Driver"},{id:2,name:"Customer"}];
	  $scope.load_userrequest=function (value){
		 console.log("here is " + value.name);
		 if(value.name=="Driver")
			 {
		$scope.myVar=!$scope.myVar;
			 }
		 if(value.name=="Customer")
		 {
	$scope.myVar1=!$scope.myVar1;
		 }
	  }
	  
	  $scope.loadCustomer= function(id){
	  $http({
		    method : "get",
		    url : '/search_customer?customer_id='+id,
		  }).success(
		      function(data) {
			
			var i;
			
		$scope.data = [];
		$scope.data2 = [];
		
			  $scope.series = ['Series A'];
			  for(i=0; i<data1.length;i++)
				{
				console.log(data1[i].origin);
				$scope.data3.push(data1[i].origin);
				}
		$scope.labels=$scope.data3;
		
			
	
			for(i=0; i<data1.length;i++)
				{
				console.log(data1[i].distance);
				$scope.data2.push(Number(data1[i].rides));
				}
		$scope.data=[$scope.data2];
		


			console.log($scope.labels);
			console.log($scope.labels1);
				 
			  $scope.onClick = function (points, evt) {
			    console.log(points, evt);
			  };
			  	
		});
		
	  }		
				//$scope.drivers=data;
	  
	  
		$scope.loadDriver=function (id){
			
			$http({
			    method : "get",
			    url : '/driverStat?driver_id='+id,
			  }).success(
			      function(data1) {
				
		
		var i;
		
	$scope.data = [];
	$scope.data2 = [];
	$scope.data3 = [];
		
		  $scope.series = ['Series A'];
		  for(i=0; i<data1.length;i++)
			{
			console.log(data1[i].date);
			$scope.data3.push(data1[i].date);
			}
	$scope.labels=$scope.data3;
	
		

		for(i=0; i<data1.length;i++)
			{
			console.log(data1[i].rides);
			$scope.data2.push(Number(data1[i].rides));
			}
	$scope.data=[$scope.data2];
	


		console.log($scope.labels);
		console.log($scope.labels1);
			 
		  $scope.onClick = function (points, evt) {
		    console.log(points, evt);
		  };
		  	
	});
	}
	  
	$scope.loadCustomer=function (id){
			
			$http({
			    method : "get",
			    url : '/customerStat?customer_id='+id,
			  }).success(
			      function(data1) {
				
		
		var i;
		
	$scope.data = [];
	$scope.data2 = [];
	$scope.data3 = [];
		
		  $scope.series = ['Series A'];
		  for(i=0; i<data1.length;i++)
			{
			console.log(data1[i].date);
			$scope.data3.push(data1[i].date);
			}
	$scope.labels=$scope.data3;
	
		

		for(i=0; i<data1.length;i++)
			{
			console.log(data1[i].rides);
			$scope.data2.push(Number(data1[i].rides));
			}
	$scope.data=[$scope.data2];
	


		console.log($scope.labels);
		console.log($scope.labels1);
			 
		  $scope.onClick = function (points, evt) {
		    console.log(points, evt);
		  };
		  	
	});
	}
		
});



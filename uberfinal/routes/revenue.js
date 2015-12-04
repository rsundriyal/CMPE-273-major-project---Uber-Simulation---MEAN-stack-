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
	
//load_userrequest(value);
	  
	  $scope.opt=[{id:1,name:"origin"},{id:2,name:"destination"},{id:3,name:"date"}]
	  $scope.load_userrequest=function (value){
		 console.log("here is " + value.name);
		 if(value.name=="date")
			 {
		
		$http.get('http://localhost:3001/charts1').success(function(data1){
			
			var i;
			
		$scope.data = [];
		$scope.data2 = [];
		$scope.data3 = [];
			 $scope.labels =[];
			  $scope.labels1 = ["January", "February", "March", "April", "May", "June", "July"];

			  $scope.series = ['Series A'];
			  for(i=0; i<data1.length;i++)
				{
				console.log(data1[i].origin);
				$scope.data3.push(data1[i].date);
				}
		$scope.labels=$scope.data3;
		
			
	
			for(i=0; i<data1.length;i++)
				{
				console.log(data1[i].distance);
				$scope.data2.push(Number(data1[i].revenue));
				}
		$scope.data=[$scope.data2];
		


			console.log($scope.labels);
			console.log($scope.labels1);
				 
			  $scope.onClick = function (points, evt) {
			    console.log(points, evt);
			  };
			  	
		});
		};
			
				//$scope.drivers=data;
	  
	  
 
	  if(value.name=="origin")
		 {
	
	$http.get('http://localhost:3001/charts2').success(function(data1){
		
		var i;
		
	$scope.data = [];
	$scope.data2 = [];
	$scope.data3 = [];
		 $scope.labels =[];
		  $scope.labels1 = ["January", "February", "March", "April", "May", "June", "July"];

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
	  
	  if(value.name=="destination")
		 {
	
	$http.get('http://localhost:3001/charts3').success(function(data1){
		
		var i;
		
	$scope.data = [];
	$scope.data2 = [];
	$scope.data3 = [];
		 $scope.labels =[];
		  $scope.labels1 = ["January", "February", "March", "April", "May", "June", "July"];

		  $scope.series = ['Series A'];
		  for(i=0; i<data1.length;i++)
			{
			console.log(data1[i].origin);
			$scope.data3.push(data1[i].destination);
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
	
		
			//$scope.drivers=data;
}

	  }	
		
});



/**
 * New node file
 */
var app = angular.module('app1', ["chart.js"]);
angular.module("app1", ["chart.js"]) // here i couldn't understand about chart.js fil
//Optional configuration
.config(['ChartJsProvider', function (ChartJsProvider) {
	  
	 
// Configure all charts
ChartJsProvider.setOptions({
// colours: ['#696969', '#FFFFFF'],
	"colours": [{
	    fillColor: 'rgba(128,128,128,1))',
	    strokeColor: 'rgba(128,128,128,1)',
	    highlightFill: 'rgba(128,128,128,1))',
	    highlightStroke: 'rgba(128,128,128,1)'
	}],
 responsive: true
});
// Configure all line charts
ChartJsProvider.setOptions('Bar', {
 datasetFill: false
});
}])
.controller("LineCtrl1", function($scope,$http,$interval){
	  load_userrequest1();
	  
	  
	  function load_userrequest1(){
			console.log("in angular user request view");
		$http.get('http://localhost:3001/charts').success(function(data1){
			console.log("charts");
			console.log(data1);
			var i;
		$scope.dataa = [];
		$scope.data2 = [];
		$scope.data3 = [];
			 $scope.label =[];
			  $scope.labels1 = ["January", "February", "March", "April", "May", "June", "July"];

			  $scope.series = ['Series B'];
			  for(i=0; i<data1.length;i++)
				{
				console.log(data1[i].firstname);
				$scope.data3.push(data1[i].firstname);
				}
		$scope.labels=$scope.data3;
		
			
	
			for(i=0; i<data1.length;i++)
				{
				console.log(data1[i].status);
				$scope.data2.push(Number(data1[i].status));
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
		
	  

//Simulate async data update
/*$timeout(function () {
$scope.data = [
 [28, 48, 40, 19, 86, 27, 90]
];
}, 3000);*/
});

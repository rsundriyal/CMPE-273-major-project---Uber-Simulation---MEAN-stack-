/**
 * New node file
 */
/**
 * New node file
 */
var app = angular.module('myApp', []);
angular.module('myApp', []).controller('orderCtrl', function($scope,$http,$interval){

	
	load_userrequest();


	
	function load_userrequest(){
		console.log("in angular user request view");
	$http.get('http://localhost:3001/bill').success(function(data){
		console.log(data);
			$scope.users=data;
	});
	};

	});
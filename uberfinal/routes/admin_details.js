/**
 * New node file
 */
/**
 * New node file
 */
var app = angular.module('myApp', []);
angular.module('myApp', []).controller('orderCtrl', function($scope,$http,$interval){

	
	load_admindetails();

	
	function load_admindetails(){
		console.log("in angular user request view");
	$http.get('http://localhost:3001/admindetails').success(function(data){
		console.log(data);
			$scope.admin=data;
			console.log("admin data");
			console.log($scope.admin);
	});
	};

	});
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
	$http.get('http://localhost:3001/driver_request1').success(function(data){
		console.log(data);
			$scope.drivers=data;
	});
	};

	$scope.cal=function(email,value){
		console.log("accept or reject"+email)
		window.location.reload(false); 
		$http.post('/driver_response', {email: email,value:value});
		
	}
	});
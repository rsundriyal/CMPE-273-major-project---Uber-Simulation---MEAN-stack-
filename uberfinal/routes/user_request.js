/**
 * New node file
 */
var app = angular.module('myApp', []);
angular.module('myApp', []).controller('orderCtrl', function($scope,$http,$interval){

	
	load_userrequest();

	
	$scope.cal=function(email,value){
		console.log("accept or reject"+email)
		window.location.reload(false); 
		$http.post('/user_response', {email: email,value:value});
		
	}
	
	function load_userrequest(){
		console.log("in angular user request view");
	$http.get('http://localhost:3001/user_request1').success(function(data){
		console.log(data);
			$scope.users=data;
	});
	};

	});
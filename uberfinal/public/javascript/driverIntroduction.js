angular.module('driverIntroductionApp', [ 'ngAnimate', 'ui.bootstrap' ]);
angular.module('driverIntroductionApp').controller(
		'driverIntroductionCtrl',
		function($scope, $http) {
			 $http({
					method : "POST",
					url : '/getDriverInfo',
				  }).success(function(data) {
					if (data.code == "200") {
					  $scope.name = data.value.firstname + " " + data.value.lastname;
//					  $scope.address = data.value.address + "," + data.value.city + " " + data.value.state + " " + data.value.zip;
//					  $scope.phone = data.value.phone;
//					  $scope.email = data.value.email;
//					  var temp_id = data.value.driver_id.toString();
//					  pre_id = "";
//					  for (var i = temp_id.length; i < 9; i++) {
//						pre_id += "0";
//					  }
//					  var driver_id = pre_id + temp_id;
//					  $scope.id = driver_id;
					}
				  }).error(function(error) {
				  });
			$http({
				method : "POST",
				url : '/getVideo',
			}).success(
					function(data) {
						if (data.code == "200") {
							//$scope.video=data.value;  我们来想这样取video的  你看看怎么弄
						}
					}).error(function(error) {
			});

		});

var angularCigars = angular.module('angularCigars', []);
angularCigars.controller('cigarController', function($scope, $http){
	var apiUrl = 'http://localhost:3000/coffee';

	$scope.registerForm = function(form){
		$http.post('http://localhost:3000/register', {
			userName: $scope.userName,
			password: $scope.password,
			password2: $scope.password2,
			emailAddress: $scope.emailAddress
		}).then(function successCallback(response){

		}, function errorCallback(response){

		});
	}

	$http.get(apiUrl).then(function successCallback(response){

	});
	function errorCallback(response){
		$scope.result = 'Error';
	}
});

angularCigars.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: "views/index.html",
        controller: 'cigarController'
    })
    .when('/register', {
        templateUrl: "views/register.html",
        controller: 'cigarController'        
    })
});
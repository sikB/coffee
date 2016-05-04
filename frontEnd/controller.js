var angularCigars = angular.module('angularCigars', ['ngRoute']);
angularCigars.controller('cigarController', function($scope, $http, $location){
	// var apiUrl = 'http://localhost:3000/coffee';

	$scope.loginForm = function(){
		$http.post('http://localhost:3000/login', {
			userName: $scope.userName,
			password: $scope.password
		}).then(function successCallback(response){
			console.log(response.data)
			if(response.data.success == 'found!'){
				$location.path('/order');
			}else if(response.data.failure == 'noUser'){
				$scope.errorMessage = 'No such user found'
			}else if( response.data.failure == 'badPassword'){
				$scope.errorMessage = "Wrong password"
			}
		},function errorCallback(response){

		});
	}

	$scope.registerForm = function(form){
		$http.post('http://localhost:3000/register', {
			userName: $scope.userName,
			password: $scope.password,
			password2: $scope.password2,
			emailAddress: $scope.emailAddress
		}).then(function successCallback(response){
			if(response.data.failure == 'passwordsMatch'){
				$scope.errorMessage = "Your passwords must match";
			}else if(response.data.success == "added"){
				$location.path('/order');
			}
		}, function errorCallback(response){

		});
	}
});

angularCigars.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: "homePage.html",
        controller: 'cigarController'
    }).when('/register', {
        templateUrl: "register.html",
        controller: 'cigarController'        
    }).when('/order', {
        templateUrl: "order.html",
        controller: 'cigarController'
    }).when('/login', {
        templateUrl: "login.html",
        controller: 'cigarController'
    })    
});
var angularCigars = angular.module('angularCigars', ['ngRoute', 'ngCookies']);
angularCigars.controller('cigarController', function($scope, $http, $location, $cookies){
	var apiUrl = 'http://localhost:3000/';

	$scope.loginForm = function(){
		$http.post(apiUrl + 'login', {
			userName: $scope.userName,
			password: $scope.password
		}).then(function successCallback(response){
			if(response.data.success == 'found!'){
				$cookies.put('token', response.data.token);
				$cookies.put('userName', $scope.userName);
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
		$http.post(apiUrl + 'register', {
			userName: $scope.userName,
			password: $scope.password,
			password2: $scope.password2,
			emailAddress: $scope.emailAddress
		}).then(function successCallback(response){
			if(response.data.failure == 'passwordsMatch'){
				$scope.errorMessage = "Your passwords must match";
			}else if(response.data.success == "added"){
				$cookies.put('token', response.data.token);
				$cookies.put('userName', $scope.userName);
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
    }).when('/delivery', {
        templateUrl: "delivery.html",
        controller: 'cigarController'
    }).when('/checkout', {
        templateUrl: "checkout.html",
        controller: 'cigarController'
    })    
});
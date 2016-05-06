var angularCigars = angular.module('angularCigars', ['ngRoute', 'ngCookies']);
angularCigars.controller('cigarController', function($scope, $http, $location, $cookies){
	var apiUrl = 'http://localhost:3000/';

	$http.get(apiUrl + 'getUserData?token=' + $cookies.get('token'),{
	}).then(function successCallback(response){
		if(response.data.failure == 'badToken'){
			$location.path('register');
		}else{
		$scope.userOrder = response.data
		// response.data; use this instead of the below because i only have one controller
	} function errorCallback(response){
		console.log(response.status);
	}
	});

	$scope.shape = [
		  {option: 'Corona'},
          {option: 'Petit Corona'},
          {option: 'Churchill'},
          {option: 'Robusto'},
          {option:'Corona Gorda'},
          {option: 'Double Corona'},
          {option:'Panetela'},
          {option: 'Lonsdale'},
          {option: 'Pyramid'},
          {option:'Belicoso'},
          {option: 'Torpedo'},
          {option:'Perfecto'},
          {option: 'Culebra'}
	];

	$scope.flavor = [
	{option: 'Dark/Robust'},
	{option: 'Medium'},
	{option: 'Light'}
	];

	$scope.smokeLength = [
		{option: "1hr"},
		{option: '45min - 1hr'},
		{option: '>45min'}
	];

	$scope.frequency = [
		{option: 'Once a week'},
		{option: "Every other week"},
		{option: "Once a month"}
	];

	$scope.flavor = $cookies.get('flavor');
	$scope.quantity = $cookies.get('quantity');
	$scope.shape = $cookies.get('shape');
	$scope.smokeLength = $cookies.get('smokeLength');
	$scope.fullName = $cookies.get('fullName');
	$scope.address = $cookies.get('address');
	$scope.address2 = $cookies.get('address2');
	$scope.city = $cookies.get('city');
	$scope.state = $cookies.get('state');
	$scope.zip = $cookies.get('zip');
	$scope.deliveryDate = $cookies.get('deliveryDate');
	$scope.total = Number($scope.quantity) * 20.00;

	$scope.proceed2Checkout = function(){
			$http({
			method: 'POST',
			url: apiUrl + 'delivery',
			data: {
				token: $cookies.get('token')
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'noToken'){
					// invalid token, so redirect to login page
					$location.path('/login');
				} else if (response.data.success = 'tokenMatch') {
					// put the delivery info into cookies for temporary storage
					$cookies.put('fullName', $scope.fullName);
					$cookies.put('address', $scope.address);
					$cookies.put('address2', $scope.address2);
					$cookies.put('city', $scope.city);
					$cookies.put('state', $scope.state);
					$cookies.put('zip', $scope.zip);
					$cookies.put('deliveryDate', $scope.deliveryDate);

					//redirect to checkout page
					$location.path('/checkout');
				}
		}, function errorCallback(status){
			console.log(status);
		});
	};

	$scope.custom = function(){
		$http.post(apiUrl + 'order', {
			flavor: $scope.flavor,
			smokeLength: $scope.smokeLength,
			shape: $scope.shape,
			token: $cookies.get('token')
		}).then(function successCallback(response){
			if(response.data.failure == 'noToken'){
				console.log('test');
				$location.path('/login');
			}else if(response == 'tokenMatch'){
				console.log('test');
				$cookies.put('flavor', $scope.flavor);
				$cookies.put('smokeLength', $scope.smokeLength);
				$cookies.put('shape', $scope.shape);
				$cookies.put('frequency', $scope.frequency);
				console.log($scope.shape);
				$location.path('/delivery');
			}
		}, function errorCallback(response){
			console.log(response);
		});
	}

	$scope.orderSingle = function(){
		console.log('test1');
	}

	$scope.partyPlan = function(){
		console.log('test2');
	}
	$scope.logOut = function($scope, $cookies){
		$cookies.remove('token');
		$cookies.remove('username');
	}


	$scope.loginForm = function(){
		$http.post(apiUrl + 'login', {
			userName: $scope.userName,
			password: $scope.password
		}).then(function successCallback(response){
			if(response.data.success == 'found!'){
				$cookies.put('token', response.data.token);
				$cookies.put('userName', $scope.userName);
				$scope.loggedIn = true;
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
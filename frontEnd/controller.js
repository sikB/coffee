var angularCigars = angular.module('angularCigars', ['ngRoute', 'ngCookies']);
angularCigars.controller('cigarController', function($scope, $http, $location, $cookies){
	var apiUrl = 'http://localhost:3000/';

	// if($location.path() != 'register' || 'login'){
	// 	$location.path('homePage');
	// }else{

	$http.get(apiUrl + 'getUserData?token=' + $cookies.get('token'),{
	}).then(function successCallback(response){
		if(response.data.failure == 'badToken'){
			$location.path('register');
		}else{
		$scope.userOrder = response.data;
		$scope.fullName = response.data.fullName;
		$scope.address = response.data.address;
		$scope.address2 = response.data.address2;
		$scope.city = response.data.city;
		$scope.state = response.data.state;
		$scope.zipCode = response.data.zipCode;
		$scope.date = response.data.date;
		$scope.flavor = response.data.flavor;
		$scope.smokeLength = response.data.smokeLength;
		$scope.shape = response.data.shape;
		$scope.frequency = response.data.frequency;

		console.log(response.data.fullName);
		// response.data; use this instead of the below because i only have one controller
	} function errorCallback(response){
		console.log(response.status);
	}
	});

	// $scope.checkOut = function(){
	// 		$http.post(apiUrl + 'checkout',{
	// 			token: $cookies.get('token'),
	// 			fullName: $cookies.get('fullName'),
	// 			address: $cookies.get('address'),
	// 			address2 : $cookies.get('address2'),
	// 			city: $cookies.get('city'),
	// 			state: $cookies.get('state'),
	// 			zipCode: $cookies.get('zipCode'),
	// 			date: $cookies.get('date'),
	// 			flavor: $cookies.get('flavor'),
	// 			smokeLength: $cookies.get('smokeLength'),
	// 			shape: $cookies.get('shape'),
	// 			frequency: $cookies.get('frequency')
	// 	}).then(function successCallback(response){
	// 		if (response.data.failure == 'failedUpdate'){
	// 				// invalid token, so redirect to login page
	// 				$location.path('order');
	// 			} else if (response.data.success == 'updated') {
	// 				// put the delivery info into cookies for temporary storage
	// 				$cookies.put('fullName', $scope.fullName);
	// 				console.log($scope.fullName);
	// 				$cookies.put('address', $scope.address);
	// 				$cookies.put('address2', $scope.address2);
	// 				$cookies.put('city', $scope.city);
	// 				$cookies.put('state', $scope.state);
	// 				$cookies.put('zipCode', $scope.zipCode);
	// 				$cookies.put('date', $scope.date);
	// 				$cookies.put('flavor', $scope.flavor);
	// 				$cookies.put('smokeLength', $scope.smokeLength);
	// 				$cookies.put('shape', $scope.shape);
	// 				$cookies.put('frequency', $scope.frequency);

	// 				//redirect to checkout page
	// 				// $location.path('payment');
	// 			}
	// 	}, function errorCallback(status){
	// 		console.log(status);
	// 	});
	// };

	$scope.proceed2Checkout = function(){
			$http.post((apiUrl + 'delivery') && (apiUrl + 'checkout'),{
				token: $cookies.get('token'),
				fullName: $scope.fullName,
				address: $scope.address,
				address2 : $scope.address2,
				city: $scope.city,
				state: $scope.state,
				zipCode: $scope.zipCode,
				date: $scope.date,
				flavor: $scope.flavor,
				smokeLength: $scope.smokeLength,
				shape: $scope.shape,
				frequency: $scope.frequency
		}).then(function successCallback(response){
			if (response.data.failure == 'failedUpdate'){
					// invalid token, so redirect to login page
					$location.path('login');
				} else if (response.data.success == 'updated') {
					// put the delivery info into cookies for temporary storage
					$cookies.put('fullName', $scope.fullName);
					console.log('this is ' + $scope.fullName);
					$cookies.put('address', $scope.address);
					$cookies.put('address2', $scope.address2);
					$cookies.put('city', $scope.city);
					$cookies.put('state', $scope.state);
					$cookies.put('zipCode', $scope.zipCode);
					$cookies.put('date', $scope.date);
					$cookies.put('flavor', $scope.flavor);
					console.log('this is ' + $scope.flavor);
					$cookies.put('smokeLength', $scope.smokeLength);
					console.log('this is ' + $scope.smokeLength);
					$cookies.put('shape', $scope.shape);
					console.log('this is ' + $scope.shape);
					$cookies.put('frequency', $scope.frequency);
					console.log('this is ' + $scope.frequency);

					//redirect to checkout page
					$location.path('checkout');
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
			frequency: $scope.frequency,
			token: $cookies.get('token')
		}).then(function successCallback(response){
			if(response.data.failure == 'failedUpdate'){
				console.log('test');
				$location.path('login');
			}else if(response.data.success == 'updated'){
				console.log('success');
				$cookies.put('flavor', $scope.flavor);
				$cookies.put('smokeLength', $scope.smokeLength);
				$cookies.put('shape', $scope.shape);
				$cookies.put('frequency', $scope.frequency);
				$location.path('delivery');
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
	// $scope.logOut = function($scope, $cookies){
	// 	$cookies.remove('token');
	// 	$cookies.remove('username');
	// }


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
				$location.path('order');
			}
		}, function errorCallback(response){
			console.log(response);
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
    }).when('/payment', {
        templateUrl: "payment.html",
        controller: 'cigarController'
    })
});


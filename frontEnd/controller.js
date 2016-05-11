var angularCigars = angular.module('angularCigars', ['ngRoute', 'ngCookies']);
angularCigars.controller('cigarController', function($scope, $http, $location, $cookies){
	var apiUrl = 'http://bogdansportfolio.com:3000';

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
		enableStripe($scope.total);

		console.log(response.data.fullName);
		// response.data; use this instead of the below because i only have one controller
	} function errorCallback(response){
		console.log(response.status);
	}
	});

	$scope.$watch(function(){
        return $location.path();
    },
    function(a){
        // console.log(a);
    });

	// function enableStripe(total){
 //        var total = Number(total * 100);
 //        console.log(total);
 //        var handler = StripeCheckout.configure({
 //            key: 'pk_test_xUwaUiQX4cjUc70hG3kFQ7iB',
 //            image: '/images/logo2.png',
 //            locale: 'auto',
 //            token: function(token) {
              // You can access the token ID with `token.id`.
              // Get the token ID to your server-side code for use.
        //     }    
        // });    
        // $('#submitButton').on('click', function(e) {
            // Open Checkout with further options:
     //        handler.open({
     //            name: 'Cigars',
     //            description: 'Purchasing from Cigars',
     //            amount: $scope.total,
     //            flavor: $scope.flavor
     //        }); console.log('test');
     //        $location.path('/');
  			// console.log('test2');
     //    });    
          // Close Checkout on page navigation:
    //       $(window).on('popstate', function() {
    //         handler.close();

    //       });
    // };

    $scope.submitToStripe = function(){
		var handler = StripeCheckout.configure({
		   	key: 'pk_test_xUwaUiQX4cjUc70hG3kFQ7iB',
		   	image: '/images/logo2.png',
		   	locale: 'auto',
		   	token: function(token) {
		   		console.log("The token Id is: ");
		   		console.log(token.id);
				$http.post(apiUrl + 'checkout', {
					amount: $scope.total,
					stripeToken: token.id,
					token: $cookies.get('token')
					//This will pass amount, stripeToken, and token to /payment
				}).then(function successCallback(response){
					$location.path('/thankYou');
					//if a response of any kind comes back from /payment, it will foward to /thankYou
					//You can add logic here to determine if the Stripe charge was successful
				}, function errorCallback(response){
				});
		   	}	
		});			
	    handler.open({
	    	name: 'Cigar',
	      	description: 'Buying from Cigar store',
	      	amount: $scope.total
	    });		
	}

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
				$location.path('#/order');
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
    }).otherwise({
		redirectTo: '/'
	})
});


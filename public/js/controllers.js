'use strict';

/* Controllers */

var loggedIn = false;
var started = false;
var complete = false;

var bangmanControllers = angular.module('bangmanControllers', []);
bangmanControllers.controller('GuessCtrl', ['$scope', '$socket', '$timeout', '$log', '$location', 
  function($scope, $socket, $timeout, $log, $location) {

    var countdown;
  	$socket.on('hangman', function(hangman) {
      $log.info('hangman');
      started = true;
      $log.info(hangman.phrase);
      $log.info('timeout was successfully canceled: ' + $timeout.cancel(countdown));
  		$scope.word = hangman.phrase;
      $scope.guesses = hangman.guesses;
      $scope.time = hangman.time;
      complete = hangman.complete;
      if (complete) {
        $log.info('complete');
        $location.path('/report');
      }

      $scope.onTimeout = function() {
        $scope.time--;
        if ($scope.time <= 0) {
          $log.info($scope.time);
          $log.info('timeout was successfully canceled: ' + $timeout.cancel(countdown));
        } else {
          countdown = $timeout($scope.onTimeout,1000);
        }
      }
      countdown = $timeout($scope.onTimeout,1000);
  	});

    $socket.on('loggedin', function(data) {
        loggedIn = true;
        complete = false;
        $scope.games = data.games;
    });

    $socket.on('stop', function() {
        $log.info('incomplete');
        $location.path('/report'); 
    });

    $scope.guess = function() {
      $log.info('guessing ' + this.letter);
    	$socket.emit('guess', this.letter);
      this.letter = '';
  	};

    $scope.leave = function() {
      $socket.emit('leave', '', function(data) {
        $log.info('timeout was successfully canceled: ' + $timeout.cancel(countdown));
        $scope.time = '';
        started = false;
        $scope.games = data.games;
      });
    };

    $scope.join = function(game) {
      $log.info('joining ' + game);
      $socket.emit('join', game);
    };

    $scope.loggedIn = function() {
      return loggedIn;
    };

    $scope.started = function() {
      return started;
    };
}]);

bangmanControllers.controller('ReportCtrl', ['$scope', '$socket', '$log', '$location', '$timeout',
  function($scope, $socket, $log, $location, $timeout) {

    $socket.on('start', function() {
      $location.path('/guess');
    });

    var countdown;

    $scope.$on('$routeChangeSuccess', function(next, current) { 
      $log.info('init report!');
      $socket.emit('report', '', function(data) {
      $log.info('timeout was successfully canceled: ' + $timeout.cancel(countdown));
      $scope.time = data.time;
      $scope.onTimeout = function() {
          $scope.time--;
          if ($scope.time <= 0) {
            $log.info('timeout was successfully canceled: ' + $timeout.cancel(countdown));
          } else {
            countdown = $timeout($scope.onTimeout,1000);
          }
        }
        countdown = $timeout($scope.onTimeout,1000);
      });
    });

    $scope.loggedIn = function() {
      return loggedIn;
    };

    $scope.complete = function() {
      return complete;
    };
}]);

var landingpageControllers = angular.module('landingpageControllers', []);
landingpageControllers.controller('LandingpageCtrl', function($scope, $http) {
	$scope.signup = function() {
	  //$scope.message = 'Thanks for signing up! You will receive an invitation at ' + $scope.email + '.';
		$http.put('/subscribe/' + $scope.email, {name: $scope.name, email: $scope.email}).success(function (data, status) {
		 	$scope.response = data;
		});
	}
});
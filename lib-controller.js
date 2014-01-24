function LibCtrl($scope, $timeout) {
	$scope.timer = {};
	$scope.players = [];
	$scope.gameOver = false;
	$scope.round = {
		current: 0,
		max: 9
	};

	$scope.nameInput = "";
	
	$scope.addPlayer = function() {
		var player = {
			name: $scope.nameInput,
			points: 0
		};
		$scope.players.push(player);
		$scope.nameInput = "";
	}

	$scope.addPoint = function(player) {
		if ($scope.timer.stopped != true) {
			player.points++;
		}
	}
	
	$scope.startPause = function() {
		if($scope.round.current == $scope.round.max) {
			return;
		}
		if(!$scope.timer.initialized) {
			$scope.timer.initialized = true;
			$scope.round.current++;
		}
		if($scope.timer.stopped == true) {
			$scope.timer.timeout = $timeout(onTimeout, 1000);
		} else {
			$timeout.cancel($scope.timer.timeout);
		}
		$scope.timer.stopped = !$scope.timer.stopped;
	}
	
	$scope.intToString = function(number) {
		if(number < 10) {
			return "0" + number;
		}
		return number;
	}
	
    onTimeout = function(){
		if($scope.timer.min == 0 && $scope.timer.sec == 0) {
			$timeout.cancel($scope.timer.timeout);
			if($scope.round.current == $scope.round.max) {
				$scope.gameOver = true;
			}
			resetTimer();
		} else if($scope.timer.sec == 0) {
			$scope.timer.sec = 59;
			$scope.timer.min -= 1;
			$scope.timer.timeout = $timeout(onTimeout,1000);
		} else {
			$scope.timer.sec -= 1;
			$scope.timer.timeout = $timeout(onTimeout,1000);
		}
	}

	/**
	 * Let's all just close our eyes for a minute here and skip a couple of lines. Your mental
	 * health might be at risk, as well as the continuation of mankind.
	 */
	function updateRowHeights() {
		if($scope.players.length > 0) {
			var cells = $(".playercell");
			var numRows = Math.ceil($scope.players.length / 2);
			var rowHeight = ($(window).height() - $($('.playercell')[0]).offset().top) / numRows;

			cells.height(rowHeight);
		}
		$timeout(updateRowHeights, 1000);
	}
	
	resetTimer = function() {
		$scope.timer = {
			min: 30,
			sec: 0,
			initialized: false,
			stopped: true,
			timeout: undefined
		};
	}
	
	resetTimer();
	updateRowHeights();
}


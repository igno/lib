function LibCtrl($scope, $timeout) {
	$scope.timer = {};
	$scope.players = [];
	$scope.gameOver = false;
	$scope.round = {
		current: 0,
		max: 9
	};
	
	var pauseTimer;
	var lastPointEnabled = false;
	var ROUND_TIME_IN_MINUTES = 1;

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
		} else if(lastPointEnabled) {
			player.points++;
			lastPointEnabled = false;
		}
	}
	
	$scope.startPause = function() {
		if($scope.round.current == $scope.round.max) {
			return;
		}
		var isInit = $scope.timer.initialized;
		if(!$scope.timer.initialized) {
			$scope.timer.initialized = true;
			$scope.timer.initTime = new Date();
			$scope.round.current++;
		}
		if($scope.timer.stopped == true) {
			$scope.timer.timeout = $timeout(onTimeout, 1000);
			if(isInit) {
				$scope.timer.initTime = new Date($scope.timer.initTime.getTime() + new Date().getTime() - pauseTimer.getTime());
			}
		} else {
			$timeout.cancel($scope.timer.timeout);
			pauseTimer = new Date();
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
		var newTime = new Date();
		$scope.timer.min = ROUND_TIME_IN_MINUTES-Math.ceil(((newTime-$scope.timer.initTime)/1000)/60);
		$scope.timer.sec = 60-(Math.floor(((newTime-$scope.timer.initTime)/1000))%60);
		if(newTime-$scope.timer.initTime >= ROUND_TIME_IN_MINUTES*60*1000) {
			$timeout.cancel($scope.timer.timeout);
			if($scope.round.current == $scope.round.max) {
				$scope.gameOver = true;
			}
			lastPointEnabled = true;
			resetTimer();
		} else {
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
			initTime: undefined,
			min: ROUND_TIME_IN_MINUTES,
			sec: 0,
			initialized: false,
			stopped: true,
			timeout: undefined
		};
	}
	
	resetTimer();
	updateRowHeights();
}


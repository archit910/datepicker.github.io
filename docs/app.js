window.ng = window.angular;
var app = angular.module('app', ['app.daterangehandler', 'app.datePicker' ]);
app.controller('ctrl' , [ '$scope' , '$filter', '$timeout', function($scope, $filter, $timeout) {
	$scope.timerange=  {
		start_time: "1-10-2016",
		end_time: "1-12-2016",
	};
	$scope.timepicker = true;
	$scope.clock = 24;
	$scope.startofweek = 3;
	$scope.date = new Date();
	$scope.mode = 'range';

	$scope.changeMode = function () {
		if ($scope.mode === 'range') {
			$scope.mode = 'single';
			$scope.timerange =  new Date()
			$scope.date = $filter('date')(new Date(), 'dd, MMM yyyy');
			$scope.time = {hours: '00', minutes: '00', seconds: '00'};
		} else {
		$scope.mode = 'range';
		$scope.timerange=  {
			start_time: "1-10-2016",
			end_time: "1-12-2016",
		};
	}
};
	$scope.pickerToggle = function () {
			$scope.timepicker = !$scope.timepicker;
		};
		$scope.clockToggle = function () {
				$scope.clock === 12 ? $scope.clock = 24 : $scope.clock = 12;
	};
	$scope.modes = [
			 [
					 {
						 label: 'Mode[mode]',
						 desc: 'Mode for picker, could be \'range\' or \'single\'.'
					 },
					{
						label: 'Timerange[timerange]',
						desc: 'Will be an \'Object\' in case the mode is RANGE having keys as '
						+ 'start_time and end_time'
					},
					{
						label: 'Start of Week[startofweek]',
						desc: 'default is sunday(1) [sunday--> 1, saturday--> 2, friday--> 3 and so on]'
					},
					{
						label: 'Callback[callback]',
						desc: 'callback to get return[Object] from the datepicker'
								},
					{
						label: 'Clock[clock]',
						desc: 'Format for timepicker, default is 24, could be 12 or 24'
					},
					{
						label: 'Return[Object][Range]',
						desc: '{startDate, endDate, startTime, endTime, meridian_start, meridian_end, clock, submitTimestamp}'
					},
					{
						label: 'Return[Object][single]',
						desc: '{date, time[Object: {keys[hours, minutes, seconds]}], meridian, clock, submitTimestamp}'
					}

				],
		  [

			]
			];

	$scope.startDate = $filter('date')($scope.timerange.start_time, "dd, MMM yyyy");
	$scope.endDate = $filter('date')($scope.timerange.end_time, "dd, MMM yyyy");
	$scope.date = $filter('date')($scope.timerange.date, "dd, MMM yyyy");

	$scope.getDate = function(date) {
		if ($scope.mode === 'range') {
			$scope.startDate = $filter('date')(date.startDate, "dd, MMM yyyy");
			$scope.endDate = $filter('date')(date.endDate, "dd, MMM yyyy");
		} else if ($scope.timepicker & $scope.mode === 'single') {
			$scope.time = date.time;
			$scope.meridian = date.meridian;
		}
		  console.log(date);
			$scope.date = $filter('date')(date.date, "dd, MMM yyyy");
	};

	}]);

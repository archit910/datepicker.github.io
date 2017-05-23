var app = angular.module('app.daterangehandler', []);
function rangeHandler($window, $timeout, datepickerUtility, $filter) {
  return {
    scope: {
      timerange: '=',
      dafaultDate: '@',
      format: '@',
      defaultStartDate: '@',
      defaultEndDate: '@',
      callback: '&',
      mode: '@',
      startofweek: '@',
      onClose: '&'
    },
    restrict: 'EA',
    templateUrl: '../dist/date-range-template.html',
    link: function (scope, element, attribute) {
      var repositionPickers;
      var removeEventHandlers;
      var startDate = new Date();
      var endDate = new Date();
      var registerBodyListener;
      var unregisterBodyListerner;
      var listener;
      var isDropdownOpen = false;
      var setTimeModels = function () {
        if (!(scope.timerange.start_time.valueOf() > 0 || new Date(scope.timerange.start_time) !== 'Invalid Date')) {
          if (!scope.defaultStartDate) {
            startDate.setMonth(startDate.getMonth() + 1);
            scope.start = startDate;
            scope.timerange.start_time = startDate;
          } else {
            scope.timerange.start_time = new Date(scope.defaultStartDate);
            scope.start = new Date(scope.defaultStartDate);
          }
        } else {
          scope.timerange.start_time = new Date(scope.timerange.start_time);
          scope.start = scope.timerange.start_time;
        }
        if (!(scope.timerange.end_time.valueOf() > 0 || new Date(scope.timerange.end_time) !== 'Invalid Date')) {
          if (!scope.defaultStartDate) {
            endDate.setMonth(endDate.getMonth() + 2);
            scope.timerange.end_time = endDate;
            scope.end = endDate;
          } else {
            scope.timerange.end_time = scope.defaultEndDate;
            scope.end = scope.defaultEndDate;
          }
        } else {
          scope.timerange.end_time = new Date(scope.timerange.end_time);
          scope.end = scope.timerange.end_time;
        }
        scope.bothDatesValid = true;
        datepickerUtility.bothSelected = true;
      };
      var setDateHandlesForInput = function () {
        var stTimeInitial;
        var edTimeInitial;
        stTimeInitial = scope.timerange.start_time;
        edTimeInitial = scope.timerange.end_time;
        datepickerUtility.datesSelected.first = stTimeInitial;
        datepickerUtility.datesSelected.second = edTimeInitial;
        scope.starthandle.year = stTimeInitial.getFullYear();
        scope.starthandle.month = stTimeInitial.getMonth() + 1;
        scope.starthandle.days = stTimeInitial.getDate();
        scope.endhandle.year = edTimeInitial.getFullYear();
        scope.endhandle.month = edTimeInitial.getMonth() + 1;
        scope.endhandle.days = edTimeInitial.getDate();
        scope.starttimehandle = {};
        scope.endtimehandle = {};
      };
      var initValsRangeMode = function () {
        setTimeModels();
        setDateHandlesForInput();
      };
      var initValsSingleMode = function () {
        if (!(scope.timerange.valueOf() > 0 || new Date(scope.timerange) !== 'Invalid Date')) {
          if (!scope.defaultDate) {
            scope.singledate = new Date();
            scope.singleModeDateModel = new Date();
          } else {
            scope.singledate = scope.defaultDate;
            scope.singleModeDateModel = scope.defaultDate;
          }
        } else {
          scope.singledate = new Date(scope.timerange);
          scope.singleModeDateModel = new Date(scope.timerange);
        }
        scope.singlemodehandle.year = scope.singledate.getFullYear();
        scope.singlemodehandle.month = scope.singledate.getMonth() + 1;
        scope.singlemodehandle.days = scope.singledate.getDate();
        scope.validSingleModeDate = true;
        scope.singleModeTime = {};
      };
      var basicConfiguration = function () {
        scope.position = {};
        scope.position.leftPicker = 'left';
        scope.position.rightPicker = 'right';
        scope.showdropdown = true;
        scope.selectWeek = false;
        scope.bothDatesValid = false;
        scope.rangemode = true;
        scope.singlemode = true;
        scope.starthandle = {};
        scope.endhandle = {};
        scope.uuid = parseInt(Math.random() * 1000, 10);
        scope.defaultDate = scope.defaultDate ? scope.defaultDate : null; // for single mode
        scope.defaultStartDate = scope.defaultStartDate ? scope.defaultStartDate : null; // if range mode, provide two dates
        scope.defaultEndDate = scope.defaultEndDate ? scope.defaultEndDate : null;
        scope.clock = attribute.clock ? Number(attribute.clock) : 24;
        scope.meridian = { left: true, right: true, singleMode: true };
        attribute.timepicker === 'true' ? scope.timepicker = true : scope.timepicker = false;
        scope.containerWidth = 575;
        scope.singlemodehandle = {};
        scope.containerHeight = 400;
        scope.time = {};
        scope.startofweek = attribute.startofweek;
        // element.find('.date-input').addClass('ng-hide');
        if (scope.mode === 'single') {
          scope.rangemode = false;
          scope.containerWidth = 265;
          initValsSingleMode();
        } else if (scope.mode === 'range') {
          scope.singlemode = false;
          initValsRangeMode();
        } else {
          scope.singlemode = false;
          initValsRangeMode();
        }
        if (scope.timepicker) {
          scope.containerHeight += 60;
        } if (scope.clock === 12) {
          scope.containerHeight += 40;
        }
      };
      basicConfiguration(); // basic configuration initialization for both type of datepickers
      scope.toggleMeridianFun = function (whichTimePicker, event) {
        if (whichTimePicker === 'left') {
          scope.meridian.left = !scope.meridian.left;
          event.stopPropagation();
        } else if (whichTimePicker === 'right') {
          scope.meridian.right = !scope.meridian.right;
          event.stopPropagation();
        } else {
          scope.meridian.singleMode = !scope.meridian.singleMode;
          event.stopPropagation();
        }
      };
      removeEventHandlers = function () {
        angular.element($window).off('resize', repositionPickers);
        element.find('.date-display-bar').off('click', repositionPickers);
      };
      repositionPickers = function (target) {
        var boundingRect = target.getBoundingClientRect();
        var style = {};
        if (boundingRect.left + scope.containerWidth > $window.innerWidth) {
          style = {
            right: 20,
            left: ''
          };
        }
        return style;
      };
      listener = function (event) {
        var flag = false;
        var ele = event.target;
        event.stopPropagation();
        while (ele) {
          if ((ng.element(ele).hasClass('meridian') || ng.element(ele).hasClass('dropdown-content') || ng.element(ele).hasClass('date-display-bar')) && datepickerUtility.picker_uuid === scope.uuid) {
            flag = true;
          }
          ele = ele.parentElement;
        }
        if (flag === false) {
          scope.$apply(function () {
            scope.showdropdown = true;
          });
          unregisterBodyListerner();
        }
      };
      registerBodyListener = function () {
        document.body.addEventListener('click', listener);
      };
      unregisterBodyListerner = function () {
        document.body.removeEventListener('click', listener);
      };
      scope.$on('dpMonthChanged', function (event) {
        event.stopPropagation();
        $timeout(function () {
          datepickerUtility.highlightSingleDate();
        }, 20);
      });
      scope.$on('datechanged', function (event, eve, viewMode) {
        // var x = eve.clientX;
        // var y = eve.clientY;
        // var eq;
        // var monthYear = document.querySelectorAll('THEAD .date-switch');
        // var elementMouseIsOver = document.elementFromPoint(x, y);
        if (viewMode === 'days' && isNaN(Number(eve.target.innerHTML)) && scope.rangemode === true) {
          $timeout(function () {
            scope.timerange.notBeforeDate = new Date(scope.timerange.start_time.getFullYear(), scope.timerange.start_time.getMonth() + 1, 1);
            if (scope.timerange.end_time.getMonth() === 0) {
              scope.timerange.notAfterDate = new Date(scope.timerange.end_time.getFullYear() - 1, 11, datepickerUtility.getDaysInMonth(scope.timerange.end_time.getFullYear() - 1, 11));
            } else {
              scope.timerange.notAfterDate = new Date(scope.timerange.end_time.getFullYear(), scope.timerange.end_time.getMonth() - 1, datepickerUtility.getDaysInMonth(scope.timerange.end_time.getFullYear(), scope.timerange.end_time.getMonth() - 1));
            }
            $timeout(function () {
              datepickerUtility.highlightSingleDate();
            }, 20);
          }, 0);
        } else if (viewMode === 'months' && scope.rangemode === true) {
          if (datepickerUtility.monthModeErr(eve.target)) {
            scope.start = new Date(datepickerUtility.datesSelected.first.valueOf());
            scope.end = new Date(datepickerUtility.datesSelected.second.valueOf());
          }
        } else if (viewMode === 'days' && isNaN(Number(eve.target.innerHTML)) && scope.rangemode === false) {
          $timeout(function () {
            datepickerUtility.removeHighlight('single');
          }, 0);
        } else if (viewMode === 'months' && isNaN(Number(eve.target.innerHTML)) && scope.rangemode === false) {
          $timeout(function () {
            datepickerUtility.removeHighlight('single');
          }, 0);
        }
      });
      scope.getDate = function (date, pickerId) {
        var eq;
        if (datepickerUtility.clickCount === 0) {
          scope.start = date;
          scope.setstartHandle(date);
          scope.end = 'endDate';
          datepickerUtility.clickCount += 1;
          datepickerUtility.datesSelected.first = date;
          datepickerUtility.clickTarget.first = pickerId;
          datepickerUtility.datesSelected.second = null;
          datepickerUtility.clickTarget.second = null;
          datepickerUtility.bothSelected = false;
          datepickerUtility.highlightSingleDate();
        } else if (datepickerUtility.clickCount === 1) {
          datepickerUtility.clickCount = 0;
          datepickerUtility.clickTarget.second = pickerId;
          eq = datepickerUtility.targetsEqual();
          // if second click date is smaller then reset to default dates
          if (pickerId === 'left' && !eq) {
            scope.start = date; // hoover logic needed
            scope.setstartHandle(date);
            scope.end = 'endDate'; // highlight
            datepickerUtility.clickCount = 1;
            datepickerUtility.datesSelected.first = date;
            datepickerUtility.clickTarget.first = pickerId;
            datepickerUtility.highlightSingleDate();
            datepickerUtility.datesSelected.second = null;
            datepickerUtility.clickTarget.second = null;
            datepickerUtility.bothSelected = false;
          } else if (pickerId === 'right' && eq) {
            if (date.valueOf() > datepickerUtility.datesSelected.first.valueOf()) {
              scope.end = date;
              scope.setendHandle(date);
              datepickerUtility.datesSelected.second = date;
              datepickerUtility.bothSelected = true;
              datepickerUtility.highlightSingleDate();
            } else {
              scope.start = date; // hooverlogic
              scope.end = 'endDate';
              scope.setstartHandle(date);
              datepickerUtility.clickCount = 1;
              datepickerUtility.datesSelected.first = date;
              datepickerUtility.clickTarget.first = pickerId;
              datepickerUtility.highlightSingleDate();
              datepickerUtility.datesSelected.second = null;
              datepickerUtility.clickTarget.second = null;
              datepickerUtility.bothSelected = false;
            }
          } else if (pickerId === 'left' && eq) {
            if (date.valueOf() > datepickerUtility.datesSelected.first.valueOf()) {
              scope.end = date;
              scope.setendHandle(date);
              datepickerUtility.datesSelected.second = date;
              datepickerUtility.bothSelected = true;
              datepickerUtility.highlightSingleDate();
            } else {
              scope.start = date; // hooverlogic
              scope.end = 'endDate';
              scope.setstartHandle(date);
              datepickerUtility.clickCount = 1;
              datepickerUtility.datesSelected.first = date;
              datepickerUtility.clickTarget.first = pickerId;
              datepickerUtility.highlightSingleDate();
              datepickerUtility.datesSelected.second = null;
              datepickerUtility.clickTarget.second = null;
              datepickerUtility.bothSelected = false;
            }
          } else if (pickerId === 'right' && !eq) {
            scope.end = date;
            scope.setendHandle(date);
            datepickerUtility.datesSelected.second = date;
            datepickerUtility.bothSelected = true;
            datepickerUtility.highlightSingleDate();
          }
        }
      };
      scope.changeDateFromInput = function (handle) {
        var stDate = new Date(Number(scope.starthandle.year), Number(scope.starthandle.month) - 1, Number(scope.starthandle.days));
        var edDate = new Date(Number(scope.endhandle.year), Number(scope.endhandle.month) - 1, Number(scope.endhandle.days));
        var baseDate = new Date(1970, 0, 1, 0, 0, 0);
        if (handle === 'start') {
          if (stDate.valueOf() > baseDate && scope.endhandle && stDate.valueOf() < edDate.valueOf() && edDate.valueOf() > baseDate.valueOf() && !isNaN(edDate.valueOf()) && !isNaN(stDate.valueOf())) {
            if (scope.starthandle.year !== '' && scope.starthandle.month !== '' && scope.starthandle.days !== '') {
              element.find('.dateinput-left').css({ border: 'none' });
              datepickerUtility.datesSelected.first = stDate;
              scope.start = stDate;
              datepickerUtility.highlightSingleDate();
            }
          } else if (stDate.valueOf() > edDate.valueOf()) {
            element.find('.dateinput-left').css({ border: '1px solid red' });
          }
          if (scope.starthandle.days > datepickerUtility.getDaysInMonth(scope.starthandle.year, scope.starthandle.month - 1)) {
            scope.starthandle.month += 1;
            scope.starthandle.days = 1;
          }
          if (scope.starthandle.month > 12) {
            scope.starthandle.year += 1;
            scope.starthandle.month = 1;
          }
          if (scope.starthandle.days <= 0) {
            scope.starthandle.month -= 1;
            scope.starthandle.days = datepickerUtility.getDaysInMonth(scope.starthandle.year, scope.starthandle.month - 1);
          }
          if (scope.starthandle.month <= 0) {
            scope.starthandle.year -= 1;
            scope.starthandle.month = 12;
          }
        }
        if (handle === 'end') {
          if (edDate.valueOf() > baseDate && scope.starthandle && edDate.valueOf() > stDate.valueOf() && stDate.valueOf() > baseDate.valueOf() && !isNaN(edDate.valueOf()) && !isNaN(stDate.valueOf())) {
            if (scope.endhandle.year !== '' && scope.endhandle.month !== '' && scope.endhandle.days !== '') {
              scope.end = edDate;
              element.find('.dateinput-right').css({ border: 'none' });
              datepickerUtility.datesSelected.second = edDate;
              datepickerUtility.highlightSingleDate();
            }
          } else if (edDate.valueOf() < stDate.valueOf()) {
            element.find('.dateinput-right').css({ border: '1px solid red' });
          }
          if (scope.endhandle.days > datepickerUtility.getDaysInMonth(scope.endhandle.year, scope.endhandle.month - 1)) {
            scope.endhandle.month += 1;
            scope.endhandle.days = 1;
          }
          if (scope.endhandle.month > 12) {
            scope.endhandle.year += 1;
            scope.endhandle.month = 1;
          }
          if (scope.endhandle.days <= 0) {
            scope.endhandle.month -= 1;
            scope.endhandle.days = datepickerUtility.getDaysInMonth(scope.endhandle.year, scope.endhandle.month - 1);
          }
          if (scope.endhandle.month <= 0) {
            scope.endhandle.year -= 1;
            scope.endhandle.month = 12;
          }
        }
      };
      scope.initRangeModePickers = function () {
        $timeout(function () {
          datepickerUtility.highlightSingleDate();
        }, 200);
        scope.timerange.notBeforeDate = new Date(scope.timerange.start_time.getFullYear(), scope.timerange.start_time.getMonth() + 1, 1);
        scope.timerange.notAfterDate = new Date(scope.timerange.end_time.getFullYear(), scope.timerange.end_time.getMonth() - 1, datepickerUtility.getDaysInMonth(scope.timerange.end_time.getFullYear(), scope.timerange.end_time.getMonth() - 1));
        angular.forEach(element.find('.date-display'), function (ele) {
          $timeout(function () {
            angular.element(ele).trigger('click');
            angular.element(ele).find('.datepicker').css({ position: 'inherit', 'box-shadow': 'none' });
            angular.element(ele).find('.date-input').css({ display: 'none' });
          }, 0);
        });
        registerBodyListener();
      };
      scope.initSingleModePicker = function () {
        // scope.singleModeDateModel = new Date();
        angular.forEach(element.find('.date-display'), function (ele) {
          $timeout(function () {
            angular.element(ele).trigger('click');
            angular.element(ele).find('.datepicker').css({ position: 'inherit', 'box-shadow': 'none' });
            angular.element(ele).find('.date-input').css({ display: 'none' });
          }, 0);
          registerBodyListener();
        });
      };
      scope.setstartHandle = function (date) {
        scope.starthandle.year = date.getFullYear();
        scope.starthandle.month = date.getMonth() + 1;
        scope.starthandle.days = date.getDate();
      };
      scope.setendHandle = function (date) {
        scope.endhandle.year = date.getFullYear();
        scope.endhandle.month = date.getMonth() + 1;
        scope.endhandle.days = date.getDate();
      };
      scope.displayPickers = function (event) {
        var style = repositionPickers(event.target);
        isDropdownOpen = !isDropdownOpen;
        if (style !== {}) {
          element.find('.dropdown-content').css(style);
        }
        if (scope.rangemode === true) {
          scope.initRangeModePickers();
        } else {
          scope.initSingleModePicker();
        }
        datepickerUtility.picker_uuid = scope.uuid;
      };
      scope.submitDate = function () {
        var returnObj = {};
        var cb = scope.callback() || scope.onClose();
        if (scope.rangemode === true) {
          returnObj.startDate = scope.start;
          returnObj.endDate = scope.end;
          if (scope.timepicker === true) {
            returnObj.startTime = scope.starttimehandle;
            returnObj.endTime = scope.endtimehandle;
            returnObj.clock = scope.clock;
            if (scope.clock === 12) {
              returnObj.meridian_start = scope.meridian.left === true ? 'AM' : 'PM';
              returnObj.meridian_end = scope.meridian.right === true ? 'AM' : 'PM';
            }
          }
        } else {
          if (scope.timepicker === true) {
            returnObj.time = scope.singleModeTime;
            returnObj.clock = scope.clock;
            if (scope.clock === 12) {
              returnObj.meridian = scope.meridian.singleMode === true ? 'AM' : 'PM';
            }
          }
          returnObj.date = new Date(scope.singledate);
        }
        returnObj.submitTimestamp = (new Date()).valueOf();
        scope.showdropdown = !scope.showdropdown;
        if (!cb) {
          console.log('please define a callback to get a return');
        } else {
          cb(returnObj);
        }
      };
      scope.$on('$destroy', removeEventHandlers);
    },
    controller: function ($scope) {
      var timeValid = function (timeModel, clk) {
        var flag = true;
        if (clk === 12) {
          if (timeModel.hours > 12 || timeModel.hours < 1) {
            flag = false;
          }
        } else if (clk === 24) {
          if (timeModel.hours > 24 || timeModel.hours < 1) {
            flag = false;
          }
        }
        if (timeModel.minutes > 60 || timeModel.minutes < 1) {
          flag = false;
        }
        if (timeModel.seconds > 60 || timeModel.seconds < 1) {
          flag = false;
        }
        return flag;
      };
      $scope.getDateSingleMode = function (date) {
        $scope.$apply(function () {
          $scope.singledate = $filter('date')(date, $scope.format);
          $scope.singlemodehandle.year = date.getFullYear();
          $scope.singlemodehandle.month = date.getMonth() + 1;
          $scope.singlemodehandle.days = date.getDate();
        });
        datepickerUtility.highlightSingleModeDate('single', date);
      };
      $scope.singleModeInputDate = function () {
        $scope.$broadcast('dateChangedFromInput');
      };
      $scope.getDateObj = function () {
        if ($scope.singlemodehandle.month > 12) {
          $scope.singlemodehandle.month = 1;
          $scope.singlemodehandle.year += 1;
        }
        if ($scope.singlemodehandle.month < 1) {
          $scope.singlemodehandle.month = 12;
          $scope.singlemodehandle.year -= 1;
        }
        if ($scope.singlemodehandle.days > datepickerUtility.getDaysInMonth($scope.singlemodehandle.year, ($scope.singlemodehandle.month - 1))) {
          $scope.singlemodehandle.month += 1;
          if ($scope.singlemodehandle.month > 12) {
            $scope.singlemodehandle.month = 1;
            $scope.singlemodehandle.year += 1;
          }
          $scope.singlemodehandle.days = 1;
        }
        if ($scope.singlemodehandle.days < 1) {
          $scope.singlemodehandle.month -= 1;
          $scope.singlemodehandle.days = datepickerUtility.getDaysInMonth($scope.singlemodehandle.year, ($scope.singlemodehandle.month - 1));
        }
        return new Date(Number($scope.singlemodehandle.year), Number($scope.singlemodehandle.month) - 1, Number($scope.singlemodehandle.days));
      };
      this.getUserInputDate = function () {
        var date = $scope.getDateObj();
        var baseDate = new Date(1970, 0, 1, 0, 0, 0);
        if (date !== 'Invalid Date' && date.valueOf() > baseDate.valueOf()) {
          $scope.validSingleModeDate = true;
          $scope.singledate = $filter('date')(date, $scope.format);
          return date;
        } return 'noop';
      };
      $scope.validateTime = function () {
        if ($scope.rangemode === true) {
          if (!timeValid($scope.starttimehandle, $scope.clock) || !timeValid($scope.endtimehandle, $scope.clock)) {
            $scope.invalidTimeRangeMode = true;
          } else {
            $scope.invalidTimeRangeMode = false;
          }
        } else if ($scope.singlemode === true) {
          if (!timeValid($scope.singleModeTime, $scope.clock)) {
            $scope.validSingleModeDate = false;
          } else {
            $scope.validSingleModeDate = true;
          }
        }
      };
    }
  };
}


app.directive('rangeHandler', rangeHandler);
rangeHandler.$inject = ['$window', '$timeout', 'datepickerUtility', '$filter'];

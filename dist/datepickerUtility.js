var app = angular.module('app.daterangehandler');
app.factory('datepickerUtility', function () {
  return {
    removeHighlight: function (id) {
      if (!id) {
        angular.forEach(ng.element(document.querySelectorAll('#left')[0]).find('TD'), function (e) {
          ng.element(e).css({ background: '' }).removeClass('border-radius-start').removeClass('border-radius-end')
          .removeClass('inbetweendates')
          .removeClass('startdate')
          .removeClass('enddate')
          .removeClass('spacing-btw-tr');
        });
        angular.forEach(ng.element(document.querySelectorAll('#right')[0]).find('TD'), function (e) {
          ng.element(e).css({ background: '' }).removeClass('border-radius-start').removeClass('border-radius-end')
          .removeClass('inbetweendates')
          .removeClass('startdate')
          .removeClass('enddate')
          .removeClass('spacing-btw-tr');
        });
      } else {
        angular.forEach(ng.element(document.querySelectorAll('#' + id)[0]).find('TD'), function (e) {
          ng.element(e).removeClass('active');
        });
      }
    },
    clickCount: 0,
    picker_uuid: 0,
    monthHash: {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    },
    clickTarget: {
      first: null,
      second: null
    },
    datesSelected: {
      first: null,
      second: null
    },
    isLeapYear: function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    getDaysInMonth: function (year, month) {
      return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    targetsEqual: function () {
      return this.clickTarget.first === this.clickTarget.second;
    },
    monthModeErr: function (target) {
      var arr1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var arr2 = target.innerText.split(' ')[1];
      if (_.includes(arr1, target.innerText) || !isNaN(Number(arr2))) {
        return false;
      }
      return true;
    },
    bothSelected: false,
    highlightSingleDate: function () {
      var pickr1 = document.querySelectorAll('#left THEAD .date-switch')[0].innerHTML.split(' ');
      var pickr2 = document.querySelectorAll('#right THEAD .date-switch')[0].innerHTML.split(' ');

      var highlightDates1 = function (e) {
        var d = new Date(Number(pickr1[1]), this.monthHash[pickr1[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() === this.datesSelected.first.valueOf()) {
          ng.element(e).addClass('border-radius-start');
          ng.element(e).addClass('startdate');
          ng.element(e).addClass('spacing-btw-tr');
        } if (this.datesSelected.second && d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('enddate');
          ng.element(e).addClass('border-radius-end');
          ng.element(e).addClass('spacing-btw-tr');
        }
      };
      var highlightDates2 = function (e) {
        var d = new Date(Number(pickr2[1]), this.monthHash[pickr2[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() === this.datesSelected.first.valueOf()) {
          ng.element(e).addClass('border-radius-start');
          ng.element(e).addClass('startdate');
          ng.element(e).addClass('spacing-btw-tr');
        } if (this.datesSelected.second && d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('enddate');
          ng.element(e).addClass('border-radius-end');
          ng.element(e).addClass('spacing-btw-tr');
        }
      };
      var hd1 = highlightDates1.bind(this);
      var hd2 = highlightDates2.bind(this);
      this.removeHighlight();
      angular.forEach(ng.element(document.querySelector('#left')).find('TD'), hd1);
      angular.forEach(ng.element(document.querySelector('#right')).find('TD'), hd2);
      if (this.datesSelected.first !== null && this.datesSelected.second !== null && this.clickTarget.first === this.clickTarget.second && this.datesSelected.first.getMonth() === this.datesSelected.second.getMonth()) {
        this.highlightDatesSameMonth.bind(this)();
      }
      if (this.datesSelected.first !== null && this.datesSelected.second !== null && this.clickTarget.first === this.clickTarget.second && this.datesSelected.first.getMonth() !== this.datesSelected.second.getMonth()) {
        this.hghgtDateSmPikrDiffMon.bind(this)();
      }
      if (this.datesSelected.first !== null && this.datesSelected.second !== null && this.clickTarget.first !== this.clickTarget.second) {
        this.hghgtDateDpPikrDiffMon.bind(this)();
      }
    },
    highlightDatesSameMonth: function () {
      var picker1 = document.querySelectorAll('#left THEAD .date-switch')[0].innerHTML.split(' ');
      var picker2 = document.querySelectorAll('#right THEAD .date-switch')[0].innerHTML.split(' ');
      var highlightDates1 = function (e) {
        var d = new Date(Number(picker1[1]), this.monthHash[picker1[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() > this.datesSelected.first.valueOf() && d.valueOf() < this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('inbetweendates');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.first.valueOf()) {
          ng.element(e).addClass('border-radius-start');
          ng.element(e).addClass('startdate');
          ng.element(e).addClass('spacing-btw-tr');
        } if (d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('enddate');
          ng.element(e).addClass('border-radius-end');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (e.previousElementSibling === null || e.previousElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-left-td');
        }
        if (e.nextElementSibling === null || e.nextElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-right-td');
        }
      };
      var highlightDates2 = function (e) {
        var d = new Date(Number(picker2[1]), this.monthHash[picker2[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() > this.datesSelected.first.valueOf() && d.valueOf() < this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('inbetweendates');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.first.valueOf()) {
          ng.element(e).addClass('border-radius-start');
          ng.element(e).addClass('startdate');
          ng.element(e).addClass('spacing-btw-tr');
        } if (d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('enddate');
          ng.element(e).addClass('border-radius-end');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (e.previousElementSibling === null || e.previousElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-left-td');
        }
        if (e.nextElementSibling === null || e.nextElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-right-td');
        }
      };
      var hD1 = highlightDates1.bind(this);
      var hD2 = highlightDates2.bind(this);
      angular.forEach(ng.element(document.querySelector('#left')).find('TD'), hD1);
      angular.forEach(ng.element(document.querySelector('#right')).find('TD'), hD2);
    },
    hghgtDateSmPikrDiffMon: function () {
      var picker1 = document.querySelectorAll('#left THEAD .date-switch')[0].innerHTML.split(' ');
      var picker2 = document.querySelectorAll('#right THEAD .date-switch')[0].innerHTML.split(' ');
      var highlightDates1 = function (e) {
        var d = new Date(Number(picker1[1]), this.monthHash[picker1[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() > this.datesSelected.first.valueOf() && d.valueOf() < this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('inbetweendates');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.first.valueOf()) {
          ng.element(e).addClass('border-radius-start');
          ng.element(e).addClass('startdate');
          ng.element(e).addClass('spacing-btw-tr');
        } if (d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('enddate');
          ng.element(e).addClass('border-radius-end');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (e.previousElementSibling === null || e.previousElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-left-td');
        }
        if (e.nextElementSibling === null || e.nextElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-right-td');
        }
      };
      var highlightDates2 = function (e) {
        var d = new Date(Number(picker2[1]), this.monthHash[picker2[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() > this.datesSelected.first.valueOf() && d.valueOf() < this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('inbetweendates');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.first.valueOf()) {
          ng.element(e).addClass('startdate').addClass('border-radius-start');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('enddate').addClass('border-radius-end');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (e.previousElementSibling === null || e.previousElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-left-td');
        }
        if (e.nextElementSibling === null || e.nextElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-right-td');
        }
      };
      var hD1 = highlightDates1.bind(this);
      var hD2 = highlightDates2.bind(this);
      angular.forEach(ng.element(document.querySelector('#left')).find('TD'), hD1);
      angular.forEach(ng.element(document.querySelector('#right')).find('TD'), hD2);
    },
    hghgtDateDpPikrDiffMon: function () {
      var picker1 = document.querySelectorAll('#left THEAD .date-switch')[0].innerHTML.split(' ');
      var picker2 = document.querySelectorAll('#right THEAD .date-switch')[0].innerHTML.split(' ');
      var highlightDates1 = function (e) {
        var d = new Date(Number(picker1[1]), this.monthHash[picker1[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() > this.datesSelected.first.valueOf() && d.valueOf() < this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('inbetweendates');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.first.valueOf()) {
          ng.element(e).addClass('startdate');
          ng.element(e).addClass('border-radius-start');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('enddate');
          ng.element(e).addClass('border-radius-end');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (e.previousElementSibling === null || e.previousElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-left-td');
        }
        if (e.nextElementSibling === null || e.nextElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-right-td');
        }
      };
      var highlightDates2 = function (e) {
        var d = new Date(Number(picker2[1]), this.monthHash[picker2[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() > this.datesSelected.first.valueOf() && d.valueOf() < this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('inbetweendates');
          ng.element(e).addClass('spacing-btw-tr');
        }
        if (d.valueOf() === this.datesSelected.first.valueOf() || d.valueOf() === this.datesSelected.second.valueOf()) {
          ng.element(e).addClass('startdate');
        }
        if (e.previousElementSibling === null || e.previousElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-left-td');
        }
        if (e.nextElementSibling === null || e.nextElementSibling.style.visibility === 'hidden') {
          ng.element(e).addClass('corner-element-right-td');
        }
      };
      var hD1 = highlightDates1.bind(this);
      var hD2 = highlightDates2.bind(this);
      angular.forEach(ng.element(document.querySelector('#' + this.clickTarget.first)).find('TD'), hD1);
      angular.forEach(ng.element(document.querySelector('#' + this.clickTarget.second)).find('TD'), hD2);
    },
    highlightSingleModeDate: function (id, date) {
      var picker = document.querySelectorAll('#' + id + ' THEAD .date-switch')[0].innerHTML.split(' ');
      var highF = function (e) {
        var d = new Date(Number(picker[1]), this.monthHash[picker[0].toLowerCase()], Number(e.innerHTML));
        if (d.valueOf() === date.valueOf()) {
          ng.element(e).addClass('active');
        }
      };
      var highFun = highF.bind(this);
      this.removeHighlight(id);
      angular.forEach(ng.element(document.querySelectorAll('#' + id)[0]).find('TD'), highFun);
    }
  };
});

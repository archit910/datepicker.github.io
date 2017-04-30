/**
 * angular-module-boilerplate - A starter project for AngularJS Module
 * @author Ayush Sharma
 * @version v0.0.0
 * @link http://ayusharma.in
 * @license MIT
 */
var app = angular.module('hello');

app.directive('hello', function () {

});

angular.module("hello").run(["$templateCache", function($templateCache) {$templateCache.put("hello.html","<h3>Hello World</h3>");}]);
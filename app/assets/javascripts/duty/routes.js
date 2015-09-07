/**
 * Dashboard routes.
 */
define(['angular', './controllers', 'common'], function (angular, controllers) {
    'use strict';

    var mod = angular.module('duty.routes', ['sc.common']);
    mod.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/duty', {templateUrl: '/assets/javascripts/duty/duty.html', controller: controllers.DutyCtrl})
            .when('/people', {templateUrl: '/assets/javascripts/duty/people.html', controller: controllers.PeopleCtrl})
            .when('/places', {templateUrl: '/assets/javascripts/duty/places.html', controller: controllers.PlacesCtrl})
            .when('/timetable', {templateUrl: '/assets/javascripts/duty/timetable.html', controller: controllers.TimetableCtrl})
            .when('/print', {templateUrl: '/assets/javascripts/duty/print.html', controller: controllers.PrintCtrl});
    }]);
    return mod;
});

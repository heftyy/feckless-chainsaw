/**
 * Home controllers.
 */
define([], function () {
    'use strict';

    /** Controls the index page */
    var HomeCtrl = function ($scope, $rootScope, $location, helper) {
        console.log(helper.sayHi());
        $rootScope.pageTitle = 'Welcome';
    };
    HomeCtrl.$inject = ['$scope', '$rootScope', '$location', 'helper'];

    /** Controls the header */
    var HeaderCtrl = function ($scope, userService, helper, $location) {
        console.log('header ctrl');
    };
    HeaderCtrl.$inject = ['$scope', 'helper', '$location'];

    /** Controls the footer */
    var FooterCtrl = function (/*$scope*/) {
    };
    //FooterCtrl.$inject = ['$scope'];

    return {
        HeaderCtrl: HeaderCtrl,
        FooterCtrl: FooterCtrl,
        HomeCtrl: HomeCtrl
    };

});

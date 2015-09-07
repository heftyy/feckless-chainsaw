/**
 * duty/main.js is the entry module which serves as an entry point so other modules only have
 * to include a single module.
 */
define(['angular', './routes'], function (angular) {
    'use strict';

    return angular.module('sc.duty', ['ngRoute', 'ngStorage', 'duty.routes']);
});

/**
 * A common directive.
 * It would also be ok to put all directives into one file, or to define one RequireJS module
 * that references them all.
 */
define(['angular'], function (angular) {
    'use strict';

    var mod = angular.module('common.directives.example', []);
    mod.directive('input', [function () {
        var directiveDefinitionObject = {
            restrict: 'E',
            require: '?ngModel',
            link: function postLink(scope, iElement, iAttrs, ngModelController) {
                if (iAttrs.value && ngModelController) {
                    ngModelController.$setViewValue(iAttrs.value);
                }
            }
        };

        return directiveDefinitionObject;
    }]);

    mod.directive('example', ['$log', function($log) {
        return {
            restrict: 'AE',
            link: function(/*scope, el, attrs*/) {
                $log.info('Here prints the example directive from /common/directives.');
            }
        };
    }]);
    return mod;
});

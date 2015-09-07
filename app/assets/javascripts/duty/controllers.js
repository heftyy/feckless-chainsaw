/**
 * duty controllers.
 */
define([], function () {
    'use strict';

    var DutyCtrl = function ($scope) {
    };
    DutyCtrl.$inject = ['$scope'];

    var PeopleCtrl = function ($scope, $localStorage) {
        $scope.form = {};
        $scope.people = $.isArray($localStorage.people) ? $localStorage.people : [];

        $scope.addPerson = function(person) {
            var p = {firstName: person.firstName, lastName: person.lastName, fullName: person.firstName + " " + person.lastName};
            $scope.people.push(p);

            $localStorage.people = $scope.people.slice();
        };

        $scope.removePerson = function(person) {
            for(var i = 0; i < $scope.people.length; i++) {
                if($scope.people[i].firstName === person.firstName &&
                    $scope.people[i].lastName === person.lastName) $scope.people.splice(i, 1);
            }

            $localStorage.people = $scope.people.slice();
        };
    };
    PeopleCtrl.$inject = ['$scope', '$localStorage'];

    var PlacesCtrl = function ($scope, $localStorage) {
        $scope.form = {};
        $scope.places = $.isArray($localStorage.places) ? $localStorage.places : [];

        $scope.addPlace = function(place) {
            var p = {name: place.name};
            $scope.places.push(p);

            $localStorage.places = $scope.places.slice();
        };

        $scope.removePlace = function(place) {
            for(var i = 0; i < $scope.places.length; i++) {
                if($scope.places[i].name === place.name) $scope.places.splice(i, 1);
            }

            $localStorage.places = $scope.places.slice();
        };
    };
    PlacesCtrl.$inject = ['$scope', '$localStorage'];

    var TimetableCtrl = function($scope, $localStorage) {
        $scope.daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
        $scope.breakTimes = {1: 10, 2: 10, 3: 10, 4: 10, 5: 20, 6: 10, 7: 10, 8: 10, 9: 10};
        $scope.places = $.isArray($localStorage.places) ? $localStorage.places : [];
        $scope.people = $.isArray($localStorage.people) ? $localStorage.people : [];

        var getPersonIndex = function(firstName, lastName) {
            for(var i = 0; i < $scope.people.length; i++) {
                var person = $scope.people[i];
                if(person.firstName === firstName && person.lastName === lastName) return i;
            }
            return -1;
        };

        var countTotalTimeForPerson = function(personIndex) {
            var person = $scope.people[personIndex];
            var total = 0;

            for(var i = 0; i < $scope.places.length; i++) {
                var place = $scope.places[i];
                for(var j = 0; j < $scope.daysOfWeek.length; j++) {
                    var day = $scope.daysOfWeek[j];

                    if(person[day] === undefined) continue;
                    var breakIndex = person[day][place.name];

                    if(breakIndex !== undefined) {
                        total += $scope.breakTimes[breakIndex];
                    }
                }
            }

            person.totalTime = total;
        };

        $scope.updateTimeTable = function(breakIndex, time, day, place, selected) {
            var index = getPersonIndex(selected.firstName, selected.lastName);
            if(index === -1) return;

            if($scope.people[index][day] === undefined) $scope.people[index][day] = {};
            $scope.people[index][day][place] = breakIndex;
            countTotalTimeForPerson(index);
        };

        $scope.getTimeForPerson = function(day, place, firstName, lastName) {
            var index = getPersonIndex(firstName, lastName);
            var person = $scope.people[index];

            if(person[day] === undefined) return;

            return $scope.people[index][day][place];
        };
    };
    TimetableCtrl.$inject = ['$scope', '$localStorage'];

    return {
        DutyCtrl: DutyCtrl,
        PeopleCtrl: PeopleCtrl,
        PlacesCtrl: PlacesCtrl,
        TimetableCtrl: TimetableCtrl
    };

});

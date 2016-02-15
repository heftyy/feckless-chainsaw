/**
 * duty controllers.
 */
define([], function () {
    'use strict';

    function clone(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

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
        $scope.breakTimes = {0: 15, 1: 10, 2: 10, 3: 10, 4: 10, 5: 20, 6: 10, 7: 10};
        $scope.places = $.isArray($localStorage.places) ? $localStorage.places : [];
        $scope.people = $.isArray($localStorage.people) ? $localStorage.people : [];
        $scope.timeTable = $.isPlainObject($localStorage.timeTable) ? $localStorage.timeTable : {};

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
                var place = $scope.places[i].name;
                for(var j = 0; j < $scope.daysOfWeek.length; j++) {
                    var day = $scope.daysOfWeek[j];
                    for (var breakIndex in $scope.breakTimes) {
                        if ($scope.breakTimes.hasOwnProperty(breakIndex)) {
                            var breakTime = $scope.breakTimes[breakIndex];

                            if($scope.timeTable[place] === undefined) continue;
                            if($scope.timeTable[place][day] === undefined) continue;
                            if($scope.timeTable[place][day][breakIndex] === undefined) continue;

                            if(personIndex === $scope.timeTable[place][day][breakIndex]) {
                                total += breakTime;
                            }
                        }
                    }
                }
            }

            person.totalTime = total;
        };

        $scope.updateTimeTable = function(breakIndex, time, day, place, selected) {
            var personIndex;
            if(selected === undefined)
                personIndex = -1;
            else
                personIndex = getPersonIndex(selected.firstName, selected.lastName);

            if($scope.timeTable[place] === undefined) $scope.timeTable[place] = {};
            if($scope.timeTable[place][day] === undefined) $scope.timeTable[place][day] = {};

            if(personIndex === -1)
                delete $scope.timeTable[place][day][breakIndex];
            else
                $scope.timeTable[place][day][breakIndex] = personIndex;

            for(var i = 0; i < $scope.people.length; i++) {
                countTotalTimeForPerson(i);
            }

            $localStorage.timeTable = clone($scope.timeTable);
        };

        $scope.getPerson = function(place, day, breakIndex) {        
            if($scope.timeTable[place] === undefined) return;
            if($scope.timeTable[place][day] === undefined) return;
            if($scope.timeTable[place][day][breakIndex] === undefined) return;

            var index = $scope.timeTable[place][day][breakIndex];

            return $scope.people[index];
        };

        $scope.saveToServer = function(e) {
            var button = $(e.currentTarget).button('loading');

            var json = {
                people: clone($localStorage.people),
                places: clone($localStorage.places),
                timeTable: clone($localStorage.timeTable)
            };

            jsRoutes.controllers.Application.saveDuty().ajax({
                data: {json: JSON.stringify(json)},
                success: function() {
                    button.button('reset');
                }
            });
        };

        $scope.loadFromServer = function(e) {
            var button = $(e.currentTarget).button('loading');

            jsRoutes.controllers.Application.loadDuty().ajax({
                success: function(response) {
                    button.button('reset');

                    $scope.people = response.people;
                    $scope.places = response.places;
                    $scope.timeTable = response.timeTable;

                    $localStorage.people = clone($scope.people);
                    $localStorage.places = clone($scope.places);
                    $localStorage.timeTable = clone($scope.timeTable);
                }
            });
        };
    };
    TimetableCtrl.$inject = ['$scope', '$localStorage'];

    var PrintCtrl = function ($scope, $localStorage) {
        $scope.daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
        $scope.breakTimes = {0: 15, 1: 10, 2: 10, 3: 10, 4: 10, 5: 20, 6: 10, 7: 10};
        $scope.places = $.isArray($localStorage.places) ? $localStorage.places : [];
        $scope.people = $.isArray($localStorage.people) ? $localStorage.people : [];
        $scope.timeTable = $.isPlainObject($localStorage.timeTable) ? $localStorage.timeTable : {};

        $scope.printDiv = function(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank', 'width=1000,height=800');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        };

        $scope.getPerson = function(place, day, breakIndex) {
            if($scope.timeTable[place] === undefined) return;
            if($scope.timeTable[place][day] === undefined) return;
            if($scope.timeTable[place][day][breakIndex] === undefined) return;

            var index = $scope.timeTable[place][day][breakIndex];

            return $scope.people[index];
        };
    };
    PrintCtrl.$inject = ['$scope', '$localStorage'];

    return {
        DutyCtrl: DutyCtrl,
        PeopleCtrl: PeopleCtrl,
        PlacesCtrl: PlacesCtrl,
        TimetableCtrl: TimetableCtrl,
        PrintCtrl: PrintCtrl
    };

});

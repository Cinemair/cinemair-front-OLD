var module = angular.module('cinemair.controllers');

var eventsCtrl = function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {

    var _loadEvents = function() {
        return CinemairSrv.getEvents().success(function(events) {
            $scope.events = events;
        });
    };

    var _deleteEvents = function(event) {
        return CinemairSrv.deleteEvent(event.id).then(function() {
            _loadEvents();
        });
    };

    $scope.deleteEvents = function() {
        $ionicLoading.show({
            content: 'Loading shows'
        });
        _deleteEvents().success(function() {
            $ionicLoading.hide();
        });
    };

    var init = function() {
        $ionicBackdrop.retain();
        $ionicLoading.show({
            content: 'Loading events'
        });
        _loadEvents().success(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    };

    init();
};

module.controller('EventsCtrl', [
    "$scope",
    "$ionicLoading",
    "$ionicBackdrop",
    "CinemairSrv",
    "UserSrv",
    eventsCtrl
]);

var eventDetailCtrl = function($scope, $ionicLoading, $stateParams, $q, CinemairSrv, UserSrv) {

    var EventID = $stateParams.id;

    var _getSingleShow = function() {
        return CinemairSrv.getSingleShow(EventID).success(function(show) {
            $scope.show = show;
        });
    };

    var _createEvent = function() {
        CinemairSrv.createEvent(show.id).then(function() {
            _getSingleShow().success(function() {
                $ionicLoading.hide();
            });
        });
    };

    var _deleteEvent = function() {
        CinemairSrv.deleteEvent(show.event).then(function() {
            _getSingleShow().success(function() {
                $ionicLoading.hide();
            });
        });
    };

    $scope.toggleShow = function(show) {
        $ionicLoading.show({
            content: 'Loading movies'
        });
        if (show.event === null){
            _createEvent();
        } else {
            _deleteEvent();
        }
    };

    var init = function() {
        $ionicLoading.show({
            content: 'Loading events'
        });
        _getSingleShow().success(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    };

    init();
}

module.controller('EventDetailCtrl', [
    '$scope',
    '$ionicLoading',
    '$stateParams',
    '$q',
    'CinemairSrv',
    'UserSrv',
    eventDetailCtrl
]);

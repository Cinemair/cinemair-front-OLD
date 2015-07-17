var module = angular.module('cinemair.controllers');

var cinemasCtrl = function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {

    var _getCinemas = function() {
        return CinemairSrv.getCinemas().success(function(cinemas) {
            $scope.cinemas = cinemas;
        });
    }

    var init = function() {
        $ionicBackdrop.retain();
        $ionicLoading.show({
            content: 'Loading events'
        });
        _getCinemas().success(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    }

    init();
}

module.controller('CinemasCtrl', [
    '$scope',
    "$ionicLoading",
    "$ionicBackdrop",
    "CinemairSrv",
    "UserSrv",
    cinemasCtrl
]);

var module = angular.module('cinemair.controllers');

var loginCtrl = function($scope, $ionicLoading, $ionicBackdrop, UserSrv, $stateParams, $location) {

    var user = UserSrv.getUser();

    _goToSchedule = function() {
        $location.url("/tab/events");
    };

    $scope.login = function() {
        UserSrv.googleAuth.getAuthorizedCodeFromGoogle();
    };

    var init = function() {
        if (!_.isUndefined(user) && !_.isNull(user)) {
            _goToSchedule();
        }
        if ($stateParams.state === "google-login") {
            $ionicBackdrop.retain();
            $ionicLoading.show({
                content: 'Loading shows'
            });

            var code = $stateParams.code;
            UserSrv.googleAuth.loginOrRegisterWithGoogleAccount(code).then(function() {
                _goToSchedule()
                $ionicLoading.hide();
                $ionicBackdrop.release();
            });
        }
    }

    init();

}

module.controller('LoginCtrl', [
    "$scope",
    "$ionicLoading",
    "$ionicBackdrop",
    "UserSrv",
    "$stateParams",
    "$location",
    loginCtrl
]);

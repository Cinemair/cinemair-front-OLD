var module = angular.module('cinemair.controllers');

var moviesCtrl = function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {

    var _getMovies = function() {
        return CinemairSrv.getMovies().success(function(movies) {
            $scope.movies = movies;
        });
    };

    var init = function() {
        $ionicBackdrop.retain();
        $ionicLoading.show({
            content: 'Loading events'
        });
        _getMovies().success(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    }

    init();
};

module.controller('MoviesCtrl', [
    "$scope",
    "$ionicLoading",
    "$ionicBackdrop",
    "CinemairSrv",
    "UserSrv",
    moviesCtrl
]);

var movieDetailCtrl = function($scope, $ionicLoading, $ionicBackdrop, $stateParams, $q, CinemairSrv, $ionicSlideBoxDelegate, UserSrv) {

    var movieId = $stateParams.id;

    var _getMovies = function() {
        return CinemairSrv.getMovies().success(function(movies) {
            $scope.movies = movies;
        });
    };

    var _getMovieShows = function() {
        return CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
            $scope.shows = movieShows;
        });
    };

    $q.all([_getMovies(), _getMovieShows()]).then(function() {
        $ionicLoading.hide();
        $ionicBackdrop.release();
        $ionicSlideBoxDelegate.update();
        $scope.movieid = movieId - 1;
    });

    $scope.slideHasChanged = function(index) {
        $ionicLoading.show({
            content: 'Loading movies'
        });
        _getMovieShows().success(function() {
            $scope.shows = movieShows;
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    }

    $scope.toggleShow = function(show) {
        $ionicLoading.show({
            content: 'Loading shows'
        });
        if (show.event === null){
            CinemairSrv.createEvent(show.id).then(function() {
                _getMovieShows().success(function() {
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                })
            });
        }
        else {
            CinemairSrv.deleteEvent(show.event).then(function() {
                _getMovieShows().success(function() {
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                })
            });
        }
    };

    var init = function() {
        $ionicBackdrop.retain();
        $ionicLoading.show({
            content: 'Loading movie'
        });
    }

    init();
};

module.controller('MovieDetailCtrl', [
    "$scope",
    "$ionicLoading",
    "$ionicBackdrop",
    "$stateParams",
    "$q",
    "CinemairSrv",
    "$ionicSlideBoxDelegate",
    "UserSrv",
    movieDetailCtrl
]);

angular.module('cinemair.controllers', [])

/******************************************************/
/* Login Controller
/******************************************************/
.controller('LoginCtrl', function($scope, $ionicLoading, $ionicBackdrop, UserSrv, $stateParams, $location) {
    $scope.login = function() {
        UserSrv.googleAuth.getAuthorizedCodeFromGoogle();
    };

    _goToSchedule = function(){
        $location.url("/tab/schedule");
    };

    user = UserSrv.getUser()

    if(!_.isUndefined(user) && !_.isNull(user)){
        _goToSchedule();
    }

    if ($stateParams.state === "google-login"){
        $ionicBackdrop.retain();
        $ionicLoading.show({content: 'Loading shows'});

        code = $stateParams.code
        UserSrv.googleAuth.loginOrRegisterWithGoogleAccount(code).then(function(){
            _goToSchedule()
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    }
})


.controller('ShowsCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        usersrv.logout();
    };

    $ionicBackdrop.retain();

    $ionicLoading.show({
        content: 'Loading shows'
    });

    CinemairSrv.getShows().success(function(shows) {
        $ionicLoading.hide();
        $ionicBackdrop.release();
        var groupedShows = _.groupBy(shows, function(show) {
            return moment(show.datetime).format('Do MMM YYYY');
        });
        $scope.shows = groupedShows;
    });

    $scope.toggleShow = function(show) {
        $ionicLoading.show({
            content: 'Loading shows'
        });
        if (show.event === null){
            // Create
            CinemairSrv.createEvent(show.id).then(function() {
                CinemairSrv.getShows().success(function(shows) {
                    var groupedShows = _.groupBy(shows, function(show) {
                        return moment(show.datetime).format('Do MMM YYYY');
                    });
                    $scope.shows = groupedShows;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteEvent(show.event).then(function() {
                CinemairSrv.getShows().success(function(shows) {
                    var groupedShows = _.groupBy(shows, function(show) {
                        return moment(show.datetime).format('Do MMM YYYY');
                    });
                    $scope.shows = groupedShows;
                    $ionicLoading.hide();
                });
            });
        }
    };
})

.controller('MoviesCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        usersrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading movies'
    });
    CinemairSrv.getMovies()
        .success(function(movies) {
            $ionicLoading.hide();
            $ionicBackdrop.release();
            $scope.movies = movies;
        });
})

.controller('MovieDetailCtrl', function($scope, $ionicLoading, $ionicBackdrop, $stateParams, $q, CinemairSrv, $ionicSlideBoxDelegate, UserSrv) {
    $scope.logout = function(){
        usersrv.logout();
    };

    $ionicLoading.show({
        content: 'Loading movies'
    });
    var movieId = $stateParams.id;

    var getMovies = CinemairSrv.getMovies().success(function(movies) {
        $scope.movies = movies;
    });

    var getMovieShowsPromise = CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
        $scope.shows = movieShows;
    });

    $scope.slideHasChanged = function(index) {
        $ionicLoading.show({
            content: 'Loading movies'
        });
        var getMovieShowsPromise = CinemairSrv.getMovieShows($scope.movies[index].id).success(function(movieShows) {
            $scope.shows = movieShows;
            $ionicLoading.hide();
        });
    }

    $q.all([getMovies, getMovieShowsPromise]).then(function() {
        $ionicLoading.hide();
        $ionicSlideBoxDelegate.update();
        $scope.movieid = movieId - 1;
    });

    $scope.toggleShow = function(show) {
        $ionicLoading.show({
            content: 'Loading shows'
        });
        if (show.event === null){
            // Create
            CinemairSrv.createEvent(show.id).then(function() {
                CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteEvent(show.event).then(function() {
                CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                });
            });
        }
    };
})

.controller('CinemasCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        usersrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading cinemas'
    });
    CinemairSrv.getCinemas().success(function(cinemas) {
        $ionicLoading.hide();
        $ionicBackdrop.release();
        $scope.cinemas = cinemas;
    });
})

.controller('ScheduleCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        usersrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading events'
    });
    CinemairSrv.getEvents().success(function(events) {
        $scope.events = events;
        $ionicLoading.hide();
        $ionicBackdrop.release();
    });
    $scope.deleteEvent = function(event) {
        $ionicLoading.show({
            content: 'Loading shows'
        });
        // Delete
        CinemairSrv.deleteEvent(event.id).then(function() {
            CinemairSrv.getEvents().success(function(events) {
                $scope.events = events;
                $ionicLoading.hide();
            });
        });
    };
})

.controller('ScheduleDetailCtrl', function($scope, $ionicLoading, $stateParams, $q, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        usersrv.logout();
    };

    $ionicLoading.show({
        content: 'Loading movies'
    });

    var EventID = $stateParams.id;

    CinemairSrv.getSingleShow(EventID).success(function(show) {
        $ionicLoading.hide();
        $scope.show = show;
    });

    $scope.toggleShow = function(show) {
        $ionicLoading.show({
            content: 'Loading movies'
        });
        if (show.event === null){
            // Create
            CinemairSrv.createEvent(show.id).then(function() {
                CinemairSrv.getSingleShow(EventID).success(function(show) {
                    $scope.show = show;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteEvent(show.event).then(function() {
                CinemairSrv.getSingleShow(EventID).success(function(show) {
                    $scope.show = show;
                    $ionicLoading.hide();
                });
            });
        }
    };
});

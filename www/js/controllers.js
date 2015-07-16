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
        UserSrv.googleAuth.loginOrRegisterWithGoogleAccount(code).then(function(response){
            _goToSchedule()
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    }
})


.controller('DatesCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv) {
    $ionicBackdrop.retain();

    $ionicLoading.show({
        content: 'Loading shows'
    });

    CinemairSrv.getShows()
        .then(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
            var groupedShows = _.groupBy(shows, function(show) {
                return moment(show.datetime).format('Do MMM YYYY');
            });
            $scope.shows = groupedShows;
        });
})

.controller('MoviesCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading movies'
    });
    CinemairSrv.getMovies()
        .then(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
            $scope.movies = movies;
        });
})

.controller('MovieDetailCtrl', function($scope, $ionicLoading, $ionicBackdrop, $stateParams, $q, CinemairSrv, $ionicSlideBoxDelegate) {
    $ionicLoading.show({
        content: 'Loading movies'
    });
    var movieId = $stateParams.id;

    var getMovies = CinemairSrv.getMovies().then(function() {
        $scope.movies = movies;
    });

    var getMovieShowsPromise = CinemairSrv.getMovieShows(movieId).then(function() {
        $scope.shows = movieShows;
    });

    $scope.slideHasChanged = function(index) {
        $ionicLoading.show({
            content: 'Loading movies'
        });
        var getMovieShowsPromise = CinemairSrv.getMovieShows($scope.movies[index].id).then(function() {
            $scope.shows = movieShows;
            $ionicLoading.hide();
        });
    }

    $q.all([getMovies, getMovieShowsPromise]).then(function() {
        $ionicLoading.hide();
        $ionicSlideBoxDelegate.update();
        $scope.movieid = movieId - 1;
    });
})

.controller('CinemasCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading cinemas'
    });
    CinemairSrv.getCinemas()
        .then(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
            $scope.cinemas = cinemas;
        });
})

.controller('ScheduleCtrl', function($scope, $ionicLoading, $ionicBackdrop, $stateParams, CinemairSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading events'
    });
    var movieId = $stateParams.id;
    CinemairSrv.getEvents()
        .then(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
            $scope.events = events;
        });
})

.controller('ScheduleDetailCtrl', function($scope, $ionicLoading, $stateParams, $q, CinemairSrv) {
    $ionicLoading.show({
        content: 'Loading movies'
    });

    var EventID = $stateParams.id;

    CinemairSrv.getSingleShow(EventID).then(function() {
        console.log(show);
        $ionicLoading.hide();
        $scope.show = show;
    });
});

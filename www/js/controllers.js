angular.module('cinemair.controllers', [])

.controller('LoginCtrl', function($scope) {})

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
            console.log(groupedShows);
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
            console.log(movies);
            $scope.movies = movies;
        });
})

.controller('MovieDetailCtrl', function($scope, $ionicLoading, $ionicBackdrop, $stateParams, CinemairSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading movies'
    });
    var movieId = $stateParams.id;
    CinemairSrv.getSingleMovie(movieId)
    .then(function() {
        $ionicLoading.hide();
        $ionicBackdrop.release();
        console.log(movie);
        $scope.release = moment(movie.tmdb_info.release_date).format('LL');
        $scope.countries = movie.tmdb_info.production_countries;
        $scope.genres = movie.tmdb_info.genres;
        $scope.movie = movie;
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
            console.log(cinemas);
            $scope.cinemas = cinemas;
        });
})

.controller('ScheduleCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading events'
    });
    CinemairSrv.getEvents()
        .then(function() {
            $ionicLoading.hide();
            $ionicBackdrop.release();
            var groupedEvents = _.groupBy(events, function(event) {
                return moment(event.datetime).format('LL');
            });
            var eventHour = moment(events.datetime).format('HH:mm');

            $scope.eventHour = eventHour;
            console.log(groupedEvents);
            $scope.events = groupedEvents;
        });
});

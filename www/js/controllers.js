angular.module('cinemair.controllers', [])

.controller('LoginCtrl', function($scope) {})
.controller('DatesCtrl', function($scope, $ionicLoading, CinemairSrv) {
    $ionicLoading.show({
        content: 'Loading shows'
    });
    CinemairSrv.getShows()
    .then(function() {
        $ionicLoading.hide();
        var groupedShows = _.groupBy(shows, function(show) {
            return moment(show.datetime).format('Do MMM YYYY');
        });
        console.log(groupedShows);
        $scope.shows = groupedShows;
    });
})

.controller('MoviesCtrl', function($scope, $ionicLoading, CinemairSrv) {
    $ionicLoading.show({
        content: 'Loading movies'
    });
    CinemairSrv.getMovies()
    .then(function() {
        $ionicLoading.hide();
        console.log(movies);
        $scope.movies = movies;
    });
})

.controller('CinemasCtrl', function($scope, $ionicLoading, CinemairSrv) {
    $ionicLoading.show({
        content: 'Loading cinemas'
    });
    CinemairSrv.getCinemas()
    .then(function() {
        $ionicLoading.hide();
        console.log(cinemas);
        $scope.cinemas = cinemas;
    });
})
.controller('ScheduleCtrl', function($scope, $ionicLoading, CinemairSrv) {
    $ionicLoading.show({
        content: 'Loading events'
    });
    CinemairSrv.getEvents()
    .then(function() {
        $ionicLoading.hide();
        var groupedEvents = _.groupBy(events, function(event) {
            return moment(event.datetime).format('Do MMM YYYY');
        });
        console.log(groupedEvents);
        $scope.events = groupedEvents;
    });
});

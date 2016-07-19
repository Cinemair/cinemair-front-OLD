angular.module('cinemair.controllers', [])

/******************************************************/
/* Login Controller
/******************************************************/
.controller('LoginCtrl', function($scope, $ionicLoading, $ionicBackdrop, UserSrv, $stateParams, $location) {
    $scope.login = function() {
        UserSrv.googleAuth.getAuthorizedCodeFromGoogle();
    };

    _goToFavorites = function(){
        $location.url("/tab/favorites");
    };

    user = UserSrv.getUser();

    if(!_.isUndefined(user) && !_.isNull(user)){
        _goToFavorites();
    }

    if ($stateParams.state === "google-login"){
        $ionicBackdrop.retain();
        $ionicLoading.show({content: 'Loading...'});

        code = $stateParams.code;
        UserSrv.googleAuth.loginOrRegisterWithGoogleAccount(code).then(function(){
            _goToFavorites();
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    }
})


/******************************************************/
/* Shows Controller
/******************************************************/
.controller('ShowsCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading shows'});

    CinemairSrv.getShows().success(function(shows) {
        $ionicLoading.hide();
        $ionicBackdrop.release();

        $scope.shows = _.groupBy(shows, function(show) {
            return moment(show.datetime).utc().format('D MMM YYYY');
        });
    });

    $scope.toggleFavorite = function(show) {
        $ionicLoading.show({content: 'Loading shows'});

        if (show.favorite === null){
            // Create
            CinemairSrv.createFavorite(show.id).then(function() {
                CinemairSrv.getShows().success(function(shows) {
                    $scope.shows = _.groupBy(shows, function(show) {
                        return moment(show.datetime).utc().format('D MMM YYYY');
                    });
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteFavorite(show.favorite).then(function() {
                CinemairSrv.getShows().success(function(shows) {
                    $scope.shows = _.groupBy(shows, function(show) {
                        return moment(show.datetime).utc().format('D MMM YYYY');
                    });
                    $ionicLoading.hide();
                });
            });
        }
    };
})

.controller('ShowDetailCtrl', function($scope, $ionicLoading, $ionicBackdrop, $stateParams, CinemairSrv, UserSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading movies'});

    var showId = $stateParams.showId;

    CinemairSrv.getShow(showId).success(function(show) {
        $scope.show = show;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });

    $scope.toggleFavorite = function(show) {
        $ionicLoading.show({content: 'Loading show'});

        if (show.favorite === null){
            // Create
            CinemairSrv.createFavorite(show.id).then(function() {
                CinemairSrv.getShow(showId).success(function(show) {
                    $scope.show = show;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteFavorite(show.favorite).then(function() {
                CinemairSrv.getShow(showId).success(function(show) {
                    $scope.show = show;
                    $ionicLoading.hide();
                });
            });
        }
    };
})


/******************************************************/
/* Movies Controller
/******************************************************/
.controller('MoviesCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading movies'});

    CinemairSrv.getMovies().success(function(movies) {
        $scope.movies = movies;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });
})

.controller('MovieDetailCtrl', function($scope, $q, $ionicLoading, $ionicBackdrop, $stateParams, CinemairSrv, UserSrv) {
    var movieId = $stateParams.movieId;

    var moviePromise = CinemairSrv.getMovie(movieId).success(function(movie) {
        $scope.movie = movie;
    });
    var showsPromise = CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
        $scope.shows = movieShows;
    });

    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading movies'});
    $q.all([moviePromise, showsPromise]).then(function() {
        $ionicLoading.hide();
        $ionicBackdrop.release();
    });

    $scope.toggleFavorite = function(show) {
        console.log("caca");
        $ionicLoading.show({content: 'Loading shows'});

        if (show.favorite === null){
            // Create
            CinemairSrv.createFavorite(show.id).then(function() {
                console.log("caca1");
                CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
                    console.log("caca2");
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteFavorite(show.favorite).then(function() {
                CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                });
            });
        }
    };
})


/******************************************************/
/* Cinemas Controller
/******************************************************/
.controller('CinemasCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading cinemas'
    });

    CinemairSrv.getCinemas().success(function(cinemas) {
        $scope.cinemas = cinemas;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });
})

.controller('CinemaDetailCtrl', function($scope, $q, $ionicLoading, $ionicBackdrop, $stateParams, CinemairSrv) {
    var cinemaId = $stateParams.cinemaId;

    var cinemaPromise = CinemairSrv.getCinema(cinemaId).success(function(cinema) {
        $scope.cinema = cinema;

        cinemaAddress = cinema.address.replace(/\s+/g, '+');
        $scope.mapAddress = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBm61TCdehUdkRlx3UVVSLrEgCmGjtwnCM&q=' + cinemaAddress+ ',' + cinema.city;
    });
    var cinemaShowsPromise = CinemairSrv.getCinemaShows(cinemaId).success(function(cinemaShows) {
        $scope.shows = cinemaShows;
    });

    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading cinema'});

    $q.all([cinemaPromise, cinemaShowsPromise]).then(function() {
        $ionicLoading.hide();
        $ionicBackdrop.release();
    });

    $scope.toggleFavorite = function(show) {
        $ionicLoading.show({content: 'Loading shows'});

        if (show.favorite === null){
            // Create
            CinemairSrv.createFavorite(show.id).then(function() {
                CinemairSrv.getCinemaShows(cinemaId).success(function(cinemaShows) {
                    $scope.shows = cinemaShows;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteFavorite(show.favorite).then(function() {
                CinemairSrv.getCinemaShows(cinemaId).success(function(cinemaShows) {
                    $scope.shows = cinemaShows;
                    $ionicLoading.hide();
                });
            });
        }
    };
})


/******************************************************/
/* Favorites Controller
/******************************************************/
.controller('FavoritesCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading favorites'});

    CinemairSrv.getFavorites().success(function(favorites) {
        $scope.favorites = favorites;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });

    $scope.deleteFavorite = function(favorite) {
        $ionicLoading.show({content: 'Loading shows'});

        // Delete
        CinemairSrv.deleteFavorite(favorite.id).then(function() {
            CinemairSrv.getFavorites().success(function(favorites) {
                $scope.favorites = favorites;
                $ionicLoading.hide();
            });
        });
    };
})

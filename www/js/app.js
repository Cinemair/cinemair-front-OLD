// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'cinemair' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'cinemair.services' is found in services.js
// 'cinemair.controllers' is found in controllers.js
angular.module('cinemair', [
    'ionic',
    'cinemair.controllers',
    'cinemair.services',
    'cinemair.filters'
])

.run(function($ionicPlatform, $rootScope, UserSrv) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.logout = function(){
        UserSrv.logout();
    };
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $provide, $httpProvider, $compileProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('login', {
        cache: false,
        url: '/?state&code',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    // FAVORITES
    .state('tab.favorites', {
        url: '/favorites',
        cache: false,
        views: {
            'tab-favorites': {
                templateUrl: 'templates/tab-favorites.html',
                controller: 'FavoritesCtrl'
            }
        }
    })
    .state('tab.favorite-detail', {
        url: '/favorites/:showId',
        views: {
            'tab-favorites': {
                templateUrl: 'templates/show-detail.html',
                controller: 'ShowDetailCtrl'
            }
        }
    })

    // MOVIES
    .state('tab.movies', {
        url: '/movies',
        cache: false,
        views: {
            'tab-movies': {
                templateUrl: 'templates/tab-movies.html',
                controller: 'MoviesCtrl'
            }
        }
    })
    .state('tab.movie-detail', {
        url: '/movies/:movieId',
        views: {
            'tab-movies': {
                templateUrl: 'templates/movie-detail.html',
                controller: 'MovieDetailCtrl'
            }
        }
    })

    // CINEMAS
    .state('tab.cinemas', {
        cache: false,
        url: '/cinemas',
        views: {
            'tab-cinemas': {
                templateUrl: 'templates/tab-cinemas.html',
                controller: 'CinemasCtrl'
            }
        }
    })

    .state('tab.cinema-details', {
        cache: false,
        url: '/cinemas/:cinemaId',
        views: {
            'tab-cinemas': {
                templateUrl: 'templates/cinema-detail.html',
                controller: 'CinemaDetailCtrl'
            }
        }
    })

    // SHOWS
    .state('tab.shows', {
        cache: false,
        url: '/shows',
        views: {
            'tab-shows': {
                templateUrl: 'templates/tab-shows.html',
                controller: 'ShowsCtrl'
            }
        }
    })
    .state('tab.show-detail', {
        url: '/shows/:showId',
        views: {
            'tab-shows': {
                templateUrl: 'templates/show-detail.html',
                controller: 'ShowDetailCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

    // HTTP provider default headers
    defaultHeaders = {
        "Content-Type": "application/json",
        "Accept-Language": "en"
    };
    $httpProvider.defaults.headers.delete = defaultHeaders;
    $httpProvider.defaults.headers.patch = defaultHeaders;
    $httpProvider.defaults.headers.post = defaultHeaders;
    $httpProvider.defaults.headers.put = defaultHeaders;

    // Interceptor if user is not legin
    authHttpIntercept = function($q, $window){
        httpResponseError = function(response) {
            if (response.status === 401) {
                $window.location.href = "/";
            }
            return $q.reject(response);
        };

        return {
            responseError: httpResponseError
        };
    };
    $provide.factory("authHttpIntercept", ["$q", "$window", authHttpIntercept])
    $httpProvider.interceptors.push("authHttpIntercept")

    // Use html5 mode (urls without #)
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    // Allow images
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);

    // Set momment locales
    moment.locale('es');
});

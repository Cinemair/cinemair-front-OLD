// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('cinemair', [
    'ionic',
    'cinemair.controllers',
    'cinemair.services',
    'cinemair.filters'
])

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.views.transition('android');
    $ionicConfigProvider.spinner.icon('android');
    $ionicConfigProvider.scrolling.jsScrolling(false);
})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $provide, $httpProvider) {

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
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.schedule', {
        url: '/schedule',
        views: {
            'tab-schedule': {
                templateUrl: 'templates/tab-schedule.html',
                controller: 'ScheduleCtrl'
            }
        }
    })
    .state('tab.scheduled', {
        url: '/schedule/:id',
        views: {
            'tab-schedule': {
                templateUrl: 'templates/schedule-detail.html',
                controller: 'ScheduleDetailCtrl'
            }
        }
    })
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
    .state('tab.movie', {
        url: '/movies/:id',
        cache: false,
        views: {
            'tab-movies': {
                templateUrl: 'templates/movie-detail.html',
                controller: 'MovieDetailCtrl'
            }
        }
    })
    .state('tab.cinemas', {
        url: '/cinemas',
        views: {
            'tab-cinemas': {
                templateUrl: 'templates/tab-cinemas.html',
                controller: 'CinemasCtrl'
            }
        }
    })
    .state('tab.dates', {
        cache: false,
        url: '/dates',
        views: {
            'tab-dates': {
                templateUrl: 'templates/tab-dates.html',
                controller: 'DatesCtrl'
            }
        }
    })
    .state('tab.date', {
        url: '/dates/:id',
        views: {
            'tab-dates': {
                templateUrl: 'templates/date-detail.html',
                controller: 'ScheduleDetailCtrl'
            }
        }
    });

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

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});

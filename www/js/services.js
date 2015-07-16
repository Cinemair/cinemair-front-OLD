var serverURL = 'http://127.0.0.1:8000/api/v1';
var googleClientId = "661976506904-t5hdjfsvggji8vt9k2jqfk1bs2st3c23.apps.googleusercontent.com"

angular.module('cinemair.services', [])

.factory('CinemairSrv', function($http, $location) {
    getMovies = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/movies'
        }).success(function(data) {
            movies = data;
        });
    };
    getSingleMovie = function(id) {
        return $http({
            method: 'GET',
            url: serverURL + '/movies/' + id
        }).success(function(data) {
            movie = data;
        });
    };
    getCinemas = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/cinemas'
        }).success(function(data) {
            cinemas = data;
        });
    };
    getShows = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/shows'
        }).success(function(data) {
            shows = data;
        });
    };
    getMovieShows = function(id) {
        return $http({
            method: 'GET',
            url: serverURL + '/movies/' + id + '/shows'
        }).success(function(data) {
            movieShows = data;
        });
    };
    getSingleShow = function(id) {
        return $http({
            method: 'GET',
            url: serverURL + '/shows/' + id
        }).success(function(data) {
            show = data;
        });
    };
    getEvents = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/events'
        }).success(function(data) {
            events = data;
        });
    };
    getSingleEvent = function(id) {
        return $http({
            method: 'GET',
            url: serverURL + '/events/' + id
        }).success(function(data) {
            event = data;
        });
    };
    googleAuth = {
        login: function() {
            responseType = "code"
            clientId = googleClientId
            redirectUri = $location.absUrl();
            scope = "email profile".replace(" ", "%20");
            state = "google-login";
            accessType = "offline";
            url = "https://accounts.google.com/o/oauth2/auth"
                    + "?response_type=" + responseType
                    + "&client_id=" + clientId
                    + "&redirect_uri=" + redirectUri
                    + "&scope=" + scope
                    + "&state=" + state
                    //+ "&access_type=" + accessType
            console.log(url);
            window.location.href = url
        },
        loginOrRegisterWithGoogleAccount: function (code) {
            return $http({
                method: 'POST',
                url: serverURL + '/auth',
                data: {
                    code: code,
                    type: "google"
                }
            }).success(function(data) {
                return data;
            });
        }
    };

    return {
        getMovies: getMovies,
        getSingleMovie: getSingleMovie,
        getCinemas: getCinemas,
        getShows: getShows,
        getMovieShows: getMovieShows,
        getSingleShow: getSingleShow,
        getSingleEvent: getSingleEvent,
        getEvents: getEvents,
        googleAuth: googleAuth
    };
});

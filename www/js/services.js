var serverURL = 'http://127.0.0.1:8000/api/v1';
var googleClientId = "661976506904-t5hdjfsvggji8vt9k2jqfk1bs2st3c23.apps.googleusercontent.com"

angular.module('cinemair.services', [])


.factory('CinemairSrv', ["$http", "$location", "UserSrv", "$rootScope", function($http, $location, UserSrv, $rootScope) {

    _headers = function() {
        headers = {};

        // Authorization token
        token = UserSrv.getAuthToken();
        if (!_.isNull(token) && !_.isUndefined(token))
            headers["Authorization"] = "Bearer " + token;

        return headers;
    };

    // MOVIES
    getMovies = function() {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/movies'
        });
    };
    getMovie = function(id) {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/movies/' + id
        });
    };
    getMovieShows = function(id) {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/movies/' + id + '/shows'
        });
    };
    // CINEMAS
    getCinemas = function() {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/cinemas'
        });
    };

    // SHOES
    getShows = function() {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/shows'
        });
    };

    getSingleShow = function(id) {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/shows/' + id
        });
    };

    // EVENTS
    getEvents = function() {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/events'
        });
    };

    createEvent = function(showId) {
        return $http({
            headers: _headers(),
            method: 'POST',
            url: serverURL + '/events',
            data: {
                show: showId,
                user: $rootScope.user.id
            }
        });
    };
    deleteEvent = function (eventId) {
        return $http({
            headers: _headers(),
            method: 'DELETE',
            url: serverURL + '/events/' + eventId,
        });
    };


    return {
        getCinemas: getCinemas,

        getMovies: getMovies,
        getMovie: getMovie,
        getMovieShows: getMovieShows,

        getShows: getShows,
        getSingleShow: getSingleShow,

        getEvents: getEvents,
        createEvent: createEvent,
        deleteEvent: deleteEvent
    };
}])

.factory('$localStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage.setItem(key, angular.toJson(value));
        },
        get: function(key, _default) {
            value = $window.localStorage.getItem(key);
            if(_.isNull(value) || _.isUndefined(value))
                return _default || null

            return angular.fromJson(value);
        },
        remove: function(key) {
            $window.localStorage.removeItem(key);
        }
    }
}])


.factory('UserSrv', ["$window", "$location", "$http", "$rootScope", "$localStorage", function($window, $location, $http, $rootScope, $localStorage) {
    setUser = function(user) {
        $rootScope.user = user;
        $localStorage.set('user', $rootScope.user);
    };

    getUser = function() {
        if (_.isNull($rootScope.user) || _.isUndefined($rootScope.user))
            $rootScope.user = $localStorage.get('user');

        return $rootScope.user;
    };

    getAuthToken = function() {
        if (_.isNull($rootScope.user) || _.isUndefined($rootScope.user))
            return null
        return $rootScope.user.auth_token
    };

    logout = function() {
        $rootScope.user = null;
        $localStorage.remove('user');
        $window.location.href = "/";
    };

    googleAuth = {
        getAuthorizedCodeFromGoogle: function() {
            responseType = "code"
            clientId = googleClientId
            redirectUri = $location.absUrl();
            scope = "email profile".replace(" ", "%20");
            state = "google-login";

            url = "https://accounts.google.com/o/oauth2/auth"
                    + "?response_type=" + responseType
                    + "&client_id=" + clientId
                    + "&redirect_uri=" + redirectUri
                    + "&scope=" + scope
                    + "&state=" + state
            $window.location.href = url;
        },
        loginOrRegisterWithGoogleAccount: function (code) {
            return $http({
                method: 'POST',
                url: serverURL + '/auth',
                data: {
                    code: code,
                    type: "google"
                }
            }).success(function(response) {
                setUser(response);
                return response;
            });
        }
    };

    return {
        getUser: getUser,
        setUser: setUser,
        getAuthToken: getAuthToken,
        logout: logout,
        googleAuth: googleAuth
    };
}]);

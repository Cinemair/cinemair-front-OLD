var serverURL = 'http://127.0.0.1:8000/api/v1';
var googleClientId = "661976506904-t5hdjfsvggji8vt9k2jqfk1bs2st3c23.apps.googleusercontent.com";

angular.module('cinemair.services', [])


.factory('CinemairSrv', ["$http", "$location", "UserSrv", function($http, $location, UserSrv) {

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
    getCinema = function(id) {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/cinemas/' + id
        });
    };
    getCinemaShows = function(id) {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/cinemas/' + id + '/shows'
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

    getShow = function(id) {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/shows/' + id
        });
    };

    // FAVORITES
    getFavorites = function() {
        return $http({
            headers: _headers(),
            method: 'GET',
            url: serverURL + '/favorites'
        });
    };
    createFavorite = function(showId) {
        return $http({
            headers: _headers(),
            method: 'POST',
            url: serverURL + '/favorites',
            data: {
                show: showId,
                user: UserSrv.getUser().id
            }
        });
    };
    deleteFavorite = function (favoriteId) {
        return $http({
            headers: _headers(),
            method: 'DELETE',
            url: serverURL + '/favorites/' + favoriteId,
        });
    };


    return {
        getCinemas: getCinemas,
        getCinema: getCinema,
        getCinemaShows: getCinemaShows,

        getMovies: getMovies,
        getMovie: getMovie,
        getMovieShows: getMovieShows,

        getShows: getShows,
        getShow: getShow,

        getFavorites: getFavorites,
        createFavorite: createFavorite,
        deleteFavorite: deleteFavorite
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
                return _default || null;

            return angular.fromJson(value);
        },
        remove: function(key) {
            $window.localStorage.removeItem(key);
        }
    };
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
            return null;
        return $rootScope.user.auth_token;
    };

    logout = function() {
        $rootScope.user = null;
        $localStorage.remove('user');
        $window.location.href = "/";
    };

    googleAuth = {
        getAuthorizedCodeFromGoogle: function() {
            responseType = "code";
            clientId = googleClientId;
            redirectUri = $location.absUrl();
            scope = "email profile".replace(" ", "%20");
            state = "google-login";

            url = "https://accounts.google.com/o/oauth2/auth"+ "?response_type=" + responseType + "&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=" + scope + "&state=" + state;
            $window.location.href = url;
        },
        loginOrRegisterWithGoogleAccount: function (code) {
            var onSuccess = function(response) {
                setUser(response.data);
                return response;
            };
            var onError = function(response){
                logout();
                return response;
            };

            return $http({
                method: 'POST',
                url: serverURL + '/auth',
                data: {
                    code: code,
                    type: "google"
                }
            }).then(onSuccess, onError);
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

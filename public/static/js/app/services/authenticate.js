
'use strict';
// TODO: adicionar sessões
var app = app || angular.module('authApp');

app.factory('AuthService', ['$http', 'localStorageService', AuthService]);

function AuthService($http, localStorageService) {
    function Register(username, password, email, callback) {
        $http.post('/register', { username: username, password: password, email: email })
            .success(function (response) {
                if (response.token) {
                    localStorageService.currentUser = { username: username, token: response.token };
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                    callback(true);
                } else {
                    callback(false);
                }
            }).error(function(err){
                console.log(err);
                callback(false);
            });
    }

    function Login(username, password, callback) {
        $http.post('/login', { username: username, password: password })
            .success(function (response) {
                if (response.token) {
                    localStorageService.currentUser = { username: username, token: response.token };
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                    callback(true);
                } else {
                    callback(false);
                }
            }).error(function(err){
                console.log(err);
                callback(false);
            });
    }

    function Logout() {
        delete localStorageService.currentUser;
        $http.defaults.headers.common.Authorization = '';
    }

    return {
        Login: Login,
        Register: Register,
        Logout: Logout
    }
}


'use strict';
// TODO: adicionar sessões
var app = app || angular.module('authApp');

app.factory('AuthService', ['$http', '$localStorage', AuthService]);

function AuthService($http, $localStorage) {
    var user = $localStorage.currentUser;

    if(user){ $http.defaults.headers.common.Authorization = 'Bearer ' + user.token; }

    function GetUser(){
        return $localStorage.currentUser;
    }

    function Register(username, password, email, callback) {
        $http.post('/register', { username: username, password: password, email: email })
            .success(function (response) {
                if (response.token) {
                    $localStorage.currentUser = { username: username, token: response.token };
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
                    $localStorage.currentUser = { username: username, token: response.token };
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
        delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = '';
    }

    return {
        Login: Login,
        Register: Register,
        Logout: Logout,
        GetUser: GetUser
    }
}

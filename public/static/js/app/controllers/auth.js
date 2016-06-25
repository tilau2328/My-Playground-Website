
'use strict';

var app = app || angular.module('authApp');

function AuthCtrl($scope, AuthService) {
    $scope.loading = false;

    $scope.register = function(){
        const username = $scope.username;
        const password = $scope.password;
        // TODO: implementar verificação de password repetida no form
        console.log($scope.username);
        $scope.loading = true;
        AuthService.Login(username, password, function (result) {
            if (result === true) {
                console.log("YAAY");
            } else {
                console.log("MEH");
                $scope.error = 'Username or password is incorrect';
                $scope$scope.loading = false;
            }
        });
        $scope.logged = true;
    };

    $scope.login = function(){
        const username = $scope.username;
        const password = $scope.password;
        console.log($scope.username);
        $scope.loading = true;
        AuthService.Login(username, password, function (result) {
            if (result === true) {
                console.log("YAAY");
            } else {
                console.log("MEH");
                $scope.error = 'Username or password is incorrect';
                $scope$scope.loading = false;
            }
        });
        $scope.logged = true;
    };

    $scope.logout = function(){
        delete $scope.username;
        delete $scope.password;
        $scope.logged = false;
    };

}

app.controller('AuthCtrl', ["$scope", "AuthService", AuthCtrl]);

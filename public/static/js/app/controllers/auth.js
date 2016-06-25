
'use strict';

var app = app || angular.module('authApp');

function AuthCtrl($scope, $rootScope, $location, AuthService) {
    $scope.logged = AuthService.Logged;

    $scope.register = function(){
        const username = $scope.formData.username;
        const email = $scope.formData.email;
        const password = $scope.formData.password;
        // TODO: implementar verificação de password repetida no form
        // TODO: implementar persistencia entre o controlador de login e o de register, para o logged
        $scope.loading = true;
        AuthService.Register(username, password, email, function (result) {
            console.log($rootScope);
            if (result === true) {
                $rootScope.logged = true;
                console.log("now logged");
                $location.path('/');
            } else {
                $scope.error = 'Username already exists';
            }
            $scope.loading = false;
        });

    };

    $scope.login = function(){
        const username = $scope.formData.username;
        const password = $scope.formData.password;
        $scope.loading = true;
        AuthService.Login(username, password, function (result) {
            console.log($rootScope);
            if (result === true) {
                console.log("now logged");
                $rootScope.logged = true;
            } else {
                $scope.error = 'Username or password is incorrect';
            }
            $scope.loading = false;
        });
    };

    $scope.logout = function(){
        $scope.formData = {
            username: "",
            password: ""
        }
        AuthService.Logout();
        $rootScope.logged = false;
    };

    $scope.logout();
    console.log($rootScope.$root);
}

app.controller('AuthCtrl', ["$scope", "$rootScope", "$location", "AuthService", AuthCtrl]);

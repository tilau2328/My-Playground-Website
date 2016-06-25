
'use strict';

var app = app || angular.module('authApp');

function AuthCtrl($scope, $rootScope, $location, AuthService) {
    $scope.user = AuthService.GetUser() || null;
    const formData = {
        username: "",
        password: "",
        email: ""
    };
    $scope.formData = formData;
    $scope.$root.logged = ($scope.user != null);

    $scope.register = function(){
        const username = $scope.formData.username;
        const email = $scope.formData.email;
        const password = $scope.formData.password;
        // TODO: implementar verificação de password repetida no form
        // TODO: implementar persistencia entre o controlador de login e o de register, para o logged
        $scope.loading = true;
        AuthService.Register(username, password, email, function (result) {
            if (result === true) {
                $rootScope.$root.logged = true;
                $scope.formData = formData;
                $location.path('/');
            } else {
                $scope.error = 'Username already exists';
            }
            $scope.loading = false;
            $scope.user = AuthService.GetUser();
        });

    };

    $scope.login = function(){
        const username = $scope.formData.username;
        const password = $scope.formData.password;
        $scope.loading = true;
        AuthService.Login(username, password, function (result) {
            if (result === true) {
                $rootScope.$root.logged = true;
                $scope.formData = formData;
            } else {
                $scope.error = 'Username or password is incorrect';
            }
            $scope.loading = false;
            $scope.user = AuthService.GetUser();
        });
    };

    $scope.logout = function(){
        AuthService.Logout();
        $rootScope.$root.logged = false;
        $scope.user = null;
        $location.path('/');
    };

}

app.controller('AuthCtrl', ["$scope", "$rootScope", "$location", "AuthService", AuthCtrl]);

'use strict';

var app = app || {};

const login = function(){
    return {
        restrict: 'E',
        scope: {
            user: "="
        },
        templateUrl: "/js/app/directives/templates/login-nav.html",
        replace: true,
        controller: AuthCtrl
    }
}

app.directive("login", login);

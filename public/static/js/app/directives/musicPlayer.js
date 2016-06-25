'use strict';

var app = app || {};

const player = function(){
    return {
        restrict: 'E',
        templateUrl: "/js/app/directives/templates/player-footer.html",
        replace: true,
        controller: MusicCtrl
    }
}

app.directive("player", player);

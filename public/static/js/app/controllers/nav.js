'use strict';

var app = app || {};

const NavCtrl = function ($scope, $state) {
    var states = $state.get();
    var divs = states.slice(3, states.length);
    $scope.divs = {
            public: [],
            private: []
        }

    for(var i = 0; i < divs.length; i++){
        var div = divs[i];
        if(div.data.private){ $scope.divs.private.push(div); }
        else { $scope.divs.public.push(div); }
    }
}

app.controller('NavCtrl', ['$scope', '$state', NavCtrl]);

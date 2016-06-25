'use strict';

var app = app || {};

app.controller('MusicCtrl', ['$scope', '$http', MusicCtrl]);

function MusicCtrl($scope, $http) {
    $scope.bands = [];

    $scope.getBands = function(){
        $http.get( "/music/bands" )
        .then(function(res) {
            $scope.bands = res.data;
        }, function errorCallback(res) { console.log("error"); });
    }

    $scope.getBand = function(band){

    }

    $scope.getAlbum = function(band,album){

    }

    $scope.getSong = function(band,album,song){
        console.log(band + "/" + album + "/" + song);
        $http.get( "/music/bands/" + band + "/" + album + "/" + song + "/get" )
        .then(function(res) {
            console.log(res.data);
        }, function errorCallback(res) { console.log("error"); });
    }

    $scope.getBands();
}

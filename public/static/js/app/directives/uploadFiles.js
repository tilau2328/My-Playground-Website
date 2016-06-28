'use strict';

var app = app || {};

const uploadFiles = function(){
    return {
        restrict: 'A',
        scope: { uploadFiles: "=uploadFiles" },
        link: function($scope, $el, $attrs){
            $el.on('change', function(){
                $scope.uploadFiles = $el[0].files;
                $scope.$apply();
            });
        }
    }
}

app.directive("uploadFiles", uploadFiles);

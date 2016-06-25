'use strict';

var app = app || {};

app.controller('FilesCtrl', ['$scope', '$http', '$window', 'FileSaver', FilesCtrl]);

function FilesCtrl($scope, $http, $window, FileSaver) {
    $scope.files = [];
    $scope.filesToUpload = [];
    $scope.currentPath = "/";
    $scope.clipboard = { file: null, mode: null };

    // Utils

    function getBack(file){
        var path = file.split("/");
        path.pop();
        return path.join("/") || "/";
    }

    function addFile(file){
        if(($scope.currentPath == file.path)
        || ($scope.currentPath == "/"
        &&  file.path == "")){
            $scope.files.push(file);
        }
    }

    function removeFile(file){
        if(($scope.currentPath == file.path)
        || ($scope.currentPath == "/"
        &&  file.path == "")){
            for(var i=0; i<$scope.files.length; i++){
                if($scope.files[i].name == file.name){
                    $scope.files.splice(i, 1);
                    break;
                }
            }
        }
    }

    // Anchored Methods

    $scope.list = function(path, name){
        var full_path;
        if(path == "/") { full_path = name; }
        else {
            if(name){ full_path = path + "/" + name; }
            else { full_path = path; }
        }
        $http.get( "/files", { params: { "path": full_path || "" } } )
        .then(function(res) {
            $scope.currentPath = full_path || "/";
            $scope.files = res.data.files;
        }, function errorCallback(res) { console.log("error"); });
    }

    $scope.get = function(file){
        if(file){
            $http.get( "/files/get", { params: { "path": file.path, "file": file.name } } )
            .then(function(res) {
                var type = res.headers("Content-type");
                var file_name = prompt("Save file as: ", file.name);
                if(file_name){
                    var data = new File([res.data], file_name, {"type": type});
                    FileSaver.saveAs(data, file_name);
                }
            }, function errorCallback(res) { console.log("error"); });
        }
    }

    $scope.upload = function(){
        var path = $scope.currentPath;
        if(path == "/") { path = ""; }

        var files = $scope.filesToUpload;
        if(files.length>0){
            for(var i=0; i<files.length; i++){
                var file = files[i];
                var fd = new FormData();
                fd.append("path", path);
                fd.append("overwrite", "false");
                fd.append("file", file);
                $http.post( "/files", fd, { transformRequest: angular.identity, headers: {'Content-Type': undefined} })
                .then(function(res){
                    var data = res.data;
                    switch(data.code){
                        case 200:
                            addFile(data.file);
                            break;
                        case 409:
                            if(confirm("File " + data.name + " already exists, do you want to overwrite it?")){
                                fd.append("overwrite", "true");
                                $http.post( "/files", fd, {
                                    transformRequest: angular.identity,
                                    headers: {'Content-Type': undefined}
                                }).then(function(res){
                                    data = res.data;
                                    if(data.code == 200){
                                        removeFile(data.file);
                                        addFile(data.file);
                                    }
                                }, function errorCallback(res) {
                                    console.log("error");
                                });
                            }
                            break;
                        default:
                            break;
                    }
                }, function errorCallback(res) { console.log("error"); });
            }
            angular.element( document.querySelector( '#files-input' ) )[0].value = "";
        }
    }

    $scope.delete = function(file){
        $http.delete( "/files", { params: { "path": file.path, "file": file.name } } )
        .then(function(res) {
            var data = res.data;
            if(data.code == 200){
                if( $scope.clipboard.file != null
                && (file.path == $scope.clipboard.file.path
                && file.name == $scope.clipboard.file.name)){
                    $scope.clipboard.file = null;
                    $scope.clipboard.mode = null;
                }
                removeFile(file);
            }
        }, function errorCallback(res) { console.log("error"); });
    }

    $scope.rename = function(file){
        var new_name = prompt((file.isDirectory ? "Directory's" : "File's") + " new name: ", file.name);
        if(new_name){
            $http.put( "/files", { file: file.name, path: file.path, name: new_name})
                 .then(function(res){
                     var data = res.data;
                     if(data.code == 200){ file.name = new_name; }
                 }, function errorCallback(res) { console.log("error"); });
        }
    }

    $scope.copy = function(file){
        $scope.clipboard.file = file;
        $scope.clipboard.mode = "copy";
    }

    $scope.cut = function(file){
        $scope.clipboard.file = file;
        $scope.clipboard.mode = "cut";
    }

    $scope.paste = function(){
        var file = $scope.clipboard.file;
        if(file){
            var path = $scope.currentPath;
            var message = { file: file.name, from: file.path, to: path, overwrite: "false" };
            switch($scope.clipboard.mode){
                case "copy":
                    $http.post( "/files/copy", message)
                    .then(function(res){
                        var data = res.data;
                        switch(data.code){
                            case 200:
                                addFile(data.file);
                                break;
                            case 404:
                                alert("It seems that file " + file.name + " is not there anymore");
                                $scope.clipboard.file = null;
                                $scope.clipboard.mode = null;
                                break;
                            case 409:
                                if(confirm("File " + file.name + " already exists at the destination directory, do you want to overwrite it?")){
                                    message.overwrite = "true";
                                    $http.post( "/files/copy", message)
                                    .then(function(res){
                                        var data = res.data;
                                        switch(data.code){
                                            case 200:
                                                removeFile(data.file);
                                                addFile(data.file);
                                                break;
                                            case 404:
                                                alert("It seems that file " + file.name + " is not there anymore");
                                                $scope.clipboard.file = null;
                                                $scope.clipboard.mode = null;
                                                break;
                                        }
                                    }, function errorCallback(res) { console.log("error"); });
                                }
                                break;
                            default:
                                break;
                        }
                    }, function errorCallback(res) { console.log("error"); });
                    break;
                case "cut":
                    $http.post( "/files/move", message)
                    .then(function(res){
                        var data = res.data;
                        switch(data.code){
                            case 200:
                                removeFile(file);
                                addFile(data.file);
                                $scope.clipboard.file = data.file;
                                $scope.clipboard.mode = "copy";
                                break;
                            case 404:
                                alert("It seems that file " + file.name + " is not there anymore");
                                $scope.clipboard.file = null;
                                $scope.clipboard.mode = null;
                                break;
                            case 409:
                                if(confirm("File " + file.name + " already exists at the destination directory, do you want to overwrite it?")){
                                    message.overwrite = "true";
                                    $http.post( "/files/move", message)
                                    .then(function(res){
                                        var data = res.data;
                                        switch(data.code){
                                            case 200:
                                                removeFile(file);
                                                removeFile(data.file);
                                                addFile(data.file);
                                                $scope.clipboard.file = data.file;
                                                $scope.clipboard.mode = "copy";
                                                break;
                                            case 404:
                                                alert("It seems that file " + file.name + " is not there anymore");
                                                $scope.clipboard.file = null;
                                                $scope.clipboard.mode = null;
                                                break;
                                        }
                                    }, function errorCallback(res) { console.log("error"); });
                                }
                                break;
                            default:
                                break;
                        }
                    }, function errorCallback(res) { console.log("error"); });
                    break;
                default:
                    break;
            }
        }
    }

    $scope.back = function(){
        $scope.currentPath = getBack($scope.currentPath);
        $scope.list($scope.currentPath);
    }

    $scope.newDir = function(){
        var dir_name = prompt("New directory's name: ");
        var path = $scope.currentPath;
        if(path == "/") { path = ""; }
        if(dir_name){
            $http.post( "/files/newdir", { path: path, name: dir_name })
            .then(function(res){
                var data = res.data;
                if(data.code == 200){ addFile(data.file); }
            }, function errorCallback(res) { console.log("error"); });
        }
    }

    $scope.list("/");
}

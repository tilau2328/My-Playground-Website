'use strict';

var app = app || angular.module('authApp');


app.config([ '$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider', Config]);

function Config($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    $stateProvider
        .state('app', {
            url: '/',
            views: {
                'navbar': {
                    templateUrl : '/js/app/views/navbar.html',
                    controller  : 'NavCtrl'
                },
                'content': {
                    templateUrl : '/js/app/views/home.html'
                },
                'footer': {
                    templateUrl : '/js/app/views/footer.html',
                }
            }
        }).state('app.register', {
            url: '/register',
            data: { name: "Files" },
            views: {
                'content@': {
                    templateUrl : '/js/app/views/register.html',
                    controller  : 'AuthCtrl'
                }
            }
        }).state('app.about', {
            url: '/about',
            data: {
                name: "About Me",
                private: false
            },
            views: {
                'content@': {
                    templateUrl : '/js/app/views/about.html'
                }
            }
        }).state('app.contacts', {
            url: '/contacts',
            data: {
                name: "Contacts",
                private: false
            },
            views: {
                'content@': {
                    templateUrl : '/js/app/views/contacts.html'
                }
            }
        });

    $urlRouterProvider.otherwise('/');

    localStorageServiceProvider
        .setPrefix('authApp')
        .setStorageType('sessionStorage')
        .setNotify(true, true);
}

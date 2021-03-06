'use strict';

var myApp = angular.module('myApp', [ ]);

myApp.run(function($rootScope){
    $rootScope.socket = new Primus();
});

myApp.config([ '$routeProvider', function ($routeProvider) {

    $routeProvider.when('/view1', {
        templateUrl: 'partials/partial1.html',
        controller: 'MyCtrl1',
        resolve: {
            posts: function (PostsService) {

                return PostsService.getPosts();
            }
        }
    });

    $routeProvider.when('/view2', {
        templateUrl: 'partials/partial2.html',
        controller: 'MyCtrl2'
    });

    $routeProvider.when('/view3', {
        templateUrl: 'partials/page.html',
        controller: 'MyCtrl3'
    });

    $routeProvider.otherwise({
        redirectTo: '/view1'
    });
}]);

"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here.
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
myApp.value('version', '0.1');

myApp.service('PrimusService', [ '$rootScope', function ($rootScope) {
    var socket = $rootScope.socket;

    return {

        write: function (name, data, cb) {
            return socket.write.call(socket, name, data, cb);
        },

        on: function (event, fn) {
            return socket.on.call(socket, event, fn);
        }
    };
}]);

myApp.factory('PostsService', [ '$http', function ($http) {

    return {

        getPosts: function () {
            return $http({ method: 'GET', url: '/api/posts' });
        }
    };
}]);

'use strict';

myApp.controller('MyCtrl1', [ '$scope', '$rootScope', 'PrimusService', 'posts',
    function ($scope, $rootScope, PrimusService, posts) {

    console.log(posts);
    $scope.messages = posts.data;

    // Received message from server
    PrimusService.on('data', function (spark) {

        if (spark.type && spark.type === 'new-message') {

            $scope.$apply(function () {

                $scope.messages.unshift(spark);
            });
        }

        console.log('Data ', spark);
    });


    $scope.newMessage = function () {
        var newMessage = angular.copy($scope.message);

        if (angular.isUndefined(newMessage)) {
            return;
        }

        if ($scope.messages.some(findEqualObject(newMessage))) {
            return;
        }

        // Set the client side date
        newMessage.created = new Date();
        // Split the tags by comma
        newMessage.tags = newMessage.tags.split(',');

        $scope.messages.unshift(newMessage);

        newMessage.type = 'new-message';

        // Send to server
        PrimusService.write(newMessage);
    };

    function findEqualObject (equalObject) {

        return function (element) {

            // "Simple" object compare, not perfect as the tags might be ordered differently
            return element &&
                   equalObject &&
                   ((element.url && equalObject.url && element.url === equalObject.url) ||
                   (element.title && equalObject.title && element.title === equalObject.title));
        };
    }

}]);

myApp.controller('MyCtrl2' ,function ($scope) {

});

myApp.controller('MyCtrl3', function ($scope) {

});

// you may add more controllers below

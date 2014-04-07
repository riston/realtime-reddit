'use strict';

myApp.controller('MyCtrl1', [ '$scope', '$rootScope', 'PrimusService',
    function ($scope, $rootScope, PrimusService) {

    $scope.messages = [
        {
            url: 'http://www.neti.ee',
            title: 'Homepage for neti',
            tags: [ 'aw', 'node', 'sak' ],
            created: new Date(),
            up_votes: 12,
            down_votes: 42
        },
        {
            url: 'http://www.neti.ee',
            title: 'Homepage for neti',
            tags: [ 'aw', 'node', 'sak' ],
            created: new Date(),
            up_votes: 12,
            down_votes: 42
        },
        {
            title: 'Homepage for neti',
            url: 'http://www.neti.ee',
            created: new Date(),
            up_votes: 12,
            down_votes: 42
        }
    ];

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
        $scope.messages.unshift(newMessage);

        newMessage.type = 'new-message';

        PrimusService.write(newMessage);
    };

    function findEqualObject (equalObject) {

        return function (element) {

            // "Simple" object compare, not perfect as the tags might be ordered differently
            return element &&
                   equalObject &&
                   ((element.url && equalObject.url && element.url === equalObject.url) ||
                   (element.title && equalObject.title && element.title === equalObject.title) ||
                   (element.tags && equalObject.tags && element.tags === equalObject.tags));
        };
    }

}]);

myApp.controller('MyCtrl2' ,function ($scope) {

});

myApp.controller('MyCtrl3', function ($scope) {

});

// you may add more controllers below

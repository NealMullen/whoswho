// create our angular module and inject firebase
var app = angular.module('WhosWho', ['firebase']);

app.constant('config', {
    clientUser: 'User'
});

// this factory returns a synchronized array of chat messages
app.factory("JustData", ["$firebaseObject", "config",
    function($firebaseObject, config) {
        var baseURL = "https://who-is-who.firebaseio.com"
        var ref = new Firebase(baseURL);
        var JustData = {}

        JustData.getAll = function() {
            return $firebaseObject(ref); // return it as a synchronized object
        };

        JustData.updateData = function(name,title) {
            var available,
                lastUser,
                profileRef = ref.child(title+'/logs/'+name+'/availability'), // Get the Avaliability object from Firebase
                availableUpdate = false;

            profileRef.once("value", function(data) { // Get the data values of the login account clicked
                available = data.child("available").val();
                lastUser = data.child("lastUser").val();

                if (lastUser == config.clientUser)
                    if (available == false) availableUpdate = true; // If last logged in user is current and login isn't avaliable, act as a log-off switch

                profileRef.update({ // Update the login profile data where required
                    "available": availableUpdate,
                    "lastUser": config.clientUser
                });

            });
        };

        // this uses AngularFire to create the synchronized array
        //return $firebaseObject(ref);
        return JustData;
    }
]);

app.controller("AppController", ["$scope", "JustData", "config",
    // we pass our new JustData factory into the controller
    function($scope, JustData, config) {

        (function init() {
            (localStorage.getItem('YourName')) ? config.clientUser = localStorage.getItem('YourName'): localStorage.setItem('YourName', config.clientUser);
            $scope.YourName = config.clientUser;
            $scope.datadatadata;
            getAll();
        })();

        function getAll() {
            $scope.datadatadata = JustData.getAll().$bindTo($scope, "datadatadata"); // create a three-way binding to our datadatadata as $scope.datadatadata;
        }

        $scope.updateData = function(name,title) {
            JustData.updateData(name,title);
        }

        $scope.userSubmit = function() {
            if (this.YourName && this.YourName != config.clientUser) {
                config.clientUser = this.YourName;
                localStorage.setItem('YourName', config.clientUser);
            }
        };
    }
]);

// create our angular module and inject firebase
var app = angular.module('WhosWho', ['firebase']);

app.constant('config', {
    clientUser: 'Unknown'
});

// this factory returns a synchronized array of chat messages
app.factory("LoginData", ["$firebaseObject", "config",
    function($firebaseObject, config) {
        var baseURL = "https://who-is-who.firebaseio.com/logins/brc"
        var ref = new Firebase(baseURL);
        var LoginData = {}

        LoginData.getAll = function() {
            return $firebaseObject(ref); // return it as a synchronized object
        };

        LoginData.updateData = function(name) {
            var available,
                lastUser,
                profileRef = ref.child(name).child("availability"), // Get the Avaliability object from Firebase
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
        return LoginData;
    }
]);

app.controller("AppController", ["$scope", "LoginData", "config",
    // we pass our new LoginData factory into the controller
    function($scope, LoginData, config) {

        (function init() {
            (localStorage.getItem('user')) ? config.clientUser = localStorage.getItem('user'): localStorage.setItem('user', config.clientUser);
            $scope.user = config.clientUser;
            $scope.logins;
            getAll();
        })();

        function getAll() {
            $scope.logins = LoginData.getAll().$bindTo($scope, "logins"); // create a three-way binding to our Logins as $scope.logins;
        }

        $scope.updateData = function(name) {
            LoginData.updateData(name);
        }

        $scope.userSubmit = function() {
            if (this.user && this.user != config.clientUser) {
                config.clientUser = this.user;
                localStorage.setItem('user', config.clientUser);
            }
        };
    }
]);
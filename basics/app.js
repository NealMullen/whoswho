// create our angular module and inject firebase
var app = angular.module('WhosWho', ['firebase']);




// this factory returns a synchronized array of chat messages
app.factory("LoginData", ["$firebaseObject",
  function($firebaseObject) {
 return function() {
    var baseURL = "https://who-is-who.firebaseio.com/logins/brc"
    var ref = new Firebase(baseURL);

    ref.child("realdev1").once("value", function(snapshot) {
      var data = snapshot.val();
      // data equals { "name": { "first": "Fred", "last": "Flintstone" }, "age": 53 }
      console.log(data.available);  // "Fred"
      console.log(data.lastUser);  // 53
    });

    ref.on('child_changed', function(childSnapshot, prevChildKey) {
  console.log("AHH");
});

    // this uses AngularFire to create the synchronized array
    return $firebaseObject(ref);
  }}
]);


app.controller("AppController", ["$scope", "LoginData",
  // we pass our new LoginData factory into the controller
  function($scope, LoginData) {
 $scope.logins;
    // we add LoginData array to the scope to be used in our ng-repeat
     $scope.logins= LoginData().$bindTo($scope, "logins");
   

    $scope.$watch($scope.logins, function() { console.log("change")}, true);

/*    $scope.$watch(function() {
  return $scope.logins;
}, function(newValue, oldValue) {
  console.log("change detected: " + newValue)
});
*/
  }
]);
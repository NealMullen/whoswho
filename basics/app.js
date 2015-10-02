// create our angular module and inject firebase
var app = angular.module('WhosWho', ['firebase']);




// this factory returns a synchronized array of chat messages
app.factory("LoginData", ["$firebaseObject",
  function($firebaseObject) {
    var baseURL = "https://who-is-who.firebaseio.com/logins/brc"
    var ref = new Firebase(baseURL);
    var LoginData = {}

    LoginData.getAll = function () {
      return $firebaseObject(ref);  // return it as a synchronized object
    };

    LoginData.updateData = function (name) {

      ref.child(name).once("value", function(snapshot) {
        var lastNameSnapshot = snapshot.child("available");
        var lastName = lastNameSnapshot.val();
        console.log(lastName);

        

      });

      var ref2 = new Firebase("https://who-is-who.firebaseio.com/logins/brc/available");

        ref2.on('value', function(childSnapshot, prevChildKey){
          console.log("CHANGED" + Math.random());
        });

       /*
        ref.child(name).on('child_changed', function(childSnapshot, prevChildKey) {
        var data = childSnapshot.child("available").exportVal();
        if(data==true){
          console.log(data);
        }
        else{
          console.log("FUCK");
        }
    });

      return $firebaseObject(ref);  // return it as a synchronized object
      */


    };


    ref.child("realdev1").once("value", function(snapshot) {
      var data = snapshot.val();
      // data equals { "name": { "first": "Fred", "last": "Flintstone" }, "age": 53 }
      console.log(data.available);  // "Fred"
      console.log(data.lastUser);  // 53
    });

    ref.once("value", function(snapshot) {
       // The callback function will get called twice, once for "fred" and once for "barney"
  snapshot.forEach(function(childSnapshot) {
    // key will be "fred" the first time and "barney" the second time
    var key = childSnapshot.key();
    // childData will be the actual contents of the child
    var childData = childSnapshot.val();

    console.log(key + " " + childData);
  });
});


    ref.on('child_changed', function(childSnapshot, prevChildKey) {
     // var data = childSnapshot.exportVal();
     // if(data==true){
      //    console.log(data);
     // }
     // else{
       // console.log("FUCK");
     // }
      
});

    // this uses AngularFire to create the synchronized array
    //return $firebaseObject(ref);
  return LoginData;
}
]);


app.controller("AppController", ["$scope", "LoginData",
  // we pass our new LoginData factory into the controller
  function($scope, LoginData) {

     (function init() {
            getAll();
        })();


 $scope.logins;
    // we add LoginData array to the scope to be used in our ng-repeat
     //$scope.logins= LoginData().$bindTo($scope, "logins");
  //  $scope.updateVal=function(name){
   //   console.log(name);
   // }

   // $scope.$watch($scope.logins, function() { console.log("change")}, true);

/*    $scope.$watch(function() {
  return $scope.logins;
}, function(newValue, oldValue) {
  console.log("change detected: " + newValue)
});
*/
  function getAll(){
       $scope.logins= LoginData.getAll().$bindTo($scope, "logins"); // create a three-way binding to our Logins as $scope.logins;
    }

    $scope.updateVal=function(name){
      //console.log("FUCK");
      LoginData.updateData(name);
    }
  }
]);
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

    LoginData.getAll = function () {
      return $firebaseObject(ref);  // return it as a synchronized object
    };

    LoginData.updateData = function (name) {
      var lastname;
      ref.child(name).child("available").once("value", function(snapshot) {
        //var lastNameSnapshot = snapshot.child("available");
        lastName = snapshot.val();
        console.log(lastName);
        console.log("CHANGED AVALIABILITY" + Math.random());
        var profileRef = ref.child(name);
        if(lastName == false){
          console.log("It's avaliable");
          
            profileRef.update({
              "available": false,
              "lastUser": "NM"
            });
        }
        else{
          profileRef.update({
            "available": true,
              "lastUser": "Unkown"
            });
        }
      });
      console.log(lastName);

     // var ref2 = new Firebase("https://who-is-who.firebaseio.com/logins/brc/available");

     //   ref2.on('value', function(childSnapshot, prevChildKey){
      //   console.log("CHANGED" + Math.random());
     //   });

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


    LoginData.updateData2 = function (name, userName) {
      console.log(name);

      ref.child(name).child("availability").once("value", function(data) {
        //var lastNameSnapshot = snapshot.child("available");
        //lastName = data.val();
        available = data.child("available").val();
        lastUser = data.child("lastUser").val();


console.log(lastUser + " " + userName);
        if(lastUser == userName){
          console.log("Same user");
        }
        else{
          console.log("New user");
        }

        switch (available) {
    case true:
 var profileRef = ref.child(name).child("availability");
 profileRef.update({
            "available": false,
              "lastUser": userName
            });

    console.log("this is now false");
        console.log("CHANGED AVALIABILITY" + Math.random());
        break;
        case false:
 var profileRef = ref.child(name).child("availability");
 profileRef.update({
            "available": true
            });

        console.log("this is now true");
        console.log("CHANGED AVALIABILITY" + Math.random());
        break;
      }


        
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
            getAll();
            if(localStorage.getItem('user')){
        config.clientUser = localStorage.getItem('user');

        console.log(config.clientUser);
      }
      else{
        localStorage.setItem('user', config.clientUser);
      }
      $scope.user = config.clientUser;
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
  $scope.userSubmit = function() {
    if(this.user){
           config.clientUser = this.user;
          console.log( config.clientUser);
          localStorage.setItem('user',  config.clientUser);
        }
      };

  function getAll(){
       $scope.logins= LoginData.getAll().$bindTo($scope, "logins"); // create a three-way binding to our Logins as $scope.logins;
    }

    $scope.updateVal=function(name){
      //console.log("FUCK");
      LoginData.updateData(name);
    }

    $scope.updateVal2=function(name){
      //console.log("FUCK");
      LoginData.updateData2(name, config.clientUser);
    }
  }
]);
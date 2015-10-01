// create our angular module and inject firebase
var app = angular.module('WhosWho', ['firebase']);

app.constant('config', {
        clientUser: 'Unknown'
    });

// a factory to create a re-usable profile object
// we pass in a username and get back their synchronized data
app.factory("LoginData", ["$firebaseObject", 'config',
  function($firebaseObject, config) {

    var baseURL = "https://who-is-who.firebaseio.com/logins";
    var ref = new Firebase(baseURL);
    
/*

    var obj = $firebaseObject(ref);

    obj.$watch(function(event) {
      console.log("ehh");
    });
    */

    var LoginData = {}

    LoginData.getAll = function () {
      return $firebaseObject(ref);  // return it as a synchronized object
    };


    LoginData.getLogin = function (name) {
      var profileRef = ref.child(name);
      return $firebaseObject(ref);  // return it as a synchronized object
    };

    LoginData.updateUser = function (name,user) {
      var profileRef = ref.child(name);
      profileRef.update({
        "lastUser": user
      });
      return $firebaseObject(ref);  // return it as a synchronized object
    };

     return LoginData;
  }

]);


app.controller("mainController", ["$scope", "LoginData", 'config',
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


        })();
$scope.logins;
/*

     $scope.init = function(){
      getAll();
      if(localStorage.getItem('user')){
        $scope.user = localStorage.getItem('user');
        console.log($scope.user);
      }
      else{
        localStorage.setItem('user', 'Unkown');
        $scope.user = localStorage.getItem('user');
      }
    }
    */

    function getAll(){
      LoginData.getAll().$bindTo($scope, "logins"); // create a three-way binding to our Logins as $scope.logins;
    }


     $scope.updateUser = function(name){
      LoginData.updateUser(name,  config.clientUser);
    }
    /*
    $scope.userSubmit = function(){
    localStorage.setItem('user', $scope.user);
      console.log($scope.user);
  }
  */
  }
]);
app.controller("subController", ["$scope", 'config',
  function($scope, config) {

    (function init() {
      if(localStorage.getItem('user')){
        config.clientUser = localStorage.getItem('user');

        console.log(config.clientUser);
      }
      else{
        localStorage.setItem('user', config.clientUser);
      }
      $scope.user = config.clientUser;
        })();

 /*   $scope.userSubmit = function(){
      $scope.user = this.text;
      console.log(this.text);
    localStorage.setItem('user', $scope.user);
  }*/

  $scope.userSubmit = function() {
    if(this.user){
           config.clientUser = this.user;
          console.log( config.clientUser);
          localStorage.setItem('user',  config.clientUser);
        }
      };

  }
]);
/*
// create our main controller and get access to firebase
app.controller('mainController2', function($scope, $firebase) {
  // our application code will go here
    // connect to firebase 
  var ref = new Firebase("https://who-is-who.firebaseio.com/logins");  
  var fb = $firebase(ref);

   // sync as object 
  var syncObject = fb.$asObject();

  // three way data binding
  syncObject.$bindTo($scope, 'logins');

  $scope.init = function(){
    if(localStorage.getItem('user')){
      $scope.user = localStorage.getItem('user');
      console.log($scope.user);
    }
    else{
      $scope.user;
      console.log("Nothing set yet");
    }
  }

  $scope.userSubmit = function(){
    localStorage.setItem('user', $scope.user);
      console.log($scope.user);
  }

$scope.stateChanged = function (name) {
       console.log(name);
       var selectedLogin = new Firebase('https://who-is-who.firebaseio.com/logins/realdev1/availability');
       //selectedLogin.update({ usedBy: $scope.user});
       //selectedLogin.child("avaiability").set({
      //  usedBy: $scope.user
     // }, onComplete);


//selectedLogin.update({ available: true , usedBy: $scope.user }, onComplete);
selectedLogin.set({ available: true, usedBy: "$scope.user"} , onComplete);
      //var fredNameRef = new Firebase('https://who-is-who.firebaseio.com/logins/realdev1');
     // fredNameRef.update({ name: $scope.user});

}

$scope.$watch('sn_number', function(v){
  //$scope.id = v;
  console.log(v);
});

var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
    console.log('Synchronization succeeded');
  }
};
});*/
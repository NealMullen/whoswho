// create our angular module and inject firebase
angular.module('WhosWho', ['firebase'])

// create our main controller and get access to firebase
.controller('mainController', function($scope, $firebase) {
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
});
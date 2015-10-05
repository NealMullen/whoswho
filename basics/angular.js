// ==UserScript==
// @name         Who's Who
// @namespace    http://realise.com
// @version      0.1
// @description  Keeping track of Who's Who
// @author       Neal Mullen @ Realise
// @include     *://stag-brc.lbcmcms.co.uk*
// @require     https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js
// @require     https://cdn.firebase.com/js/client/2.2.4/firebase.js
// @require     https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js

// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==



//var newCSS = GM_getResourceText ("customCSS");
//GM_addStyle (newCSS);

GM_addStyle('a,body,hr,html{padding:0}.loginList,nav ul{list-style:none}article,aside,details,figcaption,figure,footer,header,hgroup,hr,menu,nav,section{display:block}abbr,address,article,aside,audio,b,blockquote,body,canvas,caption,cite,code,dd,del,details,dfn,div,dl,dt,em,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,p,pre,q,samp,section,small,span,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,ul,var,video{margin:0;padding:0;border:0;outline:0;font-size:100%;vertical-align:baseline;background:0 0}ins,mark{background-color:#ff9;color:#000}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:'';content:none}a{margin:0;font-size:100%;vertical-align:baseline;background:0 0}ins{text-decoration:none}mark{font-style:italic;font-weight:700}del{text-decoration:line-through}abbr[title],dfn[title]{border-bottom:1px dotted;cursor:help}table{border-collapse:collapse;border-spacing:0}hr{height:1px;border:0;border-top:1px solid #ccc;margin:1em 0}input,select{vertical-align:middle}*{box-sizing:border-box}body,html{height:100%;margin:0;overflow:auto}body{line-height:1;position:relative;width:100%;height:100%;margin:0 auto;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif}#username,.panel{position:absolute}.panel{width:260px;right:15px;background:#464646;bottom:15px}.panel .content{height:320px;padding-top:10px;overflow:hidden}header{background:#707070;padding:10px;color:#fff;cursor:pointer}.close{float:right}#username{bottom:0}form{width:100%}#username input[type=text]{background:#262626;padding:14px 10px;height:45px;width:80%;border:0;outline:0;display:inline;float:left;color:#a1a1a1;font-weight:700;font-style:italic}.id,.status{font-weight:700;text-transform:capitalize;display:block}#username input[type=submit]{width:20%;background:#379c70;color:#fff;font-weight:700;border:0;float:left;cursor:pointer;outline:0;height:45px}.id{color:#fff;font-size:95%}.status{font-size:80%;margin-top:2px;white-space:nowrap;color:#f43838}.loginList{padding:0;margin:0}.loginList li{width:46%;margin:0 2% 3%;display:inline;float:left;border-radius:3px;height:55px;text-align:center;padding-top:14px;background:#262626;cursor:pointer;overflow:hidden}.loginList li.active{background:#7cc576}.loginList li.active .status{color:#25721f}');

$(document).ready(function() { 
    
var app = angular.module('WhosWho', ['firebase']);
app.constant('config', {
    clientUser: 'Unknown'
});

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



$('<div ng-app="WhosWho"> <div class="panel" ng-controller="AppController"><header ng-click="showBody=!showBody"><h2>Who\'s Who <span class="close" ng-show="showBody">x</span><span class="close" ng-show="!showBody">^</span></h2></header><div class="content" ng-show="showBody"> <form id="username" ng-submit="userSubmit()"> <input type="text" ng-model="user" placeholder="Who the feck are you?" ng-blur="userSubmit()"/> <input type="submit" id="submit" value="OK"/> </form> <ul class="loginList"> <li ng-repeat="login in logins" ng-click="updateData(login.name)" ng-class="{\'active\': login.availability.available}"> <span class="id">{{login.name}}</span> <span class="status" ng-if="login.availability.available">Available</span> <span class="status" ng-if="!login.availability.available">{{login.availability.lastUser}}</span> </li></ul> </div></div></div>').appendTo('body');
angular.bootstrap($('body'), ['WhosWho']);

    
});
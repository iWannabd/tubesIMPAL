var app = angular.module("App",['ui.router','ui.bootstrap','firebase']);

app.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go('login');
    }
  });
}]);

app.config(function ($stateProvider,$urlRouterProvider) {

    var config = {
        apiKey: "AIzaSyAf_GqLRnMBU2aYPnIf588Smgm4FsipiKw",
        authDomain: "perpustakaanimpal.firebaseapp.com",
        databaseURL: "https://perpustakaanimpal.firebaseio.com",
        storageBucket: "perpustakaanimpal.appspot.com",
        messagingSenderId: "425633663888"
    };

    firebase.initializeApp(config);

    var login  = {
        name:"login",
        url:"/login",
        templateUrl:'templates/login.htm'
    };

    var loginadmin = {
        name:"login.admin",
        url:"/admin",
        controller:'loginCtrl',
        templateUrl:'templates/loginadmin.htm'
    };

    var loginmember = {
        name:"login.member",
        url:"/member",
        controller:'loginMemberCtrl',
        templateUrl:'templates/loginadmin.htm'
    };

    var registmember = {
        name:"login.regis",
        url:'/registrasi',
        controller:'regisCtrl',
        templateUrl:'templates/registrasi.htm'
    };

    var mainmember = {
        name:"mainmember",
        url:"/mainmember",
        controller:"mainmemberCtrl",
        templateUrl:'templates/mainmember.htm',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireSignIn();
            }]
        }
    };

    var bookmember = {
        name:"mainmember.books",
        url:"/buku",
        controller:"mbookCtrl",
        templateUrl:"templates/mbuku.htm"
    };

    var memberprofile = {
        name:"mainmember.profile",
        url:"/profile",
        controller:"profileCtrl",
        templateUrl:"templates/profile.htm"
    };

    var borrowmember = {
        name:"mainmember.borrows",
        url:"/borrow",
        controller:"mborrowCtrl",
        templateUrl:"templates/mborrow.htm"
    };

    var mainadmin ={
        name:"main",
        url:"/main",
        controller:'mainCtrl',
        templateUrl:'templates/mainadmin.htm',
        resolve: {
        // controller will not be loaded until $requireSignIn resolves
        // Auth refers to our $firebaseAuth wrapper in the factory below
        "currentAuth": ["Auth", function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
        }]
        }
    };

    var users = {
        name:"main.users",
        url:"/users",
        controller:"userCtrl",
        templateUrl:'templates/anggota.htm'
    };

    var books = {
        name:"main.books",
        url:"/buku",
        controller:"bookCtrl",
        templateUrl:"templates/buku.htm"
    };

    var borrows = {
        name:'main.borrows',
        url:'/borrow',
        controller:'pinjamCtrl',
        templateUrl:'templates/pinjam.htm'
    };

    var report = {
        name:'main.report',
        url:'/laporan',
        controller:'reportController',
        templateUrl:'templates/laporan.htm'
    };
    
    $urlRouterProvider.otherwise('/login');
    $stateProvider.state(login);
    $stateProvider.state(loginmember);    
    $stateProvider.state(loginadmin);
    $stateProvider.state(registmember);    
    $stateProvider.state(mainadmin);
    $stateProvider.state(users);
    $stateProvider.state(books);
    $stateProvider.state(borrows);
    $stateProvider.state(report);
    $stateProvider.state(mainmember);
    $stateProvider.state(bookmember);
    $stateProvider.state(memberprofile);
    $stateProvider.state(borrowmember);


});

// ========================== fungsi fungsi untuk keperluan program ===============================================

var dateToStr = function(date){
    if (date==null){return null};
    return date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear();
}

var StrToDate = function(str){
    if (str==null){return null};    
    b = str.split('-');
    a = new Date();
    a.setDate(parseInt(b[0]));
    a.setMonth(parseInt(b[1]));
    a.setFullYear(parseInt(b[2]));
    return a;
}

var daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  var balikan = Math.round(difference_ms/one_day);
  if (balikan<=0){
      return 0
  } else {
      return balikan
  }

}

// ========================== ++++++++++++++++++++++++++++++++++++ ===============================================

app.controller("loginCtrl",function ($scope,$state,$firebaseAuth) {
    $scope.warn = false;    
    $scope.authObj = $firebaseAuth();
    
    $scope.loginSuccess = function (email,passwd) {
        $scope.authObj.$signInWithEmailAndPassword(email,passwd).then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
            $state.go('main');
        }).catch(function(error) {
            $scope.errmessage = error.message;
            $scope.warn = true;
        });
    }
});

app.controller("loginMemberCtrl", function($scope,$state,$firebaseAuth){
    $scope.warn = false;
    $scope.authObj = $firebaseAuth();

    $scope.loginSuccess = function (email,passwd) {
        $scope.authObj.$signInWithEmailAndPassword(email,passwd).then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
            $state.go('mainmember');
        }).catch(function(error) {
            $scope.errmessage = error.message;
            $scope.warn = true;
        });
    }
});

app.controller("regisCtrl",function($scope,$firebaseAuth,$firebaseArray){
    $scope.authObj = $firebaseAuth();
    //load data user dari firebase
    var rootref = firebase.database().ref().child('Members');
    var Members = $firebaseArray(rootref);
    //algorithm
    $scope.submit = function(member){
        console.log(member);
        $scope.authObj.$createUserWithEmailAndPassword($scope.member.email, $scope.password)
        .then(function(firebaseuser){
            rootref.child(firebaseuser.uid).set(member);
            $scope.successmessage = "Berhasil silahkan login";
            $scope.success = true;
        }).catch(function(error){
            console.log(error);
            $scope.errmessage = error;
            $scope.warn = true;
        })
    }
});

app.controller("mainCtrl",function($scope,$firebaseAuth,$state) {
    $scope.authObj = $firebaseAuth();
    $scope.keluar = function (){
        $scope.authObj.$signOut();
        $state.go('login');
    }
});

app.controller("mainmemberCtrl",function ($scope, $firebaseAuth, $state) {
    $scope.authObj = $firebaseAuth();
    $scope.keluar = function (){
        $scope.authObj.$signOut();
        $state.go('login');
    }
})

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);
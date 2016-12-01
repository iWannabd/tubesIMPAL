app.controller('profileCtrl',function ($scope,$firebaseObject,$firebaseAuth) {
    a = $firebaseAuth().$getAuth();
    var ref = firebase.database().ref().child('Members').child(a.uid);
    $scope.profil = $firebaseObject(ref);
});
app.controller("userCtrl",function ($scope,$firebaseAuth,$firebaseArray) {
    $scope.authObj = $firebaseAuth();    
    var currUser = $scope.authObj.$getAuth();
    console.log(currUser);

    var rootref = firebase.database().ref().child('Members');
    var Members = $firebaseArray(rootref);

    $scope.members = Members;

    $scope.pilih = function(me){
        $scope.selected = me;
    }

    $scope.perbarui = function(){
        $scope.members.$save($scope.selected);
    }

});
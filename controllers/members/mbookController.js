app.controller("mbookCtrl",function ($scope,$firebaseArray) {
    //load data buku dari firebase
    var rootref = firebase.database().ref().child('Bukus');
    var Bukus = $firebaseArray(rootref);
    $scope.books = Bukus;
})
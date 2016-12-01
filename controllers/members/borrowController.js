app.controller('mborrowCtrl', function ($scope,$firebaseAuth,$firebaseArray) {
    a = $firebaseAuth().$getAuth();
    //load data buku dari firebase
    var rootref = firebase.database().ref().child('Bukus');
    var Bukus = $firebaseArray(rootref);

    //load data peminjaman dari firebase
    var rootref2 = firebase.database().ref().child('Peminjaman');
    var query = rootref2.orderByChild('uid').equalTo(a.uid);

    $scope.peminjamans = $firebaseArray(query);

    $scope.peminjamans.$watch(
        function (event) {
            for (var i=0;i<$scope.peminjamans.length;i++){
                $scope.peminjamans[i].buku = Bukus.$getRecord($scope.peminjamans[i].bid);
                console.log($scope.peminjamans);
            }
        }
    );

    console.log($scope.peminjamans);
});
app.controller("reportController",function ($scope,$firebaseAuth,$firebaseArray) {
    $scope.authObj = $firebaseAuth();    
    var currUser = $scope.authObj.$getAuth();

    //load data buku dari firebase
    var rootref = firebase.database().ref().child('Bukus');
    var query = rootref.orderByChild('status').equalTo('Tersedia');
    var Bukus = $firebaseArray(query);
    $scope.bookss = $firebaseArray(rootref);
    $scope.books = Bukus;
    console.log(Bukus);

    //load data user dari firebase
    var rootref1 = firebase.database().ref().child('Members');
    var Members = $firebaseArray(rootref1);
    $scope.members = Members;
    console.log(Members);

    //load data peminjaman dari firebase
    var rootref2 = firebase.database().ref().child('Peminjaman');
    var Peminjamans = $firebaseArray(rootref2);
    $scope.peminjamans = Peminjamans;
    console.log(Peminjamans);

    $scope.today = dateToStr(new Date());

    //join data antara buku dan peminjam dan perbarui setiap ada perubahan
    $scope.peminjamanmember = [];
    Peminjamans.$watch(
        function(event){
            $scope.peminjamanmember = [];            
            lengkapi(Peminjamans);
        });
    //fungsi untuk menambah properti peminjaman dan buku
    lengkapi = function(list){
        for (i=0;i<list.length;i++){
            list[i].peminjam = getUser(list[i].uid);
            list[i].buku = getBuku(list[i].bid);
            $scope.peminjamanmember.push(list[i]);
        }
    }

    //fungsi mengembalikan objek members
    getUser = function(key){
        return Members.$getRecord(key);
    }
    //fungsi untuk mengembalikan objek buku
    getBuku = function(key){
        return $scope.bookss.$getRecord(key);
    }

});
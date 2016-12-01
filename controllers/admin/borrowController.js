app.controller('pinjamCtrl',function($scope,$firebaseAuth,$firebaseArray,$uibModal){
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
    };

    //fungsi mengembalikan objek members
    getUser = function(key){
        return Members.$getRecord(key);
    };
    //fungsi untuk mengembalikan objek buku
    getBuku = function(key){
        return $scope.bookss.$getRecord(key);
    };

    //fungsi untuk menambah peminjaman baru
    $scope.tambah = function(pinjam){
        pinjam.willback = dateToStr(pinjam.willbacka);
        pinjam.dipinjam = dateToStr(new Date());
        //mengganti status buku menjadi dipinjam
        buku = getBuku(pinjam.bid);
        buku.status = "Dipinjam";
        $scope.bookss.$save(buku);
        console.log(pinjam);
        Peminjamans.$add(pinjam);
    };

    //menampilkan modal pengembalian buku
    $scope.open = function(_selected){
        var modalInstance = $uibModal.open({
            templateUrl:'templates/modals/returnbook.htm',
            size:'modal-sm',
            controller:'returnBookCtrl',
            resolve:{
                peminjaman: function(){return _selected;}
            }
        });

        modalInstance.result.then(function(){
            buku = _selected.buku;
            buku.status = "Tersedia";
            $scope.bookss.$save(buku);
            delete _selected.peminjam;
            delete _selected.buku;
            _selected.dikembalikan = dateToStr(_selected.kembalia);
            Peminjamans.$save(_selected);
        });
    }

    $scope.hapus = function(peminjaman){
        buku = peminjaman.buku;
        buku.status = "Tersedia";
        $scope.bookss.$save(buku);
        $scope.peminjamans.$remove(peminjaman);
    }
})
//kelas pengendali pengembalian buku
app.controller('returnBookCtrl',function($scope,$uibModalInstance,peminjaman){
    $scope.pinjam = peminjaman;
    $scope.pinjam.return = dateToStr(new Date());
    $scope.pinjam.hilang = false;
    $scope.pinjam.keterlambatan  = daysBetween(StrToDate($scope.pinjam.willback),new Date());
    $scope.pinjam.totaldenda = $scope.pinjam.keterlambatan * $scope.pinjam.denda;
    console.log($scope.pinjam);
    console.log();
    $scope.hitungdenda = function(){
        console.log($scope.pinjam.hilang);
        if (!$scope.pinjam.hilang){
            $scope.pinjam.totaldenda = $scope.pinjam.keterlambatan * $scope.pinjam.denda;    
        } else {
            $scope.pinjam.totaldenda = $scope.pinjam.buku.hargabeli+($scope.pinjam.keterlambatan * $scope.pinjam.denda);
        }
    };

    $scope.kembali = function(){
        $uibModalInstance.close();        
    }
})
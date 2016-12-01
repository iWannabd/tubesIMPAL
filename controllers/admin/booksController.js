//================================================Kelas-kelas Olah Data Buku==================================================
// kelas pengendai olah data buku
app.controller("bookCtrl",function ($scope,$uibModal,$firebaseArray) {
    $scope.showDetil = false;    
    $scope.selectedbook = {};
    //load data buku dari firebase
    var rootref = firebase.database().ref().child('Bukus');
    var Bukus = $firebaseArray(rootref);
    $scope.books = Bukus;
    // membuka modal tambah edit buku
    $scope.open = function(editmode) {
        if (!editmode) {
            $scope.selectedbook = {};        
        }
        var modalInstance = $uibModal.open({
            templateUrl:'templates/modals/addbook.htm',
            size:'modal-sm',
            controller:'addbookCtrl',
            resolve:{
                book: function(){return $scope.selectedbook;}
            }
        });
        //yang dilakukan setelah menutup modal
        modalInstance.result.then(function(){
            $scope.selectedbook.tanggalimpor = dateToStr($scope.selectedbook.tanggalimpora);
            $scope.selectedbook.hilang = dateToStr($scope.selectedbook.hilanga);
            console.log($scope.selectedbook);
            if (!editmode){
                Bukus.$add($scope.selectedbook);
                $scope.selectedbook = {}
                
            } else {
                Bukus.$save($scope.selectedbook);
            }
        })
    };

    //memilih buku
    $scope.pilih = function(book){
        console.log(book)
        $scope.showDetil = true;
        $scope.selectedbook = book;
    }
    //menghapus buku
    $scope.delete = function(buku){
        Bukus.$remove(buku);
    }
    
});

//kelas pengendali tambah dan edit buku
app.controller('addbookCtrl',function($scope,$uibModalInstance,book){
    $scope.buku = book;
    $scope.buku.tanggalimpora = StrToDate(book.tanggalimpor);
    $scope.buku.hilanga = StrToDate(book.hilang);
    
    $scope.tambah = function(buku){
        $uibModalInstance.close();        
    };
    $scope.batal = function(){
        $uibModalInstance.close();
    }
});
//=========================================================================================================================
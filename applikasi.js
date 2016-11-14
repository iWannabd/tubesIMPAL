var app = angular.module("App",['ui.router']);

app.config(function ($stateProvider) {
    var dashboard = {
        name:"dashboard",
        url:"/dashboard",
        templateUrl:'templates/dashboard.htm'
    }

    var users = {
        name:"users",
        url:"/users",
        controller:"userCtrl",
        templateUrl:'templates/anggota.htm'
    }

    var books = {
        name:"books",
        url:"/buku",
        controller:"bukuCtrl",
        templateUrl:"templates/buku.htm"
    }

    var borrows = {
        name:'borrows',
        url:'/borrow',
        controller:'pinjamCtrl',
        templateUrl:'templates/pinjam.htm'
    }

    $stateProvider.state(dashboard);
    $stateProvider.state(users);
    $stateProvider.state(books);
    $stateProvider.state(borrows);


})

app.controller("mainCtrl",function ($scope) {
    $scope.cek = "cek dlu yaa"
})

app.controller("usersCtrl",function ($scope) {
    $scope.users = [
        
    ]
})

app.controller("bookCtrl",function ($scope) {

})
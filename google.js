var myApp = angular.module('twitter',['underscore']);

myApp.controller('twitterCtrl', function($scope, $http, $sce, _, $timeout) {
	$scope.title = "Twitter";
	$scope.suggestions = [];
	$scope.loading = true;
  $scope.searchString = '';
  $scope.hideList = true;
  $scope.tweets = [];
  $scope.currentItem = {
    loaded: false
  };


	$scope.loadSuggestions = function () {
    if($scope.searchString.length > 0){
      var url = "/search/" + $scope.searchString;
  		$http.get(url).then(function(response) {
        $scope.hideList = false;
        $scope.suggestions = response.data;
      });
    }
	}

  $scope.init = function () {
    $scope.loading = false;
  }

  $scope.go = function (item) {
    var url = "getById/" + item.id;
    $scope.hideList = false;
    $scope.loading = true;
    $scope.currentItem.loaded = false;

    $http.get(url).then(function(response) {
      $scope.currentItem = response.data[0];
      $scope.loading = false;
      console.log($scope.currentItem);
      $scope.currentItem.loaded = true;
      $scope.currentItem.highres = $scope.currentItem.profile_image_url.replace('_normal','');
      $scope.getTweets($scope.currentItem.id);
    });
  }

  $scope.getTweets = function (id) {
    var url = "getTweetsById/" + id;
    $scope.tweets = [];

    $http.get(url).then(function(response) {
      $scope.tweets = response.data;
    });
  }
  $scope.hideTheList = function (item) {
    $timeout(function(){$scope.hideList = true;}, 200);   
  }
});

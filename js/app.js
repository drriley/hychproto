// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('hychProto', ['ionic', 'firebase', 'hychProto.controllers'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.userEmail = null;
    $rootScope.baseUrl = 'https://torid-heat-7294.firebaseio.com/';
    var authRef = new Firebase($rootScope.baseUrl);
    $rootScope.auth = $firebaseAuth(authRef);

    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };

    $rootScope.hide = function() {
      $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };

    $rootScope.logout = function() {
      $rootScope.auth.$logout();
      $rootScope.userEmail = null;
      console.log($rootScope);
      $window.location.href = '#/auth/signin';
    };

    $rootScope.checkSession = function() {

      console.log($rootScope);

      var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
        if (error) {
          // no action yet.. redirect to default route
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        } else if (user) {
          // user authenticated with Firebase
          console.log("checking!!");
          $rootScope.userEmail = user.email;
        //  $window.location.href = ('#/profile/view');
        } else {
          // user is logged out
          $rootScope.userEmail = null;
          console.log("else!!");
          console.log($rootScope.userEmail);
          $window.location.href = '#/auth/signin';
        }
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('auth', {
    url: "/auth",
    abstract: true,
    templateUrl: "templates/auth.html"
  })

  .state('auth.signin', {
    url: '/signin',
    views: {
      'auth-signin': {
        templateUrl: 'templates/auth-signin.html',
        controller: 'SignInCtrl'
      }
    }
  })

  .state('auth.signup', {
    url: '/signup',
    views: {
      'auth-signup': {
        templateUrl: 'templates/auth-signup.html',
        controller: 'SignUpCtrl'
      }
    }
  })

  .state('profile', {
    url: "/profile",
    abstract: true,
    templateUrl: 'templates/profile.html',

  })

  .state('profile.view', {
    url: "/view",
    views: {
      'profile-view': {
        templateUrl: 'templates/profile-view.html',
        controller: 'ProfileCtrl'
      }
    }
  })


  .state('profile.edit', {
    url: "/edit",
    views: {
      'profile-edit': {
        templateUrl: 'templates/profile-edit.html',
        controller: 'ProfileEditCtrl'
      }
    }
  })


  $urlRouterProvider.otherwise('/auth/signin');
});

angular.module('hychProto.controllers', [])


.controller('SignUpCtrl', [
'$scope', '$rootScope', '$firebaseAuth', '$window','$routeProvider',
function ($scope, $rootScope, $firebaseAuth, $window) {
  $scope.user = {
    email: "",
    password: ""
  };

  $scope.createUser = function () {
    var email = this.user.email;
    var password = this.user.password;

    if (!email || !password) {
      $rootScope.notify("Please enter valid credentials");
      return false;
    }

    $rootScope.show('Please wait.. Registering');
    $rootScope.auth.$createUser(email, password, function (error, user) {
      if (!error) {
        $rootScope.hide();
        $rootScope.userEmail = user.email;
        $window.location.href = ('#/profile/view');
      }
      else {
        $rootScope.hide();
        if (error.code == 'INVALID_EMAIL') {
          $rootScope.notify('Invalid Email Address');
        }
        else if (error.code == 'EMAIL_TAKEN') {
          $rootScope.notify('Email Address already taken');
        }
        else {
          $rootScope.notify('Oops something went wrong. Please try again later');
        }
      }
    });
  }
}
])





.controller('SignInCtrl', [
'$scope', '$rootScope', '$firebaseAuth', '$window',
function ($scope, $rootScope, $firebaseAuth, $window) {
  // check session
  $rootScope.checkSession();
  $scope.user = {
    email: "",
    password: ""
  };

  $scope.validateUser = function () {
    $rootScope.show('Please wait.. Authenticating');
    var email = this.user.email;
    var password = this.user.password;
    if (!email || !password) {
      $rootScope.notify("Please enter valid credentials");
      return false;
    }
    $rootScope.auth.$login('password', {
      email: email,
      password: password
    })
    .then(function (user) {
      console.log(user);
      console.log($rootScope);
      $rootScope.hide();
      $rootScope.userEmail = user.email;
      $window.location.href = ('#/profile/view');
    }, function (error) {
      $rootScope.hide();
      if (error.code == 'INVALID_EMAIL') {
        $rootScope.notify('Invalid Email Address');
      }
      else if (error.code == 'INVALID_PASSWORD') {
        $rootScope.notify('Invalid Password');
      }
      else if (error.code == 'INVALID_USER') {
        $rootScope.notify('Invalid User');
      }
      else {
        $rootScope.notify('Oops something went wrong. Please try again later');
      }
    });
  }
}
])

.controller('ProfileCtrl', function($rootScope, $scope, $window, $ionicModal, $firebase) {



  //  $scope.email = $rootScope.userEmail;



  var profileRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));

  profileRef.on('value', function(snapshot) {

    console.log(snapshot.val());

  });


})

.controller('ProfileEditCtrl', function($rootScope, $scope, $window, $ionicModal, $firebase) {
  $scope.data = {
    first_name: "",
    last_name: "",
    bio: ""

  };

$scope.updateProfile = function (){
  console.log("here");

  var first_name = $scope.data.first_name;
  var last_name = $scope.data.last_name;
  var bio = $scope.data.bio;

  var Profile = {
    first_name: first_name,
    last_name: last_name,
    bio: bio,
    created: Date.now(),
    updated: Date.now()
  };

  var profileRef = new Firebase($rootScope.baseUrl+ "/profiles");

  $firebase(profileRef).$add(Profile);
  $window.location.href = ('#/profile/view');


};


});


function escapeEmailAddress(email) {
  if (!email) return false
    // Replace '.' (not allowed in a Firebase key) with ','
    email = email.toLowerCase();
    email = email.replace(/\./g, ',');
    console.log(email.trim());
    return email.trim();
  }

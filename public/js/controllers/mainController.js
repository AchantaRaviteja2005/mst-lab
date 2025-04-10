'use strict';

// Main controller for the application
app.controller('MainController', ['$scope', '$http', function($scope, $http) {
  // Initialize controller variables
  $scope.pageTitle = 'FITRACKER';
  $scope.isLoading = false;
  
  // Example function to fetch data
  $scope.fetchData = function() {
    $scope.isLoading = true;
    $http.get('/api/data')
      .then(function(response) {
        $scope.data = response.data;
        $scope.isLoading = false;
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
        $scope.isLoading = false;
      });
  };
}]);

// Dashboard controller
app.controller('DashboardController', ['$scope', '$http', function($scope, $http) {
  $scope.dashboardData = {
    workouts: [],
    stats: {}
  };
  
  // Fetch dashboard data
  $scope.loadDashboard = function() {
    $http.get('/api/dashboard')
      .then(function(response) {
        $scope.dashboardData = response.data;
      })
      .catch(function(error) {
        console.error('Error loading dashboard:', error);
      });
  };
  
  // Initialize controller
  $scope.loadDashboard();
}]);

// Profile controller
app.controller('ProfileController', ['$scope', '$http', function($scope, $http) {
  $scope.profile = {};
  $scope.editMode = false;
  
  // Load user profile
  $scope.loadProfile = function() {
    $http.get('/api/profile')
      .then(function(response) {
        $scope.profile = response.data;
      })
      .catch(function(error) {
        console.error('Error loading profile:', error);
      });
  };
  
  // Update profile
  $scope.updateProfile = function() {
    $http.post('/api/profile', $scope.profile)
      .then(function(response) {
        $scope.editMode = false;
        // Show success message
      })
      .catch(function(error) {
        console.error('Error updating profile:', error);
      });
  };
  
  // Initialize controller
  $scope.loadProfile();
}]);
'use strict';

// Dashboard controller
app.controller('DashboardController', ['$scope', '$http', function($scope, $http) {
  // Initialize fitness data
  $scope.fitnessData = {
    water: 0,
    caloriesIn: 0,
    caloriesOut: 0,
    fitnessScore: 0
  };
  
  // Initialize user data
  $scope.user = {
    username: '',
    profile: {
      accountType: '',
      age: '',
      height: ''
    }
  };
  
  // Load user data
  $scope.loadUserData = function() {
    $http.get('/api/user')
      .then(function(response) {
        $scope.user = response.data;
        if (response.data.fitnessData) {
          $scope.fitnessData = response.data.fitnessData;
        }
      })
      .catch(function(error) {
        console.error('Error loading user data:', error);
      });
  };
  
  // Update fitness values
  $scope.updateValue = function(type, value) {
    if (!value) return;
    
    var data = { type: type, value: value };
    
    // Update UI immediately for better UX
    $scope.fitnessData[type] = value;
    
    // Clear input
    $scope[type + 'Input'] = '';
    
    // Send to server
    $http.post('/dashboard/update', data)
      .then(function(response) {
        if (!response.data.success) {
          alert('Failed to update: ' + (response.data.message || 'Unknown error'));
          // Revert UI if server update failed
          $scope.loadUserData();
        }
      })
      .catch(function(error) {
        console.error('Update error:', error);
        alert('An error occurred while updating');
        // Revert UI on error
        $scope.loadUserData();
      });
  };
  
  // Calculate fitness score
  $scope.calculateFitnessScore = function() {
    $http.post('/dashboard/calculate-score')
      .then(function(response) {
        if (response.data.success) {
          $scope.fitnessData.fitnessScore = response.data.score;
        } else {
          alert('Failed to calculate score: ' + (response.data.message || 'Unknown error'));
        }
      })
      .catch(function(error) {
        console.error('Score calculation error:', error);
        alert('An error occurred while calculating fitness score');
      });
  };
  
  // Initialize controller
  $scope.loadUserData();
}]);
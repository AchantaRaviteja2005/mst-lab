'use strict';

// Data service for handling API requests
app.service('DataService', ['$http', function($http) {
  var service = {};
  
  // User related functions
  service.getCurrentUser = function() {
    return $http.get('/api/user');
  };
  
  service.updateUser = function(userData) {
    return $http.post('/api/user', userData);
  };
  
  // Workout related functions
  service.getWorkouts = function() {
    return $http.get('/api/workouts');
  };
  
  service.addWorkout = function(workout) {
    return $http.post('/api/workouts', workout);
  };
  
  service.updateWorkout = function(id, workout) {
    return $http.put('/api/workouts/' + id, workout);
  };
  
  service.deleteWorkout = function(id) {
    return $http.delete('/api/workouts/' + id);
  };
  
  // Stats related functions
  service.getStats = function() {
    return $http.get('/api/stats');
  };
  
  return service;
}]);
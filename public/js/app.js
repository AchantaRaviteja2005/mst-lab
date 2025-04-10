'use strict';

// Define the main Angular module for the application
var app = angular.module('fitrackerApp', ['ngRoute']);

// Configure routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  // Enable HTML5 mode to remove the # from URLs
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  
  // Define routes - these will work alongside Express routes
  $routeProvider
    .when('/dashboard', {
      templateUrl: '/partials/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/profile', {
      templateUrl: '/partials/profile.html',
      controller: 'ProfileController'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

// Run block for application initialization
app.run(['$rootScope', function($rootScope) {
  // Initialize any app-wide variables or settings
  $rootScope.appName = 'FITRACKER';
}]);
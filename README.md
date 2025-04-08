# FITRACKER - Fitness Tracking Application

FITRACKER is a web application for tracking fitness activities, monitoring progress, and accessing fitness resources.

## Features

- User authentication (signup, login, logout)
- Personalized dashboard
- Fitness metrics tracking (water intake, calories consumed/burned)
- Fitness score calculation
- Responsive design for all devices

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript templates)
- CSS
- JavaScript

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Make sure MongoDB is running on localhost:27017
4. Start the application:
   ```
   npm start
   ```
5. Access the application at http://localhost:3000

## Development

For development with automatic server restart:
```
npm run dev
```

## Database

The application uses MongoDB with the following connection string:
```
mongodb://localhost:27017/fitracker
```

## Project Structure

- `/models` - Database models
- `/routes` - Application routes
- `/views` - EJS templates
- `/public` - Static assets (CSS, JS, images)
- `/middleware` - Custom middleware functions
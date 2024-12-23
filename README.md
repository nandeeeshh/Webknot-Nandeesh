# Webknot assignment, Nandeesh P Math - ENG21CS0263
# DSU

This project is a full-stack application that manages attendees, tasks and events. It consists of a frontend built with React and a backend built with Python Flask. Below are the steps to get the project up and running.


## Prerequisites

Make sure you have the following software installed:

- **Node.js** (for running the React frontend)
- **npm** (for managing frontend dependencies)
- **Python 3.x** (for running the Flask backend)
- **pip** (for installing Python dependencies)
- **Git** (for cloning the repository)

### Frontend Requirements:
- React (with Material-UI and React Hook Form)

### Backend Requirements:
- Flask (Python Framework)
- SQLAlchemy (for interacting with the database)
- JWT (for authentication)

---

## Cloning the Repository

1. Open a terminal and navigate to the directory where you want to store the project.
2. Clone the repository:

```bash
git clone https://github.com/nandeeeshh/Webknot-Nandeesh.git
```

3.Navigate into the project directory:
```bash
  cd Webknot-Nandeesh
  ```

## Installing Dependencies
Frontend:
1.Navigate to the frontend directory:
```bash
  cd event-management-client
  ```

2. Install the required npm packages:
```bash
  npm install
  ```
Backend:
1. Navigate to the parent folder containing app.py
```bash
  cd ..
```

2. run this command to install dependencies
```bash
pip install Flask SQLAlchemy PyJWT
```

## Running the Application

Backend:
Navigate to the backend directory, open terminal.
Run the Flask app:
```bash
python app.py
```
ctrl + click on the url to open the swagger documentation.
Server is running.


Frontend:
Navigate to the frontend directory, open another terminal.
Start the React development server:
```bash
npm run dev
```
ctrl + click on the url to open the application on web, new tab.

---
---
---
---

# API DETAILS
This API provides functionalities for managing events, attendees, and tasks, along with user authentication. Below is the detailed information about each endpoint and its purpose.

## Authentication APIs (`/auth`)

### Register a User
- **Endpoint**: `/auth/register`
- **Method**: POST
- **Description**: Registers a new user.
- **Request Body**:
  json
  {
    "username": "string",
    "password": "string"
  }
  
- **Response**:
  - 201: User registered successfully.
  - 400: User already exists.

### Login a User
- **Endpoint**: `/auth/login`
- **Method**: POST
- **Description**: Authenticates a user and provides a JWT token.
- **Request Body**:
  json
  {
    "username": "string",
    "password": "string"
  }
  
- **Response**:
  - 200: JWT token issued.
  - 401: Invalid credentials.

---

## Event Management APIs (`/events`)

### Get All Events
- **Endpoint**: `/events/`
- **Method**: GET
- **Description**: Retrieves a list of all events.
- **Response**:
  - 200: List of events.

### Create an Event
- **Endpoint**: `/events/`
- **Method**: POST
- **Description**: Creates a new event.
- **Request Body**:
  json
  {
    "name": "string",
    "description": "string",
    "location": "string",
    "date": "DD-MM-YYYY"
  }
  
- **Response**:
  - 201: Event created successfully.
  - 400: Invalid date format.

---

## Attendee Management APIs (`/attendees`)

### Get All Attendees
- **Endpoint**: `/attendees/`
- **Method**: GET
- **Description**: Retrieves a list of all attendees.
- **Response**:
  - 200: List of attendees.

### Add an Attendee
- **Endpoint**: `/attendees/`
- **Method**: POST
- **Description**: Adds a new attendee.
- **Request Body**:
  json
  {
    "name": "string",
    "email": "string",
    "event_id": "integer"
  }
  
- **Response**:
  - 201: Attendee added successfully.

### Delete an Attendee
- **Endpoint**: `/attendees/<int:id>`
- **Method**: DELETE
- **Description**: Deletes an attendee by ID.
- **Response**:
  - 200: Attendee deleted successfully.
  - 404: Attendee not found.

---

## Task Management APIs (`/tasks`)

### Add a Task
- **Endpoint**: `/tasks/`
- **Method**: POST
- **Description**: Adds a new task to an event.
- **Request Body**:
  json
  {
    "name": "string",
    "deadline": "DD-MM-YYYY",
    "status": "string",
    "event_id": "integer",
    "attendee_id": "integer"
  }
  
- **Response**:
  - 201: Task created successfully.
  - 400: Invalid date format.

### Get Tasks by Event ID
- **Endpoint**: `/tasks/<int:event_id>`
- **Method**: GET
- **Description**: Retrieves tasks associated with a specific event.
- **Response**:
  - 200: List of tasks.

### Update Task Status
- **Endpoint**: `/tasks/<int:id>/status`
- **Method**: PUT
- **Description**: Updates the status of a task.
- **Request Body**:
  json
  {
    "status": "string"
  }
  

## Authorization
Most endpoints require a valid JWT token in the `Authorization` header as `Bearer <your-token>`.

---
## Note
- Use the Swagger UI at `/swagger` for interactive API documentation.

# KYC Compliance System

This is a full-stack application for a simplified **Know Your Customer (KYC)** system. The system allows users to submit KYC information, admins to manage and approve/reject submissions, and provides KPIs on KYC status. The app is built using **React** for the frontend and **Node.js** with **MongoDB** for the backend.

## Project Structure

The project is divided into two main folders:

- **frontend**: React application built using Vite
- **backend**: Node.js server with MongoDB as the database

## Features

### Frontend (React + Vite)
- **Authentication and Authorization**: 
  - Role-based access control for Admin and User roles.
- **KYC Submission**:
  - A form for users to input their details (name, email, etc.) and upload an ID document.
  - Form displays feedback on submission status (pending, approved, rejected).
- **Admin Dashboard**:
  - Table to display users' details and KYC submission statuses.
  - Admin can approve or reject KYC submissions directly from the table.
  - KPIs are displayed, such as total users, approved, rejected, and pending KYC submissions.

### Backend (Node.js + MongoDB)
- **Authentication and Authorization**:
  - Role-based authentication for users and admins.
  - Secure login and registration process.
- **KYC Management**:
  - API endpoints to submit and retrieve KYC data.
  - Admin can update KYC statuses (approved/rejected) via API.
- **Database**:
  - User credentials, roles, and KYC data are stored securely in MongoDB.
- **File Storage**:
  - Upload and store user ID documents.

## Tech Stack

- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Multer (for file upload handling)

## Setup Instructions

### Prerequisites

Ensure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn
- MongoDB running locally or a remote MongoDB instance

### Backend Setup

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables. Create a `.env` file in the `backend` directory with the following keys:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

   The backend will be running at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:5173`.

### Running the Application

Once both the backend and frontend servers are running, the application can be accessed at `http://localhost:5173`. The frontend will communicate with the backend API, and users will be able to register, submit KYC information, and admins will have access to manage KYC statuses.

## Usage
- **Home Page**: 
    - KPIs (total registered users, approved, rejected, pending) are displayed.

- **User Registration**: 
  - Users can register by providing their name, email, and password.
  - After registration, they can log in and submit their KYC details (name, email, and an ID document).
  
- **Admin Dashboard**:
  - Admins can view all users and their KYC submission statuses.
  - Admins have the ability to approve or reject KYC submissions.


## Assumptions & Trade-offs

- **Assumption**: User data is securely stored and can only be accessed by users with appropriate roles (Admin/User).
- **Trade-off**: No external services are used for file storage, the application stores user IDs locally. In a production scenario, a cloud storage service would be preferable for better scalability.
- **Trade-off**: The app uses a basic authentication flow with JWT tokens for role-based access. In a real-world scenario, additional security layers (like refresh tokens, etc.) may be needed.

## Tests

- Unit tests and integration tests have been added for core components. The testing suite can be found in both the frontend and backend.

## Future Improvements

- **File Storage**: Integration with cloud storage services like AWS S3 for file handling.
- **More Comprehensive KPIs**: Extend the KPIs to include approval time, rejection reasons, etc.
- **Role-based Permissions**: Implement more granular permissions for Admin roles.

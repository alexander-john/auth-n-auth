# AuthNAuth

A simple authentication and authorization example using Node.js, Express, JWT, and bcrypt. This project demonstrates user registration, login, and protected routes.

## Installation

1. Clone the repository.

2. Install dependencies:

```bash
npm install
```

3. Create .env in root directory and add the following:

```bash
PORT=5000
JWT_SECRET=supersecretkey123
```

## Running the Application

Start the server:

```bash
npm start
```

Open your browser and navigate to `http://localhost:5000`.

## Endpoints

- `POST /register`: Register a new user.
- `POST /login`: Login a user and receive a JWT token.
- `GET /profile`: Get the profile of the logged-in user (protected route).
- `GET /public`: Public route accessible to anyone.
- `POST /logout`: Logout a user (handled client-side).
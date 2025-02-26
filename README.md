# Events API

This is a REST + GraphQL event management API where users can authenticate, create events and mark attendance. The project is built using NestJS, Postgres, JWT, and Passport.js for authentication and authorization.

## Features

- **Event Management**: Users can create, update, view details and delete events.
- **Attendance**: Users can mark attendance for events, view list of attendeess.
- **Authorization**: JWT authentication is used to secure the API, with Passport.js handling the authorization.
- **REST and GraphQL API**: The application supports both REST and GraphQL (only for user creation) endpoints.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source relational database.
- **JWT (JSON Web Token)**: Used for securing the API endpoints.
- **Passport.js**: A popular middleware for authentication in Node.js.
- **TypeORM**: An ORM used for database interaction and migrations.
- **Docker**: Used for launching database for local development.
- **Jest**: Testing framework used for writing unit and integration tests.

## How to run the project

### 1. Clone the Repository

```bash
git clone https://github.com/olha-dev-fullstack/nest-rest-graphql-events-api.git
cd events-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Start Docker and run docker container:

```bash
docker-compose up -d
```

### 5. Start the Server

Run the NestJS server:

- watch mode

```bash
npm run start:dev
```

- dev mode

```bash
npm run start
```

- production mode

```bash
npm run start:prod
```

\*Please note that for production it is needed to create `prod.env` file into `src` folder with all configurations as in `dev.env`

The API will be available at `http://localhost:3000`.

## API Endpoints

### REST Endpoints

#### Authentication and Users

- **POST** `/auth/login`: User login (JWT Token generation)

```json
{
  "username": "test",
  "password": "password"
}
```

- **GET** `/auth/profile`: Get authorized user profile (requires authentication)
- **POST** `/user`: Register new user

```json
{
  "username": "test",
  "password": "password",
  "retypedPassword": "password",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@gmail.com"
}
```

#### Events

- **POST** `/events`: Create a new event (requires authentication)

```json
{
  "name": "Interesting Party",
  "description": "That is a crazy event, must go there!",
  "address": "Local St 101",
  "when": "2021-04-15 21:00:00"
}
```

- **GET** `/events`: Get a list of all events
- **GET** `/events/:id`: Get single event
- **DELETE** `/events/:id`: Delete an event (requires authentication)
- **GET** `/events-organized-by-user:id`: Get a list events organized by specific user (requires authentication)
- **PATCH** `/events/:id`: Update an event (requires authentication)

#### Event Attendance

- **PUT** `/events-attendance/:id`: Mark attendance for an event (requires authentication)

```json
{
  "answer": 1
}
```

- **GET** `/events/:id/attendees` Get List of attendees of specific event
- **GET** `/events-attendance/:id` Get specific event attendance by current user
- **GET** `/events-attendance` Get al events to be attended by currenct user

### GraphQL Endpoints

- Access GraphQL playground at `/graphql`.

\*There is Postman collection with all endpoints included in this repo

## Authentication and Authorization

- JWT is used for user authentication.
- You need to pass a valid token in the `Authorization` header for authenticated routes.

Example:

```bash
Authorization: Bearer <token>
```

## Running Tests

To run unit tests, use:

```bash
npm run test
```

To run End-to-End tests, use:

```bash
npm run test:e2e
```

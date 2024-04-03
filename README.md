# Essay Correction Project API

## Overview

The main purpose of this project is to create an API for managing essay corrections.

### Dependencies

- **dotenv**: Loads environment variables from a `.env` file into `process.env`.

  - Simplifies managing environment-specific configurations.

- **jsonwebtoken**: Implements JSON Web Tokens (JWT) for authentication.

  - Allows secure transmission of information between parties as a JSON object.

- **pg**: Node.js PostgreSQL client library.

  - Provides access to PostgreSQL databases from Node.js applications.

- **typeorm**: Object-Relational Mapping (ORM) library for TypeScript and JavaScript.
  - Simplifies database interactions by mapping database tables to TypeScript/JavaScript classes.

### Development Dependencies

- **@types/cors**: TypeScript type definitions for the CORS middleware.

  - Provides TypeScript typings for CORS middleware.

- **@types/express**: TypeScript type definitions for the Express.js framework.

  - Provides TypeScript typings for Express.js.

- **@types/uuid**: TypeScript type definitions for the UUID library.

  - Provides TypeScript typings for generating universally unique identifiers (UUIDs).

- **cors**: Cross-Origin Resource Sharing (CORS) middleware for Express.js.

  - Enables the Express.js server to handle Cross-Origin requests.

- **express**: Web application framework for Node.js.

  - Simplifies building web applications and APIs with Node.js.

- **nodemon**: Utility that automatically restarts the Node.js application when file changes are detected.

  - Facilitates development by automatically refreshing the server upon file changes.

- **ts-node**: TypeScript execution environment and REPL for Node.js.

  - Allows running TypeScript code directly in Node.js without the need for compilation.

- **typescript**: Programming language that adds optional static typing to JavaScript.

  - Used for writing type-safe and scalable Node.js applications.

- **uuid**: Library for generating universally unique identifiers (UUIDs).
  - Provides functionality to generate unique identifiers for entities in the application.

## Clone the Repository

You can clone the repository using the following command:

`git clone https://github.com/aleffaso/essay-project-api`

## Setting Environment Keys

Copy the `.env_example` file to `.env` and update the values as necessary.

## Get Docker

Install Docker from [docker.com](https://docs.docker.com/get-docker/).

## Running the Application

To run the application, execute the following command:

`docker-compose up --build`

## Congrats, your API is running

`web_1  | Server started at http://localhost:80`
`web_1  | Data Source has been initialized`

### To check the health you may go on Postman and run the following route

`http:localhost:80/`

### Response

`{"message": "API online","status_code": 200}`

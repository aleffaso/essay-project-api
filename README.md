# Essay Correction Project API

## Overview

The main purpose of this project is to create an API for managing essay corrections.

## Code Coverage

![Branches](https://img.shields.io/badge/Branches-blue)![Branches](./coverage/badge-branches.svg) <br>
![Functions](https://img.shields.io/badge/Functions-blue)![Functions](./coverage/badge-functions.svg) <br>
![Lines](https://img.shields.io/badge/Lines-blue)![Lines](./coverage/badge-lines.svg) <br>
![Statements](https://img.shields.io/badge/Statements-blue)![Statements](./coverage/badge-statements.svg) <br>

## Dependencies

- `bcrypt`: A library for hashing passwords.
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.
- `jsonwebtoken`: Implements JSON Web Tokens (JWT) for authentication.
- `pg`: Node.js PostgreSQL client library.
- `reflect-metadata`: Provides reflection capabilities for TypeScript.
- `typeorm`: Object-Relational Mapping (ORM) library for TypeScript and JavaScript.

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

`web_1 | Server started at http://localhost:80`
`web_1 | Data Source has been initialized`

### To check the health system, you may go to Postman and run the following route:

`http:localhost:80`

### Response

`{"message": "API online","status_code": 200}`

### Initial configuration

#### Important: Do not forget to create `.env` file and put `.env_example` variables accordingly. All initial configuration are from this file

1 - Go into bash using `docker exec -it essay-project-api-web bash`

2 - Then now run the following command to create user permissions `npm run createUserPermissions`

3 - After that, run the following command to create superuser `npm run createSuperUser`

Great! You have created a superuser and also all required permissions to access the system via postman or insomnia

## Testing routes TODO

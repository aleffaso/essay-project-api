# Essay Correction Project API

## Overview

The main purpose of this project is to create an API for managing essay corrections.

## Dependencies

- dotenv: Loads environment variables from a `.env` file into `process.env`.

- jsonwebtoken: Implements JSON Web Tokens (JWT) for authentication.

- pg: Node.js PostgreSQL client library.

- typeorm: Object-Relational Mapping (ORM) library for TypeScript and JavaScript.

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

### To check health system you may go on Postman and run the following route

`http:localhost:80/`

### Response

`{"message": "API online","status_code": 200}`

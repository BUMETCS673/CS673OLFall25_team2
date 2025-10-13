# CareerForge

## CS673 Job Search Web App

A web application to find real job postings, built for **CS673 Software Engineering** at **Boston University**.  
The app uses the **Rise Jobs API** to fetch live listings and provides a simple, fast interface to search and filter roles.

## Team

- Pedro Ramirez
- Gopi Rayini
- Qi Chen
- Stacey Burns
- Yongxiang Chen
- James Rose

## Overview

This project is a job search application aimed at helping individuals stay organized in their career search by saving, applying to, and tracking jobs in one place. The motivation is to provide users with a simple system to manage applied jobs instead of relying on scattered tools. Its purpose is to connect employers and employees, with potential users being anyone on the job market. Core functionality includes creating user accounts, viewing and searching job posts, saving and applying to jobs, and tracking the status of applications.

## Tech Stack

- **Frontend:** React 19, TypeScript 5.8, Vite 7
- **Backend:** Java with Spring Boot
- **Database:** MySQL 8.4
- **Data Source:** [Rise Jobs API](https://pitchwall.co/product/rise-jobs-api)
- **Styling:** Bootstrap 5, React Bootstrap

## Features

- Fetch and display real job postings from Rise Jobs API
- Keyword search and filtering (job type, location)
- User accounts & authentication
- Save jobs and track application status
- Responsive design for desktop and mobile

## Architecture

```
Frontend (React + TypeScript)
└── API Proxy (Express.js) - In production
    └── Java Spring Boot Backend (REST)
        ├── Rise Jobs API (external data)
        └── MySQL Database (users, saved jobs, applications)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 17+
- Docker and Docker Compose (optional, for containerized setup)
- MySQL 8+ (if running locally without Docker)

### Setup (Frontend)

```bash
# Navigate to frontend directory
cd code/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will run on http://localhost:5173 by default.

### Environment Configuration

The frontend application uses the following environment variables:

- `VITE_API_BASE_URL`: Points to the backend API URL (default: http://localhost:8080/api)

You can create a `.env.local` file in the `code/frontend` directory to override these settings:

```
# Example .env.local
VITE_API_BASE_URL=http://localhost:8080/api
```

### Frontend Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Lint code
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:ci
```

### Running Frontend Tests (Jest + RTL)

The frontend test suite lives under `code/frontend/src/tests`. We use Jest with `ts-jest` and React Testing Library.

Run locally:

```bash
cd code/frontend
npm install
npm run test
```

Run in Docker (for screenshots or CI):

```bash
# from repository root
docker compose build frontend-tests
docker compose run --rm frontend-tests
```

Notes:

- Tests run in a jsdom environment with a dedicated `tsconfig.jest.json`.
- `src/tests/setupTests.ts` sets up jest-dom and polyfills TextEncoder/Decoder used by react-router.
- The Docker image for tests is defined by `code/frontend/Dockerfile.test` and invoked via the `frontend-tests` service in `docker-compose.yml`.

### Full Stack Setup with Docker

You can run the entire application stack (frontend, backend, and database) using Docker Compose:

```bash
# From the repository root
docker compose up -d
```

This will start:

- MySQL database on port 3306
- Spring Boot backend on port 8080
- Frontend tests can be run separately with `docker compose run --rm frontend-tests`

### API Proxy for Development

The project includes an API proxy in the `code/api-proxy` directory that helps with:

- CORS issues during development
- Routing requests to the deployed backend

To use it:

```bash
cd code/api-proxy
npm install
npm start
```

The API proxy runs on port 5179 by default and forwards requests to the backend.

## Database Connection Setup

### Local Development

When running the application with Docker Compose, the MySQL database is automatically configured. You can connect to it using:

- Host: localhost
- Port: 3306
- Username: cf_user
- Password: secret
- Database: careerforge

### Connecting to Remote Database

To connect to the remote database, you will need to download access key `EC2 Access.pem` (ask Gopi for the file).

1. Run the command `ssh -i "address_to_pem_file" -N -L 13306:careerforgedb.ckt4mmg2etgw.us-east-1.rds.amazonaws.com:3306 ubuntu@54.227.173.227`. Or you can run the script `aws_rds_connection.ps1` under `scripts` if you are using Windows. By running this command, you should put your pem file under `scripts` folder.

## Deployment

The application is deployed on Render:

- Frontend: https://cs673olfall25-team2.onrender.com
- API Proxy: https://cs673olfall25-team2-proxy.onrender.com
- Backend: Deployed on EC2 (accessed through the API proxy)

2. Now you are all set.

### Connecting local database

Modify `application.properties`. **DO NOT** commit them. Only use these settings on your computer.

1. Check the configuration in `spring.datasource.url`, current port is `13306`, and current database is `careerforge`.
2. Check the username `spring.datasource.username` and password `spring.datasource.password`.
3. Create a database on your local Mysql named `careerforge`. Run the initialization script `code/backend/src/main/resources/db/initialization.sql` for database setup.

## Project Structure (initial)

```
client/               # React + TypeScript app
server/               # Java backend (to be added)
```

## Data & Attribution

This project uses job data via the **Rise Jobs API**: [https://pitchwall.co/product/rise-jobs-api](https://pitchwall.co/product/rise-jobs-api).
Please review and respect the provider’s terms of service and attribution guidelines.

## Security

### JWT Secret Setup

- **Development:** No setup required!  
  The app auto-generates a secure secret on first run and saves it to `~/.jwt-secret`.

- **Production:** You must provide a real secret via
  - Environment variable: `APP_JWT_SECRET`, or
  - Spring property: `app.jwt.secret`

If no secret is provided in production, the app will fail to start.

## License

For educational use as part of BU CS673 course project.

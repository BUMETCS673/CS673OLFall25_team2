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

This project is a job search application aimed at helping individuals stay organized in their career search by saving, applying to, and tracking jobs in one place. The motivation is to provide users with a simple system to lead on applied jobs instead of relying on scattered tools. Its purpose is to connect employers and employees, with potential users being anyone on the job market. Core functionality includes creating user accounts, viewing and searching job posts, saving and applying to jobs, and tracking the status of applications. The proposed technology stack for the system is React with TypeScript for building the user interface, supported by a Java backend that manages job posts, authentication, and application tracking.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Java (framework TBD; e.g., Spring Boot)
- **Database:** SQL RDBMS (e.g., PostgreSQL/MySQL – TBD)
- **Data Source:** [Rise Jobs API](https://pitchwall.co/product/rise-jobs-api)
- **Styling:** TBD (CSS Modules / Tailwind / Bootstrap)

## Features (MVP)

- Fetch and display real job postings from Rise Jobs API
- Keyword search and basic filters (job type, location)
- User accounts & authentication (Java backend)
- Save applied jobs and delete old ones
- Pagination (optional in MVP)

## Architecture (high level)

```

React (client)
└── Java Backend (REST)
├── Rise Jobs API (read-only)
└── SQL Database (users, saved jobs, applications)

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 17+
- A local SQL database (PostgreSQL/MySQL). Connection details will be added once the backend is scaffolded.

### Setup (Frontend)

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

> Backend and database setup instructions will be added when the Java service and schema are initialized. An `.env.example` will be included for DB credentials and any API keys.

## Project Structure (initial)

```
client/               # React + TypeScript app
server/               # Java backend (to be added)
```

## Data & Attribution

This project uses job data via the **Rise Jobs API**: [https://pitchwall.co/product/rise-jobs-api](https://pitchwall.co/product/rise-jobs-api).
Please review and respect the provider’s terms of service and attribution guidelines.

## License

For educational use as part of BU CS673 course project.

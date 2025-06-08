# B2B Lead Generation Platform

A powerful, AI-enhanced web application designed to discover, enrich, and evaluate B2B sales leads. This platform streamlines the lead generation process, allowing sales and marketing teams to find and qualify potential customers with greater efficiency.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

---

## Overview

This project is a full-stack B2B lead generation tool built with a modern technology stack. It moves beyond simple data scraping by leveraging AI to evaluate and prioritize leads, providing actionable insights for sales outreach. The user can specify search criteria like industry and location, and the system will generate a list of companies, find their contact information, and enrich the data with AI-powered scores.

![Demo Application](recording.gif)

---

## Core Features

Based on the application's API, the key features include:

-   **Lead Search:** Initiates a search based on industry and location to discover potential B2B leads from yellowpages.com.
-   **Data Enrichment:** Automatically enriches lead data by finding crucial firmographic information for a given list of company domains.
-   **AI-Powered Lead Evaluation:** Utilizes a Large Language Model (Gemini) to evaluate a selection of leads, generating an ICP (Ideal Customer Profile) score, keyword relevance score, and a suggested "outreach angle" to personalize sales efforts.
-   **Comprehensive Lead Management:** Provides a clean interface to view and sort all discovered leads.
-   **Data Export:** Allows users to export lead lists to CSV or Excel for use in other CRM or sales tools.
---


## Getting Started

### Prerequisites

-   [Docker](https://www.docker.com/get-started) and Docker Compose are required to run the project easily.
-   [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) (only needed for local development without Docker).

### 1. Environment Setup

Before running the project, you need to set up your environment variables.

1.  **Create a `.env` file** in the project root by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  **Edit the `.env` file** with your specific configurations and API keys:

    ```env
    # PostgreSQL Database
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword
    POSTGRES_DB=leads_db
    POSTGRES_PORT=5432 # Port exposed on the host machine

    # Application Ports
    BACKEND_PORT=3333
    FRONTEND_PORT=5000

    # API Keys
    GEMINI_API_KEY=your_google_gemini_api_key
    APOLLO_API_KEY=your_apollo_io_api_key
    HUNTER_API_KEY=your_hunter_io_api_key
    TAVILY_API_KEY=your_tavily_api_key
    
    # Frontend needs to know the backend URL
    REACT_APP_API_BASE_URL=http://localhost:3333/api
    ```

### 2. Running the Application (Docker Recommended)

Using Docker is the recommended way to run the entire application stack (backend, frontend, database) with a single command.

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd leads-web-agent
    ```

2.  **Build and start the services:**
    ```bash
    docker-compose up --build
    ```
    *(Use `docker-compose up --build -d` to run in detached mode.)*

3.  **Access the application:**
    -   **Frontend:** [http://localhost:5000](http://localhost:5000) (or whatever `FRONTEND_PORT` you set).
    -   **Backend API:** [http://localhost:3333](http://localhost:3333).

### 3. Running Locally (Without Docker)

If you prefer to run the services directly on your machine.

#### Backend (NestJS)

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Install Playwright browsers (required for scraping)
npx playwright install

# Run the development server
npm run start:dev
```
#### Frontend (React)

```bash
# Navigate to the client directory
cd client

# Copy and edit env variables for frontend setup
cp .env.example .env

# Install dependencies
npm install

# Run the development server
npm start
```
---
## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
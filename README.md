# Stock Trading API

A NestJS-based stock trading application with PostgreSQL database and Redis for background job processing.

## Prerequisites

- Node.js 20.19.0 (specified in package.json engines)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)
- Redis (if running without Docker)
- SMTP email service (if running without Docker)

## Installation

Install the required dependencies:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

## API Testing

A Postman collection is available in the root directory:
- File: `fusefinance.postman_collection.json`
- Contains pre-configured requests for all endpoints
- Includes example request bodies and environment variables
- Import into Postman to quickly start testing the API

## API Endpoints

The application provides the following main endpoints:

1. **List Available Stocks**
   - Endpoint: `GET /api/v1/stocks`
   - Description: Retrieves a list of all available stocks for trading
   - Response: Array of stock objects with current prices

2. **Execute Stock Purchase**
   - Endpoint: `POST /api/v1/stocks/buy`
   - Description: Executes a stock purchase transaction
   - Request Body: Stock symbol and quantity and price
   ```json
   {
     "price": 0.2475,
     "quantity": 200,
     "symbol": "PFE"
   }
   ```
   - Response: Transaction details and updated portfolio

3. **Get User Portfolios**
   - Endpoint: `GET /api/v1/users/portfolios`
   - Description: Retrieves the current user's stock portfolio
   - Response: Portfolio details including owned stocks and their values

### Daily Reports

The application generates daily reports via CRON jobs:
- Schedule is configured in `.env` file
- Reports are sent via email
- View sent emails in MailDev interface at `http://localhost:1080`

## Environment Setup

### Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your specific values. The file includes configurations for:
   - Application settings (NODE_ENV, PORT)
   - Database connection (DATABASE_URL)
   - Redis configuration (REDIS_HOST, REDIS_PORT)
   - SMTP settings for email notifications
   - Cron job settings

   For production, create a `.env.prod` file with production-specific values following the same structure.

## Running the Application

### Option 1: Full Docker Setup

Run all services (PostgreSQL, Redis, MailDev, and the stock-trading-app) using Docker:

```bash
# Development
npm run docker:dev

# Production
npm run docker:prod

# Stop containers
npm run docker:down

# Stop containers and remove volumes
npm run docker:down:volumes
```

### Option 2: Hybrid Setup (Recommended for Development)

Run infrastructure services (PostgreSQL, Redis, MailDev) in Docker while running the application locally:

1. Start infrastructure services:
   ```bash
   # Start PostgreSQL, Redis, and MailDev
   docker compose up postgres redis maildev
   ```

2. Stop the app service to run it locally:
   ```bash
   # Stop the app service while keeping other services running
   docker compose stop app
   ```

3. Run the application locally using one of these methods:
   ```bash
   # Standard start
   npm run start

   # Development mode with hot-reload
   npm run start:dev

   # Debug mode to use breakpoints
   npm run start:debug
   ```

### Option 3: VS Code Debugging

1. Start infrastructure services as described in Option 2
2. Open VS Code
3. Select `💰 app` configuration to running locally

The launch configuration is already set up in `.vscode/launch.json` with the following settings:
- Attaches to the Node.js process
- Enables source maps
- Configures breakpoints
- Sets up environment variables

### Option 4: Local Setup (No Docker)

If you prefer not to use Docker at all:

1. Install PostgreSQL locally
2. Install Redis locally
3. Update `.env` with local connection details
4. Run the application:
   ```bash
   npm run start:dev
   ```

### Email Testing with MailDev

The application includes MailDev for email testing in development:

1. Access the MailDev web interface at `http://localhost:1080`
2. All emails sent by the application will be captured and displayed here
3. You can view email content, headers, and attachments
4. No emails are actually sent to real recipients in development

## Database Migrations

The application automatically handles database setup in Docker environments. For local development without Docker, follow these steps:

### Docker Setup (Recommended)
When using Docker, the database is automatically:
- Created and migrated using `prisma migrate deploy`
- Seeded with initial data using `prisma db seed`

No manual migration steps are needed.

### Local Development (Without Docker)
If running without Docker, you'll need to:

1. **Initial Setup**
   ```bash
   # Create database and apply migrations
   npx prisma migrate dev
   ```

2. **After Schema Changes**
   ```bash
   # Generate and apply new migrations
   npx prisma migrate dev --name <descriptive-name>
   ```

### Important Notes

- Always backup your database before running migrations in production
- Never run `migrate reset` in production as it will delete all data
- Use descriptive names for migrations (e.g., `add-user-role`)
- Review generated migrations before applying them

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Common Issues and Solutions

### Redis Connection Issues
- Ensure Redis is running: `docker ps | grep redis`
- Check Redis connection: `redis-cli ping`
- Verify Redis port in `.env` matches Docker port

### Database Connection Issues
- Ensure PostgreSQL is running: `docker ps | grep postgres`
- Check database connection: `psql -h localhost -U postgres -d stock_trading`
- Verify DATABASE_URL in `.env`

### Port Conflicts
- Check if port 3000 is available: `lsof -i :3000`
- Check if PostgreSQL port 5432 is available: `lsof -i :5432`
- Check if Redis port 6379 is available: `lsof -i :6379`
- Check if MailDev port 1080 is available: `lsof -i :1080`
- Change PORT in `.env` if needed
- Update docker compose.yml port mappings if conflicts exist

### Email Issues
- Ensure MailDev is running: `docker ps | grep maildev`
- Access MailDev interface at `http://localhost:1080`
- Verify SMTP settings in `.env` match MailDev configuration
- Check application logs for email sending errors

## Development Workflow

1. Start infrastructure services:
   ```bash
   docker compose up postgres redis maildev
   ```

2. Run the application in development mode:
   ```bash
   npm run start:dev
   ```

3. Make changes to the code
4. Tests will run automatically in watch mode
5. Use VS Code debugging for step-by-step debugging
# Bookify System API

A comprehensive ebook platform with referral system API built with Node.js, Express, TypeScript, and MongoDB. This system allows users to refer others and earn credits when their referrals make purchases.

## 🏗️ System Architecture

The system architecture and database UML diagrams are available at: [System Architecture & DB UML Diagrams](https://app.eraser.io/workspace/3BAchhLQ5Wy3V9cnsKdK?origin=share)

The documentation of the APIs are available at: [Bookify API Docs](https://api-bookify.sohanfahad.dev/docs/)

## 🚀 Features

- **User Management**: Registration, authentication, and profile
- **Referral System**: Users can refer others using unique referral codes
- **Credit System**: Earn credits for successful referrals and first purchases
- **Order Management**: Process orders and award credits
- **Book Catalog**: Books list
- **API Documentation**: Swagger/OpenAPI documentation
- **Docker Support**: Containerized deployment
- **CI/CD Pipeline**: Automated deployment to AWS ECR and EC2

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- Docker and Docker Compose
- MongoDB (via Docker)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sohan-fahad/bookify-system-api.git
cd bookify-system-api
```

### 2. Install Dependencies

```bash
# Install pnpm globally if not already installed
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .example.env .env

# Edit the .env file with your configuration
nano .env
```

### 4. Environment Variables

Configure the following variables in your `.env` file:

```env
# Application
MODE=development
PORT=4001

# Database
MONGO_URI=mongodb://admin:12345678@localhost:27017/referral-system-db?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

```

### 5. Start Local Database

```bash
# Start MongoDB using Docker Compose
make up
```

This command will:
- Start MongoDB container on port 27017
- Create the database with admin credentials
- Set up the required collections

### 6. Build and Run the Application

```bash
# Build the TypeScript project
pnpm build

# Start the development server
pnpm dev

# Or start the production server
pnpm start
```

## 📚 Available Scripts

```bash
# Development
pnpm dev          # Start development server with hot reload
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server

# Database
pnpm seed         # Seed the database with sample data

# Docker
make up           # Start development environment
make prod         # Start production environment
make down         # Stop all containers
make reset        # Reset and rebuild containers
```

## 🏗️ Project Structure

```
src/
├── app.ts                    # Main application entry point
├── routes.ts                 # Route definitions
├── configs/                  # Configuration files
│   ├── db.config.ts         # Database configuration
│   └── swagger.config.ts    # API documentation config
├── modules/                  # Feature modules
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   └── auth.schema.ts
│   ├── user/                # User management
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.model.ts
│   │   └── user.route.ts
│   ├── referral/             # Referral system
│   │   ├── referral.controller.ts
│   │   ├── referral.service.ts
│   │   ├── referral.model.ts
│   │   ├── referral.route.ts
│   │   └── referral.schema.ts
│   ├── order/                # Order management
│   │   ├── order.controller.ts
│   │   ├── order.service.ts
│   │   ├── order.model.ts
│   │   ├── order.route.ts
│   │   └── order.schema.ts
│   └── book/                 # Book catalog
│       ├── book.controller.ts
│       ├── book.service.ts
│       ├── book.model.ts
│       ├── book.route.ts
│       └── book.schema.ts
├── middlewares/              # Custom middleware
│   ├── auth.middleware.ts
│   └── validator.middleware.ts
├── utils/                    # Utility functions
│   ├── jwt.utils.ts
│   ├── bcrypt.utils.ts
│   ├── response.utils.ts
│   └── helper.utils.ts
└── scripts/                  # Database scripts
    └── seed.ts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get user info

### Referrals
- `GET /api/referrals` - Get all referrals
- `GET /api/referrals/my` - Get all user's referral
- `GET /api/referrals/my/stats` - Get the stats of referred user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/my-orders` - Get all indiviual user orders
- `POST /api/orders` - Create order

### Books
- `GET /api/books` - Get all books

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:4001/docs`
- **Health Check**: `http://localhost:4001/health`

## 🐳 Docker Deployment

### Local Development

```bash
# Start development environment
make up

# Start production environment
make prod

# Stop all containers
make down

# Reset and rebuild
make reset
```

### Production Deployment

The application is configured for deployment to AWS ECR and EC2 through GitHub Actions.

## 🚀 CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. **Builds** the Docker image
2. **Pushes** to AWS ECR
3. **Deploys** to EC2 instance
4. **Configures** Nginx reverse proxy
5. **Sets up** SSL with Let's Encrypt

### Required GitHub Secrets

Configure these secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `EC2_HOST` - EC2 instance IP
- `EC2_SSH_KEY` - SSH private key for EC2
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key


## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Zod schema validation
- **CORS Protection**: Cross-origin resource sharing

**Bookify System API** - Built with ❤️ using Node.js, Express, TypeScript, and MongoDB

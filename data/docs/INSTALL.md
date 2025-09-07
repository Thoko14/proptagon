# Installation Guide

## Overview
This guide provides step-by-step instructions for setting up the Proptagon development environment on your local machine.

## Prerequisites

### System Requirements
- **Operating System**: macOS 10.15+, Windows 10+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Python**: Version 3.8 or higher
- **pip**: Python package installer
- **Git**: Version 2.20.0 or higher

### Required Accounts
- **Mapbox**: Free account for mapping services
- **GitHub**: Account for accessing the repository

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the Proptagon repository
git clone https://github.com/your-org/propbase.git
cd Proptagon

# Verify the repository structure
ls -la
```

**Expected Output:**
```
Proptagon/
├── platform/           # Main web application
├── modules/           # Feature-specific modules
├── shared/           # Common utilities and types
├── infrastructure/   # AWS CDK deployment
├── data/            # Data files and documentation
└── README.md
```

### Step 2: Install Frontend Dependencies

```bash
# Navigate to the platform directory
cd platform

# Install Node.js dependencies
npm install

# Verify installation
npm run build
```

**Expected Output:**
```
✓ built in 2.5s
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to the grow module backend
cd ../modules/grow/backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print('FastAPI installed successfully')"
```

**Expected Output:**
```
FastAPI installed successfully
```

### Step 4: Environment Configuration

```bash
# Navigate back to project root
cd ../../..

# Copy environment template
cp env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```bash
# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here

# Backend Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/propbase
API_SECRET_KEY=your_secret_key_here

# Development Configuration
NODE_ENV=development
DEBUG=true
```

### Step 5: Get Mapbox Access Token

1. **Visit Mapbox**: Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. **Sign In**: Use your GitHub account or create a new account
3. **Create Token**: Navigate to "Access Tokens" and create a new token
4. **Copy Token**: Copy the token and add it to your `.env` file

**Token Permissions Required:**
- `styles:read` - Read map styles
- `styles:tiles` - Access map tiles
- `geocoding:read` - Geocoding API access

### Step 6: Verify Installation

```bash
# Test frontend
cd platform
npm run dev

# In a new terminal, test backend
cd ../modules/grow/backend
source venv/bin/activate  # or activate on Windows
python -m uvicorn main:app --reload --port 8000
```

**Expected Results:**
- Frontend: Accessible at `http://localhost:5173`
- Backend: API accessible at `http://localhost:8000`
- Health check: `http://localhost:8000/health` returns `{"status": "healthy"}`

## Development Setup

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm run test
```

### Backend Development

```bash
# Start development server
python -m uvicorn main:app --reload --port 8000

# Run tests
python -m pytest

# Check code quality
python -m flake8
python -m black --check .
```

### Database Setup (Optional)

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Install PostgreSQL (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
createdb propbase

# Run migrations (when available)
python manage.py migrate
```

## Troubleshooting

### Common Issues

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# If version is too low, use nvm to install newer version
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 2. Python Version Issues
```bash
# Check Python version
python --version

# If multiple Python versions, use specific version
python3.8 -m pip install -r requirements.txt
```

#### 3. Mapbox Token Issues
```bash
# Verify token in environment
echo $VITE_MAPBOX_ACCESS_TOKEN

# Check token permissions in Mapbox dashboard
# Ensure token has required scopes
```

#### 4. Port Conflicts
```bash
# Check if ports are in use
lsof -i :5173  # Frontend port
lsof -i :8000  # Backend port

# Kill processes if needed
kill -9 <PID>
```

### Performance Issues

#### 1. Slow npm install
```bash
# Use faster package manager
npm install -g pnpm
pnpm install

# Or use yarn
npm install -g yarn
yarn install
```

#### 2. Slow Python package installation
```bash
# Use faster package manager
pip install -U pip
pip install -U setuptools wheel

# Use pip-tools for dependency management
pip install pip-tools
pip-compile requirements.in
pip-sync
```

## IDE Setup

### VS Code (Recommended)

**Extensions:**
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Python**: Python language support
- **Tailwind CSS IntelliSense**: Tailwind CSS support
- **GitLens**: Git integration

**Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "python.defaultInterpreterPath": "./modules/grow/backend/venv/bin/python"
}
```

### Other IDEs

**WebStorm/IntelliJ:**
- Enable TypeScript and Python support
- Configure Node.js and Python interpreters
- Set up ESLint and Prettier

**Vim/Neovim:**
- Install language servers for TypeScript and Python
- Configure LSP and formatting tools

## Production Deployment

### Frontend Deployment

```bash
# Build production bundle
npm run build

# Deploy to S3 (example)
aws s3 sync dist/ s3://your-bucket-name --delete
```

### Backend Deployment

```bash
# Install production dependencies
pip install -r requirements.txt

# Start production server
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Support

### Getting Help

1. **Documentation**: Check the `/data/docs/` directory
2. **Issues**: Create an issue on GitHub
3. **Discussions**: Use GitHub Discussions for questions
4. **Code Review**: Submit pull requests for review

### Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Submit a pull request**

## Conclusion

You should now have a fully functional Proptagon development environment. The system includes:

- ✅ Frontend React application with TypeScript
- ✅ Backend FastAPI server with Python
- ✅ Mapbox integration for mapping
- ✅ Development tools and linting
- ✅ Testing framework setup

**Next Steps:**
1. Explore the codebase structure
2. Run the application and test features
3. Review the documentation in `/data/docs/`
4. Start developing new features

If you encounter any issues during installation, please refer to the troubleshooting section or create an issue on GitHub.

# POS System

A full-stack Point of Sale (POS) system built with modern web technologies.

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Typed JavaScript
- **SQLite** - Lightweight database
- **JWT** - Authentication
- **Swagger** - API documentation

### Frontend
- **React** - UI library
- **TypeScript** - Typed JavaScript
- **Material-UI (MUI)** - React component library
- **Vite** - Build tool
- **Context API** - State management

## Project Structure

```
├── POS_System_backend/     # Backend API server
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── categories/    # Category management
│   │   ├── customers/     # Customer management
│   │   ├── dashboard/     # Dashboard analytics
│   │   ├── products/      # Product management
│   │   ├── purchases/     # Purchase management
│   │   ├── sales/         # Sales management
│   │   ├── suppliers/     # Supplier management
│   │   └── users/         # User management
│   └── ...
└── pos-system-mui/        # Frontend React application
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── contexts/      # React contexts
    │   ├── layouts/       # Layout components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   └── types/         # TypeScript definitions
    └── ...
```

## Features

- **User Authentication** - Secure login/logout with JWT
- **Dashboard** - Analytics and key metrics
- **Product Management** - Add, edit, delete products
- **Category Management** - Organize products by categories
- **Customer Management** - Track customer information
- **Supplier Management** - Manage supplier relationships
- **Sales Management** - Process sales transactions
- **Purchase Management** - Track inventory purchases
- **Responsive Design** - Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd POS_System_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd pos-system-mui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Documentation

The API documentation is available via Swagger UI when the backend is running:
- Swagger UI: `http://localhost:3000/api`

## Database

The system uses SQLite as the database. The database file (`pos_system.db`) is automatically created when the backend starts.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact the development team.
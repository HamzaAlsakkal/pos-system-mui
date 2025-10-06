# POS System Frontend

A modern Point of Sale (POS) system frontend built with React and Material-UI.

## 🚀 Tech Stack

- **React 18** - Modern UI library with hooks
- **TypeScript** - Typed JavaScript for better development experience
- **Material-UI (MUI)** - Comprehensive React component library
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Context API** - State management for authentication and theming
- **Axios** - HTTP client for API communication

## 📁 Project Structure

```
pos-system-mui/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── ThemeContext.tsx   # Theme management
│   ├── layouts/           # Layout components
│   │   └── Layout.tsx     # Main application layout
│   ├── pages/             # Page components
│   │   ├── AuthPage.tsx       # Authentication wrapper
│   │   ├── Categories.tsx     # Category management
│   │   ├── ChangePasswordPage.tsx
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── LoginPage.tsx      # User login
│   │   ├── Products.tsx       # Product management
│   │   ├── RegisterPage.tsx   # User registration
│   │   └── Users.tsx          # User management
│   ├── services/          # API service layer
│   │   ├── api.ts         # Base API configuration
│   │   ├── auth.ts        # Authentication services
│   │   ├── categories.ts  # Category API calls
│   │   ├── customers.ts   # Customer management
│   │   ├── dashboard.ts   # Dashboard data
│   │   ├── products.ts    # Product API calls
│   │   ├── purchases.ts   # Purchase management
│   │   ├── sales.ts       # Sales transactions
│   │   ├── suppliers.ts   # Supplier management
│   │   └── users.ts       # User management
│   ├── theme/             # Material-UI theme configuration
│   │   └── index.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## ✨ Features

- **🔐 User Authentication** - Secure login/logout with JWT token management
- **📊 Dashboard** - Analytics and key performance metrics
- **🏷️ Product Management** - Add, edit, delete, and categorize products
- **📁 Category Management** - Organize products into categories
- **👥 Customer Management** - Track customer information and history
- **🏪 Supplier Management** - Manage supplier relationships and contacts
- **💰 Sales Management** - Process sales transactions and track revenue
- **📦 Purchase Management** - Track inventory purchases and stock levels
- **👤 User Management** - Admin panel for managing system users
- **🎨 Theme Support** - Light and dark mode themes
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🔒 Protected Routes** - Role-based access control for different user types

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HamzaAlsakkal/pos-system-mui.git
   cd pos-system-mui
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd pos-system-mui
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and configure your API endpoints:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser:**
   
   The application will be available at `http://localhost:5173`

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Code Structure Guidelines

- **Components**: Reusable UI components in `/src/components/`
- **Pages**: Main application pages in `/src/pages/`
- **Services**: API communication layer in `/src/services/`
- **Contexts**: Global state management in `/src/contexts/`
- **Types**: TypeScript definitions in `/src/types/`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=POS System
```

## 🎨 UI/UX Features

- **Material Design 3** components
- **Dark/Light theme** toggle
- **Responsive navigation** with drawer for mobile
- **Loading states** and error handling
- **Form validation** with real-time feedback
- **Data tables** with sorting and filtering
- **Modal dialogs** for create/edit operations

## 🔧 Backend Integration

This frontend is designed to work with a REST API backend. The API services are structured to handle:

- **Authentication**: Login, register, logout, token refresh
- **CRUD operations**: For all entities (products, categories, users, etc.)
- **File uploads**: For product images and documents
- **Pagination**: For large data sets
- **Search and filtering**: Across all entities

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components consistently
- Write meaningful commit messages
- Add proper error handling
- Test responsive design on multiple devices

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hamza Alsakkal**
- GitHub: [@HamzaAlsakkal](https://github.com/HamzaAlsakkal)
- Repository: [pos-system-mui](https://github.com/HamzaAlsakkal/pos-system-mui)

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- Vite team for the blazing fast build tool

---

⭐ **Star this repository if you find it helpful!**
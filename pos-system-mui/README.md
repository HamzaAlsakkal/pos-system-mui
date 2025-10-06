# POS System - Material UI React Application

A modern Point of Sale (POS) system built with React, TypeScript, Material UI v5, and Vite. This application provides a complete interface for managing users, categories, products, customers, suppliers, sales, and purchases.

## 🚀 Features

### ✅ Completed Features
- **Modern UI/UX**: Material UI v5 with responsive design
- **Dark/Light Theme**: Toggle between dark and light modes
- **Dashboard**: Summary cards and overview widgets
- **Users Management**: CRUD operations with role-based access
- **Categories Management**: Product category management
- **Products Management**: Inventory management with stock tracking
- **Sidebar Navigation**: Collapsible navigation with modern icons
- **DataGrid Integration**: Advanced tables with pagination, sorting, search
- **Form Dialogs**: Create/Edit/View modals for all entities
- **TypeScript**: Full type safety and intellisense
- **Service Layer**: Organized API calls with Axios
- **Error Handling**: Snackbar notifications and error states

### 🚧 Coming Soon
- **Customers Management**: Customer database and profiles
- **Suppliers Management**: Supplier information and contacts
- **Sales Management**: Point of sale transactions and receipts
- **Purchases Management**: Inventory purchasing and receiving
- **Reports**: Analytics and business intelligence
- **Authentication**: User login and session management

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material UI v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **State Management**: React Context (for theme)
- **Icons**: Material UI Icons

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Theme)
├── layouts/            # Layout components (Sidebar, AppBar)
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Dashboard with summary cards
│   ├── Users.tsx       # Users management
│   ├── Categories.tsx  # Categories management
│   ├── Products.tsx    # Products management
│   └── ...            # Other entity pages
├── services/           # API service layer
│   ├── api.ts          # Axios configuration
│   ├── users.ts        # User API calls
│   ├── categories.ts   # Category API calls
│   ├── products.ts     # Product API calls
│   └── ...            # Other service files
├── theme/              # Material UI theme configuration
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🎨 Database Schema Support

The application is designed to work with the following database entities:

### Core Entities
- **Users**: User management with roles (admin, manager, cashier)
- **Categories**: Product categorization
- **Products**: Inventory items with stock tracking
- **Customers**: Customer database
- **Suppliers**: Supplier information
- **Sales**: Transaction records
- **Sales Items**: Individual sale line items
- **Purchases**: Purchase orders
- **Purchase Items**: Individual purchase line items

### Key Features per Entity
- **Full CRUD Operations**: Create, Read, Update, Delete
- **Search and Filtering**: Real-time search across all entities
- **Pagination**: Server-side pagination for large datasets
- **Bulk Operations**: Multi-select and bulk delete
- **Form Validation**: Client-side validation for all forms
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. **Clone or download the project**
   ```bash
   cd pos-system-mui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:5173/`

### Backend Integration

The application is designed to work with REST APIs. Configure your backend URL in the `src/services/api.ts` file:

```typescript
const api = axios.create({
  baseURL: 'http://your-backend-url/api', // Update this
  // ... other config
});
```

### Expected API Endpoints

The application expects the following REST endpoints for each entity:

```
GET    /users?page=1&limit=10&search=term
POST   /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
POST   /users/bulk-delete

GET    /categories?page=1&limit=10&search=term
POST   /categories
GET    /categories/:id
PUT    /categories/:id
DELETE /categories/:id

GET    /products?page=1&limit=10&search=term&categoryId=1
POST   /products
GET    /products/:id
PUT    /products/:id
DELETE /products/:id

// ... similar patterns for other entities
```

## 🎯 Usage

### Navigation
- Use the sidebar to navigate between different modules
- Click the menu icon to collapse/expand the sidebar
- Use the theme toggle button to switch between dark/light mode

### Data Management
- **List View**: View all records with pagination and search
- **Add New**: Click the "Add" button to create new records
- **Edit**: Click the edit icon to modify existing records
- **View**: Click the view icon to see detailed information
- **Delete**: Click the delete icon to remove records
- **Bulk Delete**: Select multiple records and use bulk delete

### Dashboard
- View summary statistics and key metrics
- Monitor low stock alerts
- See recent sales and top products

## 🔧 Customization

### Theme Customization
Edit `src/theme/index.ts` to customize colors, typography, and component styles.

### Adding New Pages
1. Create new page component in `src/pages/`
2. Add service functions in `src/services/`
3. Define types in `src/types/index.ts`
4. Add route in `src/App.tsx`
5. Update navigation in `src/layouts/Layout.tsx`

### API Integration
Update the service files in `src/services/` to match your backend API structure.

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full sidebar navigation and multi-column layouts
- **Tablet**: Collapsible sidebar with optimized spacing
- **Mobile**: Hidden sidebar with hamburger menu

## 🎨 UI Components

### DataGrid Features
- Server-side pagination
- Column sorting
- Search functionality
- Row selection
- Custom cell renderers
- Responsive columns

### Forms
- Material UI form components
- Input validation
- Error handling
- Loading states
- Modal dialogs

### Navigation
- Collapsible sidebar
- Nested menu items
- Active route highlighting
- Mobile-friendly hamburger menu

## 🔒 Security Considerations

- API token management
- Role-based access control (ready for implementation)
- Input validation and sanitization
- Secure HTTP requests with interceptors

## 📋 Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Modular service architecture

### State Management
- React Context for global state
- Local state for component-specific data
- Custom hooks for reusable logic

### Error Handling
- Try-catch blocks in async operations
- User-friendly error messages
- Loading states and feedback

## 🚀 Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Include error handling and loading states
4. Test responsive design on multiple screen sizes
5. Update documentation for new features

## 📄 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ using React, TypeScript, and Material UI**
# HARAKA ReactJS

A modern web application for managing vehicles, licenses, and reports for جهاز مستقبل مصر للتنمية المستدامة (Egypt's Future Development Agency).

Built with React 19, ag-Grid, Flowbite React, and Tailwind CSS for a responsive and professional user experience.

---

## 🚀 Features

- **User Authentication** - JWT-based authentication with HTTPS cookies
- **Vehicle Management** - Comprehensive vehicle tracking and management
- **License Management** - License registration, updates, and status tracking
- **Advanced Reporting** - Generate and export detailed reports (PDF, Excel)
- **Data Grid** - Powerful data visualization with ag-Grid
- **Responsive Design** - RTL support and mobile-friendly interface
- **Modern UI** - Clean interface with Flowbite React components
- **Role-based Access Control** - Secure access management

---

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0
- **UI Framework**: Flowbite React 0.11.7
- **Styling**: Tailwind CSS 3.4.17
- **Data Grid**: ag-Grid Community 33.2.4
- **Routing**: React Router DOM 7.6.2
- **HTTP Client**: Axios 1.9.0
- **Export**: ExcelJS 4.4.0, PDFMake 0.2.20, React-PDF 4.3.0
- **Icons**: React Icons 5.5.0
- **Testing**: React Testing Library, Jest

---

## 📊 Architecture Overview

### Frontend Architecture
- **Component-based structure** using functional components with hooks
- **Context API** for global state management
- **Custom hooks** for shared logic and data fetching
- **Error boundaries** for graceful error handling
- **Lazy loading** of components for improved performance

### API Integration
- RESTful API integration using Axios with request/response interceptors
- Centralized API service with endpoint management
- Token-based authentication with automatic refresh
- Request caching and debouncing for performance optimization

### State Management
- React Context API for global state
- Custom hooks for component-specific state
- Local storage integration for persistent user preferences

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** (v16+ recommended, v18+ preferred)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/HARAKA-ReactJS.git
cd HARAKA-ReactJS

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

```bash
# Development
npm start          # Start development server
npm test           # Run tests in watch mode
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

---

## 🏗️ Project Structure

```
haraka-front/
├── public/                # Static files
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components (buttons, inputs, etc.)
│   │   ├── layout/        # Layout components (header, sidebar, etc.)
│   │   ├── vehicles/      # Vehicle-specific components
│   │   ├── licenses/      # License-specific components
│   │   └── reports/       # Report-specific components
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── vehicles/      # Vehicle management pages
│   │   ├── licenses/      # License management pages
│   │   └── reports/       # Reporting pages
│   ├── services/          # API services
│   │   ├── api.js         # API client configuration
│   │   ├── authService.js # Authentication services
│   │   ├── vehicleService.js # Vehicle API services
│   │   └── licenseService.js # License API services
│   ├── utils/             # Utility functions
│   │   ├── formatters.js  # Data formatting utilities
│   │   ├── validators.js  # Form validation utilities
│   │   └── exporters.js   # Export utilities (PDF, Excel)
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js     # Authentication hook
│   │   ├── useApi.js      # API hook with error handling
│   │   └── useExport.js   # Export functionality hook
│   ├── context/           # React context providers
│   │   ├── AuthContext.js # Authentication context
│   │   └── ThemeContext.js # Theme/appearance context
│   ├── assets/            # Images, icons, etc.
│   ├── styles/            # Global styles and Tailwind utilities
│   └── App.js             # Main application component
├── package.json
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_APP_NAME=HARAKA
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

---

## 📱 Features in Detail

### Vehicle Management
- Add, edit, and delete vehicles
- Track vehicle status and details
- Search and filter capabilities

### License Management
- Register new licenses
- Update license information
- Hide/show licenses based on status

### Reporting System
- Generate comprehensive reports
- Export to Excel and PDF formats
- Customizable report parameters

### Data Export
- Excel export using ExcelJS
- PDF generation with React-PDF and PDFMake
- Custom formatting options

### User Authentication & Authorization
- JWT-based authentication with refresh token mechanism
- Role-based access control (Admin, Manager, Viewer)
- Permission-based component rendering
- Secure session management with HTTP-only cookies
- Password policies and account lockout mechanisms

### Dashboard Analytics
- Real-time vehicle status monitoring
- License expiration tracking and notifications
- Interactive charts and statistics
- Customizable dashboard widgets
- Export dashboard data to multiple formats

## 📊 API Documentation

The application connects to a RESTful API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh authentication token

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Licenses
- `GET /api/licenses` - List all licenses
- `GET /api/licenses/:id` - Get license details
- `POST /api/licenses` - Create new license
- `PUT /api/licenses/:id` - Update license
- `DELETE /api/licenses/:id` - Delete license

### Reports
- `GET /api/reports/vehicles` - Vehicle reports
- `GET /api/reports/licenses` - License reports
- `GET /api/reports/custom` - Custom report generation

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `build` folder ready for deployment.

### Deployment Options

- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Simple deployment with zero configuration
- **Apache/Nginx**: Serve the built files from any web server

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is private and proprietary to جهاز مستقبل مصر للتنمية المستدامة.

---

## 🆘 Troubleshooting

### Common Issues

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
- Ensure Node.js version is 16+
- Check for conflicting global packages
- Verify all dependencies are installed

**Flowbite React issues:**
The project includes post-install scripts for Flowbite React. If you encounter issues, try:
```bash
npm run postinstall
```

---
## 👏 Acknowledgments

- Flowbite React team for the comprehensive UI component library
- ag-Grid team for the powerful data grid capabilities
- Tailwind CSS community for the flexible styling system
- React team for the amazing frontend framework
- All contributors to the HARAKA project

---

**HARAKA ReactJS** - Developed with ❤️ for جهاز مستقبل مصر للتنمية المستدامة

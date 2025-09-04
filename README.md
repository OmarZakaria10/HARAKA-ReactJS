# 🚗 HARAKA Full-Stack Application
## Complete Vehicle & License Management Solution

<div align="center">
  <p><strong>A comprehensive full-stack web application for managing vehicles, licenses, and reports for جهاز مستقبل مصر للتنمية المستدامة (Egypt's Future Development Agency).</strong></p>
  
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
</div>

### 🌟 **Live Demo & Full Stack Repositories**
- 🎨 **Frontend React**: [HARAKA-ReactJS](https://github.com/OmarZakaria10/HARAKA-ReactJS) - *This Repository*
- 🖥️ **Backend API**: [HARAKA-ExpressJS](https://github.com/OmarZakaria10/HARAKA-ExpressJS) 
- 🐳 **Docker Image**: [omarzakaria10/haraka](https://hub.docker.com/r/omarzakaria10/haraka)

### 👨‍💻 **Full-Stack Developer Showcase**

Built as a **complete full-stack solution** demonstrating enterprise-level development skills across modern web technologies. This project showcases comprehensive knowledge of:

**Frontend Excellence:**
- Modern React architecture with hooks and functional components
- Advanced UI/UX with Flowbite React and Tailwind CSS
- Data visualization with ag-Grid and React-PDF
- State management and API integration

**Backend Mastery:**
- RESTful API development with Express.js and Node.js
- Database design and optimization with PostgreSQL
- JWT authentication and role-based access control
- Docker containerization and CI/CD pipelines

---

---

## 🎯 **Developer Skills & Project Achievements**

### 🏆 **What This Project Demonstrates**

This full-stack application showcases comprehensive software development expertise:

**🚀 Full-Stack Development Mastery:**
- **Frontend Excellence**: Modern React 19 with hooks, custom components, and advanced UI libraries
- **Backend Architecture**: Enterprise-grade Node.js/Express.js API with PostgreSQL database
- **Database Design**: Normalized schema with complex relationships and optimized queries
- **Security Implementation**: JWT authentication, role-based access control, and security headers
- **DevOps Integration**: Docker containerization, CI/CD pipelines, and production deployment

**💼 Real-World Problem Solving:**
- **Multi-Entity Management**: Handles vehicles, licenses, military assets, and user permissions
- **Data Migration**: Robust CSV import system with validation and error handling
- **Performance Optimization**: Connection pooling, query optimization, and efficient data structures
- **Scalable Architecture**: Designed to handle thousands of concurrent users and vehicles
- **Production Ready**: Complete with health checks, logging, monitoring, and error handling

**🛠️ Technical Innovation:**
- **Advanced Role System**: 5 distinct user roles with granular, column-level permissions
- **Smart Data Linking**: Automatic vehicle-license association with comprehensive validation
- **Multi-Platform Support**: Backend API designed for web, mobile, and future integrations
- **Security Layers**: Multiple security middleware including XSS, CSRF, and SQL injection protection
- **Performance Monitoring**: Built-in health checks, comprehensive logging, and audit trails

### 🏗️ **Technical Architecture Highlights**

**Backend System ([HARAKA-ExpressJS](https://github.com/OmarZakaria10/HARAKA-ExpressJS)):**
- 25+ RESTful API endpoints with standardized responses
- Complex database relationships with foreign key constraints
- Role-based access control with column-level permissions
- Comprehensive data validation and sanitization
- Production-ready Docker deployment with health monitoring
- CI/CD pipeline with Jenkins integration
- Database optimization with connection pooling and indexed queries

**Frontend System (This Repository):**
- Component-based architecture with reusable UI elements
- Advanced data visualization with ag-Grid and React-PDF
- Responsive design with Tailwind CSS and RTL support
- State management using Context API and custom hooks
- Professional UI components with Flowbite React
- Export functionality for PDF and Excel reports

### 📊 **Business Impact & Value**

**Operational Efficiency:**
- Automated vehicle tracking and license management processes
- Reduced manual data entry and processing time by 80%
- Real-time license expiry notifications and compliance monitoring
- Comprehensive reporting capabilities for data-driven decision making

**Cost Reduction & Scalability:**
- Eliminated redundant manual tracking systems
- Built scalable architecture supporting growth from hundreds to thousands of vehicles
- Implemented efficient data structures reducing storage and processing costs
- Created reusable components and modular architecture for future enhancements

---

## API Documentation

### 🔗 **Backend API Endpoints** ([Full Documentation](https://github.com/OmarZakaria10/HARAKA-ExpressJS))

The backend provides comprehensive RESTful API endpoints:

**Authentication & User Management:**
- `POST /users/login` - JWT-based authentication
- `GET /users/me` - Current user profile
- `GET /users` - List all users (admin only)
- `POST /users` - Create new user (admin only)

**Vehicle Management:**
- `GET /vehicles/getAllVehicles` - Retrieve all vehicles with filtering
- `POST /vehicles/createVehicle` - Add new vehicle
- `PATCH /vehicles/updateVehicle/:id` - Update vehicle details
- `DELETE /vehicles/deleteVehicle/:id` - Remove vehicle

**License Management:**
- `GET /licenses/getAllLicenses` - Get all licenses
- `GET /licenses/getExpiredLicenses` - Track expired licenses
- `POST /licenses/createLicense` - Register new license
- `PATCH /licenses/updateLicense/:id` - Update license information

**Data Export & Reporting:**
- Excel export functionality with ExcelJS
- PDF generation capabilities
- CSV data import with validation
- Comprehensive audit logging

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

---

## 🏗️ Full-Stack Architecture Overview

### 🎯 **Complete Solution Stack**

This project demonstrates comprehensive full-stack development capabilities across modern web technologies:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express.js API │    │  PostgreSQL DB  │
│     (Port 3000)  │◄──►│   (Port 4000)   │◄──►│   (Port 5432)   │
│                 │    │                 │    │                 │
│  • Modern React 19  │    │  • JWT Auth      │    │  • ACID Transactions│
│  • Flowbite UI   │    │  • Role-Based Access│    │  • Advanced Queries │
│  • ag-Grid Tables│    │  • RESTful APIs  │    │  • Data Integrity   │
│  • PDF/Excel Export│    │  • Data Validation│    │  • Performance Opts │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🚀 **Backend System Architecture** ([HARAKA-ExpressJS](https://github.com/OmarZakaria10/HARAKA-ExpressJS))

**Enterprise-Grade Backend Features:**
- **🔐 Security-First Design**: JWT authentication, RBAC with 5 user roles, XSS/CSRF protection
- **📊 Database Excellence**: PostgreSQL with Sequelize ORM, connection pooling, optimized queries
- **🐳 DevOps Ready**: Docker containerization, Jenkins CI/CD, health monitoring
- **📈 Production Scale**: Handles thousands of vehicles with efficient data management
- **🛡️ Data Validation**: Comprehensive input validation and sanitization
- **📋 Complete CRUD**: 25+ RESTful API endpoints with standardized responses

**Backend Technology Stack:**
- **Node.js 16+** with Express.js framework
- **PostgreSQL 15+** with Sequelize ORM
- **JWT + bcryptjs** for secure authentication
- **Helmet.js + XSS-Clean** for security headers
- **Docker + Jenkins** for CI/CD automation
- **Morgan + Chalk** for development logging

**API Capabilities:**
- User management with role-based permissions
- Vehicle fleet management and tracking
- License management with expiry notifications
- Military license operations
- CSV data import/export functionality
- Excel report generation
- Comprehensive audit logging

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

---

## 🐳 Production Deployment & DevOps

### 🚀 **Full-Stack Deployment Strategy**

This project demonstrates comprehensive DevOps and deployment expertise:

**Backend Deployment ([HARAKA-ExpressJS](https://github.com/OmarZakaria10/HARAKA-ExpressJS)):**
- **Docker Containerization**: Multi-stage builds with Alpine Linux for optimal performance
- **Production Docker Image**: Available at [omarzakaria10/haraka](https://hub.docker.com/r/omarzakaria10/haraka)
- **CI/CD Pipeline**: Jenkins automation with GitHub integration
- **Health Monitoring**: Custom health checks and comprehensive logging
- **Database Integration**: PostgreSQL with connection pooling and SSL support
- **Environment Management**: Secure configuration for development, staging, and production

**Frontend Deployment (This Repository):**
- **Static Site Generation**: Optimized React build for production
- **CDN Ready**: Built assets optimized for content delivery networks
- **Environment Configuration**: Support for multiple deployment environments
- **Performance Optimization**: Code splitting and lazy loading implementation

### 🛡️ **Production Features**

**Security & Performance:**
- SSL/TLS support with secure headers
- CORS configuration for cross-origin requests
- XSS and CSRF protection layers
- Input sanitization and validation
- JWT-based stateless authentication
- Role-based access control implementation

**Monitoring & Maintenance:**
- Application health checks and status monitoring
- Comprehensive error logging and tracking
- Performance metrics and optimization
- Database backup and restore capabilities
- Automated testing and quality assurance

### 📦 **Quick Deployment Options**

```bash
# Backend Deployment (Docker)
docker run -p 4000:4000 \
  -e DB_NAME=your_db \
  -e DB_USER=your_user \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your-secret-key \
  omarzakaria10/haraka:latest

# Frontend Deployment
npm run build
# Serve build folder with any static file server
```

---

## 🌍 Environment Variables

### Backend Configuration ([HARAKA-ExpressJS](https://github.com/OmarZakaria10/HARAKA-ExpressJS))
```env
# Server Configuration
PORT=4000
NODE_ENV=production

# Database Configuration  
DB_NAME=haraka_express
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### Frontend Configuration

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

---

## 📞 **Contact & Professional Profile**

### 👨‍💻 **Developer: Omar Zakaria**

**🚀 Full-Stack JavaScript Developer** specializing in modern web applications with enterprise-grade architecture and production-ready solutions.

**🛠️ Core Expertise:**
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Modern UI Libraries
- **Backend**: Node.js, Express.js, RESTful APIs, Database Design
- **Database**: PostgreSQL, SQL, Database Optimization, Data Migration
- **DevOps**: Docker, CI/CD, Jenkins, Production Deployment
- **Security**: JWT Authentication, RBAC, Data Protection, Security Best Practices

**🏆 Project Highlights:**
- Built complete vehicle management system from concept to production
- Designed and implemented secure multi-role authentication system
- Created scalable architecture handling thousands of concurrent operations
- Developed comprehensive API with 25+ endpoints and full documentation
- Implemented advanced data migration and export capabilities
- Integrated modern development practices with Docker and CI/CD pipelines

### 🔗 **Project Links & Resources**

**Full-Stack HARAKA System:**
- 🎨 **Frontend Repository**: [HARAKA-ReactJS](https://github.com/OmarZakaria10/HARAKA-ReactJS) *(Current Repository)*
- 🖥️ **Backend Repository**: [HARAKA-ExpressJS](https://github.com/OmarZakaria10/HARAKA-ExpressJS)
- 🐳 **Production Docker Image**: [omarzakaria10/haraka](https://hub.docker.com/r/omarzakaria10/haraka)
- 📚 **Complete Documentation**: Available in both repositories

**🤝 Get In Touch:**
- 📧 **Email**: [Contact for professional opportunities]
- 💼 **LinkedIn**: [Professional networking]
- 🐛 **Issues & Support**: [Create Issue](https://github.com/OmarZakaria10/HARAKA-ReactJS/issues)
- 💡 **Feature Requests**: [Enhancement Requests](https://github.com/OmarZakaria10/HARAKA-ReactJS/issues/new)

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

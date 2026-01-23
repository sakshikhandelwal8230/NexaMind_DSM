# Drug Monitor System (DMS)

A comprehensive web application for monitoring and managing drug inventory, tracking transfers, managing alerts, and providing emergency protocols for healthcare facilities.

## Features

- **Dashboard**: Real-time monitoring of drug inventory with KPI cards and status heatmaps
- **Inventory Management**: Track and manage drug stock levels with AI-powered assistance
- **Alert System**: Automated alerts for low stock, expiry dates, and security issues
- **Emergency Protocol**: Quick access to emergency procedures and protocols
- **User Management**: Role-based access control (Admin, User, Facility)
- **Medicine Transfers**: Track and manage medicine transfers between facilities
- **Security**: Secure authentication with password management
- **Theme Support**: Dark/Light mode toggle
- **AI Chatbot**: Intelligent assistant for inventory queries and recommendations

## Tech Stack

- **Framework**: Next.js 16.0.10
- **UI Library**: React with TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI components
- **State Management**: Context API
- **Forms**: React Hook Form
- **Theming**: next-themes
- **Package Manager**: npm/pnpm

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── dashboard/                # Dashboard pages and sub-routes
│   ├── inventory/                # Inventory management pages
│   ├── alerts/                   # Alert system pages
│   ├── transfers/                # Medicine transfer pages
│   ├── login/                    # Authentication pages
│   ├── signup/
│   ├── security/
│   └── providers/                # Context providers
├── components/                   # Reusable React components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard-specific components
│   ├── landing/                  # Landing page components
│   └── ui/                       # UI library components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions and storage
├── public/                       # Static assets
├── styles/                       # Global styles
└── tsconfig.json                 # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Drug-Monitor-System-DMS-
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start the development server (Turbopack enabled)
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Usage

### Authentication
- Sign up as a new user or log in with existing credentials
- Different user roles have different access levels (Admin, User, Facility)

### Dashboard
- View real-time inventory status
- Monitor KPI metrics
- Check facility trust badge status
- Access emergency protocols

### Inventory Management
- View and manage drug stock levels
- Use AI assistant for inventory recommendations
- Track medicine availability

### Alerts
- Receive notifications for critical stock levels
- Monitor expiry dates
- Track security alerts

### Medicine Transfers
- Initiate and track medicine transfers between facilities
- Monitor transfer status
- Maintain transfer history

## API Routes

- `/api/change-password` - Password management endpoint

## Context Providers

- **AuthContext**: Manages authentication state and user information
- **EmergencyContext**: Handles emergency protocol state
- **SearchContext**: Manages search functionality across the app

## Security Features

- Secure password authentication
- Password change functionality
- Role-based access control
- Emergency override protocols
- Facility trust verification

## Theming

The application supports both light and dark themes:
- Toggle theme using the theme switcher in the navigation
- Preferences are persisted in localStorage

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## License

This project is proprietary and used for the Drug Monitor System (DMS) hackathon.

## Support

For issues and questions, please contact the development team or open an issue in the repository.

## Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Icons from Lucide React
- Styling with Tailwind CSS

---

**Version**: 0.1.0  
**Last Updated**: January 2026

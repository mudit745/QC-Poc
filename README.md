# QC Management System POC

A Proof of Concept (POC) web UI for a Quality Check (QC) Management System with threaded discussions for each business rule within a configuration module.

## 🎯 Features

### Main Screen Layout
- **Header Section** with title and comprehensive filter controls
- **Data Table** displaying business rules with QC/SM comments and status
- **Interactive Chat Icons** to open threaded discussions

### Threaded Discussion Panel
- **Draggable and Resizable** chat panel using react-rnd
- **Threaded Discussions** for each business rule observation
- **Real-time Comment System** with QC and SM roles
- **Thread Management** with open/closed status tracking
- **Expandable/Collapsible** thread views

### Advanced UI Features
- **Light/Dark Theme Toggle** with system preference detection
- **Smooth Animations** using Framer Motion
- **Enterprise Dashboard Styling** inspired by SAP Fiori/ServiceNow
- **Responsive Design** with Tailwind CSS
- **Interactive Filters** for module, status, thread status, and role

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🧱 Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Main header with filters and theme toggle
│   ├── DataTable.tsx       # Business rules data table
│   └── ChatPanel.tsx       # Draggable threaded discussion panel
├── hooks/
│   └── useTheme.ts         # Theme management hook
├── types/
│   └── index.ts            # TypeScript interfaces
├── data/
│   └── mockData.ts         # Sample data for demonstration
├── App.tsx                 # Main application component
├── index.tsx              # Application entry point
└── index.css              # Global styles with Tailwind
```

## 🎨 UI Components

### Business Rules Table
- Rule number, description, and comments
- Status badges (Pass/Fail/Open/N/A)
- Interactive chat icons with notification badges
- Hover tooltips and smooth transitions

### Threaded Discussion Panel
- **Draggable**: Click and drag the panel to reposition
- **Resizable**: Drag corners/edges to resize
- **Thread Management**: Create new threads and manage existing ones
- **Comment System**: Add comments as QC or SM roles
- **Status Tracking**: Open/closed thread status with visual indicators

### Filter System
- **Module Name**: Filter by configuration module
- **Status**: Filter by rule status (Pass/Fail/Open/N/A)
- **Thread Status**: Filter by thread status (Open/Closed)
- **Role**: Filter by user role (QC/SM)

## 🎯 Dummy Data

The application includes realistic dummy data featuring:
- 5 business rules with various statuses
- 4 threaded discussions with multiple comments
- Realistic timestamps and user interactions
- Professional QC/SM workflow scenarios

## 🛠️ Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React RND** for draggable/resizable components
- **Lucide React** for icons
- **Custom Hooks** for theme management

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones (#0ea5e9)
- **Gray Scale**: Comprehensive gray palette
- **Status Colors**: Green (Pass), Red (Fail), Yellow (Open), Gray (Closed)

### Typography
- Clean, readable font stack
- Consistent sizing scale
- Proper contrast ratios for accessibility

### Spacing & Layout
- Consistent padding and margins
- Responsive grid system
- Soft shadows and rounded corners
- Enterprise-grade visual hierarchy

## 🔧 Customization

The application is built with modularity in mind:
- Easy to extend with new business rules
- Configurable filter options
- Customizable theme colors
- Scalable component architecture

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactive elements
- Optimized for both desktop and tablet use

## 🎭 Theme Support

- Automatic system theme detection
- Manual theme toggle
- Persistent theme preference
- Smooth theme transitions
- Dark mode optimized colors

This POC demonstrates a modern, enterprise-ready QC management system with advanced threading capabilities and intuitive user experience.










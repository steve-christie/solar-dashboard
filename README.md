# GivEnergy Dashboard

A modern desktop application for monitoring and visualizing your GivEnergy solar panel system. Built with Rust and Tauri for the backend, and React + TypeScript for the frontend.

## 🎯 Overview

The GivEnergy Dashboard provides a real-time view of your solar energy system, displaying:

- **Solar Generation**: Current solar power output with visual indicators
- **Grid Power**: Import/export status with directional arrows (← importing, → exporting)
- **Battery Status**: Charge level, power flow, and state of charge percentage
- **House Consumption**: Current energy consumption in kW/h
- **Energy Flow Visualization**: Interactive diagram showing energy flow between all sources

The app automatically refreshes data every 30 seconds and provides a debug mode to view raw API responses.

## 🚀 Quick Start

### Prerequisites

- **Rust** (1.70 or later) - [Install Rust](https://www.rust-lang.org/tools/install)
- **Node.js** (18 or later) - [Install Node.js](https://nodejs.org/)
- **GivEnergy API Key** - Get your API key from your GivEnergy account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd giv-energy
   ```

2. **Install Rust dependencies**
   ```bash
   # Dependencies are automatically managed by Cargo
   # No manual installation needed
   ```

3. **Install frontend dependencies**
   ```bash
   cd ui
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   GIV_ENERGY_API_KEY=your_api_key_here
   ```
   
   Replace `your_api_key_here` with your actual GivEnergy API key.

### Running the Application

```bash
cargo tauri dev
```

This will:
- Start the Vite dev server for the frontend (on port 5173)
- Build and run the Tauri application
- Open the app window automatically

## 🛠️ Development

### Key Technologies

**Backend (Rust)**
- **Tauri**: Desktop app framework
- **Tokio**: Async runtime
- **Reqwest**: HTTP client for API calls
- **Serde**: JSON serialization/deserialization

**Frontend (React + TypeScript)**
- **React 19**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Vite**: Build tool and dev server

### Building for Production

```bash
cargo tauri build
```

This will:
- Build the React frontend
- Compile the Rust backend
- Create platform-specific installers in `src-tauri/target/release/bundle/`

## 📝 API Integration

The app connects to the GivEnergy Cloud API (`https://api.givenergy.cloud/v1`) and fetches:

- **Account Data**: User account information
- **Device List**: List of inverters and devices
- **Inverter Request Data**: Real-time system data (solar, grid, battery, consumption)
- **Inverter Meter Data**: Meter readings

All API calls require authentication via the `GIV_ENERGY_API_KEY` environment variable.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
GIV_ENERGY_API_KEY=your_api_key_here
```

The `.env` file is gitignored and should not be committed to version control.

### Tauri Configuration

Main configuration is in `tauri.conf.json`:
- Window size: 1024x1140
- Dev server: `http://localhost:5173`
- Build output: `ui/dist`

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- Uses [GivEnergy Cloud API](https://api.givenergy.cloud/)


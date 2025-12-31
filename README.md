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

### Project Structure

```
giv-energy/
├── src/                    # Rust backend
│   ├── main.rs            # Tauri commands & app entry point
│   ├── giv_energy_client.rs  # GivEnergy API client
│   └── dash/              # Dashboard module
├── ui/                     # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── components/    # React components
│   │   │   ├── EnergyFlow.tsx    # Energy flow visualization
│   │   │   ├── SolarPanel.tsx   # Solar panel display
│   │   │   ├── GridPower.tsx    # Grid power display
│   │   │   ├── Battery.tsx      # Battery display
│   │   │   └── DebugDrawer.tsx  # Debug panel
│   │   ├── services/      # API service layer
│   │   └── types.ts       # TypeScript type definitions
│   └── package.json       # Frontend dependencies
├── Cargo.toml             # Rust dependencies
├── tauri.conf.json        # Tauri configuration
└── .env                   # Environment variables (not in git)
```

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

## 🎨 UI Components

### Energy Flow Diagram

The main visualization shows energy flow in a clock-like layout:
- **Solar** at 12 o'clock (top)
- **Grid** at 4 o'clock (bottom right)
- **Battery** at 8 o'clock (bottom left)
- **House** in the center

All connections are shown as straight lines, with animated flow indicators when energy is actively flowing.

### Component Cards

- **SolarPanel**: Shows solar generation with animated sun icon
- **GridPower**: Displays grid import/export with directional arrows
- **Battery**: Shows battery level, charge/discharge status, and percentage
- **EnergyFlow**: Interactive diagram of energy flow between all sources

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

## 🐛 Troubleshooting

### App won't start

1. **Check API key**: Ensure `.env` file exists with `GIV_ENERGY_API_KEY` set
2. **Check dependencies**: Run `npm install` in `ui/` directory
3. **Check Rust**: Ensure Rust is installed and up to date (`rustc --version`)

### Data not loading

1. **Check API key**: Verify your GivEnergy API key is correct
2. **Check network**: Ensure you can reach `https://api.givenergy.cloud`
3. **Check logs**: Look for error messages in the terminal

### Paths not rendering correctly

- The energy flow paths are calculated based on element positions
- If paths look wrong, try refreshing the app
- Check browser DevTools console for any errors

## 📦 Dependencies

### Rust Dependencies
- `tauri` - Desktop app framework
- `tokio` - Async runtime
- `reqwest` - HTTP client
- `serde` - Serialization
- `dotenvy` - Environment variable loading

### Frontend Dependencies
- `react` - UI framework
- `typescript` - Type safety
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `vite` - Build tool

## 🤝 Contributing

1. Make your changes
2. Test thoroughly
3. Ensure code follows existing patterns
4. Submit a pull request

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- Uses [GivEnergy Cloud API](https://api.givenergy.cloud/)


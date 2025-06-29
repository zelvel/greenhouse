# Greenhouse Control System

An automated greenhouse control system using Raspberry Pi, Arduino, and various sensors to monitor and maintain optimal growing conditions for plants.

## Features

- Real-time monitoring of:
  - Temperature
  - Humidity
  - Light levels
  - Soil moisture
- Automated control of:
  - Ventilation fans
  - Water pump
  - LED grow lights
- Web-based dashboard
- Sensor calibration support
- Plant profile management
- Historical data logging

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [API Documentation](docs/API.md)
- [Adding Plants Guide](docs/ADDING_PLANTS.md)
- [Arduino Sensors Guide](docs/ARDUINO_SENSORS_GUIDE.md)
- [Arduino Code Documentation](arduino/README.md)

## Quick Start

1. Follow the [Installation Guide](docs/INSTALLATION.md)
2. Connect the Arduino hardware according to the [Arduino Sensors Guide](docs/ARDUINO_SENSORS_GUIDE.md)
3. Upload the Arduino code
4. Start the development server: `npm run dev`
5. Access the web dashboard at `http://localhost:5173`

## Development

```bash
# Install dependencies
npm install

# Start development server (both frontend and backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Production Deployment

```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Access the application at http://localhost:5175
```

## Project Structure

```
greenhouse/
├── arduino/          # Arduino code and libraries
├── docs/            # Documentation
├── src/             # Source code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── server/      # Node.js backend
│   ├── services/    # API services
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── public/          # Static assets
└── dist/            # Built files (generated)
```

## Port Configuration

- **Development**: Frontend on port 5173, Backend on port 3001
- **Production**: Frontend on port 5175, Backend on port 3001

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
# Greenhouse Automation System

## Overview
This project aims to automate and control all aspects of greenhouse management, providing full control through a web interface and a mobile application (in the future). The system integrates IoT sensors, Raspberry Pi, Arduino, and Tailscale for remote access.

## Key Features
- **Watering**: Automated drip irrigation and sprinkler systems.
- **Sensors**:
  - Soil moisture.
  - Temperature.
  - Humidity.
  - Air quality (e.g., CO₂ levels).
- **Environmental Controls**:
  - Heating and cooling systems.
  - Lighting regulation (artificial grow lights).
  - Ventilation systems (fans, humidifiers, dehumidifiers).
- **Remote Monitoring and Control**:
  - Web interface for real-time control.
  - Logs and analytics for historical data.
  - Notifications for critical events.

## Technical Stack
- **Hardware**:
  - **Raspberry Pi**: Acts as the central controller, hosting the backend and handling data processing.
  - **Arduino**: Interfaces with sensors and actuators.
  - **Tailscale**: Provides secure remote access.
- **Software**:
  - **Frontend**: React.js for the web interface.
  - **Backend**: Python with Flask/FastAPI or Node.js for APIs.
  - **Database**: PostgreSQL or MySQL for storing logs and configurations.
- **Networking**:
  - Secure IoT communication via Tailscale.
  - Port forwarding for local and remote access.

## Goals
1. Automate environmental controls based on sensor data.
2. Enable remote access and monitoring through secure channels.
3. Provide a modular architecture for scalability and maintenance.

## Progress
- [x] Tailscale setup for remote access.
- [ ] Hardware abstraction layer for sensor and actuator communication.
- [ ] Backend API for control and data logging.
- [ ] Web interface for real-time control.
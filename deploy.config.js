module.exports = {
  // Update these values with your Raspberry Pi details
  pi: {
    host: 'raspberrypi.local', // or your Pi's IP address
    username: 'pi',
    deployPath: '/home/pi/greenhouse',
  },
  // Frontend configuration
  frontend: {
    port: 5175,
    apiUrl: 'http://localhost:3001', // Backend API URL
  },
  // Backend configuration
  backend: {
    port: 3001,
  },
}; 
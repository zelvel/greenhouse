try:
    from hardware_abstraction_layer.arduino_interface import ArduinoInterface
    MOCK_MODE = False
except ImportError:
    MOCK_MODE = True

class MockArduinoInterface:
    """Mock ArduinoInterface for testing without a physical device."""
    def __init__(self, port: str, baud_rate: int = 9600):
        print(f"MockArduinoInterface initialized on port {port} with baud_rate {baud_rate}")

    def read_sensor(self, sensor_type: str) -> float:
        print(f"Mock: Reading sensor '{sensor_type}'")
        return 25.5  # Example mock value for temperature

    def write_actuator(self, actuator_type: str, value: float) -> None:
        print(f"Mock: Setting actuator '{actuator_type}' to value {value}")

def main():
    # Use mock interface if in testing mode
    Interface = MockArduinoInterface if MOCK_MODE else ArduinoInterface

    # Initialize the interface
    arduino = Interface(port='/dev/ttyUSB0')

    # Test: Read a sensor
    temperature = arduino.read_sensor('temperature')
    print(f"Temperature: {temperature} °C")

    # Test: Control an actuator
    arduino.write_actuator('pump', 1)

if __name__ == "__main__":
    main()
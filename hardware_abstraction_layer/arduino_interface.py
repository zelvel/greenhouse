import serial
from hardware_abstraction_layer.hardware_interface import HardwareInterface

class ArduinoInterface(HardwareInterface):
    """
    Concrete implementation for Arduino communication.
    """

    def __init__(self, port: str, baud_rate: int = 9600):
        self.serial = serial.Serial(port, baud_rate, timeout=1)

    def read_sensor(self, sensor_type: str) -> float:
        command = f"READ {sensor_type}\n"
        self.serial.write(command.encode())
        response = self.serial.readline().decode().strip()
        try:
            return float(response)
        except ValueError:
            raise RuntimeError(f"Invalid response from Arduino: {response}")

    def write_actuator(self, actuator_type: str, value: float) -> None:
        command = f"SET {actuator_type} {value}\n"
        self.serial.write(command.encode())
        response = self.serial.readline().decode().strip()
        if response != "OK":
            raise RuntimeError(f"Failed to execute command: {response}")
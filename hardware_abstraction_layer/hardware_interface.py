from abc import ABC, abstractmethod

class HardwareInterface(ABC):
    """
    Abstract Base Class for hardware communication.
    """

    @abstractmethod
    def read_sensor(self, sensor_type: str) -> float:
        """
        Read data from a sensor.
        :param sensor_type: The type of sensor (e.g., 'temperature').
        :return: Sensor reading as a float.
        """
        pass

    @abstractmethod
    def write_actuator(self, actuator_type: str, value: float) -> None:
        """
        Send a command to an actuator.
        :param actuator_type: The type of actuator (e.g., 'fan', 'pump').
        :param value: The value to set (e.g., 1 for ON, 0 for OFF).
        """
        pass
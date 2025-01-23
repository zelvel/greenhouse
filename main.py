from hardware_abstraction_layer.arduino_interface import ArduinoInterface

def main():
    # Replace '/dev/ttyUSB0' with your Arduino's actual port
    arduino = ArduinoInterface(port='/dev/ttyUSB0')

    # Example: Read a temperature sensor
    temperature = arduino.read_sensor('temperature')
    print(f"Temperature: {temperature} °C")

    # Example: Turn on a pump
    arduino.write_actuator('pump', 1)

if __name__ == "__main__":
    main()
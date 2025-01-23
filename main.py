from flask import Flask, jsonify, request
from hardware_abstraction_layer.arduino_interface import ArduinoInterface
from hardware_abstraction_layer.arduino_interface import MockArduinoInterface

app = Flask(__name__)

# Initialize the hardware interface
try:
    arduino = ArduinoInterface(port='/dev/ttyUSB0')
except Exception as e:
    print(f"Using MockArduinoInterface due to error: {e}")
    arduino = MockArduinoInterface(port='/dev/ttyUSB0')

@app.route("/sensor/<sensor_type>", methods=["GET"])
def get_sensor_data(sensor_type):
    """
    API endpoint to get sensor data.
    :param sensor_type: Type of sensor to read (e.g., 'temperature').
    :return: Sensor value as JSON.
    """
    try:
        value = arduino.read_sensor(sensor_type)
        return jsonify({"sensor": sensor_type, "value": value}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/actuator/<actuator_type>", methods=["POST"])
def control_actuator(actuator_type):
    """
    API endpoint to control an actuator.
    :param actuator_type: Type of actuator to control (e.g., 'pump').
    :body param value: Value to set (e.g., 1 for ON, 0 for OFF).
    :return: Status message as JSON.
    """
    try:
        data = request.json
        value = data.get("value")
        arduino.write_actuator(actuator_type, value)
        return jsonify({"actuator": actuator_type, "status": "success", "value": value}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
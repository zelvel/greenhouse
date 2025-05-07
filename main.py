from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from hardware_abstraction_layer.arduino_interface import ArduinoInterface
import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend
import matplotlib.pyplot as plt
import os

# Mock interface for testing
class MockArduinoInterface:
    def __init__(self, port: str, baud_rate: int = 9600):
        print(f"MockArduinoInterface initialized on port {port} with baud_rate {baud_rate}")

    def read_sensor(self, sensor_type: str) -> float:
        print(f"Mock: Reading sensor '{sensor_type}'")
        return 25.5  # Example mock value for temperature

    def write_actuator(self, actuator_type: str, value: float) -> None:
        print(f"Mock: Setting actuator '{actuator_type}' to value {value}")


# Initialize Flask app
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/zelvel/Desktop/greenhouse/greenhouse.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database models
class Sensor(db.Model):
    __tablename__ = 'sensors'  # Explicitly set the table name
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    value = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

class Actuator(db.Model):
    __tablename__ = 'actuators'  # Explicitly set the table name
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

# Initialize hardware interface
try:
    arduino = ArduinoInterface(port='/dev/ttyUSB0')
except Exception as e:
    print(f"Using MockArduinoInterface due to error: {e}")
    arduino = MockArduinoInterface(port='/dev/ttyUSB0')


@app.route("/sensor/<sensor_type>", methods=["GET"])
def get_sensor_data(sensor_type):
    try:
        value = arduino.read_sensor(sensor_type)
        # Save to database
        sensor_data = Sensor(type=sensor_type, value=value)
        db.session.add(sensor_data)
        db.session.commit()
        print(f"Logged sensor data: {sensor_data}")
        return jsonify({"sensor": sensor_type, "value": value}), 200
    except Exception as e:
        db.session.rollback()  # Rollback any uncommitted changes
        print(f"Error logging sensor data: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/actuator/<actuator_type>", methods=["POST"])
def control_actuator(actuator_type):
    try:
        data = request.json
        value = data.get("value")
        arduino.write_actuator(actuator_type, value)
        # Save to database
        actuator_data = Actuator(type=actuator_type, state=bool(value))
        db.session.add(actuator_data)
        db.session.commit()
        print(f"Logged actuator data: {actuator_data}")
        return jsonify({"actuator": actuator_type, "status": "success", "value": value}), 200
    except Exception as e:
        db.session.rollback()  # Rollback any uncommitted changes
        print(f"Error logging actuator data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/logs/sensors", methods=["GET"])
def get_sensor_logs():
    """
    API endpoint to fetch all sensor logs.
    Optional query parameters:
        - type: Filter by sensor type (e.g., 'temperature').
        - start_time, end_time: Filter by timestamp range (ISO format).
    :return: List of sensor logs as JSON.
    """
    try:
        query = Sensor.query

        # Filter by sensor type
        sensor_type = request.args.get("type")
        if sensor_type:
            query = query.filter(Sensor.type == sensor_type)

        # Filter by time range
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")
        if start_time:
            query = query.filter(Sensor.timestamp >= start_time)
        if end_time:
            query = query.filter(Sensor.timestamp <= end_time)

        # Fetch results
        logs = query.all()
        result = [
            {"id": log.id, "type": log.type, "value": log.value, "timestamp": log.timestamp.isoformat()}
            for log in logs
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/logs/actuators", methods=["GET"])
def get_actuator_logs():
    """
    API endpoint to fetch all actuator logs.
    Optional query parameters:
        - type: Filter by actuator type (e.g., 'pump').
        - start_time, end_time: Filter by timestamp range (ISO format).
    :return: List of actuator logs as JSON.
    """
    try:
        query = Actuator.query

        # Filter by actuator type
        actuator_type = request.args.get("type")
        if actuator_type:
            query = query.filter(Actuator.type == actuator_type)

        # Filter by time range
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")
        if start_time:
            query = query.filter(Actuator.timestamp >= start_time)
        if end_time:
            query = query.filter(Actuator.timestamp <= end_time)

        # Fetch results
        logs = query.all()
        result = [
            {"id": log.id, "type": log.type, "state": log.state, "timestamp": log.timestamp.isoformat()}
            for log in logs
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/visualize/sensor/<sensor_type>", methods=["GET"])
def visualize_sensor_data(sensor_type):
    """
    API endpoint to generate a visualization for a specific sensor type.
    :param sensor_type: Type of sensor to visualize (e.g., 'temperature').
    :return: Path to the generated image.
    """
    try:
        logs = Sensor.query.filter_by(type=sensor_type).order_by(Sensor.timestamp).all()
        if not logs:
            return jsonify({"error": f"No data found for sensor type '{sensor_type}'"}), 404

        timestamps = [log.timestamp for log in logs]
        values = [log.value for log in logs]

        plt.figure(figsize=(10, 5))
        plt.plot(timestamps, values, marker="o", linestyle="-")
        plt.title(f"{sensor_type.capitalize()} Sensor Data")
        plt.xlabel("Timestamp")
        plt.ylabel("Value")
        plt.grid(True)

        image_path = f"visualizations/{sensor_type}_data.png"
        os.makedirs("visualizations", exist_ok=True)
        plt.savefig(image_path)
        plt.close()

        return jsonify({"message": "Visualization created", "image_path": image_path}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Test and create database tables
with app.app_context():
    print("Testing database connection...")
    db.session.execute(text("SELECT 1"))
    print("Database connection successful!")

    print("Creating tables...")
    db.create_all()  # Ensure this line exists
    print("Database tables created successfully!")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
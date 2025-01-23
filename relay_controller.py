import serial
import json
import time
from datetime import datetime

# Configuration
CONFIG_FILE = "config.json"
LOG_FILE = "relay_log.txt"
SERIAL_PORT = "/dev/ttyUSB0"  # Update this to your Arduino's port
BAUD_RATE = 9600

def load_config():
    """Load the configuration file."""
    with open(CONFIG_FILE, "r") as file:
        return json.load(file)

def log_action(action):
    """Log actions to a file."""
    with open(LOG_FILE, "a") as log:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log.write(f"{timestamp} - {action}\n")
    print(f"{timestamp} - {action}")

def send_command(arduino, command):
    """Send a command to the Arduino."""
    arduino.write(f"{command}\n".encode())
    log_action(f"Sent command: {command}")

def main():
    # Open serial connection
    try:
        arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)  # Allow time for Arduino to reset
    except Exception as e:
        print(f"Error connecting to Arduino: {e}")
        return

    print("Connected to Arduino")
    current_state = None

    while True:
        # Load schedule from config
        try:
            config = load_config()
            power_on = datetime.strptime(config["power-on"], "%H:%M").time()
            power_off = datetime.strptime(config["power-off"], "%H:%M").time()
        except Exception as e:
            print(f"Error reading config: {e}")
            time.sleep(60)
            continue

        # Get current time
        now = datetime.now().time()

        # Determine desired state
        if power_on <= now < power_off:
            desired_state = "ON"
        else:
            desired_state = "OFF"

        # Update Arduino if state changes
        if desired_state != current_state:
            send_command(arduino, desired_state)
            current_state = desired_state

        # Wait 30 seconds before checking again
        time.sleep(30)

if __name__ == "__main__":
    main()
void setup() {
  Serial.begin(9600);
  pinMode(7, OUTPUT); // Replace 7 with your relay pin
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim(); // Remove newline/whitespace
    if (command == "ON") {
      digitalWrite(7, HIGH);
      Serial.println("Relay ON");
    } else if (command == "OFF") {
      digitalWrite(7, LOW);
      Serial.println("Relay OFF");
    }
  }
}
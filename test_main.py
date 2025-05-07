from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from sqlalchemy import inspect

# Flask app setup
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/zelvel/Desktop/greenhouse/greenhouse.db'  # Use your current database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database models for testing
class Sensor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    value = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

class Actuator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    state = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

# Test script
with app.app_context():
    print(f"Database file: {db.engine.url.database}")
    try:
        print("Testing database connection...")
        db.session.execute(text("SELECT 1"))
        print("Database connection successful!")

        print("Creating tables...")
        db.create_all()
        print("Database tables created successfully!")

        print("Checking tables...")
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"Tables found: {tables}")
    except Exception as e:
        print(f"Error during database setup: {e}")
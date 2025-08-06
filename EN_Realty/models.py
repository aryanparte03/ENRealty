from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Import db from the initialized app context
from flask import current_app

# Get db from current app context
db = current_app.extensions['sqlalchemy']

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    property_type = db.Column(db.String(50), nullable=False)  # House, Apartment, etc.
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Integer)
    area = db.Column(db.Integer)  # in sq ft
    description = db.Column(db.Text)
    image_url = db.Column(db.String(300))
    is_featured = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='For Sale')  # For Sale, For Rent, Sold
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    message = db.Column(db.Text, nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Newsletter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)

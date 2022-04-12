from .db import db

# from datetime import datetime


class Quote(db.Model):
    __tablename__ = "quotes"

    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    # created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    recods = db.relationship("Records", back_populates="quote")

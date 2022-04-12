from datetime import datetime

from .db import db


class Record(db.Model):
    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)
    quote_id = db.Column(db.Integer, db.ForeignKey("quotes.id", nullable=False))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", nullable=False))
    author = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    # created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    quote = db.relationship("Quote", back_populates="records")
    user = db.relationship("User", back_populates="records")

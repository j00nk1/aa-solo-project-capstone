from datetime import datetime
from .db import db

class Timed_Record(db.Model):
  __tablename__ = "timed_records"
  
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  minute = db.Column(db.SmallInteger, nullable=False, default=1)
  accuracy = db.Column(db.Float(2), nullable=False)
  wpm = db.Column(db.Integer, nullable=False)
  updated_at = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow())

  user = db.relationship("User", back_populates="timed_records")
  comments = db.relationship("Comment", back_populates="timed_record")

  @property
  def score(self):
      return (self.wpm * self.accuracy)

  def to_dict(self):
    return {
        "id": self.id,
        "user_id": self.user_id,
        "minute": self.minute,
        "accuracy": self.accuracy,
        "wpm": self.wpm,
        "score": self.score,
        "updated_at": self.updated_at,
    }
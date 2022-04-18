from datetime import datetime

from .db import db


class Record(db.Model):
    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey("quotes.id", ondelete="CASCADE"), nullable=False)
    accuracy = db.Column(db.Float(2), nullable=False)
    # started_at = db.Column(db.DateTime, nullable=False)
    # ended_at = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.BigInteger, nullable=False)  # Store duration in milliseconds
    wpm = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow())

    user = db.relationship("User", back_populates="records")
    quote = db.relationship("Quote", back_populates="records")

    comments = db.relationship("Comment", cascade="all,delete", back_populates="record")
    
    @property
    def score(self):
        return (self.wpm * self.accuracy)
    
    @property
    def dur_time(self):
        dur = self.duration
        sec = (dur)/1000
        return sec

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "quote_id": self.quote_id,
            "accuracy": self.accuracy,
            # "started_at": self.started_at,
            # "ended_at": self.ended_at,
            "duration": self.duration,
            "wpm": self.wpm,
            "score": self.score,
            "dur_time": self.dur_time,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

from datetime import datetime

from .db import db


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey("records.id", ondelete="CASCADE"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow())

    user = db.relationship("User", back_populates="comments")
    record = db.relationship("Record", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
            "content": self.content,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

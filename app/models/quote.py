from .db import db


class Quote(db.Model):
    __tablename__ = "quotes"

    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(100), nullable=False)
    # title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    char_count = db.Column(db.Integer, nullable=False)

    records = db.relationship("Record", cascade="all,delete", back_populates="quote")

    def to_dict(self):
        return {
            "id": self.id,
            "author": self.author,
            # "title": self.title,  # no titles
            "content": self.content,
            "char_count": self.char_count,
        }

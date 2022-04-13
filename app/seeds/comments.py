from app.models import db, Comment
from random import randint


def seed_comments():
    data = [
        Comment(
            user_id=randint(1, 10),
            quote_id=randint(1, 50),
            accuracy=randint(70, 100),
            duration=randint(10000, 21000),
        )
        for x in range(100)
    ]

    db.session.add_all(data)
    db.session.commit()


def undo_comments():
    db.session.execute("TRUNCATE comments RESTART IDENTITY CASCADE;")
    db.session.commit()

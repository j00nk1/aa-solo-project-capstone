from random import randint
import lorem

from app.models import db, Comment

print()


def seed_comments():
    data = [
        Comment(
            user_id=randint(1, 10),
            record_id=randint(1, 51),
            content=lorem.sentence(),
        )
        for x in range(50)
    ]

    db.session.add_all(data)
    db.session.commit()


def undo_comments():
    db.session.execute("TRUNCATE comments RESTART IDENTITY CASCADE;")
    db.session.commit()

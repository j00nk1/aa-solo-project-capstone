from app.models import db, Record
from random import randint, uniform


def seed_records():

    data = [
        Record(
            user_id=randint(1, 10),
            quote_id=randint(1, 50),
            accuracy=round(uniform(70, 100), 2),
            duration=randint(10000, 21000),
            wpm=randint(30, 90)
        )
        for x in range(100)
    ]

    db.session.add_all(data)
    db.session.commit()


def undo_records():
    db.session.execute("TRUNCATE records RESTART IDENTITY CASCADE;")
    db.session.commit()

from app.models import db, Record
from random import randint, uniform


def seed_records():
    user_ids = list(range(1,11))
    quote_ids = list(range(1, 51))
    
    def num_picker(i, ids):
        idAt = i % len(ids)
        return ids[idAt]
    
    
    data = [
        Record(
            user_id=num_picker(x, user_ids),
            quote_id=num_picker(x, quote_ids),
            accuracy=round(uniform(70, 100), 2),
            duration=randint(10000, 21000),
            wpm=randint(30, 90)
        )
        for x in range(50)
    ]

    db.session.add_all(data)
    db.session.commit()


def undo_records():
    db.session.execute("TRUNCATE records RESTART IDENTITY CASCADE;")
    db.session.commit()

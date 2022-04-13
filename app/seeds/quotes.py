from app.models import db, Quote
from app.fetched import fetched_quotes


def seed_quotes():
    data = [Quote(author=quote["a"], content=quote["q"], char_count=int(quote["c"])) for quote in fetched_quotes]

    db.session.add_all(data)
    db.session.commit()


def undo_quotes():
    db.session.execute("TRUNCATE quotes RESTART IDENTITY CASCADE;")
    db.session.commit()

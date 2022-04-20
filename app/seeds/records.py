from app.models import db, Record, Quote
from math import floor
from random import randint


def seed_records():
    user_ids = list(range(1,11))
    quote_ids = list(range(1, 52))
    
    def num_picker(i, ids):
        idAt = i % len(ids)
        return ids[idAt]
    
    def score_generator(quote_id):
        # generate accuracy
        quote = Quote.query.get(quote_id)
        length = quote.char_count
        correct_char = randint(4, length)
        acc = round(correct_char/length *100, 2)
        
        # generate duration
        dur = randint(10000, 21000)
        
        # generate wpm
        dur_in_sec = floor(dur/1000)
        generated_wpm = round((60/dur_in_sec * correct_char) / 5)
        
        return (acc, dur, generated_wpm)
    
    data = []
    for x in range(150):
        u_id=num_picker(x, user_ids),
        q_id=num_picker(x, quote_ids),
        score = score_generator(q_id)
        acc=score[0],
        dur=score[1],
        setWpm=score[2]
        data.append(Record(user_id=u_id, quote_id=q_id, accuracy=acc, duration=dur, wpm=setWpm))
    
    db.session.add_all(data)
    db.session.commit()


def undo_records():
    db.session.execute("TRUNCATE records RESTART IDENTITY CASCADE;")
    db.session.commit()



from app.models import db, Timed_Record, Quote
from math import floor
from random import randint


def seed_timed_records():
  user_ids = list(range(1, 11))
  
  # generate ids
  def num_picker(i, ids):
    idAt = i % len(ids)
    return ids[idAt]
  
  def score_generator():
    quotes = db.session.query(Quote.char_count).all()
    # # generate num of quotes that were typed
    # num_of_quotes = randint(6, (len(quotes))//7)
    # Above was too much, so set it as 6 quotes per min
    num_of_quotes = 6
    
    count = 0
    total_char = 0
    while(count < num_of_quotes):
      # generate an index number
      quote_at = randint(0, len(quotes) - 1)
      # randomly pick a quote and adding char count
      total_char += int(quotes[quote_at].char_count)
      
      count += 1
    
    # after generated the total, generate correct chars user input
    correct_char = randint(40, total_char)
    
    # calcurlate accuracy
    acc = round(correct_char/total_char *100, 2)
    
    # generate wpm, duration is set to 1 min by default
    dur_in_sec = 60
    generated_wpm = round(60/dur_in_sec * correct_char / 5) # simply (correct_char / 5) should work, but for the future reference
    
    return (acc, generated_wpm)
    
  data = []
  # Make x amount of data
  for x in range(100):
    u_id=num_picker(x, user_ids)
    score = score_generator()
    acc = score[0]
    wpm = score[1]
    data.append(Timed_Record(user_id=u_id, accuracy=acc, wpm=wpm))
    
  db.session.add_all(data)
  db.session.commit()
  
  
def undo_timed_records():
    db.session.execute("TRUNCATE timed_records RESTART IDENTITY CASCADE;")
    db.session.commit()
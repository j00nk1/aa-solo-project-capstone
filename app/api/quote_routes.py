from crypt import methods
from flask import Blueprint, request
from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.record_form import RecordForm
from app.models import Quote, db
from app.models.record import Record

quote_routes = Blueprint('quotes', __name__)

@quote_routes.route('/')
def quotes():
  quotes = Quote.query.all()
  return {'quotes': [quote.to_dict() for quote in quotes]}


@quote_routes.route('/<int:id>')
def quote(id):
  quote = Quote.query.get(id)
  return {'quote': quote.to_dict()}

@quote_routes.route('/<int:id>/records', methods=["POST"])
def records(id):
  form = RecordForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    record = Record(
      user_id = form.data["user_id"],
      quote_id = id,
      accuracy=form.data["accuracy"],
      duration=form.data["duration"],
      wpm=form.data["wpm"],
    )
    
    db.session.add(record)
    db.session.commit()
    print(record);
    return record
  return {'errors': validation_errors_to_error_messages(form.errors)}, 401
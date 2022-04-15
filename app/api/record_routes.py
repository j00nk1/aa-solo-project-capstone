from crypt import methods
from flask import Blueprint, request

from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.record_form import RecordForm
from app.models import Record, db

record_routes = Blueprint("records", __name__)

@record_routes.route('/')
def records():
  records = Record.query.all()
  return {'records': [record.to_dict() for record in records]}


@record_routes.route('/<int:record_id>')
def record(quote_id):
  return {"quote_id": quote_id}
  # form = RecordForm()
  # # form['csrf_token'].data = request.cookies['csrf_token']
  # if form.validate_on_submit():
  #   record = Record(
  #     user_id = form.data["user_id"],
  #     quote_id = quote_id,
  #     accuracy=form.data["accuracy"],
  #     duration=form.data["duration"],
  #     wpm=form.data["wpm"],
  #   )
    
  #   db.session.add(record)
  #   db.session.commit()
  #   print(record);
  #   return record
  # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
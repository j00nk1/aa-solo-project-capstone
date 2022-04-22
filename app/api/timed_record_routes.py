from datetime import datetime
from flask import Blueprint, request
from app.api.auth_routes import validation_errors_to_error_messages

# from app.api.auth_routes import validation_errors_to_error_messages
from app.forms import TimedRecordForm, CommentForm
from app.models import Timed_Record, db, Comment

timed_record_routes = Blueprint("timed_records", __name__)

@timed_record_routes.route('/')
def timed_records():
  records = Timed_Record.query.order_by(Timed_Record.updated_at.desc())
  return {'records': [record.to_dict() for record in records]}

# User's records
@timed_record_routes.route('/users/<int:user_id>/')
def user_timed_records(user_id):
  records = Timed_Record.query.filter_by(user_id = user_id).order_by(Timed_Record.updated_at.desc())
  return {'records': [record.to_dict() for record in records]}

@timed_record_routes.route('/', methods=["POST"])
def post_timed_records():
  form = TimedRecordForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    record = Timed_Record(
      user_id = form.data["user_id"],
      minute = form.data["minute"] if form.data["minute"] else 1,
      accuracy = form.date["accuracy"],
      wpm = form.data["wpm"],
    )
    
    return record.to_dict()
  
  return {'errors': validation_errors_to_error_messages(form.errors)}, 401

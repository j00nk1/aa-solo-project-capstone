from crypt import methods
from datetime import datetime
from flask import Blueprint, request

from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.record_form import RecordForm
from app.models import Record, db

record_routes = Blueprint("records", __name__)

# WHOLE records
@record_routes.route('/')
def records():
  records = Record.query.all()
  return {'records': [record.to_dict() for record in records]}


# Session user's records
@record_routes.route('/users/<int:user_id>/')
def user_records(user_id):
  records = Record.query.filter_by(Record.user_id == user_id).all()
  return {'records': [record.to_dict() for record in records]}


@record_routes.route('/<int:record_id>/', methods=["PATCH"])
def update_record(record_id):
  form = RecordForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    
    record = Record.query.get(record_id)
    record.accuracy = form.data["accuracy"]
    record.duration=form.data["duration"]
    record.wpm=form.data["wpm"]
    record.updated_at = datetime.now()
    
    db.session.commit()
    return record.to_dict()
  return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@record_routes.route('/<int:record_id>/', methods=["DELETE"])
def delete_reccord(record_id):
  deleted_record = Record.query.get(record_id)
  db.session.delete(deleted_record)
  db.session.commit()
  return deleted_record.to_dict()
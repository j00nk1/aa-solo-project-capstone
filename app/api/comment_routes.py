from crypt import methods
from datetime import datetime
from flask import Blueprint, request
from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.comment_form import CommentForm

from app.models import db, Comment

comment_routes = Blueprint("comments", __name__)


# WHOLE COMMENTS
@comment_routes.route('/')
def comments():
  comments = Comment.query.all()
  return {'comments': [comment.to_dict() for comment in comments]}


# Record's comments
@comment_routes.route('/records/<int:record_id>/')
def record_comments(record_id):
  comments = Comment.query.filter_by(record_id = record_id)
  return {'comments': [comment.to_dict() for comment in comments]}



@comment_routes.route('/<int:comment_id>/', methods=["PATCH"])
def update_record(comment_id):
  form = CommentForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    
    record = Comment.query.get(comment_id)
    record.content=form.data["content"]
    record.updated_at = datetime.utcnow()
    
    db.session.commit()
    return record.to_dict()
  return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@comment_routes.route("/<int:comment_id>/", methods=['DELETE'])
def delete_comment(comment_id):
  comment = Comment.query.get(comment_id)
  db.session.delete(comment)
  db.session.commit()
  return comment.to_dict()
  
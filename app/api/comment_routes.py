from datetime import datetime
from flask import Blueprint, request

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
  print("IN COMMENT ROUTE ======================", record_id)
  comments = Comment.query.filter_by(record_id = record_id)
  return {'comments': [comment.to_dict() for comment in comments]}

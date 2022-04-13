from flask import Blueprint, request
from app.models import db, User, Quote, Record
from flask_login import login_required

quote_routes = Blueprint('quotes', __name__)

@quote_routes.route('/')
@login_required
def quotes():
  quotes = Quote.query.all()
  return {'quotes': [quote.to_dict() for quote in quotes]}


@quote_routes.route('/<int:id>')
@login_required
def quote(id):
  quote = Quote.query.get(id)
  return {'quote': quote.to_dict()}


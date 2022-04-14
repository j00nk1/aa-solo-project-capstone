from flask import Blueprint, request
from app.models import Quote

quote_routes = Blueprint('quotes', __name__)

@quote_routes.route('/')
def quotes():
  quotes = Quote.query.all()
  return {'quotes': [quote.to_dict() for quote in quotes]}


@quote_routes.route('/<int:id>')
def quote(id):
  quote = Quote.query.get(id)
  return {'quote': quote.to_dict()}


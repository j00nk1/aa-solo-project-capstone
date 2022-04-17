from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired

class CommentForm(FlaskForm):
  user_id = IntegerField("user_id", validators=[DataRequired()])
  record_id = IntegerField("record_id", validators=[DataRequired()])
  content = StringField("content", validators=[DataRequired()])
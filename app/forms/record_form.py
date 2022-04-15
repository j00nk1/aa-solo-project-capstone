from flask_wtf import FlaskForm
from wtforms import IntegerField, FloatField
from wtforms.validators import DataRequired

class RecordForm(FlaskForm):
  user_id = IntegerField("user_id", validators=[DataRequired()])
  quote_id = IntegerField("quote_id", validators=[DataRequired()])
  accuracy = FloatField("accuracy", validators=[DataRequired()])
  duration = IntegerField("duration", validators=[DataRequired()])
  wpm = IntegerField("wpm", validators=[DataRequired()])
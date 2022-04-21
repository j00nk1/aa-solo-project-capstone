from flask_wtf import FlaskForm
from wtforms import IntegerField, FloatField
from wtforms.validators import DataRequired

class TimedRecordForm(FlaskForm):
  user_id = IntegerField("user_id", validators=[DataRequired()])
  minute = IntegerField("minute") # if not filled out, it will be set to 1 by default
  accuracy = FloatField("accuracy", validators=[DataRequired()])
  wpm = IntegerField("wpm", validators=[DataRequired()])
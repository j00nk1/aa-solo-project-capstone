from flask.cli import AppGroup

from .users import seed_users, undo_users
from .quotes import seed_quotes, undo_quotes
from .records import seed_records, undo_records
from .comments import seed_comments, undo_comments
from .timed_records import seed_timed_records, undo_timed_records

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    seed_users()
    seed_quotes()
    seed_records()
    seed_comments()
    seed_timed_records()
    # Add other seed functions here

# only add timed_records, 
# TODO: may need another comment model or add t_rec id(nullable) & make rec_id nullable? but either one of them needs to be saved on submission
@seed_commands.command("timed_records")
def seed_t_rec():
    seed_timed_records()

# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_users()
    undo_quotes()
    undo_records()
    undo_comments()
    undo_timed_records()
    # Add other undo functions here

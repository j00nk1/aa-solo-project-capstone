"""empty message

Revision ID: 281c2ebcb77d
Revises: 1e2b88d5c846
Create Date: 2022-04-14 09:08:12.923344

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '281c2ebcb77d'
down_revision = '1e2b88d5c846'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('records', sa.Column('wpm', sa.Integer(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('records', 'wpm')
    # ### end Alembic commands ###

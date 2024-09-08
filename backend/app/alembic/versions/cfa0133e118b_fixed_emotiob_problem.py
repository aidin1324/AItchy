"""fixed emotiob problem

Revision ID: cfa0133e118b
Revises: 580481575520
Create Date: 2024-09-08 08:37:02.854222

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cfa0133e118b'
down_revision: Union[str, None] = '580481575520'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notes', sa.Column('mood_id', sa.Integer(), nullable=True))
    op.drop_constraint('notes_emotion_id_fkey', 'notes', type_='foreignkey')
    op.create_foreign_key(None, 'notes', 'mood_contents', ['mood_id'], ['id'])
    op.drop_column('notes', 'emotion_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notes', sa.Column('emotion_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'notes', type_='foreignkey')
    op.create_foreign_key('notes_emotion_id_fkey', 'notes', 'mood_contents', ['emotion_id'], ['id'])
    op.drop_column('notes', 'mood_id')
    # ### end Alembic commands ###
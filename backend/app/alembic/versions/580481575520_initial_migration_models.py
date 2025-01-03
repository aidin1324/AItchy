"""Initial migration models

Revision ID: 580481575520
Revises: 4a05d72e93a6
Create Date: 2024-09-07 21:00:22.000066

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '580481575520'
down_revision: Union[str, None] = '4a05d72e93a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('context_factors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('effects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('emotions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('mood_contents',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('surname', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=True),
    sa.Column('gender', sa.String(), nullable=True),
    sa.Column('age', sa.Integer(), nullable=True),
    sa.Column('is_superuser', sa.Boolean(), nullable=True),
    sa.Column('is_premium', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_table('mood_entries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('general_well_being', sa.Integer(), nullable=True),
    sa.Column('energy_level', sa.Integer(), nullable=True),
    sa.Column('stress_level', sa.Integer(), nullable=True),
    sa.Column('sleep_quality', sa.Integer(), nullable=True),
    sa.Column('entry_date', sa.Date(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_mood_entries_entry_date'), 'mood_entries', ['entry_date'], unique=False)
    op.create_table('notes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.String(), nullable=True),
    sa.Column('note_date', sa.Date(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('emotion_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['emotion_id'], ['mood_contents.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notes_note_date'), 'notes', ['note_date'], unique=False)
    op.create_table('mood_contexts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('mood_entry_id', sa.Integer(), nullable=True),
    sa.Column('context_factor_id', sa.Integer(), nullable=True),
    sa.Column('effect_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['context_factor_id'], ['context_factors.id'], ),
    sa.ForeignKeyConstraint(['effect_id'], ['effects.id'], ),
    sa.ForeignKeyConstraint(['mood_entry_id'], ['mood_entries.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('mood_emotions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('intensity', sa.Integer(), nullable=True),
    sa.Column('mood_entry_id', sa.Integer(), nullable=True),
    sa.Column('emotion_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['emotion_id'], ['emotions.id'], ),
    sa.ForeignKeyConstraint(['mood_entry_id'], ['mood_entries.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('mood_emotions')
    op.drop_table('mood_contexts')
    op.drop_index(op.f('ix_notes_note_date'), table_name='notes')
    op.drop_table('notes')
    op.drop_index(op.f('ix_mood_entries_entry_date'), table_name='mood_entries')
    op.drop_table('mood_entries')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_table('mood_contents')
    op.drop_table('emotions')
    op.drop_table('effects')
    op.drop_table('context_factors')
    # ### end Alembic commands ###

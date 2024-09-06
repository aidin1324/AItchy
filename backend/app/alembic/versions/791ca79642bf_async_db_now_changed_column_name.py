"""async db now + changed column name

Revision ID: 791ca79642bf
Revises: 97e83224be3c
Create Date: 2024-09-06 20:49:53.377562

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '791ca79642bf'
down_revision: Union[str, None] = '97e83224be3c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

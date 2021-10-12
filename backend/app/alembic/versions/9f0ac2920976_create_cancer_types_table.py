"""create cancer_types_table

Revision ID: 9f0ac2920976
Revises: 
Create Date: 2021-10-10 06:54:35.102060-07:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f0ac2920976'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "cancer_types",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String),
    )
    

def downgrade():
    op.drop_table('cancer_types')

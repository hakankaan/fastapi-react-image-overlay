"""create patients_table

Revision ID: c2f783cbb79b
Revises: 
Create Date: 2021-10-10 06:27:24.762508-07:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c2f783cbb79b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "patients",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("first_name", sa.String),
        sa.Column("last_name", sa.String),
        sa.Column("id_number", sa.String),
        sa.Column("cancer_type", sa.Integer, sa.ForeignKey('cancer_types.id'))
    )


def downgrade():
    op.drop_table('patients')
